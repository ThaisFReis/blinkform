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
      icon={<ImageIcon className="w-4 h-4 text-primary" />}
      label="Mint NFT"
    >
      {/* NFT Name */}
      <div className="text-sm font-medium text-foreground mb-2">
        {parameters?.name || 'NFT Name'}
      </div>

      {/* Collection Info */}
      <div className="text-xs text-muted-foreground">
        {parameters?.collectionAddress ? (
          <div>Collection: {parameters.collectionAddress.slice(0, 8)}...</div>
        ) : (
          <div>Collection not set</div>
        )}
        {parameters?.amount && <div>Amount: {parameters.amount}</div>}
      </div>
    </BaseNode>
  );
};