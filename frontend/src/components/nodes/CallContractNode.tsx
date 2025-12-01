import React from 'react';
import { NodeProps } from '@xyflow/react';
import { CodeIcon } from '@phosphor-icons/react';
import { TransactionNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface CallContractNodeProps extends NodeProps {
  data: TransactionNodeData;
}

export const CallContractNode: React.FC<CallContractNodeProps> = (props) => {
  const { data } = props;
  const { parameters } = data;

  return (
    <BaseNode
      {...props}
      icon={<CodeIcon className="w-4 h-4 text-primary" />}
      label="Call Contract"
    >
      {/* Program ID */}
      <div className="text-sm font-medium text-foreground mb-2">
        {parameters?.programId ? `${parameters.programId.slice(0, 8)}...` : 'Program ID'}
      </div>

      {/* Instruction Info */}
      <div className="text-xs text-muted-foreground">
        {parameters?.instructionData ? 'Custom instruction configured' : 'No instruction data'}
        {parameters?.accounts && parameters.accounts.length > 0 && (
          <div>{parameters.accounts.length} account{parameters.accounts.length !== 1 ? 's' : ''}</div>
        )}
      </div>
    </BaseNode>
  );
};