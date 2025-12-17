import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Send } from 'lucide-react';
import { TransactionNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface BatchAirdropNodeProps extends NodeProps {
  data: TransactionNodeData;
}

export const BatchAirdropNode: React.FC<BatchAirdropNodeProps> = (props) => {
  const { data } = props;
  const { parameters } = data;

  const recipients = parameters?.recipients || [];
  const totalAmount = recipients.reduce((sum: number, recipient: { amount: number }) => sum + (recipient.amount || 0), 0);

  return (
    <BaseNode
      {...props}
      icon={<Send className="w-4 h-4 text-blue-400" />}
      label="Batch Airdrop"
    >
      {/* Recipients Count */}
      <div className="text-sm font-medium text-foreground mb-2">
        {recipients.length > 0 ? `${recipients.length} Recipients` : 'Batch Airdrop'}
      </div>

      {/* Airdrop Details */}
      <div className="text-xs text-muted-foreground space-y-1">
        {totalAmount > 0 && (
          <div>Total: {totalAmount.toLocaleString()}</div>
        )}
        {parameters?.mintAddress && (
          <div>Token: {parameters.mintAddress.slice(0, 8)}...{parameters.mintAddress.slice(-4)}</div>
        )}
        {parameters?.decimals !== undefined && (
          <div>Decimals: {parameters.decimals}</div>
        )}
        {recipients.length === 0 && !parameters?.mintAddress && (
          <div>Configure airdrop parameters</div>
        )}
      </div>
    </BaseNode>
  );
};