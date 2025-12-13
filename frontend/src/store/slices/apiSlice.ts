import {
  FormSchema,
  ValidationError,
  SaveFormPayload,
  LoadFormResponse,
  BlinkFormNode,
  BlinkFormEdge,
} from '@/types';

export interface ApiSlice {
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  lastAutoSaved: Date | null;
  validationErrors: ValidationError[];

  saveForm: () => Promise<void>;
  loadForm: (formId: string) => Promise<void>;
  loadFromLocalStorage: () => void;
  exportSchema: () => FormSchema;
  validateSchema: () => ValidationError[];
  autoSaveToLocalStorage: () => void;
  publishToTwitter: () => void;
  getActionUrl: () => string;
}

// Debounce helper
let autoSaveTimeout: NodeJS.Timeout | null = null;

export const createApiSlice = (set: any, get: any, api: any): ApiSlice => ({
  isSaving: false,
  isLoading: false,
  lastSaved: null,
  lastAutoSaved: null,
  validationErrors: [],

  validateSchema: () => {
    const state = get();
    const errors: ValidationError[] = [];

    // Check if there's at least one node
    if (state.nodes.length === 0) {
      errors.push({
        code: 'NO_NODES',
        message: 'Form must have at least one node',
      });
    }

    // Validate each node
    state.nodes.forEach((node: BlinkFormNode) => {
      if (node.type === 'question') {
        const data = node.data as any;
        if (!data.questionText || data.questionText.trim() === '') {
          errors.push({
            code: 'EMPTY_QUESTION',
            message: 'Question node must have question text',
            nodeId: node.id,
          });
        }
      }

      if (node.type === 'transaction') {
        const data = node.data as any;
        if (!data.transactionType) {
          errors.push({
            code: 'INVALID_TRANSACTION',
            message: 'Transaction node must have a transaction type',
            nodeId: node.id,
          });
        }
      }
    });

    set({ validationErrors: errors });
    return errors;
  },

  exportSchema: () => {
    const state = get();
    const schema: FormSchema = {
      nodes: state.nodes.map((node: BlinkFormNode) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: state.edges.map((edge: BlinkFormEdge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle ?? undefined,
        targetHandle: edge.targetHandle ?? undefined,
        data: edge.data,
      })),
      metadata: {
        version: '1.0.0',
      },
    };

    return schema;
  },

  autoSaveToLocalStorage: () => {
    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new timeout for 2 seconds
    autoSaveTimeout = setTimeout(() => {
      const state = get();
      const schema = state.exportSchema();

      try {
        localStorage.setItem(
          'blinkform-draft',
          JSON.stringify({
            title: state.title,
            description: state.description,
            nodes: schema.nodes,
            edges: schema.edges,
            savedAt: new Date().toISOString(),
          })
        );

        set({ lastAutoSaved: new Date() });
      } catch (error) {
        console.error('Failed to auto-save to localStorage:', error);
      }
    }, 2000);
  },

  loadFromLocalStorage: () => {
    try {
      const draft = localStorage.getItem('blinkform-draft');
      if (!draft) return;

      const data = JSON.parse(draft);

      set((state: any) => {
        state.nodes = data.nodes || [];
        state.edges = data.edges || [];
        state.title = data.title || 'Untitled Form';
        state.description = data.description || '';
        state.lastAutoSaved = data.savedAt ? new Date(data.savedAt) : null;
      });
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  },

  saveForm: async () => {
    const state = get();

    // Validate first
    const errors = state.validateSchema();
    if (errors.length > 0) {
      throw new Error('Validation failed. Please fix errors before saving.');
    }

    set({ isSaving: true, validationErrors: [] });

    try {
      const schema = state.exportSchema();
      const payload: SaveFormPayload = {
        title: state.title,
        description: state.description,
        schema,
        creatorAddress: state.creatorAddress || undefined,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const isUpdate = !!state.formId;
      const url = isUpdate
        ? `${apiUrl}/forms/${state.formId}`
        : `${apiUrl}/forms`;

      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      const result = await response.json();

      // Update formId if it's a new form
      if (!isUpdate && result.id) {
        state.setFormId(result.id);
      }

      set({ lastSaved: new Date(), isSaving: false });
    } catch (error) {
      set({ isSaving: false });
      throw error;
    }
  },

  loadForm: async (formId) => {
    set({ isLoading: true });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/forms/${formId}`);

      if (!response.ok) {
        throw new Error('Failed to load form');
      }

      const data: LoadFormResponse = await response.json();

      set((state: any) => {
        state.nodes = data.schema.nodes as BlinkFormNode[];
        state.edges = data.schema.edges as BlinkFormEdge[];
        state.formId = data.id;
        state.title = data.title;
        state.description = data.description || '';
        state.creatorAddress = data.creatorAddress || null;
        state.isLoading = false;
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  publishToTwitter: () => {
    const state = get();
    if (!state.formId) {
      throw new Error('Form must be saved before publishing');
    }

    const actionUrl = state.getActionUrl();
    const tweetText = `Check out this interactive Solana form: ${state.title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(actionUrl)}`;

    // Open Twitter compose window
    if (typeof window !== 'undefined') {
      window.open(twitterUrl, '_blank', 'width=550,height=420');
    }
  },

  getActionUrl: () => {
    const state = get();
    if (!state.formId) {
      throw new Error('Form must be saved before getting action URL');
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    return `${apiUrl}/actions/${state.formId}`;
  },
});
