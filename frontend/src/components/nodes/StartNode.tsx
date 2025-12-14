import React from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { Info } from 'lucide-react';
import { StartNodeData } from '@/types/nodes';
import { BaseNode } from './BaseNode';

interface StartNodeProps extends NodeProps {
  data: StartNodeData;
}

export const StartNode: React.FC<StartNodeProps> = (props) => {
   const { data } = props;
   const { title, description, imageUrl } = data;

  return (
    <BaseNode
      {...props}
      icon={
        <div className="w-6 h-6 rounded-lg bg-indigo-400/10 flex items-center justify-center">
          <Info className="w-4 h-4 text-indigo-400" />
        </div>
      }
      label="Start Form"
      handles={{ input: false, output: true }}
      renderCustomContainer={(content) => (
        <div className="bg-[#13131A] border-2 rounded-xl shadow-xl min-w-[320px] max-w-[400px] transition-shadow border-white/10 hover:border-white/20">
          {/* Input Handle */}
          <Handle
            type="target"
            position={Position.Left}
            className="!w-6 !h-6 !rounded-full !bg-[#13131A] !border-2 !border-white/20 hover:!border-cyan-400 hover:!scale-110 !transition-all !cursor-crosshair !-left-3"
          />

          {content}

          {/* Output Handle */}
          <Handle
            type="source"
            position={Position.Right}
            className="!w-6 !h-6 !rounded-full !bg-[#13131A] !border-2 !border-[#460DF2]/50 hover:!border-[#460DF2] hover:!scale-110 !transition-all !cursor-crosshair !-right-3"
          />
        </div>
      )}
    >
      {/* Image (if provided) */}
      {imageUrl && (
        <div className="mb-3">
          <img
            src={imageUrl}
            alt="Form banner"
            className="w-full h-20 object-cover rounded-lg border border-white/10"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Title */}
      <div className="text-lg font-bold text-white mb-2">
        {title}
      </div>

      {/* Description */}
      <div className="text-sm text-gray-300 mb-4 leading-relaxed">
        {description}
      </div>
    </BaseNode>
  );
};