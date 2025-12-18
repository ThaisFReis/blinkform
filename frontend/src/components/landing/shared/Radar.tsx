import React from 'react';
import styles from './Radar.module.css';
import { RadarProps } from '../types';

/**
 * Radar component
 * Concentric circles pulsating to simulate scanning/monitoring.
 * @param className - Additional CSS classes
 */
const Radar: React.FC<RadarProps> = ({ className = "" }) => {
  return (
    <div className={`${styles.radar} ${className}`}>
      <div className={styles.container}>
        <div className={styles.coreGlow}></div>
        <div className={styles.ring1}></div>
        <div className={styles.ring2}></div>
        <div className={styles.ring3}></div>
        <div className={styles.scanner}>
          <div className={styles.scannerInner}></div>
        </div>
      </div>
    </div>
  );
};

export default Radar;