import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Eye,
  Wallet,
  Sparkles,
  Lock,
} from 'lucide-react';
import styles from './Hero.module.css';
import TextReveal from '../shared/TextReveal';
import Radar from '../shared/Radar';
import MagicButton from '../shared/MagicButton';

/**
 * Hero component
 * Main hero section with animated text and 3D mockup.
 */
const Hero: React.FC = () => {
  return (
    <section className={`${styles.hero} ${styles.heroLg}`}>
      <div className={styles.radar}>
        <Radar />
      </div>

      <div className={`${styles.grid} ${styles.gridLg}`}>
        <div className={`${styles.leftColumn} ${styles.leftColumnLg}`}>
          <div className={styles.badge}>
            <span className={styles.pulse}>
              <span className={styles.pulse}></span>
            </span>
            <span className={styles.badgeText}>Used by 100+ Solana Projects</span>
          </div>

          <h1 className={`${styles.heading} ${styles.headingLg}`}>
            <span>
              <TextReveal text="Create Powerful Solana Blinks" />
            </span>
            <span>
              <TextReveal text="in Minutes – No Code" gradient={true} delay={0.4} />
            </span>
          </h1>

          <p className={`${styles.description} ${styles.descriptionLg}`}>
            Drag, connect, and deploy transaction flows for NFTs, payments, and more. Built for the Solana ecosystem to accelerate your prototyping.
          </p>

          <div className={`${styles.ctas} ${styles.ctasSm}`}>
            <MagicButton href="/builder">
              <span>Start Building Free <ArrowRight className="w-4 h-4" /></span>
            </MagicButton>

            <Link href="/builder" className={styles.demoLink}>
              <Eye className="mr-2 w-4 h-4" /> View Demo
            </Link>
          </div>
        </div>

        <div className={`${styles.rightColumn} ${styles.rightColumnLg}`}>
          <div className={styles.floor}></div>

          <div className={`${styles.card3dWrapper} ${styles.mockup}`}>
            <div className={styles.card3d}>
              <div className={styles.mockupInner}>
                <div className={styles.uiHeader}>
                  <div className={styles.dots}>
                    <div className={styles.dotRed}></div>
                    <div className={styles.dotYellow}></div>
                    <div className={styles.dotGreen}></div>
                  </div>
                  <div className={styles.secure}>
                    <Lock className="w-3 h-3 text-cyan-400" />
                    <span className={styles.secureText}>SECURE CONNECTION</span>
                  </div>
                </div>

                <div className={styles.canvas}>
                  <div className={styles.gridPattern}></div>

                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                      <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 240 160 C 350 160, 350 250, 450 250"
                      stroke="url(#lineGradient2)"
                      strokeWidth="2"
                      fill="none"
                      className="drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    />
                    <circle r="4" fill="#fff">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M 240 160 C 350 160, 350 250, 450 250" />
                    </circle>
                  </svg>

                  <div className={`${styles.node} ${styles.node1}`}>
                    <div className={styles.nodeHeader}>
                      <span className={styles.nodeTitle}>Input</span>
                      <div className={styles.nodeDot}></div>
                    </div>
                    <div className={styles.nodeContent}>
                      <div className={styles.nodeItem}>
                        <div className={styles.nodeIcon}>
                          <Wallet className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className={styles.nodeText}>Connect Wallet</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.node} ${styles.node2}`}>
                    <div className={styles.node2Header}>
                      <span className={styles.node2Title}>Transaction</span>
                      <div className={styles.node2Dot}></div>
                    </div>
                    <div className={styles.nodeContent}>
                      <div className={styles.nodeItem}>
                        <div className={styles.node2Icon}>
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className={styles.nodeText}>Execute Swap</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;