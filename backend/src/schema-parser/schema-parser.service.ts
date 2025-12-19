import { Injectable } from '@nestjs/common';
import { ActionGetResponse } from '../actions/dto/action-response.dto';

export interface FormNode {
  id: string;
  type: string;
  data: any;
  /**
   * Optional flag to force transaction creation for this node
   * Used for mid-flow transactions (e.g., payment before continuing)
   * If true, this step will return TransactionResponse instead of PostResponse
   */
  requiresTransaction?: boolean;
}

export interface FormEdge {
  id: string;
  source: string;
  target: string;
}

export interface FormSchema {
  nodes: FormNode[];
  edges: FormEdge[];
}

@Injectable()
export class SchemaParserService {
  /**
   * Get the current node for a user session
   */
  getCurrentNode(schema: FormSchema, currentNodeId: string): FormNode | null {
    return schema.nodes.find(node => node.id === currentNodeId) || null;
  }

  /**
   * Get the starting node (node with no incoming edges)
   */
  getStartNode(schema: FormSchema): FormNode | null {
    if (schema.nodes.length === 0) return null;

    // Find all nodes that are targets of edges
    const targetIds = new Set(schema.edges.map(edge => edge.target));

    // Find the first node that is not a target (has no incoming edges)
    return schema.nodes.find(node => !targetIds.has(node.id)) || null;
  }

  /**
   * Get the next node based on current node and edges
   */
  getNextNode(schema: FormSchema, currentNodeId: string): FormNode | null {
    const edge = schema.edges.find(edge => edge.source === currentNodeId);
    if (!edge) return null;

    return schema.nodes.find(node => node.id === edge.target) || null;
  }

