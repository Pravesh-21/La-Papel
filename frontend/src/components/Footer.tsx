"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Footer.module.css";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(columnsRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} id="contact" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Col */}
          <div
            ref={(el) => {
              columnsRef.current[0] = el;
            }}
            className={styles.col}
          >
            <h3 className={`${styles.brand} gold-shimmer`}>La Papel</h3>
            <p className={styles.desc}>
              The epitome of luxury salon and spa experiences, redefining beauty since 2012.
            </p>
          </div>

          {/* Services Col */}
          <div
            ref={(el) => {
              columnsRef.current[1] = el;
            }}
            className={styles.col}
          >
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.links}>
              <li><Link href="/services">Hair Styling</Link></li>
              <li><Link href="/services">Bridal Makeup</Link></li>
              <li><Link href="/services">Skin & Spa</Link></li>
              <li><Link href="/services">Nail Artistry</Link></li>
            </ul>
          </div>

          {/* Visit Us Col */}
          <div
            ref={(el) => {
              columnsRef.current[2] = el;
            }}
            className={styles.col}
          >
            <h4 className={styles.colTitle}>Visit Us</h4>
            <address className={styles.address}>
              124 Luxury Avenue,<br />
              New York, NY 10001<br />
              <br />
              Tue - Sun: 10AM - 8PM<br />
              Mon: Closed
            </address>
          </div>

          {/* Follow Us Col */}
          <div
            ref={(el) => {
              columnsRef.current[3] = el;
            }}
            className={styles.col}
          >
            <h4 className={styles.colTitle}>Follow Us</h4>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <span>IG</span>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <span>FB</span>
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <span>IN</span>
              </a>
            </div>
            <a href="mailto:hello@lapapelsalon.com" className={styles.email}>
              hello@lapapelsalon.com
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2026 La Papel. All rights reserved.</p>
          <div className={styles.legal}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
