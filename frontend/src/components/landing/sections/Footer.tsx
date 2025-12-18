import React from 'react';
import {
  Zap,
  Twitter,
  Github,
  MessageCircle,
  Mail,
} from 'lucide-react';
import styles from './Footer.module.css';

/**
 * Footer component
 * Site footer with links and newsletter.
 */
const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.containerMd}`}>
        <div className={`${styles.firstCol} ${styles.firstColMd}`}>
          <div className={styles.logoArea}>
            <div className={styles.logo}>
              <Zap className={styles.logoIcon} />
            </div>
            <span className={styles.brandName}>BlinkForm</span>
          </div>
          <p className={styles.description}>
            Empowering the next generation of Solana developers with visual tools.
          </p>
          <div className={styles.social}>
            <div className={styles.socialIcon}>
              <Twitter className="w-4 h-4" />
            </div>
            <div className={styles.socialIcon}>
              <Github className="w-4 h-4" />
            </div>
            <div className={styles.socialIcon}>
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>

          <div className={styles.newsletter}>
            <p className={styles.newsletterTitle}>Subscribe to Newsletter</p>
            <div className={styles.form}>
              <Mail className={styles.mailIcon} />
              <input type="email" placeholder="Enter email" className={styles.input} />
              <button className={styles.button}>Join</button>
            </div>
          </div>
        </div>

        {['Product', 'Resources', 'Legal'].map((header, idx) => (
          <div key={header} className={styles.col}>
            <h4 className={styles.colTitle}>{header}</h4>
            <ul className={styles.links}>
              {['Link One', 'Link Two', 'Link Three', 'Link Four'].map((item, i) => (
                <li key={i}>
                  <a href="#" className={styles.link}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={`${styles.bottom} ${styles.bottomMd}`}>
        <p className={`${styles.copyright} ${styles.copyrightMd}`}>© 2024 BlinkForm Labs Inc. All rights reserved.</p>
        <p className={styles.built}>
          Built with <span className={styles.heart}>❤️</span> for the Solana Ecosystem
        </p>
      </div>
    </footer>
  );
};

export default Footer;