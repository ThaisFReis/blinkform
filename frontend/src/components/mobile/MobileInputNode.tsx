'use client';

import React, { useState, useEffect } from 'react';
import { QuestionNodeData, InputType } from '@/types/nodes';

interface MobileInputNodeProps {
  data: QuestionNodeData;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  isValid: boolean;
}

export const MobileInputNode: React.FC<MobileInputNodeProps> = ({
  data,
  value,
  onChange,
  onNext,
  isValid,
}) => {
  const { questionText, inputType, placeholder, validation } = data;
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && inputValue.trim()) {
      onNext();
    }
  };

  const getInputType = (type?: InputType) => {
    switch (type) {
      case 'number':
      case 'currency':
        return 'number';
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  };

  const formatValue = (val: string, type?: InputType) => {
    if (!val) return val;

    switch (type) {
      case 'phone':
        // Basic phone formatting for Brazilian numbers
        const cleaned = val.replace(/\D/g, '');
        if (cleaned.length <= 2) return `(${cleaned}`;
        if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      case 'cpf':
        // CPF formatting
        const cpf = val.replace(/\D/g, '');
        if (cpf.length <= 3) return cpf;
        if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
        if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
      case 'currency':
        // Basic currency formatting
        const num = parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'));
        if (isNaN(num)) return val;
        return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return val;
    }
  };

  const handleFormattedInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // For formatted inputs, store the raw value but display formatted
    if (inputType === 'phone' || inputType === 'cpf' || inputType === 'currency') {
      const rawValue = newValue.replace(/\D/g, '');
      setInputValue(newValue);
      onChange(rawValue);
    } else {
      handleInputChange(e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="text-lg font-semibold text-gray-900 leading-tight">
        {questionText || 'Enter your question...'}
      </div>

      {/* Validation Indicators */}
      {validation?.required && (
        <div className="text-sm text-red-600 font-medium">
          * Required
        </div>
      )}

      {/* Input Field */}
      <div className="space-y-2">
        <input
          type={getInputType(inputType)}
          value={inputType === 'phone' || inputType === 'cpf' || inputType === 'currency' ? formatValue(inputValue, inputType) : inputValue}
          onChange={inputType === 'phone' || inputType === 'cpf' || inputType === 'currency' ? handleFormattedInput : handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || getPlaceholder(inputType)}
          className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            !isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          autoComplete="off"
          inputMode={getInputMode(inputType)}
          min={inputType === 'date' && validation?.min ? new Date(validation.min).toISOString().split('T')[0] : undefined}
          max={inputType === 'date' && validation?.max ? new Date(validation.max).toISOString().split('T')[0] : undefined}
        />

        {/* Validation Error */}
        {!isValid && (
          <div className="text-sm text-red-600">
            {getValidationError(inputValue, validation, inputType)}
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!isValid || !inputValue.trim()}
        className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-base transition-colors ${
          isValid && inputValue.trim()
            ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

const getPlaceholder = (type?: InputType) => {
  switch (type) {
    case 'email':
      return 'your@email.com';
    case 'phone':
      return '(11) 99999-9999';
    case 'cpf':
      return '123.456.789-00';
    case 'currency':
      return 'R$ 0,00';
    case 'number':
      return 'Enter a number';
    case 'date':
      return 'Select a date...';
    default:
      return 'Type your answer...';
  }
};

const getInputMode = (type?: InputType) => {
  switch (type) {
    case 'number':
    case 'currency':
      return 'numeric';
    case 'email':
      return 'email';
    case 'phone':
      return 'tel';
    default:
      return 'text';
  }
};

const getValidationError = (value: string, validation?: any, inputType?: InputType) => {
  if (!validation) return '';

  if (validation.required && !value.trim()) {
    return 'This field is required';
  }

  if (inputType === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Please enter a valid email address';
  }

  if (inputType === 'number' || inputType === 'currency') {
    const num = parseFloat(value);
    if (validation.min && num < validation.min) {
      return `Minimum value is ${validation.min}`;
    }
    if (validation.max && num > validation.max) {
      return `Maximum value is ${validation.max}`;
    }
  }

  if (inputType === 'date' && value) {
    const selectedDate = new Date(value);
    if (validation.min && selectedDate < new Date(validation.min)) {
      return `Date must be on or after ${new Date(validation.min).toLocaleDateString()}`;
    }
    if (validation.max && selectedDate > new Date(validation.max)) {
      return `Date must be on or before ${new Date(validation.max).toLocaleDateString()}`;
    }
  }

  if (validation.minLength && value.length < validation.minLength) {
    return `Minimum ${validation.minLength} characters required`;
  }

  if (validation.maxLength && value.length > validation.maxLength) {
    return `Maximum ${validation.maxLength} characters allowed`;
  }

  return '';
};