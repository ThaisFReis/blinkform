import React from 'react';
import Link from 'next/link';
import styles from './MagicButton.module.css';
import { MagicButtonProps } from '../types';

/**
 * MagicButton component
 * A button with a rotating gradient border effect.
 * @param children - The content to display inside the button
 * @param className - Additional CSS classes for the button
 * @param href - If provided, renders as a Link component
 * @param onClick - Click handler for the button
 */
const MagicButton: React.FC<MagicButtonProps> = ({
  children,
  className = "",
  href,
  onClick
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className={`${styles.magicButton} ${className}`}
      >
        <span className={styles.gradientBorder} />
        <span className={styles.innerButton}>
          {children}
        </span>
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClick}
        className={`${styles.magicButton} ${className}`}
      >
        <span className={styles.gradientBorder} />
        <span className={styles.innerButton}>
          {children}
        </span>
      </button>
    );
  }
};

export default MagicButton;