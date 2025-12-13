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
    if (currentNode.type === 'end') {
      baseResponse.title = formTitle;
      baseResponse.description = currentNode.data.message || 'Thank you for your response!';
      baseResponse.label = 'Complete';
      baseResponse.links.actions = [{
        label: 'Finish',
        href: `${baseUrl}/api/forms/complete`
      }];
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
    if (!node.data.required) return true;

    switch (node.type) {
      case 'input':
        return !!(input && input.trim().length > 0);
      case 'choice':
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
