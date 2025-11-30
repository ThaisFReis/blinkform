'use client';

import React, { useState } from 'react';
import { useFormBuilderStore } from '@/store/formBuilderStore';
import {
  SidebarSimple,
  Gear,
  Palette,
  DotsThreeOutline,
  X,
  Plus,
  ShareNetwork,
  Eye
} from '@phosphor-icons/react';

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    toggleLeftSidebar,
    toggleRightSidebar,
    isLeftSidebarVisible,
    isRightSidebarVisible,
    nodes,
    addNode
  } = useFormBuilderStore();

  const handleAddNode = (type: string, questionType?: string) => {
    // On mobile, add node to viewport center instead of random position
    const viewportCenter = {
      x: window.innerWidth / 2 - 150, // Account for node width (~300px / 2)
      y: window.innerHeight / 2 - 100, // Account for node height (~200px / 2)
    };
    addNode(type as any, viewportCenter, questionType);
    setIsOpen(false); // Close menu after adding
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
        <div className="flex items-center justify-around py-2 px-4">
          {/* Components Button */}
          <button
            onClick={toggleLeftSidebar}
            className={`p-3 rounded-lg transition-colors ${
              isLeftSidebarVisible
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-primary'
            }`}
            title="Toggle Components"
          >
            <SidebarSimple className="w-6 h-6" />
          </button>

          {/* Quick Add Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-lg hover:bg-accent transition-colors text-primary"
            title="Quick Actions"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Properties Button */}
          <button
            onClick={toggleRightSidebar}
            className={`p-3 rounded-lg transition-colors ${
              isRightSidebarVisible
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-primary'
            }`}
            title="Toggle Properties"
          >
            <Gear className="w-6 h-6" />
          </button>

          {/* More Options */}
          <button
            className="p-3 rounded-lg hover:bg-accent transition-colors text-primary"
            title="More Options"
          >
            <DotsThreeOutline className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Quick Add Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-16 left-4 right-4 bg-background rounded-lg border border-border shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Quick Add</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-accent text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddNode('question', 'input')}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-lg">📝</span>
                  </div>
                  <span className="text-xs text-center">Input Field</span>
                </button>

                <button
                  onClick={() => handleAddNode('question', 'choice')}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-lg">☑️</span>
                  </div>
                  <span className="text-xs text-center">Choice</span>
                </button>

                <button
                  onClick={() => handleAddNode('question', 'date')}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-lg">📅</span>
                  </div>
                  <span className="text-xs text-center">Date</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-lg">➕</span>
                  </div>
                  <span className="text-xs text-center">More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add padding to body to account for navigation bar */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          body {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </>
  );
};