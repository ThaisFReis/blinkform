import React, { useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { CheckCircleIcon, TrashIcon, CopySimpleIcon } from '@phosphor-icons/react';
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
      icon: <TrashIcon className="w-4 h-4" />,
      label: 'Delete',
      shortcut: 'Del',
      onClick: handleDelete,
      variant: 'destructive',
    },
    { type: 'divider' },
    {
      icon: <CopySimpleIcon className="w-4 h-4" />,
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
            relative bg-card border-2 rounded-lg shadow-sm
            w-[200px] h-[120px] md:w-[220px] md:h-[130px]
            ${selected ? 'border-primary' : 'border-border'}
            transition-colors duration-200
            ${selected ? 'ring-2 ring-primary/20' : ''}
          `}
        >
          {/* Content */}
          <div className="p-4">
            {/* Header with Icon */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 md:w-6 md:h-6 bg-primary/10 rounded flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                End Form
              </span>
            </div>

            {/* Label */}
            <div className="text-sm font-medium text-foreground mb-1">
              {label || 'Form Complete'}
            </div>

            {/* Success Actions Count */}
            {actionCount > 0 && (
              <div className="text-xs text-primary">
                {actionCount} success action{actionCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Input Handle - Top */}
          <Handle
            type="target"
            position={Position.Top}
            className="!bg-primary !border-primary-foreground !w-6 !h-6 lg:!w-4 lg:!h-4 !border-2 touch-manipulation"
          />

          {/* Handle Label */}
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 pointer-events-none">
            <span className="text-xs text-primary font-medium">COMPLETE</span>
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