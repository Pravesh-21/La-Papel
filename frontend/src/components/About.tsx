"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./About.module.css";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(`.${styles.panel}`);

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => "+=" + (containerRef.current?.offsetWidth || 0),
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.aboutSection}>
      <div ref={containerRef} className={styles.panelsContainer}>
        {/* Panel 1 */}
        <div className={styles.panel}>
          <div className={styles.panelContent}>
            <div className={styles.accentShape1}></div>
            <h2 className={styles.quote}>
              "True beauty is not about perfection, but about the artistry of enhancing what is naturally yours."
            </h2>
            <p className={styles.quoteAuthor}>— Isabella Reyes, Founder</p>
          </div>
        </div>

        {/* Panel 2 */}
        <div className={styles.panel}>
          <div className={`${styles.panelContent} ${styles.twoCol}`}>
            <div className={styles.accentShape2}></div>
            <div className={styles.textCol}>
              <span className={styles.label}>OUR PHILOSOPHY</span>
              <h3 className={styles.subheading}>A Decade of Excellence</h3>
              <p className={styles.desc}>
                Since 2012, La Papel has been at the forefront of luxury styling. 
                We believe that a salon visit should be a transformative journey, 
                where world-class expertise meets uncompromising indulgence.
              </p>
            </div>
            <div className={styles.statsCol}>
              <div className={styles.statBox}>
                <span className={`${styles.statNum} gold-shimmer`}>12</span>
                <span className={styles.statLabel}>Years of Elegance</span>
              </div>
              <div className={styles.statBox}>
                <span className={`${styles.statNum} gold-shimmer`}>48</span>
                <span className={styles.statLabel}>Industry Awards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3 */}
        <div className={styles.panel}>
          <div className={styles.panelContent}>
            <div className={styles.accentShape3}></div>
            <span className={styles.label}>MEET OUR ARTISTS</span>
            <div className={styles.teamGrid}>
              {["Elena Rose", "Marcus Thorne", "Sophia Lin"].map((name, i) => (
                <div key={name} className={styles.teamCard}>
                  <div className={styles.avatarPlaceholder}>
                    {name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h4 className={styles.teamName}>{name}</h4>
                  <p className={styles.teamRole}>
                    {i === 0 ? "Master Stylist" : i === 1 ? "Lead Colorist" : "Bridal Specialist"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
