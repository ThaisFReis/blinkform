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

  // UI
  isMobilePreviewVisible: true,
  isLeftSidebarVisible: true,
  isRightSidebarVisible: true,

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

          isMobilePreviewVisible: true,
          isLeftSidebarVisible: true,
          isRightSidebarVisible: true,

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
          }),
        }
      )
    ),
    {
      name: 'BlinkForm Builder',
    }
  )
);
