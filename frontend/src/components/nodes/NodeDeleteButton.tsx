import React from 'react';
import { TrashIcon } from '@phosphor-icons/react';
import { Tooltip } from '@/components/ui/Tooltip';

interface NodeDeleteButtonProps {
  onDelete: () => void;
  className?: string;
}

export const NodeDeleteButton: React.FC<NodeDeleteButtonProps> = ({
  onDelete,
  className = ''
}) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete();
  };

  return (
    <Tooltip content="Delete (Del)">
      <button
        onClick={handleClick}
        className={`
          absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground
          rounded-full hover:bg-destructive/90 transition-opacity duration-200
          opacity-0 group-hover:opacity-100 flex items-center justify-center
          shadow-sm border border-destructive-foreground/20
          ${className}
        `}
        aria-label="Delete node"
      >
        <TrashIcon className="w-3 h-3" weight="bold" />
      </button>
    </Tooltip>
  );
};