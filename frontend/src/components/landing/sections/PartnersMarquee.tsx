import React from 'react';
import {
  Globe,
  Layers,
  Database,
  Cpu,
} from 'lucide-react';
import styles from './PartnersMarquee.module.css';

/**
 * PartnersMarquee component
 * Displays trusted infrastructure partners.
 */
const PartnersMarquee: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.gradient}></div>
      <div className={styles.container}>
        <p className={styles.title}>Trusted Infrastructure</p>
        <div className={styles.partners}>
          <div className={styles.partner}>
            <Globe className={`${styles.icon} ${styles.iconPurple}`} />
            <span className={styles.text}>SOLANA</span>
          </div>
          <div className={styles.partner}>
            <Layers className={`${styles.icon} ${styles.iconCyan}`} />
            <span className={styles.text}>METAPLEX</span>
          </div>
          <div className={styles.partner}>
            <Database className={`${styles.icon} ${styles.iconEmerald}`} />
            <span className={styles.text}>SUPABASE</span>
          </div>
          <div className={styles.partner}>
            <Cpu className={`${styles.icon} ${styles.iconWhite}`} />
            <span className={styles.text}>VERCEL</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;