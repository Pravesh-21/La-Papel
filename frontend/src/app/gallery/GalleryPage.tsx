"use client";

import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/PageHero";
import styles from "./GalleryPage.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────
   Three.js helix ribbon
───────────────────────────── */
function RibbonParticles() {
  const ref = useRef<any>(null);
  const t = useRef(0);
  const positions = useMemo(() => {
    const count = 500;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle  = (i / count) * Math.PI * 12;
      const radius = 3 + Math.sin(i * 0.3) * 1.5;
      arr[i * 3]     = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (i / count - 0.5) * 14;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);
  useFrame((_, d) => { t.current += d; if (ref.current) ref.current.rotation.y = t.current * 0.07; });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#bf5fe0" size={0.05} sizeAttenuation depthWrite={false} opacity={0.45} />
    </Points>
  );
}

/* ─────────────────────────────
   Gallery Data
───────────────────────────── */
type GCat = "All" | "Hair" | "Makeup" | "Spa" | "Nails" | "Men's";

interface GItem {
  id: number;
  src: string;
  label: string;
  sub: string;
  category: GCat;
  span?: "tall" | "wide";
}

const items: GItem[] = [
  { id: 1,  src: "/gallery-1.jpg",  label: "Smoky Glam",        sub: "Editorial Makeup",     category: "Makeup",  span: "tall" },
  { id: 2,  src: "/gallery-2.jpg",  label: "Golden Balayage",   sub: "Hair Colouring",       category: "Hair" },
  { id: 3,  src: "/gallery-3.jpg",  label: "Fade Masterclass",  sub: "Men's Grooming",       category: "Men's" },
  { id: 4,  src: "/gallery-4.jpg",  label: "Bridal Updo",       sub: "Bridal Styling",       category: "Hair",    span: "tall" },
  { id: 5,  src: "/gallery-5.jpg",  label: "Gold Nail Art",     sub: "Nail Artistry",        category: "Nails" },
  { id: 6,  src: "/gallery-6.jpg",  label: "The Gentleman",     sub: "Classic Shave",        category: "Men's",   span: "tall" },
  { id: 7,  src: "/gallery-7.jpg",  label: "Spa Ritual",        sub: "Luxury Facial",        category: "Spa" },
  { id: 8,  src: "/gallery-8.jpg",  label: "Copper Ombré",      sub: "Vivid Hair Color",     category: "Hair" },
  { id: 9,  src: "/gallery-9.jpg",  label: "Slick & Sharp",     sub: "Men's Editorial",      category: "Men's" },
  { id: 10, src: "/gallery-10.jpg", label: "Party Glam",        sub: "Event Makeup",         category: "Makeup",  span: "tall" },
  { id: 11, src: "/gallery-11.jpg", label: "Pure Radiance",     sub: "Natural Glow",         category: "Spa" },
  /* ── New additions ── */
  { id: 12, src: "/gallery-12.jpg", label: "Signature Sleek",   sub: "Precision Styling",    category: "Hair",    span: "tall" },
  { id: 13, src: "/gallery-13.jpg", label: "Bridal Crown",      sub: "Bridal Makeup",        category: "Makeup" },
  { id: 14, src: "/gallery-14.jpg", label: "Serene Glow",       sub: "Spa & Wellness",       category: "Spa" },
  { id: 15, src: "/gallery-15.jpg", label: "Sharp & Refined",   sub: "Men's Barbering",      category: "Men's",   span: "tall" },
  { id: 16, src: "/gallery-16.jpg", label: "Crop & Edge",       sub: "Men's Texture Cut",    category: "Men's" },
  { id: 17, src: "/gallery-17.jpg", label: "Dark Allure",       sub: "Editorial Portrait",   category: "Makeup" },
];

const filterTabs: GCat[] = ["All", "Hair", "Makeup", "Spa", "Nails", "Men's"];

