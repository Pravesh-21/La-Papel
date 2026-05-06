"use client";

import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBooking } from "../context/BookingContext";
import styles from "./Services.module.css";

interface ServiceItem {
  id: number;
  title: string;
  icon: string;
  description: string;
  price: string;
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { openModal } = useBooking();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3002/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch services", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || services.length === 0) return;

    // Initialize Vanilla Tilt
    cardsRef.current.forEach((card) => {
      if (card) {
        VanillaTilt.init(card, {
          max: 15,
          speed: 400,
          glare: true,
          "max-glare": 0.2,
        });
      }
    });

    // GSAP Scroll Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { 
          y: 100, 
          opacity: 0, 
          rotationY: 45, 
          transformPerspective: 1000 
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      cardsRef.current.forEach((card) => {
        if (card && (card as any).vanillaTilt) {
          (card as any).vanillaTilt.destroy();
        }
      });
    };
  }, [loading, services]);

  return (
    <section id="services" ref={sectionRef} className={styles.servicesSection}>
      <div className={styles.header}>
        <span className={styles.label}>EXPERIENCE LUXURY</span>
        <h2 className={`${styles.title} gold-shimmer`}>Our Signature Services</h2>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div style={{ textAlign: "center", color: "var(--accent)", padding: "2rem", gridColumn: "1 / -1" }}>
            Loading signature services...
          </div>
        ) : (
          services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`glass-card ${styles.card}`}
            >
              <div className={styles.icon}>{service.icon}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
              
              <div className={styles.cardFooter}>
                <span className={styles.price}>{service.price}</span>
                <button onClick={openModal} className={styles.bookBtn}>Book</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
