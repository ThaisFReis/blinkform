import { BlinkFormNode } from './nodes';
import { BlinkFormEdge } from './edges';

// Collection settings for NFT minting
export interface CollectionSettings {
  collectionName: string;
  collectionAddress: string;
  royalties: number; // Percentage (e.g., 5 for 5%)
  collectionDescription?: string;
  collectionImageUrl?: string;
}

// Form metadata
export interface FormMetadata {
  id?: string;
  title: string;
  description?: string;
  creatorAddress?: string;
  collectionSettings?: CollectionSettings;
}

// Complete form schema structure
export interface FormSchema {
  nodes: Array<{
    id: string;
    type: string;
    position?: { x: number; y: number };
    data: any;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    data?: any;
  }>;
  metadata: {
    startNodeId?: string;
    version: string;
  };
}

// Payload for saving form to backend
export interface SaveFormPayload {
  title: string;
  description?: string;
  schema: FormSchema;
  creatorAddress?: string;
}

// Validation error
export interface ValidationError {
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

// Load form response
export interface LoadFormResponse {
  id: string;
  title: string;
  description?: string;
  creatorAddress?: string;
  schema: FormSchema;
  createdAt?: string;
  updatedAt?: string;
}
