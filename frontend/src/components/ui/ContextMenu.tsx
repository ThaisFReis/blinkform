import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ContextMenuProps, MenuItemType } from '@/types/ui';
import { useClickOutside } from '@/hooks/useClickOutside';

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  position,
  isOpen,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useClickOutside(menuRef, onClose);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = position;

      // Adjust horizontal position if menu would overflow
      if (x + menuRect.width > viewportWidth) {
        x = viewportWidth - menuRect.width - 8;
      }
      if (x < 8) {
        x = 8;
      }

      // Adjust vertical position if menu would overflow
      if (y + menuRect.height > viewportHeight) {
        y = viewportHeight - menuRect.height - 8;
      }
      if (y < 8) {
        y = 8;
      }

      setAdjustedPosition({ x, y });
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (item: MenuItemType) => {
    if ('onClick' in item && item.onClick && !item.disabled) {
      item.onClick();
      onClose();
    }
  };

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] bg-popover border border-border rounded-md shadow-lg animate-in slide-in-from-top-2 fade-in-0 duration-150"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {items.map((item, index) => {
        if ('type' in item && item.type === 'divider') {
          return (
            <div
              key={`divider-${index}`}
              className="h-px bg-border my-1"
            />
          );
        }

        const menuItem = item as any; // Type assertion since we checked it's not divider
        const isDestructive = menuItem.variant === 'destructive';

        return (
          <button
            key={menuItem.id || `item-${index}`}
            className={`
              w-full px-3 py-2 text-left text-sm flex items-center gap-3 hover:bg-accent transition-colors
              ${isDestructive ? 'text-destructive hover:bg-destructive/10' : 'text-foreground'}
              ${menuItem.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={() => handleItemClick(menuItem)}
            disabled={menuItem.disabled}
          >
            {menuItem.icon && (
              <span className="w-4 h-4 flex items-center justify-center">
                {menuItem.icon}
              </span>
            )}
            <span className="flex-1">{menuItem.label}</span>
            {menuItem.shortcut && (
              <span className="text-xs text-muted-foreground ml-auto">
                {menuItem.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>,
    document.body
  );
};