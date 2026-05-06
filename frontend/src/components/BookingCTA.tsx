'use client';

import { useBooking } from "../context/BookingContext";
import styles from "./BookingCTA.module.css";

export default function BookingCTA() {
  const { openModal } = useBooking();
  return (
    <section id="book" className={styles.ctaSection}>
      <div className={styles.glowBg}></div>
      
      {/* Floating Rings */}
      <div className={`${styles.ring} ${styles.ring1}`}></div>
      <div className={`${styles.ring} ${styles.ring2}`}></div>
      <div className={`${styles.ring} ${styles.ring3}`}></div>

      <div className={styles.content}>
        <h2 className={`${styles.title} gold-shimmer`}>
          Ready for Your Transformation?
        </h2>
        <p className={styles.subtext}>
          Secure your appointment today and step into a world of bespoke luxury. 
          Our experts are waiting to curate your perfect look.
        </p>
        
        <button onClick={openModal} className={styles.ctaBtn}>
          <span className={styles.btnText}>Book Your Session</span>
        </button>
      </div>
    </section>
  );
}
