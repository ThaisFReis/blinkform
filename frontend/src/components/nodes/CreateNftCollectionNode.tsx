import React from 'react';
import { NodeProps } from '@xyflow/react';
import { FolderPlus } from 'lucide-react';
import { TransactionNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface CreateNftCollectionNodeProps extends NodeProps {
  data: TransactionNodeData;
}

export const CreateNftCollectionNode: React.FC<CreateNftCollectionNodeProps> = (props) => {
  const { data } = props;
  const { parameters } = data;

  const royaltyPercentage = parameters?.sellerFeeBasisPoints
    ? (parameters.sellerFeeBasisPoints / 100).toFixed(1)
    : null;

  return (
    <BaseNode
      {...props}
      icon={<FolderPlus className="w-4 h-4 text-purple-400" />}
      label="Create Collection"
    >
      {/* Collection Name and Symbol */}
      <div className="text-sm font-medium text-foreground mb-2">
        {parameters?.name && parameters?.symbol
          ? `${parameters.name} (${parameters.symbol})`
          : parameters?.name || 'Collection Name'
        }
      </div>

      {/* Collection Details */}
      <div className="text-xs text-muted-foreground space-y-1">
        {royaltyPercentage && (
          <div>Royalty: {royaltyPercentage}%</div>
        )}
        {parameters?.uri && (
          <div>URI: {parameters.uri.length > 20 ? `${parameters.uri.slice(0, 20)}...` : parameters.uri}</div>
        )}
        {!royaltyPercentage && !parameters?.uri && (
          <div>Configure collection parameters</div>
        )}
      </div>
    </BaseNode>
  );
};