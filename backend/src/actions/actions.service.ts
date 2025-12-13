import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SchemaParserService } from '../schema-parser/schema-parser.service';

@Injectable()
export class ActionsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private schemaParser: SchemaParserService,
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

    // Move to next node
    if (result.nextNodeId) {
      console.log('[Actions POST] Moving to next node:', result.nextNodeId);
      sessionData.current_node_id = result.nextNodeId;
      await this.redis.set(sessionKey, JSON.stringify(sessionData), 3600); // 1 hour

      // Get next node response
      const nextNode = this.schemaParser.getCurrentNode(schema, result.nextNodeId);
      console.log('[Actions POST] Next node found:', nextNode ? nextNode.id : 'null');

      if (nextNode) {
        const nextNextNode = this.schemaParser.getNextNode(schema, result.nextNodeId);
        console.log('[Actions POST] Next-next node:', nextNextNode ? nextNextNode.id : 'null');

        const response = this.schemaParser.generateActionResponse(
          form.title,
          nextNode,
          nextNextNode?.id,
          formId
        );
        console.log('[Actions POST] Returning response:', JSON.stringify(response));
        return response;
      }
    }

    console.log('[Actions POST] No next node, completing form');

    // Form completed - save submission
    await this.prisma.submission.create({
      data: {
        formId: form.id,
        userAccount: userAccount,
        answers: sessionData.answers,
      },
    });

    // Clear session
    await this.redis.del(sessionKey);

    // Return completion response
    return {
      type: 'completed',
      icon: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Complete',
      title: form.title,
      description: 'Thank you for completing the form!',
      label: 'Completed',
      links: {
        actions: [{
          label: 'View Results',
          href: `/api/actions/${formId}/results`
        }]
      }
    };
  }
}