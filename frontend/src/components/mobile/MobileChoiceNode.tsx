'use client';

import React, { useState, useEffect } from 'react';
import { QuestionNodeData } from '@/types/nodes';

interface MobileChoiceNodeProps {
  data: QuestionNodeData;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  isValid: boolean;
}

export const MobileChoiceNode: React.FC<MobileChoiceNodeProps> = ({
  data,
  value,
  onChange,
  onNext,
  isValid,
}) => {
  const { questionText, options, multiSelect, validation } = data;
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      setSelectedValues(Array.isArray(value) ? value : [value]);
    } else {
      setSelectedValues([]);
    }
  }, [value]);

  const handleOptionSelect = (optionId: string) => {
    let newSelected: string[];

    if (multiSelect) {
      // Multi-select (checkboxes)
      if (selectedValues.includes(optionId)) {
        newSelected = selectedValues.filter(id => id !== optionId);
      } else {
        newSelected = [...selectedValues, optionId];
      }
    } else {
      // Single select (radio buttons)
      newSelected = [optionId];
    }

    setSelectedValues(newSelected);
    onChange(multiSelect ? newSelected : newSelected[0]);
  };

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  const isSelected = (optionId: string) => selectedValues.includes(optionId);

  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="text-lg font-semibold text-gray-900 leading-tight">
        {questionText || 'Select your answer...'}
      </div>

      {/* Validation Indicators */}
      {validation?.required && (
        <div className="text-sm text-red-600 font-medium">
          * Required
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {options && options.length > 0 ? (
          options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full p-4 text-left border rounded-lg transition-all duration-200 ${
                isSelected(option.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Selection Indicator */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected(option.id)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {isSelected(option.id) && (
                    multiSelect ? (
                      // Checkmark for multi-select
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      // Dot for single select
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )
                  )}
                </div>

                {/* Option Text */}
                <span className="text-base font-medium">
                  {option.label}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">No options configured</div>
          </div>
        )}
      </div>

      {/* Validation Error */}
      {!isValid && (
        <div className="text-sm text-red-600 text-center">
          {validation?.required ? 'Please select an option' : 'Invalid selection'}
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!isValid}
        className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-base transition-colors ${
          isValid
            ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};