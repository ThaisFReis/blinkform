import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Calendar } from 'lucide-react';
import { QuestionNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface DateNodeProps extends NodeProps {
  data: QuestionNodeData;
}

export const DateNode: React.FC<DateNodeProps> = (props) => {
  const { data } = props;
  const { questionText, validation } = data;

  return (
    <BaseNode
      {...props}
      icon={
        <div className="w-6 h-6 rounded-lg bg-purple-400/10 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-purple-400" />
        </div>
      }
      label="Date"
    >
      {/* Question Text */}
      <div className="text-sm font-medium text-white mb-2">
        {questionText || 'Enter your question...'}
      </div>

      {/* Validation Indicators*/}
      {validation && (
        <div className="flex gap-1 mb-2">
          {validation.required && (
            <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
              Required
            </span>
          )}
          {validation.min && (
            <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">
              Min: {validation.min}
            </span>
          )}
          {validation.max && (
            <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded">
              Max: {validation.max}
            </span>
          )}
        </div>
      )}

      {/* Date Input Preview */}
      <div className="mt-2 h-8 bg-black/20 rounded border border-white/5 flex items-center px-3">
        <div className="text-sm text-gray-500">
          Date picker field
        </div>
      </div>
    </BaseNode>
  );
};