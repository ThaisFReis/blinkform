'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Wallet,
  CheckCircle,
  Play,
  Info
} from 'lucide-react';
import styles from './InteractiveDemo.module.css';

interface DemoNode {
  id: string;
  type: 'start' | 'input' | 'transaction' | 'end';
  title: string;
  description: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  details: string;
}

const demoFlow: DemoNode[] = [
  {
    id: 'start',
    type: 'start',
    title: 'Start Form',
    description: 'Begin the NFT minting process',
    icon: <Play className="w-4 h-4" />,
    position: { x: 20, y: 80 },
    details: 'Configure your blink title, description, and initial parameters'
  },
  {
    id: 'wallet',
    type: 'input',
    title: 'Connect Wallet',
    description: 'User connects Solana wallet',
    icon: <Wallet className="w-4 h-4" />,
    position: { x: 170, y: 80 },
    details: 'Secure wallet connection with permission verification'
  },
  {
    id: 'mint',
    type: 'transaction',
    title: 'Mint NFT',
    description: 'Execute minting transaction',
    icon: <Sparkles className="w-4 h-4" />,
    position: { x: 320, y: 80 },
    details: 'Create NFT with metadata, upload to IPFS, and transfer to user'
  },
  {
    id: 'end',
    type: 'end',
    title: 'Success',
    description: 'NFT minted successfully',
    icon: <CheckCircle className="w-4 h-4" />,
    position: { x: 470, y: 80 },
    details: 'Transaction confirmed on Solana blockchain'
  }
];

const InteractiveDemo: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<DemoNode | null>(null);

  const handleNodeClick = (node: DemoNode) => {
    setSelectedNode(node);
  };

  return (
    <div className={styles.demo}>
      <div className={styles.gridPattern}></div>

      {/* Flow Visualization */}
      <div className={styles.flowContainer}>
        <svg className={styles.connections} aria-hidden="true">
          {demoFlow.slice(0, -1).map((node, index) => {
            const nextNode = demoFlow[index + 1];
            return (
              <path
                key={`connection-${index}`}
                d={`M ${node.position.x + 60} ${node.position.y + 40} C ${node.position.x + 110} ${node.position.y + 40}, ${nextNode.position.x + 10} ${nextNode.position.y + 40}, ${nextNode.position.x + 60} ${nextNode.position.y + 40}`}
                className={styles.connection}
                stroke="#22d3ee"
                strokeWidth="2"
                fill="none"
              />
            );
          })}
        </svg>

        {demoFlow.map((node) => (
          <button
            key={node.id}
            onClick={() => handleNodeClick(node)}
            className={`${styles.node} ${styles[node.type]}`}
            style={{
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
            }}
            aria-label={`${node.title}: ${node.description}`}
          >
            <div className={styles.nodeIcon}>
              {node.icon}
            </div>
            <div className={styles.nodeContent}>
              <div className={styles.nodeTitle}>{node.title}</div>
              <div className={styles.nodeDesc}>{node.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Info Button */}
      <button
        className={styles.infoButton}
        onClick={() => setSelectedNode(demoFlow[0])}
        aria-label="Show demo information"
      >
        <Info className="w-4 h-4" />
      </button>

      {/* Node Details Modal */}
      {selectedNode && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                {selectedNode.icon}
              </div>
              <h3 id="modal-title" className={styles.modalTitle}>{selectedNode.title}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className={styles.closeButton}
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            <p className={styles.modalDescription}>{selectedNode.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveDemo;