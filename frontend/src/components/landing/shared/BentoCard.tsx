import React, { useRef, useState } from 'react';
import styles from './BentoCard.module.css';
import { BentoCardProps } from '../types';

/**
 * BentoCard component
 * Implements the "Spotlight" hover effect where a radial gradient follows the cursor.
 * @param title - Card title
 * @param desc - Card description
 * @param icon - Icon component
 * @param size - Card size (sm, md, lg)
 * @param className - Additional CSS classes
 * @param highlight - Whether to highlight the card
 */
const BentoCard: React.FC<BentoCardProps> = ({
  title,
  desc,
  icon: Icon,
  size = "sm",
  className = "",
  highlight = false
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => setOpacity(1);
  const handleBlur = () => setOpacity(0);

  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }[size] || styles.sizeSm;

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      className={`${styles.card} ${sizeClass} ${highlight ? styles.cardHighlight : ''} ${className}`}
    >
      <div className={styles.gridPattern}></div>

      <div
        className={styles.spotlight}
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.04), transparent 40%)`,
        }}
      />

      <div
        className={styles.gradientBorder}
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(34, 211, 238, 0.1), transparent 40%)`,
        }}
      />

      <div className={styles.content}>
        <div className="mb-auto">
          <div className={`${styles.iconContainer} ${highlight ? styles.iconContainerHighlight : ''}`}>
            {Icon && <Icon className={`${styles.icon} ${highlight ? styles.iconHighlight : styles.iconDefault}`} />}
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.desc}>{desc}</p>
        </div>

        <div className={styles.decorativeDots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      </div>
    </div>
  );
};

export default BentoCard;