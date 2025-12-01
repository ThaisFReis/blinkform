import React from 'react';
import { NodeProps } from '@xyflow/react';
import { BankIcon } from '@phosphor-icons/react';
import { TransactionNodeData, TransactionType } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface TransactionNodeProps extends NodeProps {
  data: TransactionNodeData;
}

export const TransactionNode: React.FC<TransactionNodeProps> = (props) => {
  const { data } = props;
  const { transactionType, parameters } = data;

  const getTransactionTypeLabel = (type: TransactionType): string => {
    switch (type) {
      case 'SPL_MINT':
        return 'Mint Token';
      case 'SPL_TRANSFER':
        return 'Transfer Token';
      case 'SYSTEM_TRANSFER':
        return 'Transfer SOL';
      default:
        return 'Transaction';
    }
  };

  const getParameterPreview = (type: TransactionType, params: any): string => {
    switch (type) {
      case 'SPL_MINT':
        return params.amount ? `${params.amount} tokens` : 'Configure amount';
      case 'SPL_TRANSFER':
        return params.amount && params.recipientAddress
          ? `${params.amount} to ${params.recipientAddress.slice(0, 8)}...`
          : 'Configure transfer';
      case 'SYSTEM_TRANSFER':
        return params.amount ? `${params.amount} SOL` : 'Configure amount';
      default:
        return 'Configure parameters';
    }
  };

  return (
    <BaseNode
      {...props}
      icon={<BankIcon className="w-4 h-4 text-primary" />}
      label="Transaction"
    >
      {/* Transaction Type */}
      <div className="text-sm font-medium text-foreground mb-2">
        {transactionType ? getTransactionTypeLabel(transactionType) : 'Select transaction type'}
      </div>

      {/* Parameter Preview */}
      <div className="text-xs text-muted-foreground">
        {transactionType && parameters
          ? getParameterPreview(transactionType, parameters)
          : 'No parameters configured'
        }
      </div>
    </BaseNode>
  );
};