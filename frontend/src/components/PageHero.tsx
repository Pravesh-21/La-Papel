"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  label: string;
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string }[];
}

export default function PageHero({ label, title, subtitle, breadcrumb }: PageHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(`.${styles.label}`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 });
      tl.fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, "-=0.4");
      if (subtitle) {
        tl.fromTo(`.${styles.subtitle}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");
      }
    }, heroRef);
    return () => ctx.revert();
  }, [subtitle]);

  return (
    <div ref={heroRef} className={styles.pageHero}>
      {/* Animated golden lines */}
      <div className={styles.lineLeft}></div>
      <div className={styles.lineRight}></div>

      {breadcrumb && (
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link href="/" className={styles.crumb}>Home</Link>
          {breadcrumb.map((crumb, i) => (
            <span key={i}>
              <span className={styles.crumbSep}>/</span>
              {i === breadcrumb.length - 1 ? (
                <span className={`${styles.crumb} ${styles.crumbActive}`}>{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className={styles.crumb}>{crumb.label}</Link>
              )}
            </span>
          ))}
        </nav>
      )}

      <span className={styles.label}>{label}</span>
      <div className="gold-divider" style={{ width: "50px", margin: "1rem auto" }}></div>
      <h1 ref={titleRef} className={`${styles.title} gold-shimmer`}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.cornerTL}></div>
      <div className={styles.cornerBR}></div>
    </div>
  );
}
