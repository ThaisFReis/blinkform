export interface MagicButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export interface RadarProps {
  className?: string;
}

export interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  gradient?: boolean;
}

export interface BentoCardProps {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  highlight?: boolean;
}

export interface GridBeamProps {}

export interface AuroraBackgroundProps {}

export interface HeaderProps {}

export interface HeroProps {}

export interface PartnersMarqueeProps {}

export interface FeaturesProps {}

export interface ShowcaseProps {}

export interface CTAProps {}

export interface FooterProps {}