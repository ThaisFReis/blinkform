'use client';

import ThemeToggle from '@/components/ThemeToggle';
import { Zap, Moon, Smartphone, Share2, PanelLeft, User, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useFormBuilderStore } from '@/store/formBuilderStore';

export const Header = () => {
  const [activeUsers] = useState([
    { id: 1, name: 'User 1', color: 'bg-blue-500' },
    { id: 2, name: 'User 2', color: 'bg-green-500' },
    { id: 3, name: 'User 3', color: 'bg-purple-500' },
  ]);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLeftSidebarVisible = useFormBuilderStore((state) => state.isLeftSidebarVisible);
  const isRightSidebarVisible = useFormBuilderStore((state) => state.isRightSidebarVisible);
  const toggleLeftSidebar = useFormBuilderStore((state) => state.toggleLeftSidebar);
  const toggleRightSidebar = useFormBuilderStore((state) => state.toggleRightSidebar);
  const saveForm = useFormBuilderStore((state) => state.saveForm);
  const isSaving = useFormBuilderStore((state) => state.isSaving);

  const handlePublish = async () => {
    try {
      await saveForm();
      setIsPublishModalOpen(true);
    } catch (error: any) {
      alert(`Failed to publish: ${error.message}`);
    }
  };

  const handleCopyLink = async () => {
    const formId = useFormBuilderStore.getState().formId;
    if (formId) {
      const link = `https://blinkform-backend.vercel.app/api/actions/${formId}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0A0A0F] flex items-center justify-between px-6 z-20 shadow-md">
      <div className="flex items-center space-x-4">
        {/* Left Sidebar Toggle */}
        <button
          onClick={toggleLeftSidebar}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Toggle Components Sidebar"
        >
          {isLeftSidebarVisible ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <PanelLeft className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#460DF2] to-[#7C3AED] flex items-center justify-center">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">BlinkForm</span>
        </div>

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-gray-600 text-lg font-light">/</span>
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">My Projects</span>
          <span className="text-gray-600 text-lg font-light">/</span>
          <span className="text-white font-medium">Superteam Quiz Mint</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Active users - Hidden on small screens */}
        <div className="hidden md:flex items-center -space-x-2">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${user.color} border-2 border-[#0A0A0F] flex items-center justify-center`}
              title={user.name}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          ))}
        </div>

        {/* Button Group with Theme Toggle and Mobile Preview */}
        <div className="hidden sm:flex items-center space-x-1 bg-white/5 rounded-lg p-1 border border-white/5">
          <ThemeToggle />
          <button
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Mobile Preview"
            title="Mobile Preview"
          >
            <Smartphone className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Share button */}
        <button
          className="hidden sm:flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/5 transition-colors"
          aria-label="Share"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        {/* Right Sidebar Toggle */}
        <button
          onClick={toggleRightSidebar}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Toggle Properties Sidebar"
        >
          {isRightSidebarVisible ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <PanelLeft className="w-5 h-5 text-gray-400" style={{ transform: 'scaleX(-1)' }} />
          )}
        </button>

        {/* Publish button */}
        <button
          onClick={handlePublish}
          disabled={isSaving}
          className="bg-gradient-to-r from-[#460DF2] to-[#7C3AED] hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium shadow-[0_0_20px_-5px_#460DF2] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#13131A] border border-white/10 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Form Published!</h2>
                <button
                  onClick={() => setIsPublishModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300">
                  Your form has been published successfully. Here's the test link:
                </p>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`https://blinkform-backend.vercel.app/api/actions/${useFormBuilderStore.getState().formId || ''}`}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {copied && (
                  <p className="text-green-400 text-sm">Link copied to clipboard!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};