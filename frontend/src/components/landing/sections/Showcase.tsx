import React from 'react';
import {
  CheckCircle,
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;