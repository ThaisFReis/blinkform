import { nanoid } from 'nanoid';
import {
  BlinkFormNode,
  NodeType,
  QuestionNodeData,
  TransactionNodeData,
  LogicNodeData,
  EndNodeData,
  StartNodeData,
  NodeData,
} from '@/types';

export interface NodesSlice {
  nodes: BlinkFormNode[];
  selectedNodeId: string | null;

  addNode: (type: NodeType, position?: { x: number; y: number }, questionType?: string) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  moveNode: (id: string, position: { x: number; y: number }) => void;
  duplicateNode: (id: string) => void;
}

// Helper to create default node data based on type
const createDefaultNodeData = (type: NodeType, questionType?: string): NodeData => {
  switch (type) {
    case 'question':
      const qType = questionType || 'text';
      const baseQuestionData = {
        questionText: 'Enter your question here...',
        questionType: qType,
        validation: { required: false },
      } as QuestionNodeData;

      // Add type-specific defaults
      switch (qType) {
        case 'input':
          return { ...baseQuestionData, inputType: 'text', placeholder: 'Type your answer...' };
        case 'date':
          return baseQuestionData;
        case 'choice':
          return { ...baseQuestionData, options: [] };
        default:
          return baseQuestionData;
      }

    case 'transaction':
      if (questionType === 'nft') {
        return {
          transactionType: 'SPL_MINT',
          program: 'SPL Token Program',
          parameters: {
            amount: 1,
            decimals: 0,
            name: 'My NFT',
            symbol: 'NFT',
            uri: '',
          },
        } as TransactionNodeData;
      }
      if (questionType === 'contract') {
        return {
          transactionType: 'CUSTOM_CALL',
          program: 'Custom Program',
          parameters: {
            programId: '',
            instructionData: '',
            accounts: [],
          },
        } as TransactionNodeData;
      }
      return {
        transactionType: 'SYSTEM_TRANSFER',
        program: 'System Program',
        parameters: {},
      } as TransactionNodeData;

    case 'logic':
      if (questionType === 'validation') {
        return {
          logicType: 'validation',
          validationRules: [],
          blockOnFailure: true,
        } as any; // Type assertion needed due to union type
      }
      if (questionType === 'calculation') {
        return {
          logicType: 'calculation',
          operations: [],
        } as any; // Type assertion needed due to union type
      }
      return {
        logicType: 'conditional',
        mode: 'switch', // Default to switch mode
        branches: [
          {
            id: 'branch-true',
            label: 'True',
            color: '#22c55e', // Green
            matchValues: ['true', 'yes', '1'],
          },
          {
            id: 'branch-false',
            label: 'False',
            color: '#ef4444', // Red
            matchValues: ['false', 'no', '0'],
          },
        ],
      } as LogicNodeData;

    case 'end':
      return {
        label: 'Form Complete',
        message: 'Thank you for completing this form! Your submission has been processed successfully.',
        successActions: [],
      } as EndNodeData;

    case 'start':
      return {
        title: 'Welcome to this Interactive Form',
        description: 'This is a Blink - an interactive blockchain experience that lets you complete transactions and interact with decentralized applications directly from this page.',
        imageUrl: '', // Optional image URL for the form
        context: 'Fill out this form to participate in blockchain activities. Your responses will be used to generate secure, on-chain transactions.',
        definition: 'Blinks make blockchain interactions simple and accessible, eliminating the need for complex wallet setups or technical knowledge.',
        examples: [
          'Submit a form to mint an NFT',
          'Vote in a community proposal',
          'Purchase tokens or digital assets',
          'Participate in decentralized applications'
        ],
      } as StartNodeData;

    default:
      throw new Error(`Unknown node type: ${type}`);
  }
};

export const createNodesSlice = (set: any, get: any, api: any): NodesSlice => ({
  nodes: [],
  selectedNodeId: null,

  addNode: (type, position = { x: 250, y: 250 }, questionType) => {
    const id = nanoid();
    const newNode: BlinkFormNode = {
      id,
      type,
      position,
      data: createDefaultNodeData(type, questionType),
    };

    set((state: any) => {
      state.nodes.push(newNode);
      state.selectedNodeId = id;
      // Deselect edges when selecting a node
      if ('selectedEdgeId' in state) {
        state.selectedEdgeId = null;
      }
    });
  },

  updateNode: (id, data) => {
    set((state: any) => {
      const node = state.nodes.find((n: any) => n.id === id);
      if (node) {
        node.data = { ...node.data, ...data };
      }
    });
  },

  deleteNode: (id) => {
    set((state: any) => {
      state.nodes = state.nodes.filter((n: any) => n.id !== id);

      // Clear selection if deleted node was selected
      if (state.selectedNodeId === id) {
        state.selectedNodeId = null;
      }
    });

    // Cascade delete edges connected to this node
    get().deleteEdgesForNode(id);
  },

  selectNode: (id) => {
    set((state: any) => {
      state.selectedNodeId = id;
      // Deselect edges when selecting a node
      if ('selectedEdgeId' in state) {
        state.selectedEdgeId = null;
      }
    });
  },

  moveNode: (id, position) => {
    set((state: any) => {
      const node = state.nodes.find((n: any) => n.id === id);
      if (node) {
        node.position = position;
      }
    });
  },

  duplicateNode: (id) => {
    const node = get().nodes.find((n: any) => n.id === id);
    if (!node) return;

    const newId = nanoid();
    const newNode: BlinkFormNode = {
      ...node,
      id: newId,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: { ...node.data },
    };

    set((state: any) => {
      state.nodes.push(newNode);
      state.selectedNodeId = newId;
    });
  },
});
