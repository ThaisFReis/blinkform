import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import styles from "./Header.module.css";
import MagicButton from "../shared/MagicButton";

/**
 * Header component
 * Navigation bar with scroll effects and mobile menu.
 */
const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Builder", href: "/builder" },
  ];

  return (
    <nav
      className={`${styles.navbar} ${
        isScrolled || mobileMenuOpen ? styles.navbarScrolled : ""
      }`}
    >
      {isScrolled && <div className={styles.shimmerBorder} />}

      <div className={styles.container}>
        {/* Logo Area */}
        <div className={styles.logoArea}>
          <div className={styles.logoGlow}>
            <div className={styles.logoGlowInset} />
            <div className={styles.logo}>
              <Zap className={styles.logoIcon} />
            </div>
          </div>
          <span className={styles.brandName}>BlinkForm</span>
        </div>

        {/* Desktop Navigation */}
        <div className={`${styles.desktopNav} ${styles.desktopNavMd}`}>
          {navLinks.map((item) => (
            <Link key={item.name} href={item.href} className={styles.navLink}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className={`${styles.desktopCtas} ${styles.desktopCtasMd}`}>
          <button className={styles.themeToggle} aria-label="Toggle Theme">
            <div className={styles.themeIcon} />
          </button>
          <MagicButton href="/builder">
            <span>Get Started</span>
          </MagicButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`${styles.mobileToggle} ${styles.mobileToggleMd}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`${styles.mobileMenu} ${
          mobileMenuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed
        }`}
      >
        {navLinks.map((item) =>
            <Link
              key={item.name}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
        )}
        <div className={styles.mobileCtas}>
          <MagicButton href="/builder" className="w-full">
            Start Building
          </MagicButton>
        </div>
      </div>
    </nav>
  );
};

export default Header;
