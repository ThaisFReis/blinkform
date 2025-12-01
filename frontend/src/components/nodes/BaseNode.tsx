import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { TrashIcon, CopySimpleIcon } from '@phosphor-icons/react';
import { useFormBuilderStore } from '@/store/formBuilderStore';
import { useNodeContextMenu } from '@/hooks/useNodeContextMenu';
import { NodeDeleteButton } from './NodeDeleteButton';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { MenuItemType } from '@/types/ui';
import { NodeData } from '@/types/nodes';

interface BaseNodeProps extends Omit<NodeProps, 'data'> {
  data: NodeData;
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  handles?: {
    input?: boolean;
    output?: boolean;
    custom?: React.ReactNode;
  };
  renderCustomContainer?: (content: React.ReactNode) => React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  selected,
  id,
  icon,
  label,
  children,
  handles = { input: true, output: true },
  renderCustomContainer
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen, position, openMenu, closeMenu } = useNodeContextMenu();

  const handleDelete = () => {
    useFormBuilderStore.getState().deleteNode(id);
  };

  const handleDuplicate = () => {
    useFormBuilderStore.getState().duplicateNode(id);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openMenu(event.clientX, event.clientY);
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const { selectNode, toggleRightSidebar, isRightSidebarVisible } = useFormBuilderStore.getState();
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

  // Default content (icon + label + children)
  const defaultContent = (
    <div className="p-3 md:p-4">
      {/* Header with Icon */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 md:w-6 md:h-6 bg-primary/10 rounded flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Specific Content */}
      {children}
    </div>
  );

  // Container rendering - use custom or default
  const containerContent = renderCustomContainer ? (
    renderCustomContainer(defaultContent)
  ) : (
    <div
      className={`
        bg-card border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px] md:min-w-[220px] md:max-w-[320px]
        ${selected ? 'border-primary' : 'border-border'}
        transition-colors duration-200
        ${selected ? 'ring-2 ring-primary/20' : ''}
      `}
    >
      {/* Input Handle - Larger on mobile for better touch targets */}
      {handles.input && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-primary !border-primary-foreground !w-6 !h-6 lg:!w-4 lg:!h-4 !border-2 touch-manipulation"
        />
      )}

      {defaultContent}

      {/* Output Handle - Larger on mobile for better touch targets */}
      {handles.output && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-primary !border-primary-foreground !w-6 !h-6 lg:!w-4 lg:!h-4 !border-2 touch-manipulation"
        />
      )}

      {/* Custom handles (for ConditionalNode) */}
      {handles.custom}
    </div>
  );

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
        {containerContent}

        {/* Delete Button - Always visible on mobile when selected, hover on desktop */}
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