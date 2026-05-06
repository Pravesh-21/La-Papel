"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import styles from "./Testimonials.module.css";

const testimonialsData = [
  {
    name: "Victoria H.",
    quote: "An absolutely transformative experience. The attention to detail and level of luxury is unmatched.",
  },
  {
    name: "Samantha R.",
    quote: "I’ve never felt more beautiful. The bridal team was phenomenal and made my day truly special.",
  },
  {
    name: "Eleanor M.",
    quote: "The spa is a sanctuary. Every treatment feels like a masterclass in relaxation.",
  },
  {
    name: "Chloe D.",
    quote: "My go-to place for color. The expertise they bring to balayage is simply brilliant.",
  },
  {
    name: "Madison P.",
    quote: "A true luxury editorial experience from the moment you walk through the doors.",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.header}>
        <span className={styles.label}>CLIENT STORIES</span>
        <h2 className={`${styles.title} gold-shimmer`}>Words of Praise</h2>
      </div>

      <div className={styles.carouselWrapper}>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className={styles.swiperContainer}
        >
          {testimonialsData.map((t, index) => (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <div className={`glass-card ${styles.card}`}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.quote}>"{t.quote}"</p>
                
                <div className={styles.authorArea}>
                  <div className={styles.avatar}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.name}>{t.name}</h4>
                    <span className={styles.verified}>Verified Client</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
