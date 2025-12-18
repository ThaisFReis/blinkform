import React from 'react';
import {
  CheckCircle,
  Wand2,
  Wallet,
} from 'lucide-react';
import styles from './Showcase.module.css';
import BentoCard from '../shared/BentoCard';
import InteractiveDemo from '../shared/InteractiveDemo';

/**
 * Showcase component
 * Displays use cases and interactive demo.
 */
const Showcase: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.grid} ${styles.gridMd}`}>
          <div>
            <div className={styles.badge}>
              Use Cases
            </div>
            <h2 className={`${styles.title} ${styles.titleMd}`}>Built for every scenario</h2>
            <p className={styles.description}>
              Whether you are launching a new NFT collection, managing a DAO, or crowdfunding, BlinkForm adapts to your needs.
            </p>

            <div className={styles.list}>
              {[
                { title: "NFT Mints", desc: "Allowlists, public mints, and token gating." },
                { title: "DeFi Actions", desc: "Swaps, staking, and liquidity provision." },
                { title: "Governance", desc: "On-chain voting and proposal creation." }
              ].map((item, i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.icon}>
                    <CheckCircle className={styles.iconInner} />
                  </div>
                  <div>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                    <p className={styles.itemDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.blob}></div>

            <InteractiveDemo />

            <div className={styles.floatingCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconPurple}`}>
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <div className={styles.cardTitle}>Mint Pass</div>
              </div>
              <div className={styles.progress}></div>
            </div>

            <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconCyan}`}>
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className={styles.cardTitle}>Swap SOL</div>
              </div>
              <div className={styles.progress}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;