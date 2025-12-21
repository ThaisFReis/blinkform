'use client';

import React from 'react';
import { StartNodeData } from '@/types/nodes';

interface MobileStartNodeProps {
  data: StartNodeData;
  onNext: () => void;
}

export const MobileStartNode: React.FC<MobileStartNodeProps> = ({
  data,
  onNext,
}) => {
  const { title, description, imageUrl } = data;

  return (
    <div className="space-y-6">
      {/* Image (if provided) */}
      {imageUrl && (
        <div className="mb-6">
          <img
            src={imageUrl}
            alt="Form banner"
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {title || 'Welcome to this Interactive Form'}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Start Button */}
      <button
        onClick={onNext}
        className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
      >
        Get Started
      </button>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500">
        Powered by BlinkForm
      </div>
    </div>
  );
};