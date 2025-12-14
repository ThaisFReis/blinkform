import React from 'react';
import { NodeProps } from '@xyflow/react';
import { CheckCircle } from 'lucide-react';
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
      icon={
        <div className="w-6 h-6 rounded-lg bg-pink-400/10 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-pink-400" />
        </div>
      }
      label={multiSelect ? "Checkbox" : "Choice"}
    >
      {/* Question Text */}
      <div className="text-sm font-medium text-white mb-2">
        {questionText || 'Enter your question...'}
      </div>

      {/* Validation Indicators */}
      {validation && validation.required && (
        <div className="flex gap-1 mb-2">
          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
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
                  <div className="w-4 h-4 border border-white/10 rounded bg-black/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-pink-400/30 rounded-sm opacity-50"></div>
                  </div>
                ) : (
                  // Radio button style
                  <div className="w-4 h-4 border border-white/10 rounded-full bg-black/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-pink-400/30 rounded-full opacity-50"></div>
                  </div>
                )}
                <span className="text-sm text-gray-300">{option.label}</span>
              </div>
            ))}
            {options.length > 3 && (
              <div className="text-xs text-gray-500 italic">
                +{options.length - 3} more options...
              </div>
            )}
          </>
        ) : (
          <div className="text-xs text-gray-500 italic">
            No options configured
          </div>
        )}
      </div>
    </BaseNode>
  );
};