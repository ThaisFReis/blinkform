import { useState, useCallback } from 'react';

export interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
}

export const useNodeContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  const openMenu = useCallback((x: number, y: number) => {
    setContextMenu({
      isOpen: true,
      position: { x, y },
    });
  }, []);

  const closeMenu = useCallback(() => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
    });
  }, []);

  return {
    isOpen: contextMenu.isOpen,
    position: contextMenu.position,
    openMenu,
    closeMenu,
  };
};