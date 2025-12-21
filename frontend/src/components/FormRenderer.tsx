'use client';

import React, { useState, useMemo } from 'react';
import { BlinkFormNode, isQuestionNode, isTransactionNode, isEndNode, isStartNode } from '@/types/nodes';
import { MobileInputNode } from './mobile/MobileInputNode';
import { MobileChoiceNode } from './mobile/MobileChoiceNode';
import { MobileTransactionNode } from './mobile/MobileTransactionNode';
import { MobileEndNode } from './mobile/MobileEndNode';
import { MobileStartNode } from './mobile/MobileStartNode';

interface FormRendererProps {
  nodes: BlinkFormNode[];
  edges: any[];
  title: string;
  description?: string;
  onSubmit?: (responses: Record<string, any>) => void;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  nodes,
  edges,
  title,
  description,
  onSubmit
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [isFormStarted, setIsFormStarted] = useState(false);

  const currentNode = useMemo(() => {
    if (!currentNodeId) return null;
    return nodes.find(node => node.id === currentNodeId) || null;
  }, [currentNodeId, nodes]);

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
      setResponses(prev => ({
        ...prev,
        [currentNode.id]: responseValue
      }));
    }

    // Find next node
    const nextNodeId = getNextNodeId(currentNode.id, responseValue);

    if (nextNodeId) {
      setNavigationHistory(prev => [...prev, nextNodeId]);
      setCurrentNodeId(nextNodeId);
    } else {
      // No more nodes, form is complete
      if (onSubmit) {
        onSubmit(responses);
      }
    }
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current node
      const previousNodeId = newHistory[newHistory.length - 1];
      setCurrentNodeId(previousNodeId);
      setNavigationHistory(newHistory);
    }
  };

  const startForm = () => {
    // Try to find a start node first, otherwise use the first question node
    const startNode = nodes.find(node => node.type === 'start');
    const firstQuestionNode = nodes.find(node => node.type === 'question');

    const targetNode = startNode || firstQuestionNode;
    if (targetNode) {
      setCurrentNodeId(targetNode.id);
      setNavigationHistory([targetNode.id]);
      setIsFormStarted(true);
    }
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

    const currentValue = responses[currentNode.id];
    const isValid = validateResponse(currentNode, currentValue);

    if (isQuestionNode(currentNode)) {
      const { questionType } = currentNode.data;

      switch (questionType) {
        case 'input':
          return (
            <MobileInputNode
              data={currentNode.data}
              value={currentValue}
              onChange={(value) => setResponses(prev => ({ ...prev, [currentNode.id]: value }))}
              onNext={() => handleNodeNext(currentValue)}
              isValid={isValid}
            />
          );
        case 'choice':
          return (
            <MobileChoiceNode
              data={currentNode.data}
              value={currentValue}
              onChange={(value) => setResponses(prev => ({ ...prev, [currentNode.id]: value }))}
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
          onRestart={() => {
            setCurrentNodeId(null);
            setResponses({});
            setNavigationHistory([]);
            setIsFormStarted(false);
          }}
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

  // Show the blink card if form hasn't started
  if (!isFormStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Blink Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{title}</h2>
                  <p className="text-white text-opacity-90 text-sm">blinkform.xyz</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {description && (
                <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                  {description}
                </p>
              )}

              <div className="space-y-3">
                <button
                  onClick={startForm}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Start Form
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    {nodes.length} question{nodes.length !== 1 ? 's' : ''} • Interactive Solana form
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the form renderer
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
          disabled={navigationHistory.length <= 1}
          className={`p-2 rounded-full transition-colors ${
            navigationHistory.length > 1
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