import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash2, Copy } from 'lucide-react';
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

  // Default content (icon + label + children)
  const defaultContent = (
    <>
      {/* Header with Icon and Label */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02] rounded-t-xl">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-gray-200">{label}</span>
        </div>
      </div>

      {/* Node Body */}
      <div className="p-3">
        {children}
      </div>
    </>
  );

  // Container rendering - use custom or default
  const containerContent = renderCustomContainer ? (
    renderCustomContainer(defaultContent)
  ) : (
    <div
      className={`
        bg-[#13131A] border-2 rounded-xl shadow-xl min-w-[200px] max-w-[300px] transition-shadow
        ${selected ? 'border-[#460DF2] shadow-[0_0_20px_-5px_rgba(70,13,242,0.3)]' : 'border-white/10 hover:border-white/20'}
      `}
    >
      {/* Input Handle */}
      {handles.input && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-6 !h-6 !rounded-full !bg-[#13131A] !border-2 !border-white/20 hover:!border-cyan-400 hover:!scale-110 !transition-all !cursor-crosshair !-left-3"
        />
      )}

      {defaultContent}

      {/* Output Handle */}
      {handles.output && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-6 !h-6 !rounded-full !bg-[#13131A] !border-2 !border-[#460DF2]/50 hover:!border-[#460DF2] hover:!scale-110 !transition-all !cursor-crosshair !-right-3"
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