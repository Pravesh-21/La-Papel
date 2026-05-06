"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/PageHero";
import styles from "./ContactPage.module.css";
import { MapPin, Clock, Phone, Mail, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Vortex / spiral particles
function VortexParticles() {
  const ref = useRef<any>(null);
  const t = useRef(0);

  const positions = useMemo(() => {
    const count = 400;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 20;
      const r = (i / count) * 5;
      arr[i * 3]     = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.rotation.y = t.current * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#bf5fe0" size={0.05} sizeAttenuation depthWrite={false} opacity={0.55} />
    </Points>
  );
}

type FormState = { name: string; email: string; phone: string; message: string };

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        scrollTrigger: { trigger: formRef.current, start: "top 80%" },
        x: -60, opacity: 0, duration: 1, ease: "power3.out",
      });
      gsap.from(infoRef.current, {
        scrollTrigger: { trigger: infoRef.current, start: "top 80%" },
        x: 60, opacity: 0, duration: 1, ease: "power3.out",
      });

      // Animate input labels with GSAP
      const inputs = formRef.current?.querySelectorAll("input, textarea");
      inputs?.forEach((input) => {
        input.addEventListener("focus", () => {
          gsap.to(input.previousElementSibling, { color: "var(--accent)", y: -2, duration: 0.3 });
        });
        input.addEventListener("blur", () => {
          gsap.to(input.previousElementSibling, { color: "var(--text-muted)", y: 0, duration: 0.3 });
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1600)); // simulate API call
    setSent(true);
    setSending(false);
    // Button success animation
    gsap.to(`.${styles.submitBtn}`, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1 });
  };

  const infoItems = [
    { Icon: MapPin, label: "Address", value: "124 Luxury Avenue, New York, NY 10001" },
    { Icon: Clock,  label: "Hours",   value: "Tue–Sun: 10AM – 8PM · Mon: Closed" },
    { Icon: Phone,  label: "Phone",   value: "+1 (212) 555-0199" },
    { Icon: Mail,   label: "Email",   value: "hello@lapapelsalon.com" },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.bgCanvas}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <VortexParticles />
        </Canvas>
      </div>

      <PageHero
        label="Get In Touch"
        title="Contact Us"
        subtitle="Reserve your bespoke experience or simply say hello."
        breadcrumb={[{ label: "Contact", href: "/contact" }]}
      />

      <div className={styles.contactGrid}>
        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.formTitle}>Send a Message</h2>

          {(["name", "email", "phone"] as const).map((field) => (
            <div key={field} className={styles.field}>
              <label className={styles.label} htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                value={form[field]}
                onChange={handleChange}
                className={styles.input}
                required={field !== "phone"}
                autoComplete="off"
              />
              <span className={styles.inputLine}></span>
            </div>
          ))}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className={`${styles.input} ${styles.textarea}`}
              required
            />
            <span className={styles.inputLine}></span>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={sent || sending}>
            {sent ? (
              <span>Message Sent ✓</span>
            ) : sending ? (
              <span className={styles.spinner}></span>
            ) : (
              <>
                <Send size={16} />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>

        {/* Info Panel */}
        <div ref={infoRef} className={styles.infoPanel}>
          <h2 className={styles.formTitle}>Find Us</h2>

          <div className={styles.infoList}>
            {infoItems.map(({ Icon, label, value }) => (
              <div key={label} className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <Icon size={18} color="var(--accent)" />
                </div>
                <div>
                  <span className={styles.infoLabel}>{label}</span>
                  <p className={styles.infoValue}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative map placeholder */}
          <div className={styles.mapBox}>
            <div className={styles.mapOverlay}>
              <MapPin size={32} color="var(--accent)" />
              <p>124 Luxury Avenue, NYC</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
