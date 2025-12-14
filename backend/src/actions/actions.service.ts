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
   * Resolve parameter placeholders like {{parameterName}} with actual values
   * from user answers collected through the form flow
   *
   * @param parameters - Transaction parameters object with potential placeholders
   * @param answers - User answers from the session (nodeId -> value mapping)
   * @param schema - Form schema to lookup parameter names from input nodes
   * @returns Parameters with placeholders replaced by actual values
   */
  private resolveParameters(parameters: any, answers: Record<string, any>, schema: any): any {
    if (!parameters || typeof parameters !== 'object') {
      return parameters;
    }

    const resolved = { ...parameters };

    // Iterate through each parameter
    for (const [key, value] of Object.entries(resolved)) {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        // Extract parameter name from {{parameterName}}
        const paramName = value.slice(2, -2).trim();
        console.log(`[Parameter Resolution] Found placeholder: ${value} -> paramName: ${paramName}`);

        // Find the input node that has this parameter name
        const inputNode = schema.nodes?.find((node: any) =>
          node.type === 'input' && node.data?.parameterName === paramName
        );

        if (inputNode) {
          const nodeId = inputNode.id;
          const userValue = answers[nodeId];

          if (userValue !== undefined && userValue !== null) {
            resolved[key] = userValue;
            console.log(`[Parameter Resolution] Resolved ${key}: ${value} -> ${userValue}`);
          } else {
            console.warn(`[Parameter Resolution] No answer found for ${paramName} (node: ${nodeId})`);
          }
        } else {
          console.warn(`[Parameter Resolution] No input node found with parameterName: ${paramName}`);
        }
      }
    }

    console.log('[Parameter Resolution] Final resolved parameters:', resolved);
    return resolved;
  }

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
                    || this.extractParameter('confirm', query, body)
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

    // Determine if this is the final step (requires transaction)
    const nextNode = result.nextNodeId ? this.schemaParser.getCurrentNode(schema, result.nextNodeId) : null;
    const isFinalStep = currentNode.type === 'transaction' ||
                       currentNode.data?.requiresTransaction === true ||
                       (nextNode && nextNode.data?.requiresTransaction === true);

    console.log('[Actions POST] Current node type:', currentNode.type);
    console.log('[Actions POST] Current node data:', JSON.stringify(currentNode.data, null, 2));
    console.log('[Actions POST] Next node:', nextNode ? nextNode.type : 'null');
    console.log('[Actions POST] Is final step:', isFinalStep);

    if (isFinalStep) {
      // FINAL STEP: Create transaction and save submission
      console.log('[Actions POST] Final step - creating transaction and saving submission');

      let transaction: string;

      try {
        // Check if this is a transaction node
        if (currentNode.type === 'transaction') {
          console.log('[Actions POST] Transaction node detected, creating real transaction');
          const transactionData = currentNode.data as any;
          console.log('[Actions POST] Transaction data:', JSON.stringify(transactionData, null, 2));
          console.log('[Actions POST] Transaction type:', transactionData.transactionType);
          console.log('[Actions POST] Transaction parameters:', transactionData.parameters);
          console.log('[Actions POST] Parameters type:', typeof transactionData.parameters);

          // Ensure parameters is an object
          let parameters = transactionData.parameters;
          if (typeof parameters === 'string') {
            try {
              parameters = JSON.parse(parameters);
              console.log('[Actions POST] Parsed parameters:', parameters);
            } catch (e) {
              console.error('[Actions POST] Failed to parse parameters:', e);
              throw new Error('Invalid transaction parameters format');
            }
          }

          // Resolve parameter placeholders like {{parameterName}}
          console.log('[Actions POST] Resolving parameters with answers:', sessionData.answers);
          parameters = this.resolveParameters(parameters, sessionData.answers || {}, form.schema);

          console.log('[Actions POST] Final resolved parameters:', parameters);

          // Validate required parameters based on transaction type
          if (transactionData.transactionType === 'SYSTEM_TRANSFER') {
            if (!parameters.recipientAddress) {
              throw new Error('SYSTEM_TRANSFER requires recipientAddress parameter');
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error('SYSTEM_TRANSFER requires amount parameter');
            }
          } else if (transactionData.transactionType === 'SPL_TRANSFER') {
            if (!parameters.recipientAddress) {
              throw new Error('SPL_TRANSFER requires recipientAddress parameter');
            }
            if (!parameters.mintAddress) {
              throw new Error('SPL_TRANSFER requires mintAddress parameter');
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error('SPL_TRANSFER requires amount parameter');
            }
          } else if (transactionData.transactionType === 'SPL_MINT') {
            if (!parameters.mintAddress) {
              throw new Error('SPL_MINT requires mintAddress parameter');
            }
            if (!parameters.recipientAddress) {
              throw new Error('SPL_MINT requires recipientAddress parameter');
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error('SPL_MINT requires amount parameter');
            }
          }

          console.log('[Actions POST] Creating transaction with:', {
            transactionType: transactionData.transactionType,
            userAccount,
            parameters
          });

          transaction = await this.transactionBuilder.createTransaction(
            transactionData.transactionType,
            userAccount,
            parameters
          );
        } else if (nextNode && nextNode.type === 'transaction') {
          console.log('[Actions POST] Next node is transaction, creating real transaction');
          const transactionData = nextNode.data as any;
          console.log('[Actions POST] Transaction data:', JSON.stringify(transactionData, null, 2));
          console.log('[Actions POST] Transaction type:', transactionData.transactionType);
          console.log('[Actions POST] Transaction parameters:', transactionData.parameters);
          console.log('[Actions POST] Parameters type:', typeof transactionData.parameters);

          // Ensure parameters is an object
          let parameters = transactionData.parameters;

          // Handle different parameter formats
          if (typeof parameters === 'string') {
            // Try to parse as JSON
            if (parameters.trim().startsWith('{') || parameters.trim().startsWith('[')) {
              try {
                parameters = JSON.parse(parameters);
                console.log('[Actions POST] Parsed JSON parameters:', parameters);
              } catch (e) {
                console.error('[Actions POST] Failed to parse JSON parameters:', e);
                console.error('[Actions POST] Raw parameters:', transactionData.parameters);
                parameters = {};
              }
            } else {
              // Not JSON, treat as plain object
              console.log('[Actions POST] Parameters is string but not JSON, using as-is');
            }
          } else if (parameters && typeof parameters === 'object') {
            console.log('[Actions POST] Parameters already object:', parameters);
          } else {
            console.log('[Actions POST] Parameters undefined or invalid, using empty object');
            parameters = {};
          }

          // Resolve parameter placeholders like {{parameterName}}
          console.log('[Actions POST] Resolving parameters with answers:', sessionData.answers);
          parameters = this.resolveParameters(parameters, sessionData.answers || {}, form.schema);

          console.log('[Actions POST] Final resolved parameters:', parameters);

          // Validate required parameters based on transaction type
          if (transactionData.transactionType === 'SYSTEM_TRANSFER') {
            if (!parameters.recipientAddress) {
              throw new Error('SYSTEM_TRANSFER requires recipientAddress parameter');
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error('SYSTEM_TRANSFER requires amount parameter');
            }
          } else if (transactionData.transactionType === 'SPL_TRANSFER') {
            if (!parameters.recipientAddress) {
              throw new Error('SPL_TRANSFER requires recipientAddress parameter');
            }
            if (!parameters.mintAddress) {
              throw new Error('SPL_TRANSFER requires mintAddress parameter');
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error('SPL_TRANSFER requires amount parameter');
            }
          } else if (transactionData.transactionType === 'SPL_MINT') {
            if (!parameters.mintAddress) {
              throw new Error('SPL_MINT requires mintAddress parameter');
            }
            if (!parameters.recipientAddress) {
              throw new Error('SPL_MINT requires recipientAddress parameter');
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error('SPL_MINT requires amount parameter');
            }
          }

          console.log('[Actions POST] Creating transaction with:', {
            transactionType: transactionData.transactionType,
            userAccount,
            parameters
          });

          transaction = await this.transactionBuilder.createTransaction(
            transactionData.transactionType,
            userAccount,
            parameters
          );
          console.log('[Actions POST] Transaction created successfully');
        } else {
          // This shouldn't happen with new logic, but fallback
          console.log('[Actions POST] Unexpected transaction creation');
          const memoData = `FormID:${formId}|Answers:${JSON.stringify(sessionData.answers)}|Timestamp:${Date.now()}`;
          transaction = await this.transactionBuilder.createMemoTransaction(
            userAccount,
            memoData
          );
        }
      } catch (error) {
        console.error('[Actions POST] Transaction creation failed:', error);
        console.error('[Actions POST] Error details:', {
          message: error.message,
          stack: error.stack,
          currentNodeType: currentNode.type,
          nextNodeType: nextNode?.type,
          userAccount,
          sessionData: JSON.stringify(sessionData),
          formId
        });

        // Return Solana Actions compliant error response for transaction errors
        const baseUrl = process.env.BASE_URL || 'https://blinkform-backend.vercel.app';
        return {
          type: 'error',
          icon: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Error',
          title: form.title,
          description: `Transaction Error: ${error.message}`,
          label: 'Try Again',
          error: {
            message: error.message
          },
          links: {
            actions: [{
              label: 'Try Again',
              href: `${baseUrl}/api/actions/${formId}`
            }]
          }
        };
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

      // Create detailed message based on transaction type
      let detailedMessage = 'Form submitted successfully!';

      if (currentNode.type === 'transaction') {
        const txData = currentNode.data;
        let params = txData.parameters;
        if (typeof params === 'string') {
          try {
            params = JSON.parse(params);
          } catch (e) {
            params = {};
          }
        }

        switch (txData.transactionType) {
          case 'SYSTEM_TRANSFER':
            detailedMessage += `📤 SOL Transfer Details:\n`;
            detailedMessage += `• Amount: ${params.amount} SOL\n`;
            detailedMessage += `• From: ${userAccount}\n`;
            detailedMessage += `• To: ${params.recipientAddress}\n`;
            detailedMessage += `• Network: Solana Devnet\n`;
            detailedMessage += `• Timestamp: ${new Date().toISOString()}\n\n`;
            detailedMessage += `Check the transaction on Solana Explorer.`;
            break;

          case 'SPL_TRANSFER':
            detailedMessage += `📤 Token Transfer Details:\n`;
            detailedMessage += `• Amount: ${params.amount} tokens\n`;
            detailedMessage += `• Token Mint: ${params.mintAddress}\n`;
            detailedMessage += `• From: ${userAccount}\n`;
            detailedMessage += `• To: ${params.recipientAddress}\n`;
            detailedMessage += `• Decimals: ${params.decimals}\n`;
            detailedMessage += `• Network: Solana Devnet\n`;
            detailedMessage += `• Timestamp: ${new Date().toISOString()}\n\n`;
            detailedMessage += `After signing, check the transaction on Solana Explorer.`;
            break;

          case 'SPL_MINT':
            detailedMessage += `🪙 Token Mint Details:\n`;
            detailedMessage += `• Amount: ${params.amount} tokens\n`;
            detailedMessage += `• Token Mint: ${params.mintAddress}\n`;
            detailedMessage += `• Mint Authority: ${userAccount}\n`;
            detailedMessage += `• Recipient: ${params.recipientAddress}\n`;
            detailedMessage += `• Decimals: ${params.decimals}\n`;
            detailedMessage += `• Network: Solana Devnet\n`;
            detailedMessage += `• Timestamp: ${new Date().toISOString()}\n\n`;
            detailedMessage += `After signing, check the transaction on Solana Explorer.`;
            break;

          default:
            detailedMessage += `Transaction ready for signing.`;
        }
      } else {
        detailedMessage += `Transaction ready for signing.`;
      }

      // Return TransactionResponse (requires blockchain signature)
      return {
        transaction: transaction,
        message: detailedMessage,
      } as TransactionResponse;

    } else if (!nextNode) {
      // END OF FORM: No transaction, just save and complete
      console.log('[Actions POST] End of form - saving submission without transaction');

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

      console.log('[Actions POST] Returning PostResponse for form completion');

      // Return PostResponse (no transaction, form completed)
      return {
        type: 'post',
        message: 'Form completed successfully! Thank you for your response.',
      } as PostResponse;

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