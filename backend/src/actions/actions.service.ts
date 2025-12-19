import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SchemaParserService } from '../schema-parser/schema-parser.service';
import { TransactionBuilderService } from '../solana/transaction-builder.service';
import { validateSolanaAddress, isPlaceholder, validateAndSanitizeAccount } from '../utils/solana-validation.utils';
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

        // Find the input node that has this parameter name
        const inputNode = schema.nodes?.find((node: any) =>
          node.type === 'input' && node.data?.parameterName === paramName
        );

        if (inputNode) {
          const nodeId = inputNode.id;
          const userValue = answers[nodeId];

          if (userValue !== undefined && userValue !== null) {
            resolved[key] = userValue;
          } else {
            console.warn(`[Parameter Resolution] No answer found for ${paramName} (node: ${nodeId})`);
          }
        } else {
          console.warn(`[Parameter Resolution] No input node found with parameterName: ${paramName}`);
        }
      }
    }

    return resolved;
  }

  /**
   * Dual Extraction Strategy for Solana Actions parameters
   * Extracts parameter value from query params, body.data, or body root
   * Priority: query params > body.data > body root
   *
   * @param paramName - Parameter name to extract (e.g., 'input', 'choice')
   * @param query
   * @param body
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
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });
    if (!form) {
      console.error('[Actions POST] Form not found:', formId);
      throw new Error('Form not found');
    }

    // Validate account parameter before any processing
    let userAccount: string;
    try {
      userAccount = validateAndSanitizeAccount(account, 'form submission');
    } catch (error) {
      console.error('[Actions POST] Account validation failed:', error.message);
      console.error('[Actions POST] Received account value:', account);

      const baseUrl = process.env.BASE_URL || 'https://blinkform-backend.vercel.app';
      return {
        type: 'error',
        icon: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Error',
        title: 'Wallet Connection Error',
        description: error.message,
        label: 'Retry',
        message: error.message,
        links: {
          actions: [{
            label: 'Retry',
            href: `${baseUrl}/api/actions/${formId}`
          }]
        }
      };
    }

    const sessionKey = `session:${formId}:${userAccount}`;
    const session = await this.redis.get(sessionKey);
    const sessionData = session ? JSON.parse(session) : { current_node_id: null, answers: {} };

    const schema = form.schema as any;
    let currentNodeId = sessionData.current_node_id;
    let currentNode = currentNodeId ? this.schemaParser.getCurrentNode(schema, currentNodeId) : null;

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

    const result = this.schemaParser.processUserInput(schema, currentNodeId, userInput);

    if (!result.isValid) {
      // Return Solana Actions compliant error response
      const baseUrl = process.env.BASE_URL || 'https://blinkform-backend.vercel.app';
      return {
        type: 'error',
        icon: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Error',
        title: form.title,
        description: result.error || 'Invalid input',
        label: 'Try Again',
        message: result.error || 'Invalid input',
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

    // Determine if this is the final step (requires transaction)
    const nextNode = result.nextNodeId ? this.schemaParser.getCurrentNode(schema, result.nextNodeId) : null;
    const isFinalStep = currentNode.type === 'transaction' ||
                       currentNode.data?.requiresTransaction === true ||
                       (nextNode && nextNode.data?.requiresTransaction === true);

    // In demo mode, skip all transactions and return mock success
    const isDemoMode = process.env.DEMO_MODE === 'true';
    if (isDemoMode) {
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

      // Return mock success response
      return {
        type: 'post',
        message: '🎉 Demo Complete! Form submitted successfully with mock transaction.\n\nIn a real scenario, this would have created a blockchain transaction, but demo mode prevents any real wallet connections.',
      } as PostResponse;
    }

    if (isFinalStep) {
      // FINAL STEP: Create transaction and save submission

      let transaction: string;
      let transactionCreated = false;

      try {
        // Check if this is a transaction node
        if (currentNode.type === 'transaction') {
          const transactionData = currentNode.data as any;

          // Ensure parameters is an object
          let parameters = transactionData.parameters;
          if (typeof parameters === 'string') {
            try {
              parameters = JSON.parse(parameters);
            } catch (e) {
              console.error('[Actions POST] Failed to parse parameters:', e);
              throw new Error('Invalid transaction parameters format');
            }
          }

          // Resolve parameter placeholders like {{parameterName}}
          parameters = this.resolveParameters(parameters, sessionData.answers || {}, form.schema);

          // Default recipientAddress to userAccount for CREATE_TOKEN if not set or set to system program
          if (transactionData.transactionType === 'CREATE_TOKEN') {
            if (!parameters.recipientAddress || parameters.recipientAddress === '11111111111111111111111111111112') {
              parameters.recipientAddress = userAccount;
            }
          }

          // Validate required parameters based on transaction type
          if (transactionData.transactionType === 'SYSTEM_TRANSFER') {
            if (!parameters.recipientAddress) {
              throw new Error('SYSTEM_TRANSFER requires recipientAddress parameter');
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error('SYSTEM_TRANSFER requires amount parameter');
            }
            // Validate recipient address format
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
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
            // Validate addresses
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
            }
            if (!isPlaceholder(parameters.mintAddress)) {
              const mintValidation = validateSolanaAddress(parameters.mintAddress);
              if (!mintValidation.valid) {
                throw new Error(`Invalid mint address: ${mintValidation.error}`);
              }
            }
          } else if (transactionData.transactionType === 'SPL_MINT' || transactionData.transactionType === 'MINT_TOKENS') {
            if (!parameters.mintAddress) {
              throw new Error(`${transactionData.transactionType} requires mintAddress parameter`);
            }
            if (!parameters.recipientAddress) {
              throw new Error(`${transactionData.transactionType} requires recipientAddress parameter`);
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error(`${transactionData.transactionType} requires amount parameter`);
            }
            // Validate addresses
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
            }
            if (!isPlaceholder(parameters.mintAddress)) {
              const mintValidation = validateSolanaAddress(parameters.mintAddress);
              if (!mintValidation.valid) {
                throw new Error(`Invalid mint address: ${mintValidation.error}`);
              }
            }
          } else if (transactionData.transactionType === 'CREATE_TOKEN') {
            if (!parameters.name) {
              throw new Error('CREATE_TOKEN requires name parameter');
            }
            if (!parameters.symbol) {
              throw new Error('CREATE_TOKEN requires symbol parameter');
            }
            if (!parameters.initialSupply) {
              throw new Error('CREATE_TOKEN requires initialSupply parameter');
            }
            if (!parameters.recipientAddress) {
              throw new Error('CREATE_TOKEN requires recipientAddress parameter');
            }
            // Validate recipient address with strict validation
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
            }
          } else if (transactionData.transactionType === 'CREATE_NFT_COLLECTION') {
            if (!parameters.name) {
              throw new Error('CREATE_NFT_COLLECTION requires name parameter');
            }
            if (!parameters.symbol) {
              throw new Error('CREATE_NFT_COLLECTION requires symbol parameter');
            }
            if (!parameters.uri) {
              throw new Error('CREATE_NFT_COLLECTION requires uri parameter');
            }
          } else if (transactionData.transactionType === 'MINT_NFT') {
            if (!parameters.collectionAddress) {
              throw new Error('MINT_NFT requires collectionAddress parameter');
            }
            if (!parameters.name) {
              throw new Error('MINT_NFT requires name parameter');
            }
            if (!parameters.uri) {
              throw new Error('MINT_NFT requires uri parameter');
            }
            if (!parameters.recipientAddress) {
              throw new Error('MINT_NFT requires recipientAddress parameter');
            }
            // Validate addresses
            if (!isPlaceholder(parameters.collectionAddress)) {
              const collectionValidation = validateSolanaAddress(parameters.collectionAddress);
              if (!collectionValidation.valid) {
                throw new Error(`Invalid collection address: ${collectionValidation.error}`);
              }
            }
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
            }
          } else if (transactionData.transactionType === 'BATCH_AIRDROP') {
            if (!parameters.mintAddress) {
              throw new Error('BATCH_AIRDROP requires mintAddress parameter');
            }
            if (!parameters.recipients || !Array.isArray(parameters.recipients)) {
              throw new Error('BATCH_AIRDROP requires recipients array parameter');
            }
            // Validate mint address
            if (!isPlaceholder(parameters.mintAddress)) {
              const mintValidation = validateSolanaAddress(parameters.mintAddress);
              if (!mintValidation.valid) {
                throw new Error(`Invalid mint address: ${mintValidation.error}`);
              }
            }
            // Validate each recipient
            for (const recipient of parameters.recipients) {
              if (!recipient.address || !recipient.amount) {
                throw new Error('BATCH_AIRDROP recipients must have address and amount');
              }
              if (!isPlaceholder(recipient.address)) {
                const recipientValidation = validateSolanaAddress(recipient.address);
                if (!recipientValidation.valid) {
                  throw new Error(`Invalid recipient address: ${recipientValidation.error}`);
                }
              }
            }
          }

          transaction = await this.transactionBuilder.createTransaction(
            transactionData.transactionType,
            userAccount,
            parameters
          );
          transactionCreated = true;
        } else if (nextNode && nextNode.type === 'transaction') {
          const transactionData = nextNode.data as any;

          // Ensure parameters is an object
          let parameters = transactionData.parameters;

          // Handle different parameter formats
          if (typeof parameters === 'string') {
            // Try to parse as JSON
            if (parameters.trim().startsWith('{') || parameters.trim().startsWith('[')) {
              try {
                parameters = JSON.parse(parameters);
              } catch (e) {
                console.error('[Actions POST] Failed to parse JSON parameters:', e);
                console.error('[Actions POST] Raw parameters:', transactionData.parameters);
                parameters = {};
              }
            } else {
              // Not JSON, treat as plain object
            }
          } else if (parameters && typeof parameters === 'object') {
          } else {
            parameters = {};
          }

          // Resolve parameter placeholders like {{parameterName}}
          parameters = this.resolveParameters(parameters, sessionData.answers || {}, form.schema);

          // Default recipientAddress to userAccount for CREATE_TOKEN if not set or set to system program
          if (transactionData.transactionType === 'CREATE_TOKEN') {
            if (!parameters.recipientAddress || parameters.recipientAddress === '11111111111111111111111111111112') {
              parameters.recipientAddress = userAccount;
            }
          }

          // Validate required parameters based on transaction type
          if (transactionData.transactionType === 'SYSTEM_TRANSFER') {
            if (!parameters.recipientAddress) {
              throw new Error('SYSTEM_TRANSFER requires recipientAddress parameter');
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error('SYSTEM_TRANSFER requires amount parameter');
            }
            // Validate recipient address format
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
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
            // Validate addresses
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
            }
            if (!isPlaceholder(parameters.mintAddress)) {
              const mintValidation = validateSolanaAddress(parameters.mintAddress);
              if (!mintValidation.valid) {
                throw new Error(`Invalid mint address: ${mintValidation.error}`);
              }
            }
          } else if (transactionData.transactionType === 'SPL_MINT' || transactionData.transactionType === 'MINT_TOKENS') {
            if (!parameters.mintAddress) {
              throw new Error(`${transactionData.transactionType} requires mintAddress parameter`);
            }
            if (!parameters.recipientAddress) {
              throw new Error(`${transactionData.transactionType} requires recipientAddress parameter`);
            }
            if (parameters.amount === undefined || parameters.amount === null) {
              throw new Error(`${transactionData.transactionType} requires amount parameter`);
            }
            // Validate addresses
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
            }
            if (!isPlaceholder(parameters.mintAddress)) {
              const mintValidation = validateSolanaAddress(parameters.mintAddress);
              if (!mintValidation.valid) {
                throw new Error(`Invalid mint address: ${mintValidation.error}`);
              }
            }
          } else if (transactionData.transactionType === 'CREATE_TOKEN') {
            if (!parameters.name) {
              throw new Error('CREATE_TOKEN requires name parameter');
            }
            if (!parameters.symbol) {
              throw new Error('CREATE_TOKEN requires symbol parameter');
            }
            if (!parameters.initialSupply) {
              throw new Error('CREATE_TOKEN requires initialSupply parameter');
            }
            if (!parameters.recipientAddress) {
              throw new Error('CREATE_TOKEN requires recipientAddress parameter');
            }
            // Validate recipient address with strict validation
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
            }
          } else if (transactionData.transactionType === 'CREATE_NFT_COLLECTION') {
            if (!parameters.name) {
              throw new Error('CREATE_NFT_COLLECTION requires name parameter');
            }
            if (!parameters.symbol) {
              throw new Error('CREATE_NFT_COLLECTION requires symbol parameter');
            }
            if (!parameters.uri) {
              throw new Error('CREATE_NFT_COLLECTION requires uri parameter');
            }
          } else if (transactionData.transactionType === 'MINT_NFT') {
            if (!parameters.collectionAddress) {
              throw new Error('MINT_NFT requires collectionAddress parameter');
            }
            if (!parameters.name) {
              throw new Error('MINT_NFT requires name parameter');
            }
            if (!parameters.uri) {
              throw new Error('MINT_NFT requires uri parameter');
            }
            if (!parameters.recipientAddress) {
              throw new Error('MINT_NFT requires recipientAddress parameter');
            }
            // Validate addresses
            if (!isPlaceholder(parameters.collectionAddress)) {
              const collectionValidation = validateSolanaAddress(parameters.collectionAddress);
              if (!collectionValidation.valid) {
                throw new Error(`Invalid collection address: ${collectionValidation.error}`);
              }
            }
            if (!isPlaceholder(parameters.recipientAddress)) {
              const validation = validateSolanaAddress(parameters.recipientAddress);
              if (!validation.valid) {
                throw new Error(`Invalid recipient address: ${validation.error}`);
              }
            }
          } else if (transactionData.transactionType === 'BATCH_AIRDROP') {
            if (!parameters.mintAddress) {
              throw new Error('BATCH_AIRDROP requires mintAddress parameter');
            }
            if (!parameters.recipients || !Array.isArray(parameters.recipients)) {
              throw new Error('BATCH_AIRDROP requires recipients array parameter');
            }
            // Validate mint address
            if (!isPlaceholder(parameters.mintAddress)) {
              const mintValidation = validateSolanaAddress(parameters.mintAddress);
              if (!mintValidation.valid) {
                throw new Error(`Invalid mint address: ${mintValidation.error}`);
              }
            }
            // Validate each recipient
            for (const recipient of parameters.recipients) {
              if (!recipient.address || !recipient.amount) {
                throw new Error('BATCH_AIRDROP recipients must have address and amount');
              }
              if (!isPlaceholder(recipient.address)) {
                const recipientValidation = validateSolanaAddress(recipient.address);
                if (!recipientValidation.valid) {
                  throw new Error(`Invalid recipient address: ${recipientValidation.error}`);
                }
              }
            }
          }

          transaction = await this.transactionBuilder.createTransaction(
            transactionData.transactionType,
            userAccount,
            parameters
          );
          transactionCreated = true;
        } else {
          // This shouldn't happen with new logic, but fallback
          const memoData = `FormID:${formId}|Answers:${JSON.stringify(sessionData.answers)}|Timestamp:${Date.now()}`;
          transaction = await this.transactionBuilder.createMemoTransaction(
            userAccount,
            memoData
          );
          transactionCreated = true;
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
          message: error.message,
          links: {
            actions: [{
              label: 'Try Again',
              href: `${baseUrl}/api/actions/${formId}`
            }]
          }
        };
      }

      // Only save submission and return transaction response if transaction was created successfully
      if (transactionCreated) {

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
      } else {
        // Transaction creation failed, but we already returned an error response above
        // This shouldn't be reached, but just in case
        throw new Error('Transaction creation failed');
      }

    } else if (!nextNode) {
      // END OF FORM: No transaction, just save and complete

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

      // Return PostResponse (no transaction, form completed)
      return {
        type: 'post',
        message: 'Form completed successfully! Thank you for your response.',
      } as PostResponse;

    } else {
      // INTERMEDIATE STEP: Return PostResponse (no transaction)

      sessionData.current_node_id = result.nextNodeId;
      await this.redis.set(sessionKey, JSON.stringify(sessionData), 3600); // 1 hour

      // Generate callback URL for next action
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const stateParams = new URLSearchParams({
        account: userAccount,
        formId: formId,
      }).toString();

      const nextHref = `${baseUrl}/api/actions/${formId}/next?${stateParams}`;

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
    // Validate account parameter
    const userAccount = validateAndSanitizeAccount(account, 'next action');

    // Retrieve session
    const sessionKey = `session:${formId}:${userAccount}`;
    const sessionStr = await this.redis.get(sessionKey);

    if (!sessionStr) {
      console.error('[Actions GET NEXT] Session expired or invalid');
      throw new Error('Session expired or invalid. Please start the form again.');
    }

    const sessionData = JSON.parse(sessionStr);
    const currentNodeId = sessionData.current_node_id;

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

    // Get next node for action generation
    const nextNode = this.schemaParser.getNextNode(schema, currentNodeId);

    // Generate and return ActionGetResponse for current node
    const actionResponse = this.schemaParser.generateActionResponse(
      form.title,
      currentNode,
      nextNode?.id,
      formId
    );

    return actionResponse;
  }
}