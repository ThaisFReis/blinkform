import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Type, Hash } from 'lucide-react';
import { QuestionNodeData, InputType } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface InputNodeProps extends NodeProps {
  data: QuestionNodeData;
}

export const InputNode: React.FC<InputNodeProps> = (props) => {
  const { data } = props;
  const { questionText, inputType, placeholder, validation } = data;

  const getIcon = (type?: InputType) => {
    switch (type) {
      case 'number':
      case 'currency':
        return (
          <div className="w-6 h-6 rounded-lg bg-blue-400/10 flex items-center justify-center">
            <Hash className="w-4 h-4 text-blue-400" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-lg bg-blue-400/10 flex items-center justify-center">
            <Type className="w-4 h-4 text-blue-400" />
          </div>
        );
    }
  };

  const getLabel = (type?: InputType) => {
    switch (type) {
      case 'number':
        return 'Number Input';
      case 'email':
        return 'Email Input';
      case 'phone':
        return 'Phone Input';
      case 'cpf':
        return 'CPF Input';
      case 'currency':
        return 'Currency Input';
      case 'custom':
        return 'Custom Input';
      default:
        return 'Text Input';
    }
  };

  const getPreviewText = (type?: InputType) => {
    switch (type) {
      case 'email':
        return 'user@example.com';
      case 'phone':
        return '(11) 99999-9999';
      case 'cpf':
        return '123.456.789-00';
      case 'currency':
        return 'R$ 1.234,56';
      case 'number':
        return '12345';
      default:
        return placeholder || 'Enter text...';
    }
  };

  return (
    <BaseNode
      {...props}
      icon={getIcon(inputType)}
      label={getLabel(inputType)}
    >
      {/* Question Text */}
      <div className="text-sm font-medium text-white mb-2">
        {questionText || 'Enter your question...'}
      </div>

      {/* Validation Indicators */}
      {validation && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {validation.required && (
            <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
              Required
            </span>
          )}
          {inputType === 'number' || inputType === 'currency' ? (
            <>
              {validation.min && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                  Min: {validation.min}
                </span>
              )}
              {validation.max && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                  Max: {validation.max}
                </span>
              )}
            </>
          ) : (
            <>
              {validation.minLength && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                  Min: {validation.minLength}
                </span>
              )}
              {validation.maxLength && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                  Max: {validation.maxLength}
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Input Preview */}
      <div className="mt-2 h-8 bg-black/20 rounded border border-white/5 flex items-center px-3">
        <div className="text-sm text-gray-500">
          {getPreviewText(inputType)}
        </div>
      </div>
    </BaseNode>
  );
};