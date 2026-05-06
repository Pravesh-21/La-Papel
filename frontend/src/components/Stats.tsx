"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Stats.module.css";

const statsData = [
  { value: 5000, suffix: "+", label: "Clients" },
  { value: 12, suffix: " YRS", label: "Experience" },
  { value: 48, suffix: "", label: "Awards" },
  { value: 30, suffix: "", label: "Experts" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      countersRef.current.forEach((counter, i) => {
        if (!counter) return;

        const targetValue = statsData[i].value;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.to(counter, {
              innerHTML: targetValue,
              duration: 2.5,
              ease: "power3.out",
              snap: { innerHTML: 1 },
              onUpdate: function() {
                counter.innerHTML = Math.round(Number(this.targets()[0].innerHTML)).toString() + statsData[i].suffix;
              }
            });
          },
          once: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.statsBanner}>
      <div className={styles.container}>
        {statsData.map((stat, i) => (
          <div key={i} className={styles.statBlock}>
            <span
              ref={(el) => {
                countersRef.current[i] = el;
              }}
              className={styles.statNumber}
            >
              0{stat.suffix}
            </span>
            <span className={styles.statLabel}>{stat.label}</span>
            {i !== statsData.length - 1 && <div className={styles.separator}></div>}
          </div>
        ))}
      </div>
    </section>
  );
}
