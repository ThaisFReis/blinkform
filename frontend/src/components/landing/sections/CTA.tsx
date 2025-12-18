import React from 'react';
import {
  ExternalLink,
} from 'lucide-react';
import styles from './CTA.module.css';
import MagicButton from '../shared/MagicButton';

/**
 * CTA component
 * Call to action section with gradient background.
 */
const CTA: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.glow}></div>

        <div className={`${styles.card} ${styles.cardMd}`}>
          <div className={styles.shine}></div>

          <h2 className={`${styles.title} ${styles.titleMd}`}>
            Ready to build the <br />
            <span className={styles.gradient}>future of interactivity?</span>
          </h2>

          <div className={`${styles.ctas} ${styles.ctasSm}`}>
            <MagicButton className="w-full sm:w-auto text-lg px-10 py-3">
              Get Started for Free
            </MagicButton>
            <a href="/DOCUMENTATION.md" target="_blank" rel="noopener noreferrer" className={`${styles.docLink} w-full sm:w-auto`}>
              Read Documentation <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;