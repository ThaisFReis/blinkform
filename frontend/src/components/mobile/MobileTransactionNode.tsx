'use client';

import React from 'react';
import { TransactionNodeData, TransactionType } from '@/types/nodes';

interface MobileTransactionNodeProps {
  data: TransactionNodeData;
  onNext: () => void;
}

export const MobileTransactionNode: React.FC<MobileTransactionNodeProps> = ({
  data,
  onNext,
}) => {
  const { transactionType, program, parameters } = data;

  const getTransactionDetails = () => {
    switch (transactionType) {
      case 'SPL_MINT':
        return {
          title: 'Mint Tokens',
          icon: '🪙',
          details: [
            { label: 'Token Type', value: 'SPL Token' },
            { label: 'Amount', value: parameters?.amount ? `${parameters.amount} tokens` : 'Not specified' },
            { label: 'Mint Address', value: parameters?.mintAddress || 'Not specified' },
            { label: 'Recipient', value: parameters?.recipientAddress || 'Your wallet' },
          ]
        };
      case 'SPL_TRANSFER':
        return {
          title: 'Transfer Tokens',
          icon: '💸',
          details: [
            { label: 'Token Type', value: 'SPL Token' },
            { label: 'Amount', value: parameters?.amount ? `${parameters.amount} tokens` : 'Not specified' },
            { label: 'Recipient', value: parameters?.recipientAddress || 'Not specified' },
            { label: 'Token Mint', value: parameters?.mintAddress || 'Not specified' },
          ]
        };
      case 'SYSTEM_TRANSFER':
        return {
          title: 'SOL Transfer',
          icon: '◎',
          details: [
            { label: 'Amount', value: parameters?.amount ? `${parameters.amount} SOL` : 'Not specified' },
            { label: 'Recipient', value: parameters?.recipientAddress || 'Not specified' },
            { label: 'Network', value: 'Solana Mainnet' },
          ]
        };
      default:
        return {
          title: 'Custom Transaction',
          icon: '⚙️',
          details: [
            { label: 'Program', value: program || 'Not specified' },
            { label: 'Type', value: 'Custom Call' },
          ]
        };
    }
  };

  const transactionInfo = getTransactionDetails();

  return (
    <div className="space-y-6">
      {/* Transaction Header */}
      <div className="text-center space-y-2">
        <div className="text-4xl">{transactionInfo.icon}</div>
        <h2 className="text-xl font-bold text-gray-900">
          {transactionInfo.title}
        </h2>
        <p className="text-sm text-gray-600">
          Review the transaction details below
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {transactionInfo.details.map((detail, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              {detail.label}
            </span>
            <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Network Fee Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="text-blue-600 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <div className="font-medium">Network Fee</div>
            <div className="text-blue-600">
              A small Solana network fee will be required to process this transaction.
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onNext}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
        >
          Confirm Transaction
        </button>

        <button
          onClick={() => {/* Handle cancel */}}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Security Notice */}
      <div className="text-xs text-gray-500 text-center">
        This is a preview. Actual transaction will require wallet approval.
      </div>
    </div>
  );
};