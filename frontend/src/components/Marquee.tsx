import styles from "./Marquee.module.css";

export default function Marquee() {
  const text = "HAIR STYLING ✦ BRIDAL MAKEUP ✦ NAIL ART ✦ SPA & WELLNESS ✦ ";

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent}>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
