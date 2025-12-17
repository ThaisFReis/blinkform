'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Connection,
  NodeChange,
  EdgeChange,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFormBuilderStore } from '@/store/formBuilderStore';
import { InputNode } from '@/components/nodes/InputNode';
import { ChoiceNode } from '@/components/nodes/ChoiceNode';
import { TransactionNode } from '@/components/nodes/TransactionNode';
import { MintNFTNode } from '@/components/nodes/MintNFTNode';
import { CallContractNode } from '@/components/nodes/CallContractNode';
import { CreateTokenNode } from '@/components/nodes/CreateTokenNode';
import { MintTokenNode } from '@/components/nodes/MintTokenNode';
import { CreateNftCollectionNode } from '@/components/nodes/CreateNftCollectionNode';
import { BatchAirdropNode } from '@/components/nodes/BatchAirdropNode';
import { ConditionalNode } from '@/components/nodes/ConditionalNode';
import { ValidationNode } from '@/components/nodes/ValidationNode';
import { CalculationNode } from '@/components/nodes/CalculationNode';
import { EndNode } from '@/components/nodes/EndNode';
import { StartNode } from '@/components/nodes/StartNode';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { MenuItemType } from '@/types/ui';
import { Trash2, Grid3x3, HelpCircle, X } from 'lucide-react';

const GraphBuilder = () => {
  // Selective subscriptions for performance
  const nodes = useFormBuilderStore((state) => state.nodes);
  const edges = useFormBuilderStore((state) => state.edges);
  const addNode = useFormBuilderStore((state) => state.addNode);
  const addEdge = useFormBuilderStore((state) => state.addEdge);
  const deleteEdge = useFormBuilderStore((state) => state.deleteEdge);
  const selectNode = useFormBuilderStore((state) => state.selectNode);
  const selectEdge = useFormBuilderStore((state) => state.selectEdge);
  const moveNode = useFormBuilderStore((state) => state.moveNode);
  const autoSaveToLocalStorage = useFormBuilderStore((state) => state.autoSaveToLocalStorage);


  // Edge context menu state
  const [edgeContextMenu, setEdgeContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    edgeId: string | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    edgeId: null,
  });

  // Help panel state
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Auto-save effect
  useEffect(() => {
    const unsubscribe = useFormBuilderStore.subscribe((state, prevState) => {
      // Only auto-save if nodes or edges changed
      if (state.nodes !== prevState.nodes || state.edges !== prevState.edges) {
        autoSaveToLocalStorage();
      }
    });

    return unsubscribe;
  }, [autoSaveToLocalStorage]);

  // Keyboard shortcuts for node and edge deletion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in input field
      if (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) return;

      const state = useFormBuilderStore.getState();
      const currentSelectedNodeId = state.selectedNodeId;
      const currentSelectedEdgeId = state.selectedEdgeId;

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();

        if (currentSelectedNodeId) {
          state.deleteNode(currentSelectedNodeId);
        } else if (currentSelectedEdgeId) {
          state.deleteEdge(currentSelectedEdgeId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Strict connection validation
  const isValidConnection = useCallback(
    (connection: Connection | any) => {
      if (!connection.source || !connection.target) return false;

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      // End nodes can't have outgoing connections
      if (sourceNode.type === 'end') return false;

      // Prevent duplicate edges
      const isDuplicate = edges.some(
        (e) => e.source === connection.source && e.target === connection.target
      );
      if (isDuplicate) return false;

      // Prevent self-connections
      if (connection.source === connection.target) return false;

      return true;
    },
    [nodes, edges]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'position' && 'position' in change && change.position && !change.dragging) {
          // Only update position when drag ends, not during dragging
          moveNode(change.id, change.position);
        } else if (change.type === 'select' && 'selected' in change && change.selected) {
          selectNode(change.id);
        }
      });
    },
    [moveNode, selectNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          deleteEdge(change.id);
        } else if (change.type === 'select' && 'selected' in change && change.selected) {
          selectEdge(change.id);
        }
      });
    },
    [deleteEdge, selectEdge]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      addEdge(connection);
    },
    [addEdge]
  );

  // Handle drag over for drop zones
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof data === 'undefined' || !data) {
        return;
      }

      // Parse type and questionType from data (format: "type:questionType" or just "type")
      const [type, questionType] = data.split(':');

      // Get the position of the drop
      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      };

      addNode(type as any, position, questionType);
    },
    [addNode]
  );

  // Edge context menu handler
  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: any) => {
    event.preventDefault();
    event.stopPropagation();

    setEdgeContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      edgeId: edge.id,
    });
  }, []);

  // Close edge context menu
  const closeEdgeContextMenu = useCallback(() => {
    setEdgeContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      edgeId: null,
    });
  }, []);

  // Handle edge deletion from context menu
  const handleDeleteEdge = useCallback(() => {
    if (edgeContextMenu.edgeId) {
      useFormBuilderStore.getState().deleteEdge(edgeContextMenu.edgeId);
      closeEdgeContextMenu();
    }
  }, [edgeContextMenu.edgeId, closeEdgeContextMenu]);

  // Tidy up nodes function
  const tidyUpNodes = useCallback(() => {
    const currentNodes = nodes;
    if (currentNodes.length === 0) return;

    const nodesPerRow = Math.ceil(Math.sqrt(currentNodes.length));
    const spacing = 300; // Space between nodes
    const startX = 100;
    const startY = 100;

    const updatedNodes = currentNodes.map((node, index) => {
      const row = Math.floor(index / nodesPerRow);
      const col = index % nodesPerRow;

      return {
        ...node,
        position: {
          x: startX + col * spacing,
          y: startY + row * spacing,
        },
      };
    });

    // Update all nodes at once
    updatedNodes.forEach((node) => {
      moveNode(node.id, node.position);
    });
  }, [nodes, moveNode]);

  // Edge context menu items
  const edgeContextMenuItems: MenuItemType[] = [
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: 'Delete Connection',
      shortcut: 'Del',
      onClick: handleDeleteEdge,
      variant: 'destructive',
    },
  ];

  // Custom edge styling - gray default, purple when selected
  const defaultEdgeOptions = {
    type: 'smoothstep',
    style: { stroke: '#4b5563', strokeWidth: 2 },
    animated: false,
  };

  // Generic QuestionNode that renders the appropriate specific node
  const QuestionNode = (props: any) => {
    const { data } = props;
    switch (data.questionType) {
      case 'input':
        return <InputNode {...props} />;
      case 'choice':
        return <ChoiceNode {...props} />;
      default:
        return <InputNode {...props} />;
    }
  };

  // Generic TransactionNode that renders the appropriate specific node
  const TransactionNodeRenderer = (props: any) => {
    const { data } = props;
    // Route to specific components based on transaction type
    switch (data.transactionType) {
      case 'CREATE_TOKEN':
        return <CreateTokenNode {...props} />;
      case 'MINT_TOKENS':
        return <MintTokenNode {...props} />;
      case 'CREATE_NFT_COLLECTION':
        return <CreateNftCollectionNode {...props} />;
      case 'MINT_NFT':
        return <MintNFTNode {...props} />;
      case 'BATCH_AIRDROP':
        return <BatchAirdropNode {...props} />;
      case 'CUSTOM_CALL':
        return <CallContractNode {...props} />;
      case 'SPL_MINT':
        // Check if it's an NFT minting node (has NFT-specific parameters)
        if (data.parameters?.name || data.parameters?.symbol || data.parameters?.uri) {
          return <MintNFTNode {...props} />;
        }
        return <MintTokenNode {...props} />;
      default:
        return <TransactionNode {...props} />;
    }
  };

  // Generic LogicNode that renders the appropriate specific node
  const LogicNodeRenderer = (props: any) => {
    const { data } = props;
    if (data.logicType === 'validation') {
      return <ValidationNode {...props} />;
    }
    if (data.logicType === 'calculation') {
      return <CalculationNode {...props} />;
    }
    // Default to conditional node
    return <ConditionalNode {...props} />;
  };

  // Node types for ReactFlow
  const nodeTypes = {
    question: QuestionNode,
    transaction: TransactionNodeRenderer,
    logic: LogicNodeRenderer,
    end: EndNode,
    start: StartNode,
  };

  return (
    <div className="h-full w-full pb-20 lg:pb-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onEdgeContextMenu={onEdgeContextMenu}
        isValidConnection={isValidConnection}
        defaultEdgeOptions={defaultEdgeOptions}
        style={{ background: 'transparent' }}
        fitView
        attributionPosition="bottom-left"
        className="touch-pan-x touch-pinch-zoom"
        panOnDrag={[1, 2]} // Allow panning with mouse and touch
        selectionOnDrag={false} // Prevent selection on drag for better touch experience
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background
          gap={20}
          color="#2a2a35"
          size={1}
          style={{ opacity: 0.5 }}
        />
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          className="!bottom-24 lg:!bottom-4 !left-4 !bg-[#13131A] !border-white/10 !rounded-lg"
        />

        {/* Custom buttons - Hidden on mobile, shown on larger screens */}
        <div className="absolute top-4 right-4 z-10 hidden md:flex gap-2">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-[#13131A] border border-white/10 rounded-lg shadow-sm hover:bg-white/10 transition-colors text-gray-200"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Help</span>
          </button>
          {nodes.length > 0 && (
            <button
              onClick={tidyUpNodes}
              className="flex items-center gap-2 px-3 py-2 bg-[#13131A] border border-white/10 rounded-lg shadow-sm hover:bg-white/10 transition-colors text-gray-200"
              title="Tidy up nodes"
            >
              <Grid3x3 className="w-4 h-4" />
              <span className="text-sm">Tidy Up</span>
            </button>
          )}
        </div>

        {/* Mobile-specific controls */}
        <div className="absolute top-4 right-4 z-10 md:hidden">
          <div className="flex gap-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-2 bg-[#13131A] border border-white/10 rounded-lg shadow-sm hover:bg-white/10 transition-colors text-gray-200"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            {nodes.length > 0 && (
              <button
                onClick={tidyUpNodes}
                className="p-2 bg-[#13131A] border border-white/10 rounded-lg shadow-sm hover:bg-white/10 transition-colors text-gray-200"
                title="Tidy up nodes"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </ReactFlow>

      {/* Help Panel */}
      {isHelpOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#13131A] border border-white/10 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Welcome to BlinkForm Builder</h2>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What is a Blink?</h3>
                  <p className="leading-relaxed">
                    A Blink is an interactive blockchain experience that lets you complete transactions and interact with decentralized applications directly from this page.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">How to Build Your Form</h3>
                  <p className="leading-relaxed mb-2">
                    Use the components from the left sidebar to build your interactive form. Start with a <strong>Start Form</strong> node to define your blink's purpose, then add input fields, logic, and transaction nodes.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Start Form:</strong> Define your blink's title, description, and purpose</li>
                    <li><strong>Input Fields:</strong> Collect user information (text, numbers, dates, choices)</li>
                    <li><strong>Logic:</strong> Add conditions, validation, and calculations</li>
                    <li><strong>Transactions:</strong> Enable blockchain interactions (transfers, NFT minting, etc.)</li>
                    <li><strong>End Form:</strong> Complete the workflow with success actions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What You Can Build</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Submit forms to mint NFTs</li>
                    <li>Vote in community proposals</li>
                    <li>Purchase tokens or digital assets</li>
                    <li>Participate in decentralized applications</li>
                    <li>Create interactive blockchain experiences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Getting Started</h3>
                  <p className="leading-relaxed">
                    Drag components from the sidebar onto the canvas. Connect them by dragging from the output handle (right side) to the input handle (left side) of another node. Click on any node to edit its properties in the right sidebar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edge Context Menu */}
      <ContextMenu
        items={edgeContextMenuItems}
        position={edgeContextMenu.position}
        isOpen={edgeContextMenu.isOpen}
        onClose={closeEdgeContextMenu}
      />
    </div>
  );
};

export default GraphBuilder;