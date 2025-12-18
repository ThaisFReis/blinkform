import React from 'react';
import styles from './AuroraBackground.module.css';
import GridBeam from './GridBeam';

/**
 * AuroraBackground component
 * Provides the animated background with gradients and grid beams.
 */
const AuroraBackground: React.FC = () => {
  return (
    <div className={styles.auroraBackground}>
      <div className={styles.deepGradient1}></div>
      <div className={styles.deepGradient2}></div>
      <div className={styles.gridPattern}></div>
      <GridBeam />
    </div>
  );
};

export default AuroraBackground;