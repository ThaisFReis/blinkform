import React, { useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { CheckCircle, Trash2, Copy } from 'lucide-react';
import { EndNodeData } from '@/types/nodes';
import { useFormBuilderStore } from '@/store/formBuilderStore';
import { useNodeContextMenu } from '@/hooks/useNodeContextMenu';
import { NodeDeleteButton } from './NodeDeleteButton';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { MenuItemType } from '@/types/ui';

interface EndNodeProps extends NodeProps {
  data: EndNodeData;
}

export const EndNode: React.FC<EndNodeProps> = (props) => {
  const { data, selected, id } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, position, openMenu, closeMenu } = useNodeContextMenu();

  // Store actions
  const { deleteNode, duplicateNode, selectNode, toggleRightSidebar, isRightSidebarVisible } = useFormBuilderStore();

  // Event handlers (replicate BaseNode functionality)
  const handleDelete = () => {
    deleteNode(id);
  };

  const handleDuplicate = () => {
    duplicateNode(id);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openMenu(event.clientX, event.clientY);
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    selectNode(id);
    if (!isRightSidebarVisible) {
      toggleRightSidebar();
    }
  };

  const contextMenuItems: MenuItemType[] = [
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: 'Delete',
      shortcut: 'Del',
      onClick: handleDelete,
      variant: 'destructive',
    },
    { type: 'divider' },
    {
      icon: <Copy className="w-4 h-4" />,
      label: 'Duplicate',
      shortcut: 'Ctrl+D',
      onClick: handleDuplicate,
    },
  ];

  // End node configuration
  const { label, message, successActions } = data;
  const actionCount = successActions?.filter(action => action.enabled).length || 0;

  return (
    <>
      <div
        className="group relative touch-manipulation"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Node Container */}
        <div
          className={`
            relative bg-[#13131A] border-2 rounded-xl shadow-xl
            w-[200px] h-[120px] transition-shadow
            ${selected ? 'border-[#460DF2] shadow-[0_0_20px_-5px_rgba(70,13,242,0.3)]' : 'border-white/10 hover:border-white/20'}
          `}
        >
          {/* Header */}
          <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/[0.02] rounded-t-xl">
            <div className="w-6 h-6 rounded-lg bg-green-400/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm font-semibold text-gray-200">End Form</span>
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Label */}
            <div className="text-sm font-medium text-white mb-1">
              {label || 'Form Complete'}
            </div>

            {/* Success Actions Count */}
            {actionCount > 0 && (
              <div className="text-xs text-green-400">
                {actionCount} success action{actionCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Input Handle - Top */}
          <Handle
            type="target"
            position={Position.Left}
            className="!w-6 !h-6 !rounded-full !bg-[#13131A] !border-2 !border-white/20 hover:!border-cyan-400 hover:!scale-110 !transition-all !cursor-crosshair !-left-3"
          />

          {/* Handle Label */}
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 pointer-events-none">
            <span className="text-xs text-green-400 font-medium">COMPLETE</span>
          </div>
        </div>

        {/* Delete Button - Same as BaseNode */}
        <div className="md:hidden">
          {selected && <NodeDeleteButton onDelete={handleDelete} />}
        </div>
        <div className="hidden md:block">
          {(isHovered || selected) && <NodeDeleteButton onDelete={handleDelete} />}
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        items={contextMenuItems}
        position={position}
        isOpen={isOpen}
        onClose={closeMenu}
      />
    </>
  );
};