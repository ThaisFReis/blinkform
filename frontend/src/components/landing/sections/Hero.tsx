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

<style>{`
  .card-3d-wrapper {
    perspective: 1000px;
  }
  .card-3d {
    transform-style: preserve-3d;
    transition: transform 0.7s ease-out;
  }
  @media (min-width: 1024px) {
    .card-3d {
      transform: rotateY(-12deg) rotateX(6deg);
    }
    .card-3d-wrapper:hover .card-3d {
      transform: rotateY(0deg) rotateX(0deg);
    }
  }
`}</style>

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

      <div className={`${styles.grid} ${styles.gridLg} card-3d-wrapper`}>
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

          <div className="card-3d border border-white/10 rounded-xl bg-[#0A0A0F]/60 backdrop-blur-md p-1 shadow-2xl ring-1 ring-white/5">
            <div className="border border-white/5 rounded-lg overflow-hidden bg-black/80 aspect-[16/9] relative group">
              {/* UI Header */}
              <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/5 flex items-center justify-between px-4 bg-[#0A0A0F]/90 z-20">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-white/5 border border-white/5">
                   <Lock className="w-3 h-3 text-cyan-400" />
                   <span className="text-[10px] text-gray-400 font-mono tracking-wider">SECURE CONNECTION</span>
                </div>
                <div className="w-10"></div>
              </div>
              
              {/* Canvas Area */}
              <div className="absolute inset-0 mt-10 p-0 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                  
                  {/* Connection Line */}
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
                     {/* Animated Moving Dot on Line */}
                     <circle r="4" fill="#fff">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M 240 160 C 350 160, 350 250, 450 250" />
                      </circle>
                  </svg>

                  {/* Node 1: Input */}
                  <div className="absolute top-28 left-16 w-56 bg-[#13131A]/90 backdrop-blur border border-cyan-500/30 rounded-xl p-0 shadow-[0_0_30px_-5px_rgba(34,211,238,0.1)] z-10 hover:border-cyan-400 transition-all cursor-move group/node">
                    <div className="bg-cyan-950/20 border-b border-cyan-500/20 p-3 rounded-t-xl flex justify-between items-center">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">Input</span>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20">
                             <Wallet className="w-4 h-4 text-cyan-400" />
                           </div>
                           <div className="text-sm text-white font-medium">Connect Wallet</div>
                        </div>
                    </div>
                  </div>

                  {/* Node 2: Transaction */}
                  <div className="absolute top-52 left-[450px] w-56 bg-[#13131A]/90 backdrop-blur border border-purple-500/30 rounded-xl p-0 shadow-[0_0_30px_-5px_rgba(192,132,252,0.1)] z-10 hover:border-purple-400 transition-all cursor-move">
                    <div className="bg-purple-950/20 border-b border-purple-500/20 p-3 rounded-t-xl flex justify-between items-center">
                        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Transaction</span>
                        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                             <Sparkles className="w-4 h-4 text-purple-400" />
                           </div>
                           <div className="text-sm text-white font-medium">Execute Swap</div>
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