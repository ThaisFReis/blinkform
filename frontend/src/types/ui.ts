export interface MenuItem {
  id?: string;
  icon?: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export interface MenuDivider {
  type: 'divider';
}

export type MenuItemType = MenuItem | MenuDivider;

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export interface ContextMenuProps {
  items: MenuItemType[];
  position: { x: number; y: number };
  isOpen: boolean;
  onClose: () => void;
}