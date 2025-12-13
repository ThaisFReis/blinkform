import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SchemaParserService } from '../schema-parser/schema-parser.service';
import { TransactionBuilderService } from '../solana/transaction-builder.service';
import {
  ActionPostResponse,
  PostResponse,
  TransactionResponse,
  ActionGetResponse,
} from './dto/action-response.dto';

@Injectable()
export class ActionsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private schemaParser: SchemaParserService,
    private transactionBuilder: TransactionBuilderService,
  ) {}

  /**
   * Dual Extraction Strategy for Solana Actions parameters
   * Extracts parameter value from query params, body.data, or body root
   * Priority: query params > body.data > body root
   *
   * @param paramName - Parameter name to extract (e.g., 'input', 'choice')
   * @param query - Query parameters from request
   * @param body - Request body
   * @returns Extracted value or undefined
   */
  private extractParameter(paramName: string, query: any, body: any): any {
    // Priority 1: Query parameters (classic approach with {input} placeholder)
    if (query?.[paramName] !== undefined && query[paramName] !== null) {
      return query[paramName];
    }

    // Priority 2: body.data (sRFC 29 compliant)
    if (body?.data?.[paramName] !== undefined && body.data[paramName] !== null) {
      return body.data[paramName];
    }

    // Priority 3: Root body (backward compatibility)
    if (body?.[paramName] !== undefined && body[paramName] !== null) {
      return body[paramName];
    }

    return undefined;
  }

  async getAction(formId: string, account?: string) {
    // Fetch form
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });
    if (!form) {
      throw new Error('Form not found');
    }

    // Get current node from session or start
    let currentNodeId = 'start';
    if (account) {
      const sessionKey = `session:${formId}:${account}`;
      const session = await this.redis.get(sessionKey);
      if (session) {
        const sessionData = JSON.parse(session);
        currentNodeId = sessionData.current_node_id || 'start';
      }
    }

    // Get current node from schema
    const schema = form.schema as any;
    let currentNode = this.schemaParser.getCurrentNode(schema, currentNodeId);

    // If no current node, get start node
    if (!currentNode) {
      currentNode = this.schemaParser.getStartNode(schema);
      if (currentNode) {
        currentNodeId = currentNode.id;
      }
    }

    if (!currentNode) {
      throw new Error('No valid node found in form schema');
    }

    // Get next node for action generation
    const nextNode = this.schemaParser.getNextNode(schema, currentNodeId);

    // Generate action response
    return this.schemaParser.generateActionResponse(
      form.title,
      currentNode,
      nextNode?.id,
      formId
    );
  }

  async postAction(formId: string, account: string, body: any, query?: Record<string, any>) {
    // Use default account for testing if not provided
    const userAccount = account || 'test-account';

    console.log('[Actions POST] FormId:', formId, 'Account:', userAccount);
    console.log('[Actions POST] Body:', JSON.stringify(body));
    console.log('[Actions POST] Query:', JSON.stringify(query));

    // Fetch form
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });
    if (!form) {
      console.error('[Actions POST] Form not found:', formId);
      throw new Error('Form not found');
    }

    // Get current session
    const sessionKey = `session:${formId}:${userAccount}`;
    const session = await this.redis.get(sessionKey);
    const sessionData = session ? JSON.parse(session) : { current_node_id: null, answers: {} };

    console.log('[Actions POST] Session data:', JSON.stringify(sessionData));

    // Get current node
    const schema = form.schema as any;
    let currentNodeId = sessionData.current_node_id;
    let currentNode = currentNodeId ? this.schemaParser.getCurrentNode(schema, currentNodeId) : null;

    console.log('[Actions POST] Current node ID:', currentNodeId);

    // If no current node, start from beginning
    if (!currentNode) {
      currentNode = this.schemaParser.getStartNode(schema);
      if (currentNode) {
        currentNodeId = currentNode.id;
        sessionData.current_node_id = currentNodeId;
      }
    }

    if (!currentNode) {
      throw new Error('No valid node found in form schema');
    }

    // Process user input using dual extraction strategy
    const userInput = this.extractParameter('input', query, body)
                   || this.extractParameter('choice', query, body)
                   || body;  // Keep body as ultimate fallback for backward compatibility

    console.log('[Actions POST] User input:', userInput);

    const result = this.schemaParser.processUserInput(schema, currentNodeId, userInput);

    console.log('[Actions POST] Process result:', JSON.stringify(result));

    if (!result.isValid) {
      console.log('[Actions POST] Input validation failed');
      // Return Solana Actions compliant error response
      const baseUrl = process.env.BASE_URL || 'https://blinkform-backend.vercel.app';
      return {
        type: 'error',
        icon: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Error',
        title: form.title,
        description: result.error || 'Invalid input',
        label: 'Try Again',
        error: {
          message: result.error || 'Invalid input'
        },
        links: {
          actions: [{
            label: 'Try Again',
            href: `${baseUrl}/api/actions/${formId}`
          }]
        }
      };
    }

    // Update session with answer
    sessionData.answers = sessionData.answers || {};
    sessionData.answers[currentNodeId] = userInput;

    console.log('[Actions POST] Updated answers:', JSON.stringify(sessionData.answers));

    // Determine if this is the final step
    const nextNode = result.nextNodeId ? this.schemaParser.getCurrentNode(schema, result.nextNodeId) : null;
    const isFinalStep = !nextNode || nextNode.type === 'end' || nextNode.data?.requiresTransaction === true;

    console.log('[Actions POST] Is final step:', isFinalStep);

    if (isFinalStep) {
      // FINAL STEP: Create transaction and save submission
      console.log('[Actions POST] Final step - creating transaction and saving submission');

      let transaction: string;

      // Check if this is a transaction node
      if (currentNode.type === 'transaction') {
        console.log('[Actions POST] Transaction node detected, creating real transaction');
        const transactionData = currentNode.data as any;
        console.log('[Actions POST] Transaction type:', transactionData.transactionType);
        console.log('[Actions POST] Transaction parameters:', transactionData.parameters);

        transaction = await this.transactionBuilder.createTransaction(
          transactionData.transactionType,
          userAccount,
          transactionData.parameters
        );
      } else {
        // Fallback to memo transaction for end nodes
        console.log('[Actions POST] End node detected, creating memo transaction');
        const memoData = `FormID:${formId}|Answers:${JSON.stringify(sessionData.answers)}|Timestamp:${Date.now()}`;
        console.log('[Actions POST] Creating memo transaction:', memoData);
        console.log('[Actions POST] Memo size:', Buffer.from(memoData, 'utf-8').length, 'bytes');

        transaction = await this.transactionBuilder.createMemoTransaction(
          userAccount,
          memoData
        );
      }

      console.log('[Actions POST] User account:', userAccount);

      // Save submission to database
      await this.prisma.submission.create({
        data: {
          formId: form.id,
          userAccount: userAccount,
          answers: sessionData.answers,
        },
      });

      // Clear session
      await this.redis.del(sessionKey);

      console.log('[Actions POST] Returning TransactionResponse for final step');

      // Return TransactionResponse (requires blockchain signature)
      return {
        transaction: transaction,
        message: 'Form completed! Please sign to submit on-chain.',
      } as TransactionResponse;

    } else {
      // INTERMEDIATE STEP: Return PostResponse (no transaction)
      console.log('[Actions POST] Intermediate step - returning PostResponse');

      // Move to next node
      sessionData.current_node_id = result.nextNodeId;
      await this.redis.set(sessionKey, JSON.stringify(sessionData), 3600); // 1 hour

      // Generate callback URL for next action
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const stateParams = new URLSearchParams({
        account: userAccount,
        formId: formId,
      }).toString();

      const nextHref = `${baseUrl}/api/actions/${formId}/next?${stateParams}`;

      console.log('[Actions POST] Callback URL:', nextHref);

      // Return PostResponse (advances immediately, no transaction)
      return {
        type: 'post',
        message: `Answer recorded: "${userInput}"`,
        links: {
          next: {
            type: 'post',
            href: nextHref,
          }
        }
      } as PostResponse;
    }
  }

  /**
   * Get next action - Called by links.next callback
   * Retrieves current session state and returns UI for the next question
   *
   * @param formId - Form identifier
   * @param account - User's Solana account address
   * @returns ActionGetResponse with next question UI
   */
  async getNextAction(formId: string, account: string): Promise<ActionGetResponse> {
    const userAccount = account || 'test-account';

    console.log('[Actions GET NEXT] FormId:', formId, 'Account:', userAccount);

    // Retrieve session
    const sessionKey = `session:${formId}:${userAccount}`;
    const sessionStr = await this.redis.get(sessionKey);

    if (!sessionStr) {
      console.error('[Actions GET NEXT] Session expired or invalid');
      throw new Error('Session expired or invalid. Please start the form again.');
    }

    const sessionData = JSON.parse(sessionStr);
    const currentNodeId = sessionData.current_node_id;

    console.log('[Actions GET NEXT] Current node ID:', currentNodeId);

    if (!currentNodeId) {
      throw new Error('No current node in session. Please start the form again.');
    }

    // Get form and schema
    const form = await this.prisma.form.findUnique({ where: { id: formId } });
    if (!form) {
      console.error('[Actions GET NEXT] Form not found:', formId);
      throw new Error('Form not found');
    }

    const schema = form.schema as any;
    const currentNode = this.schemaParser.getCurrentNode(schema, currentNodeId);

    if (!currentNode) {
      console.error('[Actions GET NEXT] Current node not found in schema:', currentNodeId);
      throw new Error('Current node not found in schema');
    }

    console.log('[Actions GET NEXT] Current node:', currentNode.id, 'Type:', currentNode.type);

    // Get next node for action generation
    const nextNode = this.schemaParser.getNextNode(schema, currentNodeId);

    console.log('[Actions GET NEXT] Next node:', nextNode ? nextNode.id : 'none');

    // Generate and return ActionGetResponse for current node
    const actionResponse = this.schemaParser.generateActionResponse(
      form.title,
      currentNode,
      nextNode?.id,
      formId
    );

    console.log('[Actions GET NEXT] Returning action response');

    return actionResponse;
  }
}