import React from 'react';
import { NodeProps } from '@xyflow/react';
import { ImageIcon } from '@phosphor-icons/react';
import { TransactionNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface MintNFTNodeProps extends NodeProps {
  data: TransactionNodeData;
}

export const MintNFTNode: React.FC<MintNFTNodeProps> = (props) => {
  const { data } = props;
  const { parameters } = data;

  return (
    <BaseNode
      {...props}
      icon={<ImageIcon className="w-4 h-4 text-pink-400" />}
      label="Mint NFT"
    >
      {/* NFT Name */}
      <div className="text-sm font-medium text-foreground mb-2">
        {parameters?.name || 'NFT Name'}
      </div>

      {/* Collection Address */}
      <div className="text-xs text-muted-foreground space-y-1">
        {parameters?.collectionAddress && (
          <div>Collection: {parameters.collectionAddress.slice(0, 8)}...{parameters.collectionAddress.slice(-4)}</div>
        )}
        {parameters?.uri && (
          <div>URI: {parameters.uri.length > 20 ? `${parameters.uri.slice(0, 20)}...` : parameters.uri}</div>
        )}
        {parameters?.recipientAddress && (
          <div>To: {parameters.recipientAddress.slice(0, 8)}...{parameters.recipientAddress.slice(-4)}</div>
        )}
        {!parameters?.collectionAddress && !parameters?.uri && !parameters?.recipientAddress && (
          <div>Configure NFT parameters</div>
        )}
      </div>
    </BaseNode>
  );
};