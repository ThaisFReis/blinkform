'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface FormData {
  id: string;
  title: string;
  description?: string;
  schema: {
    nodes: any[];
    edges: any[];
  };
}

export default function FormPage() {
  const params = useParams();
  const formId = params.id as string;
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/forms/${formId}`);

        if (!response.ok) {
          throw new Error('Form not found');
        }

        const data = await response.json();
        setForm(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      loadForm();
    }
  }, [formId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>{error || 'Form not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {/* Form fields would be rendered here based on the schema */}
          <div className="text-center text-gray-500">
            <p>Form rendering not yet implemented</p>
            <p className="text-sm mt-2">Form ID: {form.id}</p>
            <p className="text-sm">Nodes: {form.schema.nodes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}