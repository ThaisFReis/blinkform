import React from 'react';
import { NodeProps } from '@xyflow/react';
import { TextAaIcon, HashStraightIcon } from '@phosphor-icons/react';
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
        return <HashStraightIcon className="w-4 h-4 text-primary" />;
      default:
        return <TextAaIcon className="w-4 h-4 text-primary" />;
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
      <div className="text-sm font-medium text-foreground mb-2">
        {questionText || 'Enter your question...'}
      </div>

      {/* Validation Indicators */}
      {validation && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {validation.required && (
            <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-1.5 py-0.5 rounded">
              Required
            </span>
          )}
          {inputType === 'number' || inputType === 'currency' ? (
            <>
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
            </>
          ) : (
            <>
              {validation.minLength && (
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
                  Min: {validation.minLength}
                </span>
              )}
              {validation.maxLength && (
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
                  Max: {validation.maxLength}
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Input Preview */}
      <div className="border border-input rounded px-3 py-2 bg-background">
        <div className="text-sm text-muted-foreground">
          {getPreviewText(inputType)}
        </div>
      </div>
    </BaseNode>
  );
};