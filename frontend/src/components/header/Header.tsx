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
    <header className="flex items-center justify-between bg-sidebar px-4 sm:px-6 py-3 w-full border-b border-border">
      <div className="flex items-center gap-3 flex-1 min-w-0 max-w-fit">
        {/* Left Sidebar Toggle */}
        <button
          onClick={toggleLeftSidebar}
          className="p-2 rounded-lg hover:bg-secondary transition-colors hidden lg:flex"
          title="Toggle Components Sidebar"
        >
          {isLeftSidebarVisible ? (
            <X className="w-5 h-5 text-primary" weight="bold" />
          ) : (
            <SidebarSimple className="w-5 h-5 text-muted-foreground" weight="regular" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-foreground font-gluten whitespace-nowrap">
            BlinkForm
          </h1>
        </div>

        <div className="border-l border-border h-6"></div>

        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base text-muted-foreground truncate">
            My Projects <span className="mx-1 text-primary">›</span> <span className='font-medium text-white'>Superteam Quiz Mint</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        {/* Active users */}
        <div className="hidden sm:flex items-center -space-x-2">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className={`w-8 h-8 rounded-full ${user.color} border-2 border-background flex items-center justify-center`}
              title={user.name}
            >
              <UserCircleIcon className="w-5 h-5 text-white" weight="fill" />
            </div>
          ))}
        </div>

        {/* Share button */}
        <button
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Share"
          title="Share"
        >
          <ShareNetworkIcon className="w-5 h-5 text-foreground" weight="regular" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Right Sidebar Toggle */}
        <button
          onClick={toggleRightSidebar}
          className="p-2 rounded-lg hover:bg-secondary transition-colors hidden xl:flex"
          title="Toggle Properties Sidebar"
        >
          {isRightSidebarVisible ? (
            <X className="w-5 h-5 text-primary" weight="bold" />
          ) : (
            <SidebarSimple className="w-5 h-5 text-muted-foreground" weight="regular" style={{ transform: 'scaleX(-1)' }} />
          )}
        </button>

        {/* Publish button */}
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap">
          Publish
        </button>
      </div>
    </header>
  );
};