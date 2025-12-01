import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createNodesSlice, NodesSlice } from './slices/nodesSlice';
import { createEdgesSlice, EdgesSlice } from './slices/edgesSlice';
import { createMetadataSlice, MetadataSlice } from './slices/metadataSlice';
import { createApiSlice, ApiSlice } from './slices/apiSlice';

// Combined store type
export type FormBuilderStore = NodesSlice & EdgesSlice & MetadataSlice & ApiSlice & {
  reset: () => void;
  isMobilePreviewVisible: boolean;
  toggleMobilePreview: () => void;
  isLeftSidebarVisible: boolean;
  toggleLeftSidebar: () => void;
  isRightSidebarVisible: boolean;
  toggleRightSidebar: () => void;

  // Mobile preview state
  mobilePreview: {
    currentNodeId: string | null;
    responses: Record<string, any>;
    navigationHistory: string[];
    isFormStarted: boolean;
  };
  startMobilePreview: () => void;
  navigateToNode: (nodeId: string) => void;
  goBackInPreview: () => void;
  updateResponse: (nodeId: string, value: any) => void;
  resetMobilePreview: () => void;
};

// Initial state
const initialState = {
  // Nodes
  nodes: [],
  selectedNodeId: null,

  // Edges
  edges: [],
  selectedEdgeId: null,

  // Metadata
  formId: null,
  title: 'Untitled Form',
  description: '',
  creatorAddress: null,
  collectionSettings: null,

  // UI - Default to closed on mobile, open on desktop
  isMobilePreviewVisible: false,
  isLeftSidebarVisible: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  isRightSidebarVisible: typeof window !== 'undefined' ? window.innerWidth >= 1280 : true,

  // Mobile preview state
  mobilePreview: {
    currentNodeId: null,
    responses: {},
    navigationHistory: [],
    isFormStarted: false,
  },

  // API
  isSaving: false,
  isLoading: false,
  lastSaved: null,
  lastAutoSaved: null,
  validationErrors: [],
};

// Create the store with middleware
export const useFormBuilderStore = create<FormBuilderStore>()(
  devtools(
    immer(
      persist(
        (set, get, api) => ({
          ...createNodesSlice(set, get, api),
          ...createEdgesSlice(set, get, api),
          ...createMetadataSlice(set, get, api),
          ...createApiSlice(set, get, api),

          isMobilePreviewVisible: false,
          isLeftSidebarVisible: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
          isRightSidebarVisible: typeof window !== 'undefined' ? window.innerWidth >= 1280 : true,

          toggleMobilePreview: () => {
            set((state: any) => ({
              isMobilePreviewVisible: !state.isMobilePreviewVisible
            }));
          },

          toggleLeftSidebar: () => {
            set((state: any) => ({
              isLeftSidebarVisible: !state.isLeftSidebarVisible
            }));
          },

          toggleRightSidebar: () => {
            set((state: any) => ({
              isRightSidebarVisible: !state.isRightSidebarVisible
            }));
          },

          // Mobile preview functions
          mobilePreview: {
            currentNodeId: null,
            responses: {},
            navigationHistory: [],
            isFormStarted: false,
          },

          startMobilePreview: () => {
            const { nodes } = get();
            const firstQuestionNode = nodes.find(node => node.type === 'question');
            if (firstQuestionNode) {
              set((state: any) => {
                state.mobilePreview.currentNodeId = firstQuestionNode.id;
                state.mobilePreview.isFormStarted = true;
                state.mobilePreview.navigationHistory = [firstQuestionNode.id];
                state.mobilePreview.responses = {};
              });
            }
          },

          navigateToNode: (nodeId: string) => {
            set((state: any) => {
              const currentHistory = [...state.mobilePreview.navigationHistory];
              // Only add to history if it's not already the current node
              if (state.mobilePreview.currentNodeId !== nodeId) {
                currentHistory.push(nodeId);
              }
              state.mobilePreview.currentNodeId = nodeId;
              state.mobilePreview.navigationHistory = currentHistory;
            });
          },

          goBackInPreview: () => {
            set((state: any) => {
              const history = [...state.mobilePreview.navigationHistory];
              if (history.length > 1) {
                history.pop(); // Remove current node
                const previousNodeId = history[history.length - 1];
                state.mobilePreview.currentNodeId = previousNodeId;
                state.mobilePreview.navigationHistory = history;
              }
            });
          },

          updateResponse: (nodeId: string, value: any) => {
            set((state: any) => {
              state.mobilePreview.responses[nodeId] = value;
            });
          },

          resetMobilePreview: () => {
            set((state: any) => {
              state.mobilePreview = {
                currentNodeId: null,
                responses: {},
                navigationHistory: [],
                isFormStarted: false,
              };
            });
          },

          reset: () => set(initialState),
        }),
        {
          name: 'blinkform-builder-storage',
          partialize: (state) => ({
            title: state.title,
            description: state.description,
            collectionSettings: state.collectionSettings,
            // Don't persist nodes and edges to keep canvas clean
            // nodes: state.nodes,
            // edges: state.edges,
            isLeftSidebarVisible: state.isLeftSidebarVisible,
            isRightSidebarVisible: state.isRightSidebarVisible,
            isMobilePreviewVisible: state.isMobilePreviewVisible,
            // Don't persist mobile preview state - should reset on page reload
          }),
        }
      )
    ),
    {
      name: 'BlinkForm Builder',
    }
  )
);
