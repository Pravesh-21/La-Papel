"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(itemsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        rotateX: 25,
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const gradients = [
    "linear-gradient(135deg, #2a1f16 0%, #0f0c09 100%)",
    "linear-gradient(135deg, #bf5fe0 0%, #6b2fa0 100%)",
    "linear-gradient(135deg, #1c1409 0%, #2a1f16 100%)",
    "linear-gradient(135deg, #d4967a 0%, #6b2fa0 100%)",
    "linear-gradient(135deg, #0f0c09 0%, #161009 100%)",
    "linear-gradient(135deg, #c47ef5 0%, #bf5fe0 100%)",
    "linear-gradient(135deg, #161009 0%, #0d0a12 100%)",
    "linear-gradient(135deg, #6b2fa0 0%, #2a1f16 100%)",
    "linear-gradient(135deg, #2a1f16 0%, #d4967a 100%)",
  ];

  return (
    <section id="gallery" ref={sectionRef} className={styles.gallerySection}>
      <div className={styles.header}>
        <span className={styles.label}>PORTFOLIO</span>
        <h2 className={`${styles.title} gold-shimmer`}>Artistry in Motion</h2>
      </div>

      <div className={`perspective-1200 ${styles.masonryGrid}`}>
        {gradients.map((gradient, i) => (
          <div
            key={i}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            className={`${styles.masonryItem} ${i === 2 ? styles.span2 : ""}`}
            style={{ background: gradient }}
          >
            <div className={styles.overlay}>
              <span className={styles.viewText}>View</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
