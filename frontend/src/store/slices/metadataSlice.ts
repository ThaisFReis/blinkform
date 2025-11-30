import { FormMetadata, CollectionSettings } from '@/types';

export interface MetadataSlice {
  formId: string | null;
  title: string;
  description: string;
  creatorAddress: string | null;
  collectionSettings: CollectionSettings | null;

  setFormMetadata: (metadata: Partial<FormMetadata>) => void;
  setFormId: (id: string) => void;
  setCollectionSettings: (settings: Partial<CollectionSettings>) => void;
}

export const createMetadataSlice = (set: any, get: any, api: any): MetadataSlice => ({
  formId: null,
  title: 'Untitled Form',
  description: '',
  creatorAddress: null,
  collectionSettings: null,

  setFormMetadata: (metadata) => {
    set((state: any) => {
      if (metadata.title !== undefined) state.title = metadata.title;
      if (metadata.description !== undefined) state.description = metadata.description;
      if (metadata.creatorAddress !== undefined)
        state.creatorAddress = metadata.creatorAddress;
      if (metadata.collectionSettings !== undefined)
        state.collectionSettings = metadata.collectionSettings;
    });
  },

  setFormId: (id) => {
    set({ formId: id });
  },

  setCollectionSettings: (settings) => {
    set((state: any) => {
      if (!state.collectionSettings) {
        state.collectionSettings = {
          collectionName: '',
          collectionAddress: '',
          royalties: 0,
          collectionDescription: '',
          collectionImageUrl: '',
        };
      }
      if (settings.collectionName !== undefined) state.collectionSettings.collectionName = settings.collectionName;
      if (settings.collectionAddress !== undefined) state.collectionSettings.collectionAddress = settings.collectionAddress;
      if (settings.royalties !== undefined) state.collectionSettings.royalties = settings.royalties;
      if (settings.collectionDescription !== undefined) state.collectionSettings.collectionDescription = settings.collectionDescription;
      if (settings.collectionImageUrl !== undefined) state.collectionSettings.collectionImageUrl = settings.collectionImageUrl;
    });
  },
});
