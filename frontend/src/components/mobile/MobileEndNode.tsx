'use client';

import React from 'react';
import { EndNodeData, SuccessActionType } from '@/types/nodes';

interface MobileEndNodeProps {
  data: EndNodeData;
  onRestart?: () => void;
}

export const MobileEndNode: React.FC<MobileEndNodeProps> = ({
  data,
  onRestart,
}) => {
  const { label, message, successActions } = data;

  const getActionIcon = (type: SuccessActionType) => {
    switch (type) {
      case 'email':
        return '📧';
      case 'webhook':
        return '🔗';
      case 'redirect':
        return '↗️';
      case 'custom':
        return '⚙️';
      default:
        return '✅';
    }
  };

  const getActionDescription = (action: any) => {
    switch (action.type) {
      case 'email':
        return `Email sent to ${action.emailRecipient || 'recipient'}`;
      case 'webhook':
        return `Data sent to ${action.webhookUrl || 'webhook endpoint'}`;
      case 'redirect':
        return `Redirecting to ${action.redirectUrl || 'external page'}`;
      case 'custom':
        return action.description || 'Custom action executed';
      default:
        return action.description || 'Action completed';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {label || 'Form Completed!'}
          </h2>
          {message && (
            <p className="text-gray-600 mt-2">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Success Actions */}
      {successActions && successActions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">What happens next:</h3>
          <div className="space-y-2">
            {successActions
              .filter(action => action.enabled)
              .map((action, index) => (
                <div
                  key={action.id || index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-lg">{getActionIcon(action.type)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {action.description || getActionDescription(action)}
                    </div>
                  </div>
                  <div className="text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {onRestart && (
          <button
            onClick={onRestart}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Start New Form
          </button>
        )}

        <button
          onClick={() => {/* Handle share */}}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Share Form
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500">
        Powered by BlinkForm
      </div>
    </div>
  );
};