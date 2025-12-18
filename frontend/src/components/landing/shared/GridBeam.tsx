import React from 'react';
import styles from './GridBeam.module.css';

/**
 * GridBeam component
 * A beam of light traversing the background grid.
 */
const GridBeam: React.FC = () => {
  return (
    <div className={styles.gridBeam}>
      <div className={styles.beamH}></div>
      <div className={styles.beamH2}></div>
      <div className={styles.beamV}></div>
      <div className={styles.beamV2}></div>
    </div>
  );
};

export default GridBeam;