import React from 'react';
import { NodeProps } from '@xyflow/react';
import { CalendarDotsIcon } from '@phosphor-icons/react';
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
      icon={<CalendarDotsIcon className="w-4 h-4 text-primary" />}
      label="Date"
    >
      {/* Question Text */}
      <div className="text-sm font-medium text-foreground mb-2">
        {questionText || 'Enter your question...'}
      </div>

      {/* Validation Indicators */}
      {validation && (
        <div className="flex gap-1 mb-2">
          {validation.required && (
            <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-1.5 py-0.5 rounded">
              Required
            </span>
          )}
          {validation.min && (
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
              Min: {validation.min}
            </span>
          )}
          {validation.max && (
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
              Max: {validation.max}
            </span>
          )}
        </div>
      )}

      {/* Date Input Preview */}
      <div className="border border-input rounded px-3 py-2 bg-background">
        <div className="text-sm text-muted-foreground">
          Date picker field
        </div>
      </div>
    </BaseNode>
  );
};