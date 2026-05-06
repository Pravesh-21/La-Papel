"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import Link from "next/link";
import { useBooking } from "../context/BookingContext";
import styles from "./Hero.module.css";

/* ─────────────────────────────────────────
   Three.js: ambient floating purple-pink dust
───────────────────────────────────────── */
function PurpleDust() {
  const ref = useRef<any>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300 * 3; i++) arr[i] = (Math.random() - 0.5) * 16;
    return arr;
  }, []);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.025;
      ref.current.rotation.x += d * 0.012;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#bf5fe0" size={0.03} sizeAttenuation depthWrite={false} opacity={0.55} />
    </Points>
  );
}

/* ─────────────────────────────────────────
   Slide data
───────────────────────────────────────── */
const slides = [
  {
    image: "/hero-slide-1.png",
    tag: "SIGNATURE STYLING",
    heading: ["Where Beauty", "Meets Artistry"],
    sub: "World-class precision. Bespoke transformations crafted exclusively for you.",
    cta: "Book Appointment",
    ctaHref: "/booking",
  },
  {
    image: "/hero-slide-2.png",
    tag: "BRIDAL COLLECTION",
    heading: ["Your Perfect", "Bridal Look"],
    sub: "Our award-winning bridal team creates timeless elegance for your special day.",
    cta: "Explore Bridal",
    ctaHref: "/services",
  },
  {
    image: "/hero-slide-3.png",
    tag: "SPA & WELLNESS",
    heading: ["Indulge in", "Pure Luxury"],
    sub: "Rejuvenate mind, body and soul with our signature spa rituals.",
    cta: "View Services",
    ctaHref: "/services",
  },
  {
    image: "/hero-slide-4.png",
    tag: "MEN'S GROOMING",
    heading: ["Refined Style,", "Defined You"],
    sub: "Precision cuts, expert grooming, and bespoke styling crafted for the modern gentleman.",
    cta: "Men's Services",
    ctaHref: "/services",
  },
  {
    image: "/hero-slide-5.png",
    tag: "EXPERT HAIRCUTS",
    heading: ["Sharp Cuts,", "Sharper Edge"],
    sub: "From classic fades to modern textures — our master stylists deliver perfection every time.",
    cta: "Book a Cut",
    ctaHref: "/booking",
  },
];

const SLIDE_DURATION = 5500;

/* ─────────────────────────────────────────
   Hero Component
───────────────────────────────────────── */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const { openModal } = useBooking();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  /* ── Slide change logic ── */
  const goTo = useCallback(
    (next: number) => {
      if (animating || next === current) return;
      setAnimating(true);
      setPrev(current);
      setCurrent(next);

      // Animate text out → in
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.3 }
        );
      }
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 900);
    },
    [animating, current]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev2 = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  /* ── Auto-advance ── */
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, SLIDE_DURATION);
  }, [next]);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);


  /* ── Initial text entrance ── */
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.5 }
      );
    }
  }, []);

  const slide = slides[current];

  return (
    <section className={styles.hero}>
      {/* ── Three.js ambient dust ── */}
      <div className={styles.dustCanvas}>
        <Canvas camera={{ position: [0, 0, 7] }}>
          <PurpleDust />
        </Canvas>
      </div>

      {/* ── Slide images ── */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === current ? styles.slideActive : ""} ${i === prev ? styles.slidePrev : ""}`}
          aria-hidden={i !== current}
        >
          <img src={s.image} alt="" className={styles.slideImg} />
          {/* Gradient overlays */}
          <div className={styles.gradLeft}></div>
          <div className={styles.gradBottom}></div>
          <div className={styles.gradRight}></div>
        </div>
      ))}

      {/* ── Content ── */}
      <div className={styles.content}>
        <div ref={textRef} className={styles.textWrap}>
          {/* Tag */}
          <span className={styles.tag}>
            <span className={styles.tagLine}></span>
            {slide.tag}
            <span className={styles.tagLine}></span>
          </span>

          {/* Heading */}
          <h1 className={styles.heading}>
            {slide.heading.map((line, i) => (
              <span key={i} className={`${styles.headLine} ${i === 1 ? "gold-shimmer" : ""}`}>
                {line}
              </span>
            ))}
          </h1>

          {/* Sub */}
          <p className={styles.sub}>{slide.sub}</p>

          {/* CTAs */}
          <div className={styles.ctas}>
            <Link href={slide.ctaHref} className={styles.primaryBtn}>
              <span className={styles.btnInner}>{slide.cta}</span>
              <span className={styles.btnShine}></span>
            </Link>
            <button onClick={openModal} className={styles.secondaryBtn}>
              Book Now
            </button>
          </div>
        </div>

      </div>

      {/* ── Side thumbnails (Lakme-style) ── */}
      <div className={styles.thumbStrip}>
        {slides.map((s, i) => (
          <button
            key={i}
            className={`${styles.thumb} ${i === current ? styles.thumbActive : ""}`}
            onClick={() => { goTo(i); startInterval(); }}
            aria-label={`Go to slide ${i + 1}`}
          >
            <img src={s.image} alt="" className={styles.thumbImg} />
            <span className={styles.thumbNum}>{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {/* ── Nav arrows ── */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => { prev2(); startInterval(); }} aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => { next(); startInterval(); }} aria-label="Next slide">
        <svg viewBox ="0 0 24 24m" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>


      {/* ── Dot indicators ── */}
      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => { goTo(i); startInterval(); }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Scroll hint ── */}
      <div className={styles.scrollHint}>
        <span className={styles.scrollLine}></span>
        <span className={styles.scrollText}>Scroll</span>
      </div>
    </section>
  );
}
