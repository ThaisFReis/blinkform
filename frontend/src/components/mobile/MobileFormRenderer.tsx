'use client';

import React, { useMemo } from 'react';
import { useFormBuilderStore } from '@/store/formBuilderStore';
import { BlinkFormNode, isQuestionNode, isTransactionNode, isEndNode, isStartNode } from '@/types/nodes';
import { MobileInputNode } from './MobileInputNode';
import { MobileChoiceNode } from './MobileChoiceNode';
import { MobileTransactionNode } from './MobileTransactionNode';
import { MobileEndNode } from './MobileEndNode';
import { MobileStartNode } from './MobileStartNode';

export const MobileFormRenderer: React.FC = () => {
  const {
    nodes,
    edges,
    mobilePreview,
    navigateToNode,
    updateResponse,
    goBackInPreview,
    resetMobilePreview,
  } = useFormBuilderStore();

  const currentNode = useMemo(() => {
    if (!mobilePreview.currentNodeId) return null;
    return nodes.find(node => node.id === mobilePreview.currentNodeId) || null;
  }, [mobilePreview.currentNodeId, nodes]);

  const getNextNodeId = (currentNodeId: string, responseValue: any): string | null => {
    // Find outgoing edges from current node
    const outgoingEdges = edges.filter(edge => edge.source === currentNodeId);

    if (outgoingEdges.length === 0) return null;

    // For now, just return the first connected node
    // In a full implementation, this would handle conditional logic
    const targetNodeId = outgoingEdges[0].target;
    return nodes.find(node => node.id === targetNodeId) ? targetNodeId : null;
  };

  const handleNodeNext = (responseValue?: any) => {
    if (!currentNode) return;

    // Update response if provided
    if (responseValue !== undefined) {
      updateResponse(currentNode.id, responseValue);
    }

    // Find next node
    const nextNodeId = getNextNodeId(currentNode.id, responseValue);

    if (nextNodeId) {
      navigateToNode(nextNodeId);
    } else {
      // No more nodes, form is complete
      // Could navigate to a completion state here
    }
  };

  const handleGoBack = () => {
    goBackInPreview();
  };

  const validateResponse = (node: BlinkFormNode, value: any): boolean => {
    if (!isQuestionNode(node)) return true;

    const { validation } = node.data;

    if (!validation) return true;

    // Required validation
    if (validation.required) {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return false;
      }
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
    }

    // Type-specific validation
    if (node.data.questionType === 'input') {
      const strValue = String(value);

      if (validation.minLength && strValue.length < validation.minLength) {
        return false;
      }

      if (validation.maxLength && strValue.length > validation.maxLength) {
        return false;
      }

      if (node.data.inputType === 'email' && strValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue)) {
        return false;
      }

      if ((node.data.inputType === 'number' || node.data.inputType === 'currency') && validation.min !== undefined) {
        const num = parseFloat(strValue);
        if (!isNaN(num) && num < validation.min) {
          return false;
        }
      }

      if ((node.data.inputType === 'number' || node.data.inputType === 'currency') && validation.max !== undefined) {
        const num = parseFloat(strValue);
        if (!isNaN(num) && num > validation.max) {
          return false;
        }
      }

      if (node.data.inputType === 'date' && strValue) {
        const selectedDate = new Date(strValue);
        if (validation.min && selectedDate < new Date(validation.min)) {
          return false;
        }
        if (validation.max && selectedDate > new Date(validation.max)) {
          return false;
        }
      }
    }

    return true;
  };

  const renderNode = () => {
    if (!currentNode) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500">No form to display</div>
        </div>
      );
    }

    const currentValue = mobilePreview.responses[currentNode.id];
    const isValid = validateResponse(currentNode, currentValue);

    if (isQuestionNode(currentNode)) {
      const { questionType } = currentNode.data;

      switch (questionType) {
        case 'input':
          return (
            <MobileInputNode
              data={currentNode.data}
              value={currentValue}
              onChange={(value) => updateResponse(currentNode.id, value)}
              onNext={() => handleNodeNext(currentValue)}
              isValid={isValid}
            />
          );
        case 'choice':
          return (
            <MobileChoiceNode
              data={currentNode.data}
              value={currentValue}
              onChange={(value) => updateResponse(currentNode.id, value)}
              onNext={() => handleNodeNext(currentValue)}
              isValid={isValid}
            />
          );
        default:
          return (
            <div className="text-center py-8">
              <div className="text-gray-500">Unsupported question type</div>
            </div>
          );
      }
    } else if (isTransactionNode(currentNode)) {
      return (
        <MobileTransactionNode
          data={currentNode.data}
          onNext={() => handleNodeNext()}
        />
      );
    } else if (isEndNode(currentNode)) {
      return (
        <MobileEndNode
          data={currentNode.data}
          onRestart={resetMobilePreview}
        />
      );
    } else if (isStartNode(currentNode)) {
      return (
        <MobileStartNode
          data={currentNode.data}
          onNext={() => handleNodeNext()}
        />
      );
    } else {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500">Unsupported node type</div>
        </div>
      );
    }
  };

  const getProgressPercentage = () => {
    if (!currentNode) return 0;

    const totalNodes = nodes.length;
    const currentIndex = nodes.findIndex(node => node.id === currentNode.id);

    if (totalNodes === 0) return 0;
    return Math.round(((currentIndex + 1) / totalNodes) * 100);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-blue-500 h-1 transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Header with Back Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={handleGoBack}
          disabled={mobilePreview.navigationHistory.length <= 1}
          className={`p-2 rounded-full transition-colors ${
            mobilePreview.navigationHistory.length > 1
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-sm text-gray-500">
          {getProgressPercentage()}% complete
        </div>

        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      {/* Form Content */}
      <div className="flex-1 p-6">
        {renderNode()}
      </div>
    </div>
  );
};