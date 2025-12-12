'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FormRenderer } from '@/components/FormRenderer';
import { BlinkFormNode } from '@/types/nodes';

interface FormData {
  id: string;
  title: string;
  description?: string;
  schema: {
    nodes: BlinkFormNode[];
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiUrl}/forms/${formId}`);

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

  const handleFormSubmit = async (responses: Record<string, any>) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/forms/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses,
          // In a real implementation, you'd get the user account from wallet
          userAccount: 'test-user-account',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      // You could show a success message or redirect here
      alert('Form submitted successfully!');
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Failed to submit form. Please try again.');
    }
  };

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
    <FormRenderer
      nodes={form.schema.nodes}
      edges={form.schema.edges}
      title={form.title}
      description={form.description}
      onSubmit={handleFormSubmit}
    />
  );
}