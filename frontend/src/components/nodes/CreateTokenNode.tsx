import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import { TransactionNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface CreateTokenNodeProps extends NodeProps {
  data: TransactionNodeData;
}

export const CreateTokenNode: React.FC<CreateTokenNodeProps> = (props) => {
  const { data } = props;
  const { parameters } = data;

  return (
    <BaseNode
      {...props}
      icon={<Sparkles className="w-4 h-4 text-yellow-400" />}
      label="Create Token"
    >
      {/* Token Name and Symbol */}
      <div className="text-sm font-medium text-foreground mb-2">
        {parameters?.name && parameters?.symbol
          ? `${parameters.name} (${parameters.symbol})`
          : parameters?.name || 'Token Name'
        }
      </div>

      {/* Token Details */}
      <div className="text-xs text-muted-foreground space-y-1">
        {parameters?.initialSupply && (
          <div>Supply: {parameters.initialSupply.toLocaleString()}</div>
        )}
        {parameters?.decimals !== undefined && (
          <div>Decimals: {parameters.decimals}</div>
        )}
        {parameters?.uri && (
          <div>URI: {parameters.uri.length > 20 ? `${parameters.uri.slice(0, 20)}...` : parameters.uri}</div>
        )}
        {!parameters?.initialSupply && !parameters?.uri && (
          <div>Configure token parameters</div>
        )}
      </div>
    </BaseNode>
  );
};