"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/PageHero";
import styles from "./AboutPage.module.css";

gsap.registerPlugin(ScrollTrigger);

// Expanding ring / galaxy particle system
function GalaxyParticles() {
  const ref = useRef<any>(null);
  const t = useRef(0);

  const positions = useMemo(() => {
    const count = 600;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * 5;
      const theta = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 0.8;
      arr[i * 3]     = Math.cos(theta) * r;
      arr[i * 3 + 1] = spread;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.rotation.y = t.current * 0.06;
      ref.current.rotation.x = Math.sin(t.current * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#bf5fe0" size={0.04} sizeAttenuation depthWrite={false} opacity={0.5} />
    </Points>
  );
}

const teamMembers = [
  { name: "Elena Rose", role: "Master Stylist", initials: "ER", exp: "14 yrs" },
  { name: "Marcus Thorne", role: "Lead Colorist", initials: "MT", exp: "10 yrs" },
  { name: "Sophia Lin", role: "Bridal Specialist", initials: "SL", exp: "8 yrs" },
  { name: "James Okafor", role: "Spa Director", initials: "JO", exp: "12 yrs" },
];

const milestones = [
  { year: "2012", event: "La Papel Founded in Manhattan" },
  { year: "2015", event: "First International Beauty Award" },
  { year: "2018", event: "Expanded to SoHo flagship studio" },
  { year: "2022", event: "50,000th client milestone" },
  { year: "2024", event: "Named #1 Luxury Salon in NYC" },
];

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline items animate in from alternating sides
      const milestoneEls = gsap.utils.toArray<HTMLElement>(`.${styles.milestone}`);
      milestoneEls.forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });

      // Team cards stagger
      gsap.from(cardsRef.current, {
        scrollTrigger: { trigger: teamRef.current, start: "top 80%" },
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.12,
        ease: "back.out(1.4)",
      });

      // Quote large text
      gsap.from(`.${styles.bigQuote}`, {
        scrollTrigger: { trigger: `.${styles.bigQuote}`, start: "top 80%" },
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power2.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className={styles.page}>
      <div className={styles.bgCanvas}>
        <Canvas camera={{ position: [0, 0, 7] }}>
          <GalaxyParticles />
        </Canvas>
      </div>

      <PageHero
        label="Our Story"
        title="A Decade of Excellence"
        subtitle="Redefining luxury beauty since 2012 with passion, precision, and artistry."
        breadcrumb={[{ label: "About", href: "/about" }]}
      />

      {/* Big Pull Quote */}
      <section className={styles.quoteSection}>
        <blockquote className={styles.bigQuote}>
          "True beauty is not about perfection, but about the artistry of enhancing what is naturally yours."
        </blockquote>
        <cite className={styles.quoteAuthor}>— Isabella Reyes, Founder</cite>
      </section>

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>MILESTONES</span>
          <h2 className={`${styles.sectionTitle} gold-shimmer`}>Our Journey</h2>
        </div>
        <div ref={timelineRef} className={styles.timeline}>
          <div className={styles.timelineLine}></div>
          {milestones.map((m, i) => (
            <div key={i} className={`${styles.milestone} ${i % 2 === 0 ? styles.left : styles.right}`}>
              <div className={styles.milestoneCard}>
                <span className={`${styles.milestoneYear} gold-shimmer`}>{m.year}</span>
                <p className={styles.milestoneEvent}>{m.event}</p>
              </div>
              <div className={styles.milestoneDot}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>THE ARTISTS</span>
          <h2 className={`${styles.sectionTitle} gold-shimmer`}>Meet Our Team</h2>
        </div>
        <div ref={teamRef} className={styles.teamGrid}>
          {teamMembers.map((member, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`glass-card ${styles.teamCard}`}
            >
              <div className={styles.avatarRing}>
                <div className={styles.avatar}>{member.initials}</div>
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
              <span className={styles.memberExp}>{member.exp} experience</span>
              <div className={styles.cardShine}></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
