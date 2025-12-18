import React from 'react';
import {
  Workflow,
  Smartphone,
  Zap,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import styles from './Features.module.css';
import BentoCard from '../shared/BentoCard';

/**
 * Features component
 * Displays the main features using BentoCard grid.
 */
const Features: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={`${styles.title} ${styles.titleMd}`}>
            The <span className={styles.gradient}>Operating System</span> <br />for Solana Actions.
          </h2>
          <p className={styles.description}>
            We abstracted away the complexity of Rust and Web3.js so you can focus on designing the experience.
          </p>
        </div>

        <div className={`${styles.grid} ${styles.gridMd} ${styles.gridLg}`}>
          <BentoCard
            size="md"
            title="Visual Flow Builder"
            desc="A node-based environment that feels like magic. Drag, drop, and connect primitives to build complex on-chain logic."
            icon={Workflow}
            highlight={true}
          />
          <BentoCard
            size="sm"
            title="Real-time Mobile Preview"
            desc="See exactly how your Blink will look on X (Twitter) and mobile wallets instantly."
            icon={Smartphone}
          />
          <BentoCard
            size="sm"
            title="Solana Native"
            desc="Deep integration with web3.js and the Blinks protocol standard out of the box."
            icon={Zap}
          />
          <BentoCard
            size="md"
            title="Transaction Security"
            desc="Built-in simulation and safety checks ensure your forms are secure before they ever go live. We handle the signature verification for you."
            icon={ShieldCheck}
            highlight={true}
          />
          <BentoCard
            size="sm"
            title="One-Click Deploy"
            desc="Push to IPFS and generate your action.json instantly."
            icon={Share2}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;