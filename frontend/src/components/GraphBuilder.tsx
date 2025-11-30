'use client';

import React from 'react';
import { ReactFlow, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const GraphBuilder = () => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
};

export default GraphBuilder;