'use client';

import React from 'react';
import { useFormBuilderStore } from '@/store/formBuilderStore';
import { MobileFormRenderer } from './mobile/MobileFormRenderer';

export const MobilePreview = () => {
  const {
    title,
    description,
    nodes,
    isMobilePreviewVisible,
    toggleMobilePreview,
    mobilePreview,
    startMobilePreview,
    resetMobilePreview
  } = useFormBuilderStore();

  // Get the first question node for preview
  const firstQuestionNode = nodes.find(node => node.type === 'question');

  // If form is started, show the full mobile form renderer
  if (isMobilePreviewVisible && mobilePreview.isFormStarted) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm max-h-[90vh] flex flex-col">
          {/* Mobile device frame header */}
          <div className="bg-gray-900 text-white p-3 flex items-center justify-between flex-shrink-0">
            <span className="text-sm font-medium">Mobile Preview</span>
            <button
              onClick={() => {
                resetMobilePreview();
                toggleMobilePreview();
              }}
              className="text-white hover:text-gray-300 transition-colors p-1"
              title="Close Preview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-hidden">
            <MobileFormRenderer />
          </div>

          {/* Mobile frame bottom */}
          <div className="bg-gray-900 h-1 flex-shrink-0"></div>
        </div>
      </div>
    );
  }

  // Show the compact preview toggle
  if (!isMobilePreviewVisible) {
    return (
      <div className="fixed bottom-24 lg:bottom-4 right-4 z-40">
        <button
          onClick={toggleMobilePreview}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Show Mobile Preview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    );
  }

  // Show the expanded preview with form info
  return (
    <div className="fixed bottom-24 lg:bottom-4 right-4 z-40">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-80 max-h-96">
        {/* Mobile device frame with close button */}
        <div className="bg-gray-900 text-white p-2 flex items-center justify-between">
          <span className="text-xs font-medium">Mobile Preview</span>
          <button
            onClick={toggleMobilePreview}
            className="text-white hover:text-gray-300 transition-colors"
            title="Close Preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Blink content */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{title || 'Untitled Form'}</h3>
              <p className="text-xs text-gray-500">blinkform.xyz</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {description || 'Interactive form powered by Solana Actions'}
          </p>

          {/* Action buttons */}
          <div className="space-y-2">
            {firstQuestionNode ? (
              <button
                onClick={() => {
                  startMobilePreview();
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Start Interactive Preview
              </button>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500">Add question nodes to test the interactive preview</p>
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors">
                Share
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors">
                View
              </button>
            </div>
          </div>
        </div>

        {/* Mobile frame bottom */}
        <div className="bg-gray-900 h-1"></div>
      </div>
    </div>
  );
};