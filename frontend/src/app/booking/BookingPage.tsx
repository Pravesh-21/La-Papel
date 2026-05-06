"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBooking } from "@/context/BookingContext";
import BookingCTA from "@/components/BookingCTA";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import PageHero from "@/components/PageHero";
import styles from "./BookingPage.module.css";

gsap.registerPlugin(ScrollTrigger);

// Expanding concentric ring particles
function RingParticles() {
  const groupRef = useRef<any>(null);
  const t = useRef(0);

  const rings = useMemo(() => {
    return [2, 3.2, 4.5, 5.8].map((radius) => {
      const count = Math.floor(radius * 40);
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        arr[i * 3]     = Math.cos(angle) * radius;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
        arr[i * 3 + 2] = Math.sin(angle) * radius;
      }
      return { arr, radius };
    });
  }, []);

  useFrame((_, delta) => {
    t.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y = t.current * 0.07;
      groupRef.current.rotation.x = Math.sin(t.current * 0.12) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map(({ arr }, i) => (
        <Points key={i} positions={arr} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#bf5fe0"
            size={0.04 + i * 0.01}
            sizeAttenuation
            depthWrite={false}
            opacity={0.7 - i * 0.1}
          />
        </Points>
      ))}
    </group>
  );
}

// Anime.js countdown timer to a "special offer" deadline
function CountdownBanner() {
  const daysRef = useRef<HTMLSpanElement>(null);
  const hoursRef = useRef<HTMLSpanElement>(null);
  const minsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7); // 7 days from now

    const tick = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      if (diff <= 0) return;
      if (daysRef.current)  daysRef.current.textContent  = String(Math.floor(diff / 86400000)).padStart(2, "0");
      if (hoursRef.current) hoursRef.current.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
      if (minsRef.current)  minsRef.current.textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    };

    tick();
    const id = setInterval(tick, 60000);

    // GSAP entrance pulse
    gsap.fromTo(`.${styles.countBanner}`,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: `.${styles.countBanner}`, start: "top 85%" } }
    );

    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.countBanner}>
      <p className={styles.countLabel}>EXCLUSIVE OFFER ENDS IN</p>
      <div className={styles.countTimers}>
        {[{ ref: daysRef, label: "Days" }, { ref: hoursRef, label: "Hours" }, { ref: minsRef, label: "Mins" }].map(({ ref, label }) => (
          <div key={label} className={styles.countUnit}>
            <span ref={ref} className={`${styles.countNum} gold-shimmer`}>00</span>
            <span className={styles.countUnitLabel}>{label}</span>
          </div>
        ))}
      </div>
      <p className={styles.countOffer}>15% off your first luxury session</p>
    </div>
  );
}

export default function BookingPage() {
  const { openModal } = useBooking();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-open booking modal on page load
    const timer = setTimeout(() => openModal(), 800);
    return () => clearTimeout(timer);
  }, [openModal]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.openModalCard}`, {
        scale: 0.92,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.5)",
        delay: 0.3,
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className={styles.page}>
      <div className={styles.bgCanvas}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <RingParticles />
        </Canvas>
      </div>

      <PageHero
        label="Reserve Your Experience"
        title="Book Appointment"
        subtitle="Choose your service. Meet your artist. Begin your transformation."
        breadcrumb={[{ label: "Booking", href: "/booking" }]}
      />

      {/* Countdown offer banner */}
      <section className={styles.countSection}>
        <CountdownBanner />
      </section>

      {/* Re-open modal card */}
      <section className={styles.openModalSection}>
        <div className={`glass-card ${styles.openModalCard}`}>
          <span className={styles.openModalIcon}>✦</span>
          <h2 className={styles.openModalTitle}>Ready to Begin?</h2>
          <p className={styles.openModalText}>
            Our booking system is open. Select your preferred service and artist.
          </p>
          <button onClick={openModal} className={styles.openModalBtn}>
            Open Booking Form
          </button>
        </div>
      </section>

      {/* Stats & Testimonials for social proof */}
      <Stats />
      <Testimonials />
      <BookingCTA />
    </main>
  );
}
