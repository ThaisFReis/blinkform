'use client';

import React, { useState } from 'react';
import { useFormBuilderStore } from '@/store/formBuilderStore';

const Toolbar = () => {
  const addNode = useFormBuilderStore((state) => state.addNode);
  const saveForm = useFormBuilderStore((state) => state.saveForm);
  const exportSchema = useFormBuilderStore((state) => state.exportSchema);
  const isSaving = useFormBuilderStore((state) => state.isSaving);
  const lastSaved = useFormBuilderStore((state) => state.lastSaved);
  const lastAutoSaved = useFormBuilderStore((state) => state.lastAutoSaved);
  const validationErrors = useFormBuilderStore((state) => state.validationErrors);

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleAddQuestion = () => {
    addNode('question');
  };

  const handleAddTransaction = () => {
    addNode('transaction');
  };

  const handleAddEnd = () => {
    addNode('end');
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await saveForm();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save form');
    }
  };

  const handleExport = () => {
    const schema = exportSchema();
    const blob = new Blob([JSON.stringify(schema, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blinkform-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 space-y-3">
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Add Nodes</h3>
        <div className="flex gap-2">
          <button
            onClick={handleAddQuestion}
            className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
          >
            + Question
          </button>
          <button
            onClick={handleAddTransaction}
            className="px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition"
          >
            + Transaction
          </button>
          <button
            onClick={handleAddEnd}
            className="px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
          >
            + End
          </button>
        </div>
      </div>

      <div className="border-t pt-3 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Actions</h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition"
          >
            Export JSON
          </button>
        </div>
      </div>

      <div className="border-t pt-3 space-y-1 text-xs text-gray-600">
        {lastAutoSaved && (
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
            <span>Auto-saved at {formatTime(lastAutoSaved)}</span>
          </div>
        )}
        {lastSaved && (
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
            <span>Saved to server at {formatTime(lastSaved)}</span>
          </div>
        )}
      </div>

      {validationErrors.length > 0 && (
        <div className="border-t pt-3">
          <div className="text-xs text-red-600 font-semibold">
            {validationErrors.length} validation error{validationErrors.length > 1 ? 's' : ''}
          </div>
        </div>
      )}

      {saveError && (
        <div className="border-t pt-3">
          <div className="text-xs text-red-600">{saveError}</div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
