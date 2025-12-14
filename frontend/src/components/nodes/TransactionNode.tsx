import React from 'react';
import { NodeProps } from '@xyflow/react';
import { CreditCard } from 'lucide-react';
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
      icon={
        <div className="w-6 h-6 rounded-lg bg-cyan-400/10 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-cyan-400" />
        </div>
      }
      label="Transaction"
    >
      {/* Transaction Type */}
      <div className="text-sm font-medium text-white mb-2">
        {transactionType ? getTransactionTypeLabel(transactionType) : 'Select transaction type'}
      </div>

      {/* Parameter Preview */}
      <div className="text-xs text-gray-500">
        {transactionType && parameters
          ? getParameterPreview(transactionType, parameters)
          : 'No parameters configured'
        }
      </div>
    </BaseNode>
  );
};