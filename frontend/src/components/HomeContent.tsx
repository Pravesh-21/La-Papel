"use client";

import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useBooking } from "@/context/BookingContext";
import styles from "./HomeContent.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────
   Three.js: Ring expander for the "Ritual" section
────────────────────────────────────────── */
function RingCloud() {
  const ref = useRef<any>(null);
  const t = useRef(0);
  const positions = useMemo(() => {
    const count = 320;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 2.2 + Math.sin(i * 0.8) * 0.8;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);
  useFrame((_, d) => {
    t.current += d;
    if (ref.current) ref.current.rotation.y = t.current * 0.09;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#bf5fe0" size={0.055} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  );
}

/* ──────────────────────────────────────────
   Data
────────────────────────────────────────── */
const features = [
  { icon: "✦", num: "12", unit: "Years", label: "Of Luxury Excellence", desc: "Crafting bespoke transformations since 2012 with award-winning precision." },
  { icon: "◈", num: "48", unit: "Awards", label: "Industry Recognition", desc: "Celebrated globally for innovation and artistry in luxury beauty." },
  { icon: "◉", num: "5K+", unit: "Clients", label: "Transformed", desc: "Over five thousand satisfied clients who trust us with their beauty." },
  { icon: "⬡", num: "30", unit: "Artists", label: "Master Stylists", desc: "A handpicked team of world-class artists dedicated to perfection." },
];

const serviceCards = [
  {
    emoji: "✂️",
    title: "Hair Styling",
    desc: "Precision cuts and editorial styling techniques tailored to your unique features.",
    price: "From ₹1,200",
    gradient: "linear-gradient(135deg, #1c1409 0%, #2a1f16 100%)",
    accent: "#bf5fe0",
  },
  {
    emoji: "💍",
    title: "Bridal Makeup",
    desc: "A transformative, long-lasting bridal look crafted with luxury cosmetics.",
    price: "From ₹8,500",
    gradient: "linear-gradient(135deg, #1c1409 0%, #2a1006 100%)",
    accent: "#d4967a",
  },
  {
    emoji: "🌿",
    title: "Spa Rituals",
    desc: "Signature spa treatments that rejuvenate mind, body, and soul in pure luxury.",
    price: "From ₹2,800",
    gradient: "linear-gradient(135deg, #091c14 0%, #0c1a10 100%)",
    accent: "#8ab4a0",
  },
];

const rituals = [
  { step: "01", title: "Consultation", desc: "A private 1-on-1 session to understand your vision and curate the perfect treatment plan." },
  { step: "02", title: "Preparation", desc: "Your space is prepared with bespoke products selected specifically for your hair and skin type." },
  { step: "03", title: "Transformation", desc: "Our master stylists work their artistry with precision, passion, and world-class technique." },
  { step: "04", title: "Reveal", desc: "Experience your stunning new look and leave with the confidence of a true luxury editorial." },
];

const testimonials = [
  { name: "Victoria H.", role: "Bride 2024", quote: "An absolutely transformative experience. The attention to detail and level of luxury is completely unmatched anywhere in the city.", rating: 5 },
  { name: "Marcus D.", role: "Regular Client", quote: "Best men's grooming experience I've had. The slick-back they gave me had everyone at the party asking who did my hair.", rating: 5 },
  { name: "Samantha R.", role: "Bridal Client", quote: "My entire bridal party was handled flawlessly. The team is phenomenal and made my wedding day absolutely magical.", rating: 5 },
];

/* ──────────────────────────────────────────
   Main Component
────────────────────────────────────────── */
export default function HomeContent() {
  const { openModal } = useBooking();
  const statsRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ritualRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* 1 ── Stat counters roll up */
      [{ val: 12 }, { val: 48 }, { val: 5000 }, { val: 30 }].forEach((s, i) => {
        const el = countersRef.current[i];
        if (!el) return;
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const obj = { v: 0 };
            gsap.to(obj, {
              v: s.val, duration: 2.5, ease: "power2.out",
              onUpdate: () => {
                el.textContent = (s.val >= 1000)
                  ? Math.round(obj.v).toLocaleString() + "+"
                  : Math.round(obj.v) + (i === 2 ? "+" : "");
              },
            });
          },
        });
      });

      /* 2 ── Feature cards stagger in */
      gsap.from(cardsRef.current, {
        scrollTrigger: { trigger: cardsRef.current[0], start: "top 80%" },
        y: 80, opacity: 0, rotationY: 25, transformPerspective: 800,
        duration: 1, stagger: 0.15, ease: "power3.out",
      });

      /* 3 ── Ritual steps alternate slide */
      gsap.utils.toArray<HTMLElement>(`.${styles.ritualItem}`).forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          x: i % 2 === 0 ? -70 : 70, opacity: 0, duration: 0.9, ease: "power3.out",
        });
      });

      /* 4 ── Split section parallax text */
      gsap.from(`.${styles.splitText}`, {
        scrollTrigger: { trigger: splitRef.current, start: "top 75%" },
        y: 50, opacity: 0, duration: 1.2, ease: "power2.out",
      });
      gsap.from(`.${styles.splitImg}`, {
        scrollTrigger: { trigger: splitRef.current, start: "top 75%" },
        scale: 1.12, duration: 1.4, ease: "power2.out",
      });

      /* 5 ── Testimonials fade */
      gsap.from(`.${styles.testimCard}`, {
        scrollTrigger: { trigger: testimonialsRef.current, start: "top 80%" },
        y: 50, opacity: 0, duration: 0.9, stagger: 0.2, ease: "power3.out",
      });

      /* 6 ── CTA headline character reveal */
      gsap.from(`.${styles.ctaHeadline}`, {
        scrollTrigger: { trigger: `.${styles.ctaSection}`, start: "top 80%" },
        y: 60, opacity: 0, duration: 1.2, ease: "power3.out",
      });

    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.homeContent}>

      {/* ═══════════════════════════════════════
          SECTION 1 — Animated Stats Banner
      ═══════════════════════════════════════ */}
      <section ref={statsRef} className={styles.statsSection}>
        {features.map((f, i) => (
          <div key={i} className={styles.statBlock}>
            <span className={styles.statIcon}>{f.icon}</span>
            <div className={styles.statNumRow}>
              <span
                ref={(el) => { countersRef.current[i] = el; }}
                className={`${styles.statNum} gold-shimmer`}
              >
                0
              </span>
              <span className={styles.statUnit}>{f.unit}</span>
            </div>
            <span className={styles.statLabel}>{f.label}</span>
            <p className={styles.statDesc}>{f.desc}</p>
            {i < features.length - 1 && <div className={styles.statSep} />}
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — Featured Services Teaser
      ═══════════════════════════════════════ */}
      <section className={styles.servicesTeaser}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>WHAT WE OFFER</span>
          <h2 className={`${styles.sectionTitle} gold-shimmer`}>Signature Experiences</h2>
          <p className={styles.sectionSub}>Each service is a journey, not just an appointment.</p>
        </div>

        <div className={styles.serviceGrid}>
          {serviceCards.map((s, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`glass-card ${styles.serviceCard}`}
              style={{ "--card-accent": s.accent } as any}
            >
              <div className={styles.cardBg} style={{ background: s.gradient }} />
              <div className={styles.cardEmoji}>{s.emoji}</div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
              <div className={styles.cardFooter}>
                <span className={`${styles.cardPrice} gold-shimmer`}>{s.price}</span>
                <Link href="/services" className={styles.cardLink}>
                  Explore <span className={styles.arrow}>→</span>
                </Link>
              </div>
              <div className={styles.cardGlow} />
              <div className={styles.cardBorderAnim} />
            </div>
          ))}
        </div>
        <div>
          <span className={styles.sectionTag}>     
              <p>    
                  
              </p>
          </span>
        </div>
        <div className={styles.sectionCta}>
          <Link href="/services" className={styles.outlineBtn}>
            View All Services
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — Full-width Split Feature
      ═══════════════════════════════════════ */}
      <section ref={splitRef} className={styles.splitSection}>
        <div className={styles.splitImgWrap}>
          <img src="/hero-model.png" alt="La Papel Experience" className={styles.splitImg} />
          <div className={styles.splitImgOverlay} />
        </div>
        <div className={styles.splitText}>
          <span className={styles.sectionTag}>OUR PHILOSOPHY</span>
          <div className="gold-divider" style={{ width: "50px", margin: "1rem 0" }} />
          <h2 className={styles.splitHeading}>
            Beauty is an art.<br />
            <em className="gold-shimmer">We are the artists.</em>
          </h2>
          <p className={styles.splitBody}>
            At La Papel, we believe every client deserves a bespoke experience —
            not a template. Our master stylists study your features, lifestyle,
            and personality before a single scissor touches your hair.
          </p>
          <p className={styles.splitBody}>
            The result? A look that feels entirely, undeniably yours.
          </p>
          <button onClick={openModal} className={styles.splitBtn}>
            Book Your Consultation
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — The Ritual (Process Steps)
          with Three.js ring behind it
      ═══════════════════════════════════════ */}
      <section className={styles.ritualSection}>
        {/* Background Three.js ring */}
        <div className={styles.ritualCanvas}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <RingCloud />
          </Canvas>
        </div>

        <div className={styles.ritualInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTag}>THE EXPERIENCE</span>
            <h2 className={`${styles.sectionTitle} gold-shimmer`}>The La Papel Ritual</h2>
            <p className={styles.sectionSub}>Four steps to your most beautiful self.</p>
          </div>

          <div ref={ritualRef} className={styles.ritualGrid}>
            {rituals.map((r, i) => (
              <div key={i} className={`${styles.ritualItem} glass-card`}>
                <span className={`${styles.ritualStep} gold-shimmer`}>{r.step}</span>
                <h3 className={styles.ritualTitle}>{r.title}</h3>
                <p className={styles.ritualDesc}>{r.desc}</p>
                <div className={styles.ritualLine} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — Horizontal scrolling 
          Gallery Strip with Model Images
      ═══════════════════════════════════════ */}
      <section className={styles.galleryStrip}>
        <div className={styles.sectionHead} style={{ paddingTop: "5rem" }}>
          <span className={styles.sectionTag}>OUR WORK</span>
          <h2 className={`${styles.sectionTitle} gold-shimmer`}>From the Portfolio</h2>
          <p className={styles.sectionSub}>A glimpse into the transformations we create every day.</p>
        </div>

        {/* Scrolling marquee track */}
        <div className={styles.galleryTrack}>
          {[
            { img: "/gallery-1.jpg", label: "Hair Colour", num: "01" },
            { img: "/gallery-2.jpg", label: "Bridal Look", num: "02" },
            { img: "/gallery-3.jpg", label: "Styling", num: "03" },
            { img: "/gallery-4.jpg", label: "Skin Care", num: "04" },
            { img: "/gallery-5.jpg", label: "Makeup", num: "05" },
            { img: "/gallery-6.jpg", label: "Hair Cut", num: "06" },
            { img: "/gallery-7.jpg", label: "Glam Look", num: "07" },
            { img: "/gallery-8.jpg", label: "Spa", num: "08" },
            { img: "/gallery-9.jpg", label: "Colour", num: "09" },
            { img: "/gallery-10.jpg", label: "Editorial", num: "10" },
            /* duplicate for seamless loop */
            { img: "/gallery-1.jpg", label: "Hair Colour", num: "01" },
            { img: "/gallery-2.jpg", label: "Bridal Look", num: "02" },
            { img: "/gallery-3.jpg", label: "Styling", num: "03" },
            { img: "/gallery-4.jpg", label: "Skin Care", num: "04" },
            { img: "/gallery-5.jpg", label: "Makeup", num: "05" },
          ].map((item, i) => (
            <div key={i} className={styles.galleryThumb}>
              <img
                src={item.img}
                alt={item.label}
                className={styles.galleryThumbImg}
              />
              {/* Hover overlay */}
              <div className={styles.galleryThumbOverlay}>
                <span className={styles.galleryThumbLabel}>{item.label}</span>
              </div>
              <span className={styles.galleryNum}>{item.num}</span>
            </div>
          ))}
        </div>

        <div className={styles.galleryCaption}>
          <Link href="/gallery" className={styles.galleryLink}>
            View Full Portfolio <span>→</span>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6 — Testimonials
      ═══════════════════════════════════════ */}
      <section ref={testimonialsRef} className={styles.testimSection}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTag}>CLIENT STORIES</span>
          <h2 className={`${styles.sectionTitle} gold-shimmer`}>Words of Praise</h2>
        </div>

        <div className={styles.testimGrid}>
          {testimonials.map((t, i) => (
            <div key={i} className={`glass-card ${styles.testimCard}`}>
              <div className={styles.stars}>
                {"★".repeat(t.rating)}
              </div>
              <p className={styles.testimQuote}>"{t.quote}"</p>
              <div className={styles.testimAuthor}>
                <div className={styles.testimAvatar}>
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <strong className={styles.testimName}>{t.name}</strong>
                  <span className={styles.testimRole}>{t.role}</span>
                </div>
              </div>
              <div className={styles.testimShine} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 7 — Bold CTA Strip
      ═══════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaRings}>
          <div className={styles.ctaRing1} />
          <div className={styles.ctaRing2} />
          <div className={styles.ctaRing3} />
        </div>
        <div className={styles.ctaInner}>
          <span className={styles.ctaTag}>READY TO BEGIN?</span>
          <h2 className={`${styles.ctaHeadline} gold-shimmer`}>
            Your Transformation Awaits
          </h2>
          <p className={styles.ctaSub}>
            Join over 5,000 clients who experience La Papel's signature luxury.
            Book your exclusive appointment today.
          </p>
          <div className={styles.ctaBtns}>
            <button onClick={openModal} className={styles.ctaPrimary}>
              <span className={styles.btnInner}>Book Appointment</span>
              <span className={styles.btnShine} />
            </button>
            <Link href="/services" className={styles.ctaSecondary}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
