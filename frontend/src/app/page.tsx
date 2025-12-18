'use client';

import React from 'react';
import AuroraBackground from '@/components/landing/shared/AuroraBackground';
import Header from '@/components/landing/sections/Header';
import Hero from '@/components/landing/sections/Hero';
import PartnersMarquee from '@/components/landing/sections/PartnersMarquee';
import Features from '@/components/landing/sections/Features';
import Showcase from '@/components/landing/sections/Showcase';
import CTA from '@/components/landing/sections/CTA';
import Footer from '@/components/landing/sections/Footer';

/**
 * LandingPage component
 * Main landing page for BlinkForm, composed of modular components.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans text-gray-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-white bg-[#030305]">
      <AuroraBackground />
      <Header />
      <Hero />
      <PartnersMarquee />
      <Features />
      <Showcase />
      <CTA />
      <Footer />
    </div>
  );
}
