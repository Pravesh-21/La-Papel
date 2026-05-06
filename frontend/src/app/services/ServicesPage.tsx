"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VanillaTilt from "vanilla-tilt";
import { useBooking } from "@/context/BookingContext";
import PageHero from "@/components/PageHero";
import styles from "./ServicesPage.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────
   Three.js background
───────────────────────────── */
function ServiceParticles() {
  const ref = useRef<any>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(350 * 3);
    for (let i = 0; i < 350 * 3; i++) arr[i] = (Math.random() - 0.5) * 20;
    return arr;
  }, []);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.035;
      ref.current.rotation.x += d * 0.012;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#bf5fe0" size={0.038} sizeAttenuation depthWrite={false} opacity={0.3} />
    </Points>
  );
}

/* ─────────────────────────────
   Service Data
───────────────────────────── */
const categories = ["All", "Hair", "Makeup", "Skin & Spa", "Nails", "Men's"] as const;
type Category = typeof categories[number];

interface Service {
  id: number;
  category: Category;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

const services: Service[] = [
  /* HAIR */
  {
    id: 1, category: "Hair", icon: "✂️",
    title: "Precision Haircut",
    tagline: "Sculpted to perfection",
    description: "A bespoke cut engineered for your face shape, hair texture, and lifestyle. Our master stylists consult extensively before a single snip.",
    tags: ["Signature Cut", "Blowdry Finish", "Style Consultation"],
    featured: true,
  },
  {
    id: 2, category: "Hair", icon: "🎨",
    title: "Balayage & Color",
    tagline: "Effortless dimensional colour",
    description: "Hand-painted highlights and full-spectrum colour services using premium European pigments for radiant, long-lasting results.",
    tags: ["Balayage", "Full Color", "Toning & Gloss"],
  },
  {
    id: 3, category: "Hair", icon: "🌊",
    title: "Hair Spa Treatment",
    tagline: "Deep restoration ritual",
    description: "An intensive treatment journey that rebuilds bonds, restores moisture, and delivers mirror-like shine to every strand.",
    tags: ["Keratin Ritual", "Scalp Therapy", "Bond Repair"],
  },
  {
    id: 4, category: "Hair", icon: "👸",
    title: "Hair Extensions",
    tagline: "Instant length & volume",
    description: "Premium Remy hair extensions seamlessly blended with your natural hair for breathtaking length, body, and drama.",
    tags: ["Tape-In", "Nano Rings", "Clip-In"],
  },
  {
    id: 5, category: "Hair", icon: "🔥",
    title: "Smoothing & Texture",
    tagline: "Frizz-free, flawless",
    description: "From Brazilian blowouts to keratin smoothing — eliminate frizz and achieve salon-straight perfection for months at a time.",
    tags: ["Keratin", "Brazilian Blowout", "Relaxer"],
  },

  /* MAKEUP */
  {
    id: 6, category: "Makeup", icon: "💍",
    title: "Bridal Makeup",
    tagline: "Your most beautiful day",
    description: "An immersive bridal consultation and application experience crafted to make you look and feel extraordinary from ceremony to after-party.",
    tags: ["Airbrush", "HD Makeup", "Trial Session"],
    featured: true,
  },
  {
    id: 7, category: "Makeup", icon: "✨",
    title: "Party & Event Makeup",
    tagline: "Steal every glance",
    description: "Glamorous looks for galas, receptions, and special occasions — long-wearing formulas that photograph flawlessly under every light.",
    tags: ["Glam", "Editorial", "Soft Glam"],
  },
  {
    id: 8, category: "Makeup", icon: "🎬",
    title: "Editorial & Shoot",
    tagline: "Camera-ready artistry",
    description: "High-fashion editorial and photoshoot makeup services crafted by our senior makeup artists for maximum visual impact.",
    tags: ["Fashion Shoots", "Portrait", "Commercial"],
  },

  /* SKIN & SPA */
  {
    id: 9, category: "Skin & Spa", icon: "🌿",
    title: "Luxury Facial",
    tagline: "Glow from within",
    description: "A tailored facial journey using premium skincare actives — cleansing, exfoliation, mask, and facial massage for transformative results.",
    tags: ["Hydrating", "Anti-Aging", "Brightening"],
    featured: true,
  },
  {
    id: 10, category: "Skin & Spa", icon: "💆",
    title: "Spa Body Ritual",
    tagline: "Total body indulgence",
    description: "A full-body spa experience: exfoliation scrub, wrap, and oil massage using signature La Papel blends for ultimate relaxation.",
    tags: ["Body Wrap", "Scrub", "Hot Stone"],
  },
  {
    id: 11, category: "Skin & Spa", icon: "🌸",
    title: "Advanced Skin Treatments",
    tagline: "Clinical-grade results",
    description: "Microneedling, chemical peels, and advanced actives-based treatments delivered by certified aestheticians for visible rejuvenation.",
    tags: ["Microneedling", "Peels", "Acne Care"],
  },

  /* NAILS */
  {
    id: 12, category: "Nails", icon: "💅",
    title: "Nail Art & Design",
    tagline: "Fingertips as canvas",
    description: "From minimal nude sets to elaborate 3D nail art — our nail artists craft miniature masterpieces with premium gel and acrylic systems.",
    tags: ["Gel", "Acrylic", "3D Art"],
    featured: true,
  },
  {
    id: 13, category: "Nails", icon: "🪷",
    title: "Manicure & Pedicure",
    tagline: "Hands & feet perfected",
    description: "Luxurious nail and cuticle care paired with a relaxing hand and foot massage, finished with a polish of your choice.",
    tags: ["Classic", "Spa Mani", "Gel Polish"],
  },

  /* MEN'S */
  {
    id: 14, category: "Men's", icon: "🪒",
    title: "Classic Shave & Groom",
    tagline: "The gentleman's ritual",
    description: "A traditional hot-towel straight-razor shave paired with a beard shape-up and skin treatment for the refined gentleman.",
    tags: ["Hot Towel", "Beard Shape", "Skin Care"],
    featured: true,
  },
  {
    id: 15, category: "Men's", icon: "💈",
    title: "Men's Haircut & Style",
    tagline: "Sharp. Defined. You.",
    description: "From textured crops to classic tapers — precision cuts for every style preference, finished with expert product styling.",
    tags: ["Fade", "Taper", "Texture Crop"],
  },
  {
    id: 16, category: "Men's", icon: "🧴",
    title: "Men's Skin Treatment",
    tagline: "Skincare built for men",
    description: "A targeted facial designed for men's skin — deep cleanse, sebum control, and hydration therapy for a refreshed, clear complexion.",
    tags: ["Deep Cleanse", "Hydration", "Anti-Acne"],
  },
];

/* ─────────────────────────────
   Component
───────────────────────────── */
export default function ServicesPage() {
  const { openModal } = useBooking();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [animating, setAnimating] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filtered = services.filter(
    (s) => activeCategory === "All" || s.category === activeCategory
  );

  /* Filter tab switch animation */
  const switchCategory = (cat: Category) => {
    if (cat === activeCategory || animating) return;
    setAnimating(true);
    gsap.to(`.${styles.card}`, {
      y: 20, opacity: 0, duration: 0.3, stagger: 0.03,
      onComplete: () => {
        setActiveCategory(cat);
        setAnimating(false);
      },
    });
  };

  /* Animate cards in after filter change */
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      `.${styles.card}`,
      { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.07, ease: "power3.out", delay: 0.05 }
    );
  }, [activeCategory]);

  /* VanillaTilt on visible cards */
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    cards.forEach((card) => {
      VanillaTilt.init(card, { max: 8, speed: 400, glare: true, "max-glare": 0.1, scale: 1.02 });
    });
    return () => {
      cards.forEach((c) => { if ((c as any).vanillaTilt) (c as any).vanillaTilt.destroy(); });
    };
  }, [filtered]);

  return (
    <main className={styles.page}>
      {/* Three.js canvas */}
      <div className={styles.bgCanvas}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ServiceParticles />
        </Canvas>
      </div>

      <PageHero
        label="Experience Luxury"
        title="Our Services"
        subtitle="Every treatment is a bespoke ritual, curated for you alone."
        breadcrumb={[{ label: "Services", href: "/services" }]}
      />

      {/* ── Category Filter Tabs ── */}
      <div className={styles.filterWrap}>
        <div className={styles.filterTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ""}`}
              onClick={() => switchCategory(cat)}
            >
              {cat}
              {activeCategory === cat && <span className={styles.tabPill} />}
            </button>
          ))}
        </div>
        <span className={styles.filterCount}>{filtered.length} services</span>
      </div>

      {/* ── Services Grid ── */}
      <div ref={gridRef} className={styles.grid}>
        {filtered.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => { cardsRef.current[i] = el; }}
            className={`glass-card ${styles.card} ${service.featured ? styles.featured : ""}`}
          >
            {service.featured && (
              <span className={styles.featuredBadge}>✦ Featured</span>
            )}

            {/* Icon */}
            <div className={styles.iconWrap}>
              <span className={styles.icon}>{service.icon}</span>
              <div className={styles.iconRing} />
            </div>

            {/* Category chip */}
            <span className={styles.categoryChip}>{service.category}</span>

            {/* Text */}
            <h3 className={styles.cardTitle}>{service.title}</h3>
            <p className={styles.cardTagline}>{service.tagline}</p>
            <p className={styles.cardDesc}>{service.description}</p>

            {/* Tags */}
            <div className={styles.tagList}>
              {service.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>

            {/* CTA */}
            <button onClick={openModal} className={styles.bookBtn}>
              <span>Book This Service</span>
              <span className={styles.btnArrow}>→</span>
            </button>

            {/* Decorative */}
            <div className={styles.cardCornerTL} />
            <div className={styles.cardCornerBR} />
            <div className={styles.cardLine} />
            <div className={styles.cardGlow} />
          </div>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className={styles.bottomCta}>
        <p className={styles.bottomText}>Can't find what you're looking for?</p>
        <button onClick={openModal} className={styles.bottomBtn}>
          Request a Custom Service
        </button>
      </div>
    </main>
  );
}
