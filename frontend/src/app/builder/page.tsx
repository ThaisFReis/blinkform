'use client';

import { useEffect } from 'react';
import { LeftSidebar } from '@/components/sidebars/LeftSidebar';
import { RightSidebar } from '@/components/sidebars/RightSidebar';
import { MobileSidebarOverlay } from '@/components/sidebars/MobileSidebarOverlay';
import { Header } from '@/components/header/Header';
import { Canvas } from '@/components/canvas';
import { MobilePreview } from '@/components/MobilePreview';
import { MobileNavigation } from '@/components/MobileNavigation';
import { useFormBuilderStore } from '@/store/formBuilderStore';

export default function BuilderPage() {
  const isLeftSidebarVisible = useFormBuilderStore((state) => state.isLeftSidebarVisible);
  const isRightSidebarVisible = useFormBuilderStore((state) => state.isRightSidebarVisible);
  const toggleLeftSidebar = useFormBuilderStore((state) => state.toggleLeftSidebar);
  const toggleRightSidebar = useFormBuilderStore((state) => state.toggleRightSidebar);

  // Set initial sidebar visibility based on screen size on client mount
  useEffect(() => {
    const leftVisible = window.innerWidth >= 1024;
    const rightVisible = window.innerWidth >= 1280;

    // Only update if different from current state
    if (leftVisible !== isLeftSidebarVisible) {
      toggleLeftSidebar();
    }
    if (rightVisible !== isRightSidebarVisible) {
      toggleRightSidebar();
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Dynamic viewport height support for mobile browsers */}
      <style jsx>{`
        @supports (height: 100dvh) {
          .flex.flex-col {
            height: 100dvh;
          }
        }
      `}</style>

      {/* Full-width Header */}
      <Header />

      {/* Main Content Area - Horizontal Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Desktop: inline, Mobile: overlay */}
        <div
          className={`bg-sidebar border-r border-sidebar-border flex-shrink-0 transition-all duration-300 overflow-hidden hidden lg:flex ${
            isLeftSidebarVisible ? 'w-80' : 'w-0'
          }`}
        >
          <LeftSidebar />
        </div>

        {/* Canvas - Center Area */}
        <div className="flex-1 relative">
          <Canvas />
        </div>

        {/* Right Sidebar - Desktop: inline, Mobile: overlay */}
        <div
          className={`bg-sidebar border-l border-sidebar-border flex-shrink-0 transition-all duration-300 overflow-hidden hidden xl:flex ${
            isRightSidebarVisible ? 'w-80' : 'w-0'
          }`}
        >
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlays - Only on mobile (< lg) */}
      {isLeftSidebarVisible && (
        <MobileSidebarOverlay side="left" onClose={toggleLeftSidebar}>
          <LeftSidebar />
        </MobileSidebarOverlay>
      )}

      {isRightSidebarVisible && (
        <MobileSidebarOverlay side="right" onClose={toggleRightSidebar}>
          <RightSidebar />
        </MobileSidebarOverlay>
      )}

      {/* Mobile Navigation - Only shown on mobile */}
      <MobileNavigation />

      {/* Mobile Preview */}
      <MobilePreview />
    </div>
  );
}