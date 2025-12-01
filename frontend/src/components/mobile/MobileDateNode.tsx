'use client';

import React, { useState, useEffect } from 'react';
import { QuestionNodeData } from '@/types/nodes';

interface MobileDateNodeProps {
  data: QuestionNodeData;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  isValid: boolean;
}

export const MobileDateNode: React.FC<MobileDateNodeProps> = ({
  data,
  value,
  onChange,
  onNext,
  isValid,
}) => {
  const { questionText, validation } = data;
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    } else {
      setSelectedDate('');
    }
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onChange(newDate);
  };

  const handleNext = () => {
    if (isValid && selectedDate) {
      onNext();
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="text-lg font-semibold text-gray-900 leading-tight">
        {questionText || 'Select a date...'}
      </div>

      {/* Validation Indicators */}
      {validation?.required && (
        <div className="text-sm text-red-600 font-medium">
          * Required
        </div>
      )}

      {/* Date Input */}
      <div className="space-y-3">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            !isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          min={validation?.min ? new Date(validation.min).toISOString().split('T')[0] : undefined}
          max={validation?.max ? new Date(validation.max).toISOString().split('T')[0] : undefined}
        />

        {/* Display formatted date */}
        {selectedDate && (
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            Selected: {formatDateForDisplay(selectedDate)}
          </div>
        )}

        {/* Validation Error */}
        {!isValid && (
          <div className="text-sm text-red-600">
            {getValidationError(selectedDate, validation)}
          </div>
        )}
      </div>

      {/* Quick Date Options */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Quick select:</div>
        <div className="grid grid-cols-2 gap-2">
          {getQuickDateOptions().map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSelectedDate(option.value);
                onChange(option.value);
              }}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                selectedDate === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!isValid || !selectedDate}
        className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-base transition-colors ${
          isValid && selectedDate
            ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

const getQuickDateOptions = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return [
    {
      label: 'Today',
      value: today.toISOString().split('T')[0]
    },
    {
      label: 'Tomorrow',
      value: tomorrow.toISOString().split('T')[0]
    },
    {
      label: 'Next Week',
      value: nextWeek.toISOString().split('T')[0]
    },
    {
      label: 'Custom Date',
      value: ''
    }
  ];
};

const getValidationError = (value: string, validation?: any) => {
  if (!validation) return '';

  if (validation.required && !value) {
    return 'Please select a date';
  }

  if (value) {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (validation.min && selectedDate < new Date(validation.min)) {
      return `Date must be on or after ${new Date(validation.min).toLocaleDateString()}`;
    }

    if (validation.max && selectedDate > new Date(validation.max)) {
      return `Date must be on or before ${new Date(validation.max).toLocaleDateString()}`;
    }
  }

  return '';
};