import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Coins } from 'lucide-react';
import { TransactionNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface MintTokenNodeProps extends NodeProps {
  data: TransactionNodeData;
}

export const MintTokenNode: React.FC<MintTokenNodeProps> = (props) => {
  const { data } = props;
  const { parameters } = data;

  return (
    <BaseNode
      {...props}
      icon={<Coins className="w-4 h-4 text-green-400" />}
      label="Mint Tokens"
    >
      {/* Mint Address */}
      <div className="text-sm font-medium text-foreground mb-2">
        {parameters?.mintAddress
          ? `${parameters.mintAddress.slice(0, 8)}...${parameters.mintAddress.slice(-4)}`
          : 'Mint Address'
        }
      </div>

      {/* Mint Details */}
      <div className="text-xs text-muted-foreground space-y-1">
        {parameters?.amount && (
          <div>Amount: {parameters.amount.toLocaleString()}</div>
        )}
        {parameters?.recipientAddress && (
          <div>To: {parameters.recipientAddress.slice(0, 8)}...{parameters.recipientAddress.slice(-4)}</div>
        )}
        {parameters?.decimals !== undefined && (
          <div>Decimals: {parameters.decimals}</div>
        )}
        {!parameters?.amount && !parameters?.recipientAddress && (
          <div>Configure mint parameters</div>
        )}
      </div>
    </BaseNode>
  );
};