  /**
   * Generate ActionGetResponse for the current node
   */
  generateActionResponse(
    formTitle: string,
    currentNode: FormNode,
    nextNodeId?: string,
    formId?: string
  ): ActionGetResponse {
    const baseUrl = process.env.BASE_URL || 'https://blinkform-backend.vercel.app';
    const baseResponse: ActionGetResponse = {
      type: 'action',
      icon: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=BlinkForm',
      title: formTitle,
      description: `Question: ${currentNode.data.questionText || 'Complete the form'}`,
      label: 'Continue',
      links: {
        actions: []
      }
    };

    // Generate actions based on node type
    if (currentNode.type === 'start') {
      // Handle start node - use its specific data
      baseResponse.icon = currentNode.data.imageUrl || 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=BlinkForm';
      baseResponse.title = currentNode.data.title || formTitle;
      baseResponse.description = currentNode.data.description || 'Complete this interactive form';
      baseResponse.label = 'Start';
      baseResponse.links.actions = [{
        label: 'Start',
        href: `${baseUrl}/api/actions/${formId}`,
        parameters: [{
          name: 'start',
          label: 'Click Start to begin',
          required: true
        }]
      }];
    } else if (currentNode.type === 'end') {
      baseResponse.title = formTitle;
      baseResponse.description = currentNode.data.message || 'Thank you for your response!';
      baseResponse.label = 'Completed';
      baseResponse.links.actions = []; // No actions for end node
    } else if (currentNode.type === 'transaction') {
      // Handle transaction nodes
      const transactionData = currentNode.data;
      const transactionType = transactionData.transactionType;
      const isDemoMode = process.env.DEMO_MODE === 'true';

      let transactionDescription = 'Confirm the transaction details below';

      // Ensure parameters is an object
      let params = transactionData.parameters;

      // Handle different parameter formats
      if (typeof params === 'string') {
        // Try to parse as JSON
        if (params.trim().startsWith('{') || params.trim().startsWith('[')) {
          try {
            params = JSON.parse(params);
          } catch (e) {
            console.error('Failed to parse transaction parameters in schema parser:', e);
            console.error('Raw parameters:', transactionData.parameters);
            params = {};
          }
        }
        // If not JSON, keep as string (might be used differently)
      } else if (params && typeof params === 'object') {
        // Already an object, use as-is
      } else {
        params = {};
      }

      if (isDemoMode) {
        // In demo mode, show mock completion
        let demoDescription = 'Demo Mode: No real transaction will be created.';

        switch (transactionType) {
          case 'CREATE_TOKEN':
            demoDescription = `Demo Mode: This would create the "${params?.name || 'Token'}" token with symbol "${params?.symbol || ''}" and initial supply of ${params?.initialSupply || 0}. No real token will be created.`;
            break;
          case 'CREATE_NFT_COLLECTION':
            demoDescription = `Demo Mode: This would create an NFT collection "${params?.name || 'Collection'}" with symbol "${params?.symbol || ''}". No real collection will be created.`;
            break;
          case 'MINT_NFT':
            demoDescription = `Demo Mode: This would mint an NFT "${params?.name || 'NFT'}" into the collection. No real NFT will be minted.`;
            break;
          case 'BATCH_AIRDROP':
            demoDescription = `Demo Mode: This would airdrop tokens to ${params?.recipients?.length || 0} recipients. No real airdrop will occur.`;
            break;
          case 'SYSTEM_TRANSFER':
            demoDescription = `Demo Mode: This would transfer ${params?.amount || 0} SOL. No real transfer will occur.`;
            break;
          case 'SPL_TRANSFER':
            demoDescription = `Demo Mode: This would transfer ${params?.amount || 0} tokens. No real transfer will occur.`;
            break;
          case 'SPL_MINT':
          case 'MINT_TOKENS':
            demoDescription = `Demo Mode: This would mint ${params?.amount || 0} tokens. No real tokens will be minted.`;
            break;
          default:
            demoDescription = `Demo Mode: This would execute a ${transactionType.toLowerCase().replace('_', ' ')} transaction. No real transaction will be created.`;
        }

        baseResponse.title = formTitle;
        baseResponse.description = demoDescription;
        baseResponse.label = 'Complete Demo';
        baseResponse.links.actions = [{
          label: 'Complete Demo',
          href: `${baseUrl}/api/actions/${formId}?confirm=demo`
        }];
      } else {
        switch (transactionType) {
          case 'SYSTEM_TRANSFER':
            transactionDescription = `Transfer ${params?.amount || 0} SOL to ${params?.recipientAddress || 'recipient'}`;
            break;
          case 'SPL_TRANSFER':
            transactionDescription = `Transfer ${params?.amount || 0} tokens to ${params?.recipientAddress || 'recipient'}`;
            break;
          case 'SPL_MINT':
            transactionDescription = `Mint ${params?.amount || 0} tokens to ${params?.recipientAddress || 'recipient'}`;
            break;
          default:
            transactionDescription = 'Execute custom transaction';
        }

        baseResponse.title = formTitle;
        baseResponse.description = transactionDescription;
        baseResponse.label = 'Confirm Transaction';
        baseResponse.links.actions = [{
          label: 'Confirm Transaction',
          href: `${baseUrl}/api/actions/${formId}?confirm=transaction`
        }];
      }
    } else {
      // Handle question nodes
      const questionType = currentNode.data?.questionType;

      switch (questionType) {
        case 'input':
        baseResponse.links.actions = [{
          label: nextNodeId ? 'Next' : 'Submit',
          href: `${baseUrl}/api/actions/${formId}?input={input}`,
          parameters: [{
            name: 'input',
            label: currentNode.data.questionText,
            required: currentNode.data.validation?.required || false
          }]
        }];
        break;

      case 'choice':
        // For multiple choice buttons, encode the selection in href
        baseResponse.links.actions = (currentNode.data.options || []).map((option: any) => ({
          label: option.label,
          href: `${baseUrl}/api/actions/${formId}/${option.value}`
        }));
        break;

      case 'date':
        baseResponse.links.actions = [{
          label: nextNodeId ? 'Next' : 'Submit',
          href: `${baseUrl}/api/actions/${formId}?input={input}`,
          parameters: [{
            name: 'input',
            label: currentNode.data.questionText,
            required: currentNode.data.validation?.required || false
          }]
        }];
        break;

      default:
        baseResponse.links.actions = [{
          label: 'Continue',
          href: `${baseUrl}/api/actions/${formId}`
        }];
      }
    }

    return baseResponse;
  }

  /**
   * Validate user input for a node
   */
  validateNodeInput(node: FormNode, input: any): boolean {
    switch (node.type) {
      case 'start':
        // Start node just needs any input to proceed
        return true;
      case 'transaction':
        // For transaction nodes, we just need confirmation
        const isDemoMode = process.env.DEMO_MODE === 'true';
        if (isDemoMode) {
          return input === 'demo' || input?.confirm === 'demo' || input === 'transaction' || input?.confirm === 'transaction';
        }
        return input === 'transaction' || input?.confirm === 'transaction';
      case 'input':
        if (!node.data?.validation?.required) return true;
        return !!(input && input.trim().length > 0);
      case 'choice':
        if (!node.data?.validation?.required) return true;
        return !!(input && node.data.options?.some((opt: any) => opt.value === input));
      default:
        return true;
    }
  }

  /**
   * Process user input and determine next action
   */
  processUserInput(
    schema: FormSchema,
    currentNodeId: string,
    userInput: any
  ): { nextNodeId: string | null; isValid: boolean; error?: string } {
    const currentNode = this.getCurrentNode(schema, currentNodeId);
    if (!currentNode) {
      return { nextNodeId: null, isValid: false, error: 'Node not found' };
    }

    // Validate input
    const isValid = this.validateNodeInput(currentNode, userInput);
    if (!isValid) {
      return { nextNodeId: currentNodeId, isValid: false, error: 'Invalid input' };
    }

    // Get next node
    const nextNode = this.getNextNode(schema, currentNodeId);
    const nextNodeId = nextNode ? nextNode.id : null;

    return { nextNodeId, isValid: true };
  }
}
