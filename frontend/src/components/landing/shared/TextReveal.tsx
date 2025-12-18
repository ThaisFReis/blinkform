import React from 'react';
import styles from './TextReveal.module.css';
import { TextRevealProps } from '../types';

/**
 * TextReveal component
 * Splits text into words and animates them from blurry/transparent to clear/opaque.
 * @param text - The text to animate
 * @param className - Additional CSS classes
 * @param delay - Delay before starting animation (in seconds)
 * @param gradient - Whether to apply gradient text effect
 */
const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = "",
  delay = 0,
  gradient = false
}) => {
  if (!text || typeof text !== 'string') return null;
  const words = text.split(" ");
  return (
    <span className={`${styles.textReveal} ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`${styles.word} ${gradient ? styles.wordGradient : ''}`}
          style={{ animationDelay: `${delay + (i * 0.1)}s` }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

export default TextReveal;