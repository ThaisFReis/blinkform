import { Injectable } from '@nestjs/common';

export interface FormNode {
  id: string;
  type: string;
  data: any;
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

export interface ActionResponse {
  type?: string;
  icon: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
  links: {
    actions: Array<{
      label: string;
      href: string;
      parameters?: Array<{
        name: string;
        label?: string;
        required?: boolean;
      }>;
    }>;
  };
  error?: {
    message: string;
  };
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
   * Get the starting node (first node in the schema)
   */
  getStartNode(schema: FormSchema): FormNode | null {
    if (schema.nodes.length === 0) return null;

    // For now, assume the first node is the start
    // In a more complex implementation, we might have a dedicated start node
    return schema.nodes[0];
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
   * Generate ActionResponse for the current node
   */
  generateActionResponse(
    formTitle: string,
    currentNode: FormNode,
    nextNodeId?: string,
    formId?: string
  ): ActionResponse {
    const baseUrl = process.env.BASE_URL || 'https://blinkform-production.up.railway.app';
    const baseResponse: ActionResponse = {
      type: 'action',
      icon: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=BlinkForm',
      title: formTitle,
      description: `Question: ${currentNode.data.questionText || 'Complete the form'}`,
      label: 'Continue',
      links: {
        actions: []
      }
    };

    // Generate actions based on node data questionType
    const questionType = currentNode.data?.questionType;

    switch (questionType) {
      case 'input':
        baseResponse.links.actions = [{
          label: currentNode.data.questionText || 'Enter your response',
          href: `${baseUrl}/api/actions/${formId}?node=${currentNode.id}`,
          parameters: [{
            name: 'input',
            label: currentNode.data.questionText,
            required: currentNode.data.required || false
          }]
        }];
        break;

      case 'choice':
        baseResponse.links.actions = (currentNode.data.options || []).map((option: any) => ({
          label: option.label,
          href: `${baseUrl}/api/actions/${formId}?choice=${option.value}&next=${nextNodeId || 'end'}`
        }));
        break;

      case 'end':
        baseResponse.title = formTitle;
        baseResponse.description = currentNode.data.message || 'Thank you for your response!';
        baseResponse.label = 'Complete';
        baseResponse.links.actions = [{
          label: 'Finish',
          href: `${baseUrl}/api/actions/complete`
        }];
        break;

      default:
        baseResponse.links.actions = [{
          label: 'Continue',
          href: `${baseUrl}/api/actions/${formId}?next=${nextNodeId || 'end'}`
        }];
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
