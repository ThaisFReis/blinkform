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
  };
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  selected,
  id,
  icon,
  label,
  children,
  handles = { input: true, output: true }
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

  return (
    <>
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
      >
        <div
          className={`
            bg-card border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px]
            ${selected ? 'border-primary' : 'border-border'}
            transition-colors duration-200
          `}
        >
          {/* Input Handle */}
          {handles.input && (
            <Handle
              type="target"
              position={Position.Top}
              className="!bg-primary !border-primary-foreground !w-3 !h-3"
            />
          )}

          {/* Node Content */}
          <div className="p-4">
            {/* Header with Icon */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                {icon}
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {label}
              </span>
            </div>

            {/* Specific Content */}
            {children}
          </div>

          {/* Output Handle */}
          {handles.output && (
            <Handle
              type="source"
              position={Position.Bottom}
              className="!bg-primary !border-primary-foreground !w-3 !h-3"
            />
          )}
        </div>

        {/* Delete Button */}
        {(isHovered || selected) && (
          <NodeDeleteButton onDelete={handleDelete} />
        )}
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