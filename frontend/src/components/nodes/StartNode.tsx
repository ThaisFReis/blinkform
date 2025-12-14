import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Info } from 'lucide-react';
import { StartNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface StartNodeProps extends NodeProps {
  data: StartNodeData;
}

export const StartNode: React.FC<StartNodeProps> = (props) => {
  const { data } = props;
  const { title, description, context, definition, examples } = data;

  return (
    <BaseNode
      {...props}
      icon={
        <div className="w-6 h-6 rounded-lg bg-indigo-400/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-indigo-400" />
        </div>
      }
      label="Start Info"
      handles={{ input: false, output: true }}
    >
      {/* Title */}
      <div className="text-sm font-semibold text-white mb-3">
        {title}
      </div>

      {/* Description */}
      <div className="text-xs text-gray-300 mb-3 leading-relaxed">
        {description}
      </div>

      {/* Context */}
      <div className="mb-3">
        <div className="text-xs font-medium text-indigo-300 mb-1">Context</div>
        <div className="text-xs text-gray-400 leading-relaxed">
          {context}
        </div>
      </div>

      {/* Definition */}
      <div className="mb-3">
        <div className="text-xs font-medium text-indigo-300 mb-1">Definition</div>
        <div className="text-xs text-gray-400 leading-relaxed">
          {definition}
        </div>
      </div>

      {/* Examples */}
      <div>
        <div className="text-xs font-medium text-indigo-300 mb-2">Examples</div>
        <div className="space-y-1">
          {examples.map((example, index) => (
            <div key={index} className="text-xs text-gray-400 flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>{example}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseNode>
  );
};