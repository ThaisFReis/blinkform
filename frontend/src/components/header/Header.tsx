'use client';

import ThemeToggle from '@/components/ThemeToggle';
import { UserCircleIcon, ShareNetworkIcon, SidebarSimple, X } from '@phosphor-icons/react';
import { useState } from 'react';
import { useFormBuilderStore } from '@/store/formBuilderStore';

export const Header = () => {
  const [activeUsers] = useState([
    { id: 1, name: 'User 1', color: 'bg-blue-500' },
    { id: 2, name: 'User 2', color: 'bg-green-500' },
    { id: 3, name: 'User 3', color: 'bg-purple-500' },
  ]);

  const isLeftSidebarVisible = useFormBuilderStore((state) => state.isLeftSidebarVisible);
  const isRightSidebarVisible = useFormBuilderStore((state) => state.isRightSidebarVisible);
  const toggleLeftSidebar = useFormBuilderStore((state) => state.toggleLeftSidebar);
  const toggleRightSidebar = useFormBuilderStore((state) => state.toggleRightSidebar);

  return (
    <header className="flex items-center justify-between bg-sidebar px-3 sm:px-4 lg:px-6 py-3 w-full border-b border-border">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Left Sidebar Toggle - Always visible */}
        <button
          onClick={toggleLeftSidebar}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Toggle Components Sidebar"
        >
          {isLeftSidebarVisible ? (
            <X className="w-5 h-5 text-primary" weight="bold" />
          ) : (
            <SidebarSimple className="w-5 h-5 text-muted-foreground" weight="regular" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-foreground font-gluten whitespace-nowrap">
            BlinkForm
          </h1>
        </div>

        <div className="border-l border-border h-5 hidden sm:block"></div>

        <div className="min-w-0 flex-1 hidden sm:block">
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground truncate">
            My Projects <span className="mx-1 text-primary">›</span> <span className='font-medium text-white'>Superteam Quiz Mint</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">
        {/* Active users - Hidden on small screens */}
        <div className="hidden md:flex items-center -space-x-2">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${user.color} border-2 border-background flex items-center justify-center`}
              title={user.name}
            >
              <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" weight="fill" />
            </div>
          ))}
        </div>

        {/* Share button - Hidden on very small screens */}
        <button
          className="hidden sm:flex p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Share"
          title="Share"
        >
          <ShareNetworkIcon className="w-5 h-5 text-foreground" weight="regular" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Right Sidebar Toggle - Always visible on mobile/tablet */}
        <button
          onClick={toggleRightSidebar}
          className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden xl:flex"
          title="Toggle Properties Sidebar"
        >
          {isRightSidebarVisible ? (
            <X className="w-5 h-5 text-primary" weight="bold" />
          ) : (
            <SidebarSimple className="w-5 h-5 text-muted-foreground" weight="regular" style={{ transform: 'scaleX(-1)' }} />
          )}
        </button>

        {/* Publish button - Smaller on mobile */}
        <button className="px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap text-sm sm:text-base">
          Publish
        </button>
      </div>
    </header>
  );
};