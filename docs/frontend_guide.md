# Frontend Development Guide for BlinkForm

This guide provides a step-by-step approach to building the BlinkForm frontend, a no-code visual interface for creating Solana Blinks with multi-step forms. The frontend uses Next.js, React Flow, Zustand, and Dialect Blinks SDK.

## Prerequisites

- Node.js and npm installed
- Basic knowledge of React, TypeScript, and Next.js
- Backend API endpoints available (from Phase 1)
- Understanding of Solana Actions and Blinks concepts

## Project Structure Overview

The frontend is already set up with:
- Next.js 16 with TypeScript
- Tailwind CSS for styling
- React Flow (@xyflow/react) for graph visualization
- Zustand for state management
- Dialect Blinks SDK for simulation

Current structure:
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   └── builder/
│   │       └── page.tsx      # Builder page
│   └── components/
│       ├── GraphBuilder.tsx  # Main graph editor
│       └── BlinkSimulator.tsx # Preview component
```

## Step 1: Set Up Development Environment

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done, but verify):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 to see the current landing page.

## Step 2: Implement Zustand Store for Graph State

Create a store to manage the graph state locally before saving to the backend.

1. Create `src/stores/graphStore.ts`:
   ```typescript
   import { create } from 'zustand';
   import { Node, Edge } from '@xyflow/react';

   interface GraphState {
     nodes: Node[];
     edges: Edge[];
     formTitle: string;
     formDescription: string;
     setNodes: (nodes: Node[]) => void;
     setEdges: (edges: Edge[]) => void;
     addNode: (node: Node) => void;
     updateNode: (id: string, data: any) => void;
     addEdge: (edge: Edge) => void;
     removeEdge: (id: string) => void;
     setFormTitle: (title: string) => void;
     setFormDescription: (desc: string) => void;
     reset: () => void;
   }

   const initialState = {
     nodes: [],
     edges: [],
     formTitle: '',
     formDescription: '',
   };

   export const useGraphStore = create<GraphState>((set, get) => ({
     ...initialState,
     setNodes: (nodes) => set({ nodes }),
     setEdges: (edges) => set({ edges }),
     addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
     updateNode: (id, data) => set((state) => ({
       nodes: state.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
     })),
     addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
     removeEdge: (id) => set((state) => ({ edges: state.edges.filter(e => e.id !== id) })),
     setFormTitle: (title) => set({ formTitle: title }),
     setFormDescription: (desc) => set({ formDescription: desc }),
     reset: () => set(initialState),
   }));
   ```

2. Update `GraphBuilder.tsx` to use the store:
   ```typescript
   'use client';

   import React from 'react';
   import { ReactFlow } from '@xyflow/react';
   import '@xyflow/react/dist/style.css';
   import { useGraphStore } from '@/stores/graphStore';

   const GraphBuilder = () => {
     const { nodes, edges, setNodes, setEdges } = useGraphStore();

     return (
       <div style={{ height: '100vh' }}>
         <ReactFlow
           nodes={nodes}
           edges={edges}
           onNodesChange={setNodes}
           onEdgesChange={setEdges}
           fitView
         />
       </div>
     );
   };

   export default GraphBuilder;
   ```

## Step 3: Create Custom Node Types

You have two options for implementing node components: separate components for each type (recommended for maintainability) or a single unified component. Both approaches are valid, but separate components reduce complexity and improve type safety.

### Option A: Separate Components (Recommended)

1. Create `src/components/nodes/QuestionNode.tsx`:
   ```typescript
   import React from 'react';
   import { Handle, Position } from '@xyflow/react';

   interface QuestionNodeProps {
     data: {
       question: string;
       options: string[];
     };
   }

   const QuestionNode: React.FC<QuestionNodeProps> = ({ data }) => {
     return (
       <div className="bg-white border-2 border-gray-300 rounded-lg p-4 min-w-64">
         <Handle type="target" position={Position.Top} />
         <h3 className="font-semibold mb-2">Question</h3>
         <input
           type="text"
           placeholder="Enter question"
           value={data.question || ''}
           onChange={(e) => {/* Update node data */}}
           className="w-full mb-2 p-2 border rounded"
         />
         <div className="space-y-1">
           {data.options?.map((option, index) => (
             <div key={index} className="flex items-center gap-2">
               <input
                 type="text"
                 placeholder={`Option ${index + 1}`}
                 value={option}
                 onChange={(e) => {/* Update option */}}
                 className="flex-1 p-1 border rounded"
               />
               <Handle
                 type="source"
                 position={Position.Right}
                 id={`option-${index}`}
                 style={{ top: `${(index + 1) * 30}px` }}
               />
             </div>
           ))}
           <button
             onClick={() => {/* Add option */}}
             className="text-sm text-blue-500 hover:text-blue-700"
           >
             + Add Option
           </button>
         </div>
       </div>
     );
   };

   export default QuestionNode;
   ```

2. Create `src/components/nodes/TransactionNode.tsx`:
   ```typescript
   import React from 'react';
   import { Handle, Position } from '@xyflow/react';

   interface TransactionNodeProps {
     data: {
       type: 'mint' | 'transfer';
       amount?: number;
       mintAddress?: string;
       recipientAddress?: string;
     };
   }

   const TransactionNode: React.FC<TransactionNodeProps> = ({ data }) => {
     return (
       <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 min-w-64">
         <Handle type="target" position={Position.Top} />
         <h3 className="font-semibold mb-2 text-green-800">Transaction</h3>
         <select
           value={data.type || 'mint'}
           onChange={(e) => {/* Update type */}}
           className="w-full mb-2 p-2 border rounded"
         >
           <option value="mint">Mint NFT/Token</option>
           <option value="transfer">Transfer SOL</option>
         </select>
         {data.type === 'mint' ? (
           <div className="space-y-2">
             <input
               type="number"
               placeholder="Amount"
               value={data.amount || ''}
               onChange={(e) => {/* Update amount */}}
               className="w-full p-2 border rounded"
             />
             <input
               type="text"
               placeholder="Mint Address"
               value={data.mintAddress || ''}
               onChange={(e) => {/* Update mint address */}}
               className="w-full p-2 border rounded"
             />
           </div>
         ) : (
           <div className="space-y-2">
             <input
               type="number"
               placeholder="Amount (SOL)"
               value={data.amount || ''}
               onChange={(e) => {/* Update amount */}}
               className="w-full p-2 border rounded"
             />
             <input
               type="text"
               placeholder="Recipient Address"
               value={data.recipientAddress || ''}
               onChange={(e) => {/* Update recipient */}}
               className="w-full p-2 border rounded"
             />
           </div>
         )}
         <Handle type="source" position={Position.Bottom} />
       </div>
     );
   };

   export default TransactionNode;
   ```

### Option B: Single Unified Node Component

Alternatively, you can create a single `CustomNode.tsx` that handles all node types. This reduces code duplication but can become complex with many conditionals. It's not inherently "risky" but may be harder to maintain as the application grows.

```typescript
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface CustomNodeData {
  type: 'question' | 'transaction';
  question?: string;
  options?: string[];
  transactionType?: 'mint' | 'transfer';
  amount?: number;
  mintAddress?: string;
  recipientAddress?: string;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, id }) => {
  const renderContent = () => {
    switch (data.type) {
      case 'question':
        return (
          <>
            <h3 className="font-semibold mb-2">Question</h3>
            <input
              type="text"
              placeholder="Enter question"
              value={data.question || ''}
              onChange={(e) => {/* Update question */}}
              className="w-full mb-2 p-2 border rounded"
            />
            <div className="space-y-1">
              {data.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {/* Update option */}}
                    className="flex-1 p-1 border rounded"
                  />
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`option-${index}`}
                    style={{ top: `${(index + 1) * 30}px` }}
                  />
                </div>
              ))}
              <button
                onClick={() => {/* Add option */}}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                + Add Option
              </button>
            </div>
          </>
        );
      case 'transaction':
        return (
          <>
            <h3 className="font-semibold mb-2 text-green-800">Transaction</h3>
            <select
              value={data.transactionType || 'mint'}
              onChange={(e) => {/* Update type */}}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="mint">Mint NFT/Token</option>
              <option value="transfer">Transfer SOL</option>
            </select>
            {data.transactionType === 'mint' ? (
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={data.amount || ''}
                  onChange={(e) => {/* Update amount */}}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Mint Address"
                  value={data.mintAddress || ''}
                  onChange={(e) => {/* Update mint address */}}
                  className="w-full p-2 border rounded"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Amount (SOL)"
                  value={data.amount || ''}
                  onChange={(e) => {/* Update amount */}}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={data.recipientAddress || ''}
                  onChange={(e) => {/* Update recipient */}}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
          </>
        );
      default:
        return <div>Unknown node type</div>;
    }
  };

  const nodeStyle = data.type === 'transaction'
    ? "bg-green-50 border-green-300"
    : "bg-white border-gray-300";

  return (
    <div className={`border-2 rounded-lg p-4 min-w-64 ${nodeStyle}`}>
      <Handle type="target" position={Position.Top} />
      {renderContent()}
      {data.type === 'transaction' && (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  );
};

export default CustomNode;
```

**Recommendation:** Start with separate components (Option A) for better maintainability. You can always refactor to a unified component later if needed. The separate approach aligns better with React's component composition principles and makes testing easier.

3. Update `GraphBuilder.tsx` to use custom node types:
   ```typescript
   import QuestionNode from './nodes/QuestionNode';
   import TransactionNode from './nodes/TransactionNode';

   const nodeTypes = {
     question: QuestionNode,
     transaction: TransactionNode,
   };

   const GraphBuilder = () => {
     // ... existing code
     return (
       <div style={{ height: '100vh' }}>
         <ReactFlow
           nodes={nodes}
           edges={edges}
           nodeTypes={nodeTypes}
           onNodesChange={setNodes}
           onEdgesChange={setEdges}
           fitView
         />
       </div>
     );
   };
   ```

## Step 4: Add Node Creation and Management

Implement toolbar for adding nodes and managing the graph.

1. Create a toolbar component `src/components/GraphToolbar.tsx`:
   ```typescript
   import React from 'react';
   import { useGraphStore } from '@/stores/graphStore';

   const GraphToolbar = () => {
     const { addNode, reset } = useGraphStore();

     const addQuestionNode = () => {
       const newNode = {
         id: `question-${Date.now()}`,
         type: 'question',
         position: { x: Math.random() * 400, y: Math.random() * 400 },
         data: { question: '', options: [''] },
       };
       addNode(newNode);
     };

     const addTransactionNode = () => {
       const newNode = {
         id: `transaction-${Date.now()}`,
         type: 'transaction',
         position: { x: Math.random() * 400, y: Math.random() * 400 },
         data: { type: 'mint' },
       };
       addNode(newNode);
     };

     return (
       <div className="absolute top-4 left-4 z-10 bg-white border rounded-lg p-4 shadow-lg">
         <h3 className="font-semibold mb-2">Add Nodes</h3>
         <div className="space-y-2">
           <button
             onClick={addQuestionNode}
             className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
           >
             Add Question
           </button>
           <button
             onClick={addTransactionNode}
             className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
           >
             Add Transaction
           </button>
           <button
             onClick={reset}
             className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
           >
             Clear All
           </button>
         </div>
       </div>
     );
   };

   export default GraphToolbar;
   ```

2. Add toolbar to `GraphBuilder.tsx`:
   ```typescript
   import GraphToolbar from './GraphToolbar';

   const GraphBuilder = () => {
     // ... existing code
     return (
       <div style={{ height: '100vh', position: 'relative' }}>
         <GraphToolbar />
         <ReactFlow
           // ... existing props
         />
       </div>
     );
   };
   ```

## Step 5: Implement Form Metadata Panel

Add a panel for form title, description, and save functionality.

1. Create `src/components/FormPanel.tsx`:
   ```typescript
   import React from 'react';
   import { useGraphStore } from '@/stores/graphStore';

   const FormPanel = () => {
     const { formTitle, formDescription, setFormTitle, setFormDescription, nodes, edges } = useGraphStore();

     const saveForm = async () => {
       const schema = {
         title: formTitle,
         description: formDescription,
         nodes,
         edges,
       };

       try {
         const response = await fetch('/api/forms', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(schema),
         });

         if (response.ok) {
           alert('Form saved successfully!');
         } else {
           alert('Error saving form');
         }
       } catch (error) {
         console.error('Save error:', error);
         alert('Error saving form');
       }
     };

     return (
       <div className="absolute top-4 right-4 z-10 bg-white border rounded-lg p-4 shadow-lg w-80">
         <h3 className="font-semibold mb-4">Form Details</h3>
         <div className="space-y-4">
           <div>
             <label className="block text-sm font-medium mb-1">Title</label>
             <input
               type="text"
               value={formTitle}
               onChange={(e) => setFormTitle(e.target.value)}
               className="w-full p-2 border rounded"
               placeholder="Enter form title"
             />
           </div>
           <div>
             <label className="block text-sm font-medium mb-1">Description</label>
             <textarea
               value={formDescription}
               onChange={(e) => setFormDescription(e.target.value)}
               className="w-full p-2 border rounded h-20"
               placeholder="Enter form description"
             />
           </div>
           <button
             onClick={saveForm}
             className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
           >
             Save Form
           </button>
         </div>
       </div>
     );
   };

   export default FormPanel;
   ```

2. Add to `GraphBuilder.tsx`:
   ```typescript
   import FormPanel from './FormPanel';

   const GraphBuilder = () => {
     // ... existing code
     return (
       <div style={{ height: '100vh', position: 'relative' }}>
         <GraphToolbar />
         <FormPanel />
         <ReactFlow
           // ... existing props
         />
       </div>
     );
   };
   ```

## Step 6: Integrate BlinkSimulator

Implement the preview functionality using Dialect Blinks SDK.

1. Update `BlinkSimulator.tsx`:
   ```typescript
   'use client';

   import React, { useEffect, useState } from 'react';
   import { useGraphStore } from '@/stores/graphStore';

   const BlinkSimulator = () => {
     const { nodes, edges, formTitle, formDescription } = useGraphStore();
     const [blinkUrl, setBlinkUrl] = useState<string>('');

     useEffect(() => {
       // Generate a mock blink URL for local testing
       if (nodes.length > 0) {
         const formId = 'mock-form-id'; // In real implementation, get from saved form
         setBlinkUrl(`http://localhost:3000/api/actions/${formId}`);
       }
     }, [nodes, edges]);

     return (
       <div className="bg-gray-100 p-4 rounded-lg">
         <h2 className="text-lg font-semibold mb-4">Blink Simulator</h2>
         {blinkUrl ? (
           <div>
             <p className="mb-2">Preview URL: {blinkUrl}</p>
             <div className="border rounded p-4 bg-white">
               {/* Placeholder for Dialect Blinks component */}
               <div className="text-center py-8">
                 <p className="text-gray-500">Blink preview will appear here</p>
                 <p className="text-sm text-gray-400 mt-2">
                   Integrate with @dialectlabs/blinks for full preview
                 </p>
               </div>
             </div>
           </div>
         ) : (
           <p className="text-gray-500">Add nodes to see preview</p>
         )}
       </div>
     );
   };

   export default BlinkSimulator;
   ```

2. Add simulator to builder page layout. Update `builder/page.tsx`:
   ```typescript
   import GraphBuilder from '@/components/GraphBuilder';
   import BlinkSimulator from '@/components/BlinkSimulator';

   export default function BuilderPage() {
     return (
       <div className="h-screen flex">
         <div className="flex-1">
           <GraphBuilder />
         </div>
         <div className="w-96 bg-white border-l p-4">
           <BlinkSimulator />
         </div>
       </div>
     );
   }
   ```

## Step 7: Add Node Data Updates

Connect the node forms to the store for real-time updates.

1. Update `QuestionNode.tsx` to use store:
   ```typescript
   import { useGraphStore } from '@/stores/graphStore';

   const QuestionNode: React.FC<QuestionNodeProps> = ({ id, data }) => {
     const { updateNode } = useGraphStore();

     const updateQuestion = (question: string) => {
       updateNode(id, { question });
     };

     const updateOption = (index: number, value: string) => {
       const newOptions = [...(data.options || [])];
       newOptions[index] = value;
       updateNode(id, { options: newOptions });
     };

     const addOption = () => {
       const newOptions = [...(data.options || []), ''];
       updateNode(id, { options: newOptions });
     };

     // Update input onChange handlers
     <input
       value={data.question || ''}
       onChange={(e) => updateQuestion(e.target.value)}
       // ... other props
     />
     // Similar for options
   };
   ```

2. Do the same for `TransactionNode.tsx`.

## Step 8: Implement Backend Integration

Create API routes for saving and loading forms.

1. Create `src/app/api/forms/route.ts`:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';

   export async function POST(request: NextRequest) {
     try {
       const { title, description, nodes, edges } = await request.json();

       // In a real implementation, save to your backend
       // For now, just return success
       const formId = `form-${Date.now()}`;

       return NextResponse.json({ id: formId, message: 'Form saved' });
     } catch (error) {
       return NextResponse.json({ error: 'Failed to save form' }, { status: 500 });
     }
   }

   export async function GET() {
     // Return list of forms - placeholder
     return NextResponse.json({ forms: [] });
   }
   ```

## Step 9: Add Styling and Polish

1. Update global styles in `src/app/globals.css` for better React Flow appearance.

2. Add loading states and error handling.

3. Implement form validation.

## Step 10: Testing and Validation

1. Test node creation and connection.

2. Verify data persistence in store.

3. Test save functionality (mock for now).

4. Ensure responsive design.

5. Test with different node configurations.

## Next Steps

After completing the basic builder:

1. Integrate with real backend API endpoints.

2. Implement full Dialect Blinks SDK integration for simulator.

3. Add conditional logic nodes.

4. Implement form loading from saved schemas.

5. Add user authentication and form ownership.

6. Deploy to Vercel.

## Resources

- [React Flow Documentation](https://reactflow.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Dialect Blinks Documentation](https://docs.dialect.to/)
- [Solana Actions Spec](https://github.com/solana-developers/solana-actions)

This guide covers the core functionality for Phase 2. Each step builds upon the previous one, creating a functional visual form builder.