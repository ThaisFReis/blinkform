import { Connection } from '@xyflow/react';
import { nanoid } from 'nanoid';
import { BlinkFormEdge, ConditionalEdgeData } from '@/types';

export interface EdgesSlice {
  edges: BlinkFormEdge[];
  selectedEdgeId: string | null;

  addEdge: (connection: Connection) => void;
  updateEdge: (id: string, data: ConditionalEdgeData) => void;
  deleteEdge: (id: string) => void;
  selectEdge: (id: string | null) => void;
  deleteEdgesForNode: (nodeId: string) => void;
}

export const createEdgesSlice = (set: any, get: any, api: any): EdgesSlice => ({
  edges: [],
  selectedEdgeId: null,

  addEdge: (connection) => {
    const id = nanoid();
    const newEdge: BlinkFormEdge = {
      id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || undefined,
      targetHandle: connection.targetHandle || undefined,
      type: 'default',
      animated: false,
      data: {},
    };

    set((state: any) => {
      state.edges.push(newEdge);
    });
  },

  updateEdge: (id, data) => {
    set((state: any) => {
      const edge = state.edges.find((e: any) => e.id === id);
      if (edge) {
        edge.data = { ...edge.data, ...data };
      }
    });
  },

  deleteEdge: (id) => {
    set((state: any) => {
      state.edges = state.edges.filter((e: any) => e.id !== id);

      // Clear selection if deleted edge was selected
      if (state.selectedEdgeId === id) {
        state.selectedEdgeId = null;
      }
    });
  },

  selectEdge: (id) => {
    set((state: any) => {
      state.selectedEdgeId = id;
      // Deselect nodes when selecting an edge
      if ('selectedNodeId' in state) {
        state.selectedNodeId = null;
      }
    });
  },

  deleteEdgesForNode: (nodeId) => {
    set((state: any) => {
      state.edges = state.edges.filter(
        (e: any) => e.source !== nodeId && e.target !== nodeId
      );
    });
  },
});
