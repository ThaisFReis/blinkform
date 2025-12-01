import React, { useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { GitBranchIcon, TrashIcon, CopySimpleIcon } from '@phosphor-icons/react';
import { LogicNodeData } from '@/types/nodes';
import { useFormBuilderStore } from '@/store/formBuilderStore';
import { useNodeContextMenu } from '@/hooks/useNodeContextMenu';
import { NodeDeleteButton } from './NodeDeleteButton';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { MenuItemType } from '@/types/ui';

interface ConditionalNodeProps extends NodeProps {
  data: LogicNodeData;
}

export const ConditionalNode: React.FC<ConditionalNodeProps> = (props) => {
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

  // Branch configuration
  const branches = data.branches || [];

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
        {/* Diamond Container */}
        <div
          className={`
            relative bg-card border-2 rounded-lg shadow-sm
            w-[160px] h-[160px] md:w-[180px] md:h-[180px]
            ${selected ? 'border-primary' : 'border-border'}
            transition-colors duration-200
            ${selected ? 'ring-2 ring-primary/20' : ''}
          `}
          style={{
            transform: 'rotate(45deg)',
            transformOrigin: 'center'
          }}
        >
          {/* Content Container (counter-rotated) */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4"
            style={{
              transform: 'rotate(-45deg)',
              transformOrigin: 'center'
            }}
          >
            <div className="text-center">
              {/* Icon */}
              <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <GitBranchIcon className="w-5 h-5 text-primary" />
              </div>

              {/* Label */}
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Conditional
              </div>

              {/* Summary */}
              <div className="text-xs text-muted-foreground">
                {branches.length} {branches.length === 1 ? 'branch' : 'branches'}
              </div>
            </div>
          </div>

          {/* Input Handle - Top (outside diamond, no rotation needed) */}
          <Handle
            type="target"
            position={Position.Top}
            className="!bg-primary !border-primary-foreground !w-6 !h-6 lg:!w-4 lg:!h-4 !border-2 touch-manipulation"
            style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%) rotate(-45deg)', // Counter-rotate the handle
            }}
          />

          {/* Dynamic Output Handles */}
          {branches.map((branch, index) => {
            const totalBranches = branches.length;
            const angleStep = 360 / totalBranches;
            const angle = (index * angleStep) - 45; // Offset by -45 to account for diamond rotation

            // Calculate position based on angle
            // For a diamond, we'll position handles around the perimeter
            const position = getHandlePosition(angle, totalBranches, index);

            return (
              <React.Fragment key={branch.id}>
                <Handle
                  type="source"
                  position={position.side}
                  id={branch.id}
                  className="!border-2 touch-manipulation"
                  style={{
                    backgroundColor: branch.color,
                    borderColor: branch.color,
                    width: '24px',
                    height: '24px',
                    [position.offsetKey]: position.offsetValue,
                    ...position.customStyle,
                  }}
                />

                {/* Handle Label */}
                <div
                  className="absolute pointer-events-none z-10"
                  style={{
                    ...position.labelStyle,
                    transform: 'rotate(-45deg)', // Counter-rotate label
                  }}
                >
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap"
                    style={{
                      backgroundColor: `${branch.color}20`,
                      color: branch.color,
                    }}
                  >
                    {branch.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
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

// Helper function to calculate handle positions around diamond
function getHandlePosition(angle: number, totalBranches: number, index: number) {
  // For simplicity, we'll use the 4 cardinal directions of the diamond
  // Right, Bottom, Left, and additional positions as needed

  if (totalBranches === 2) {
    // Right and Bottom
    if (index === 0) {
      return {
        side: Position.Right,
        offsetKey: 'top',
        offsetValue: '50%',
        customStyle: { right: '-12px', transform: 'translateY(-50%) rotate(-45deg)' },
        labelStyle: { top: '50%', right: '-60px', transform: 'translateY(-50%) rotate(-45deg)' },
      };
    } else {
      return {
        side: Position.Bottom,
        offsetKey: 'left',
        offsetValue: '50%',
        customStyle: { bottom: '-12px', transform: 'translateX(-50%) rotate(-45deg)' },
        labelStyle: { bottom: '-30px', left: '50%', transform: 'translateX(-50%) rotate(-45deg)' },
      };
    }
  } else if (totalBranches === 3) {
    // Right, Bottom, Left
    const positions = [Position.Right, Position.Bottom, Position.Left];
    const styles = [
      {
        side: Position.Right,
        offsetKey: 'top',
        offsetValue: '50%',
        customStyle: { right: '-12px', transform: 'translateY(-50%) rotate(-45deg)' },
        labelStyle: { top: '50%', right: '-60px', transform: 'translateY(-50%) rotate(-45deg)' },
      },
      {
        side: Position.Bottom,
        offsetKey: 'left',
        offsetValue: '50%',
        customStyle: { bottom: '-12px', transform: 'translateX(-50%) rotate(-45deg)' },
        labelStyle: { bottom: '-30px', left: '50%', transform: 'translateX(-50%) rotate(-45deg)' },
      },
      {
        side: Position.Left,
        offsetKey: 'top',
        offsetValue: '50%',
        customStyle: { left: '-12px', transform: 'translateY(-50%) rotate(-45deg)' },
        labelStyle: { top: '50%', left: '-60px', transform: 'translateY(-50%) rotate(-45deg)' },
      },
    ];
    return styles[index];
  } else {
    // 4+ branches: distribute evenly
    const positions = [Position.Right, Position.Bottom, Position.Left, Position.Top];
    const posIndex = index % 4;
    const offset = Math.floor(index / 4) * 15; // Offset multiple handles on same side

    const baseStyles = [
      {
        side: Position.Right,
        offsetKey: 'top',
        offsetValue: `calc(50% + ${offset}px)`,
        customStyle: { right: '-12px', transform: `translateY(calc(-50% - ${offset}px)) rotate(-45deg)` },
        labelStyle: { top: `calc(50% + ${offset}px)`, right: '-60px', transform: `translateY(calc(-50% - ${offset}px)) rotate(-45deg)` },
      },
      {
        side: Position.Bottom,
        offsetKey: 'left',
        offsetValue: `calc(50% + ${offset}px)`,
        customStyle: { bottom: '-12px', transform: `translateX(calc(-50% - ${offset}px)) rotate(-45deg)` },
        labelStyle: { bottom: '-30px', left: `calc(50% + ${offset}px)`, transform: `translateX(calc(-50% - ${offset}px)) rotate(-45deg)` },
      },
      {
        side: Position.Left,
        offsetKey: 'top',
        offsetValue: `calc(50% + ${offset}px)`,
        customStyle: { left: '-12px', transform: `translateY(calc(-50% - ${offset}px)) rotate(-45deg)` },
        labelStyle: { top: `calc(50% + ${offset}px)`, left: '-60px', transform: `translateY(calc(-50% - ${offset}px)) rotate(-45deg)` },
      },
      {
        side: Position.Top,
        offsetKey: 'left',
        offsetValue: `calc(50% + ${offset}px)`,
        customStyle: { top: '-12px', transform: `translateX(calc(-50% - ${offset}px)) rotate(-45deg)` },
        labelStyle: { top: '-30px', left: `calc(50% + ${offset}px)`, transform: `translateX(calc(-50% - ${offset}px)) rotate(-45deg)` },
      },
    ];

    return baseStyles[posIndex];
  }
}