/* ─────────────────────────────
   Lightbox Component
───────────────────────────── */
function Lightbox({ item, onClose, onPrev, onNext }: {
  item: GItem; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  useEffect(() => {
    gsap.fromTo(`.${styles.lightboxInner}`, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.lightboxBg} onClick={onClose}>
      <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
        <button className={styles.lbClose} onClick={onClose}>✕</button>
        <button className={`${styles.lbArrow} ${styles.lbLeft}`} onClick={onPrev}>‹</button>
        <img src={item.src} alt={item.label} className={styles.lbImg} />
        <button className={`${styles.lbArrow} ${styles.lbRight}`} onClick={onNext}>›</button>
        <div className={styles.lbCaption}>
          <span className={styles.lbLabel}>{item.label}</span>
          <span className={styles.lbSub}>{item.sub}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   Main Gallery Page
───────────────────────────── */
export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<GCat>("All");
  const [animating, setAnimating] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filtered = items.filter((it) => activeFilter === "All" || it.category === activeFilter);

  /* Filter switch */
  const switchFilter = (cat: GCat) => {
    if (cat === activeFilter || animating) return;
    setAnimating(true);
    gsap.to(`.${styles.item}`, {
      y: 24, opacity: 0, scale: 0.95, duration: 0.28, stagger: 0.03,
      onComplete: () => { setActiveFilter(cat); setAnimating(false); },
    });
  };

  /* Animate in on filter change */
  useEffect(() => {
    gsap.fromTo(`.${styles.item}`,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.06, ease: "power3.out", delay: 0.05 }
    );
  }, [activeFilter]);

  /* Initial scroll reveal */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.item}`, {
        scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
        y: 70, opacity: 0, rotateX: 12, transformPerspective: 900,
        duration: 0.9, stagger: 0.07, ease: "power3.out",
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  /* Lightbox navigation */
  const lbItem = lightbox !== null ? filtered.find((it) => it.id === lightbox) ?? null : null;
  const lbIdx  = lbItem ? filtered.indexOf(lbItem) : -1;

  const lbPrev = useCallback(() => {
    if (lbIdx > 0) setLightbox(filtered[lbIdx - 1].id);
    else setLightbox(filtered[filtered.length - 1].id);
  }, [lbIdx, filtered]);

  const lbNext = useCallback(() => {
    if (lbIdx < filtered.length - 1) setLightbox(filtered[lbIdx + 1].id);
    else setLightbox(filtered[0].id);
  }, [lbIdx, filtered]);

  return (
    <main className={styles.page}>
      {/* Three.js */}
      <div className={styles.bgCanvas}>
        <Canvas camera={{ position: [0, 0, 9] }}><RibbonParticles /></Canvas>
      </div>

      <PageHero
        label="Portfolio"
        title="Artistry in Motion"
        subtitle="A curated collection of our most transformative editorial work."
        breadcrumb={[{ label: "Gallery", href: "/gallery" }]}
      />

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterTabs}>
          {filterTabs.map((cat) => (
            <button
              key={cat}
              className={`${styles.tab} ${activeFilter === cat ? styles.tabActive : ""}`}
              onClick={() => switchFilter(cat)}
            >
              {cat}
              {activeFilter === cat && <span className={styles.tabPill} />}
            </button>
          ))}
        </div>
        <span className={styles.count}>{filtered.length} works</span>
      </div>

      {/* Masonry Grid */}
      <div ref={gridRef} className={styles.masonry}>
        {filtered.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => { itemsRef.current[i] = el; }}
            className={`${styles.item} ${item.span === "tall" ? styles.tall : ""} ${item.span === "wide" ? styles.wide : ""}`}
            onClick={() => setLightbox(item.id)}
          >
            <img src={item.src} alt={item.label} className={styles.img} loading="lazy" />

            {/* Hover overlay */}
            <div className={styles.overlay}>
              <span className={styles.catBadge}>{item.category}</span>
              <div className={styles.overlayText}>
                <h3 className={styles.itemLabel}>{item.label}</h3>
                <p className={styles.itemSub}>{item.sub}</p>
              </div>
              <span className={styles.expandIcon}>↗</span>
            </div>

            {/* Shimmer sweep */}
            <div className={styles.shimmer} />

            {/* Corner accents */}
            <div className={styles.cornerTL} />
            <div className={styles.cornerBR} />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lbItem && (
        <Lightbox item={lbItem} onClose={() => setLightbox(null)} onPrev={lbPrev} onNext={lbNext} />
      )}
    </main>
  );
}
