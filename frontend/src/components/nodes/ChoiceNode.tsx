import React from 'react';
import { NodeProps } from '@xyflow/react';
import { RadioButtonIcon } from '@phosphor-icons/react';
import { QuestionNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface ChoiceNodeProps extends NodeProps {
  data: QuestionNodeData;
}

export const ChoiceNode: React.FC<ChoiceNodeProps> = (props) => {
  const { data } = props;
  const { questionText, options, multiSelect, validation } = data;

  return (
    <BaseNode
      {...props}
      icon={<RadioButtonIcon className="w-4 h-4 text-primary" />}
      label={multiSelect ? "Checkbox" : "Choice"}
    >
      {/* Question Text */}
      <div className="text-sm font-medium text-foreground mb-2">
        {questionText || 'Enter your question...'}
      </div>

      {/* Validation Indicators */}
      {validation && validation.required && (
        <div className="flex gap-1 mb-2">
          <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-1.5 py-0.5 rounded">
            Required
          </span>
        </div>
      )}

      {/* Options Preview */}
      <div className="space-y-1">
        {options && options.length > 0 ? (
          <>
            {options.slice(0, 3).map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                {multiSelect ? (
                  // Checkbox style
                  <div className="w-4 h-4 border border-input rounded bg-background flex items-center justify-center">
                    <div className="w-2 h-2 bg-muted-foreground/30 rounded-sm opacity-50"></div>
                  </div>
                ) : (
                  // Radio button style
                  <div className="w-4 h-4 border border-input rounded-full bg-background flex items-center justify-center">
                    <div className="w-2 h-2 bg-muted-foreground/30 rounded-full opacity-50"></div>
                  </div>
                )}
                <span className="text-sm text-muted-foreground">{option.label}</span>
              </div>
            ))}
            {options.length > 3 && (
              <div className="text-xs text-muted-foreground italic">
                +{options.length - 3} more options...
              </div>
            )}
          </>
        ) : (
          <div className="text-xs text-muted-foreground italic">
            No options configured
          </div>
        )}
      </div>
    </BaseNode>
  );
};