'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface MobileSidebarOverlayProps {
  children: ReactNode;
  side: 'left' | 'right';
  onClose: () => void;
}

export const MobileSidebarOverlay = ({ children, side, onClose }: MobileSidebarOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);

  useEffect(() => {
    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!contentRef.current) return;

    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;

    // Only allow swipe in close direction
    if ((side === 'left' && diff < 0) || (side === 'right' && diff > 0)) {
      const translateX = side === 'left' ? Math.min(0, diff) : Math.max(0, diff);
      contentRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!contentRef.current) return;

    const diff = currentX.current - startX.current;
    const threshold = 100; // pixels to swipe before closing

    // Check if swipe was far enough to close
    if ((side === 'left' && diff < -threshold) || (side === 'right' && diff > threshold)) {
      onClose();
    } else {
      // Reset position if swipe wasn't far enough
      contentRef.current.style.transform = 'translateX(0)';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const overlayContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-50 lg:hidden"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          fixed top-0 bottom-0 bg-sidebar
          w-[85%] max-w-md
          shadow-2xl
          transition-transform duration-300 ease-out
          ${side === 'left' ? 'left-0' : 'right-0'}
          ${side === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'}
        `}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)', // Account for mobile nav
        }}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );

  // Use portal to render at document body level
  return typeof document !== 'undefined'
    ? createPortal(overlayContent, document.body)
    : null;
};
