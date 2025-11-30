'use client';

import { LeftSidebar } from '@/components/sidebars/LeftSidebar';
import { RightSidebar } from '@/components/sidebars/RightSidebar';
import { Header } from '@/components/header/Header';
import { Canvas } from '@/components/canvas';
import { MobilePreview } from '@/components/MobilePreview';
import { useFormBuilderStore } from '@/store/formBuilderStore';

export default function BuilderPage() {
  const isLeftSidebarVisible = useFormBuilderStore((state) => state.isLeftSidebarVisible);
  const isRightSidebarVisible = useFormBuilderStore((state) => state.isRightSidebarVisible);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Full-width Header */}
      <Header />

      {/* Main Content Area - Horizontal Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={`bg-sidebar border-r border-sidebar-border flex-shrink-0 transition-all duration-300 overflow-hidden hidden lg:flex ${
            isLeftSidebarVisible ? 'w-80' : 'w-0'
          }`}
        >
          <LeftSidebar />
        </div>

        {/* Canvas - Center Area */}
        <Canvas />

        {/* Right Sidebar */}
        <div
          className={`bg-sidebar border-l border-sidebar-border flex-shrink-0 transition-all duration-300 overflow-hidden hidden xl:flex ${
            isRightSidebarVisible ? 'w-80' : 'w-0'
          }`}
        >
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Preview */}
     {/*  <MobilePreview /> */}
    </div>
  );
}