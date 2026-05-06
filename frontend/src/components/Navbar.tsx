"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import styles from "./Navbar.module.css";
import { gsap } from "gsap";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useBooking();
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        `.${styles.mobileMenu}`,
        { y: "-100%", opacity: 0, display: "none" },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", display: "flex" }
      );
    } else {
      gsap.to(`.${styles.mobileMenu}`, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => gsap.set(`.${styles.mobileMenu}`, { display: "none" }),
      });
    }
  }, [menuOpen]);

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.logoContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lapapel-logo.png"
            alt="La Papel Salon Logo"
            width={52}
            height={52}
            className={styles.logoImg}
          />
          <Link href="/" className={`${styles.logo} gold-shimmer`}>
            La Papel
          </Link>
        </div>

        <div className={styles.desktopLinks}>
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          {!user ? (
            <SignInButton mode="modal">
              <button className={styles.outlineBtn} style={{ marginRight: '1rem', border: '1px solid rgba(191, 95, 224, 0.3)', padding: '0.4rem 1rem', borderRadius: '50px', background: 'transparent', color: 'var(--cream)', cursor: 'pointer', fontFamily: 'var(--font-jost)' }}>
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
              <UserButton />
            </div>
          )}

          <button onClick={openModal} className={styles.bookBtn}>
            Book Now
          </button>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={28} color="var(--purple-light)" />
            ) : (
              <Menu size={28} color="var(--purple-light)" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={styles.mobileMenu}>
        <div className={styles.mobileLinks}>
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`${styles.mobileLink} ${pathname === href ? styles.mobileActive : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => {
              openModal();
              setMenuOpen(false);
            }}
            className={styles.mobileBookBtn}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </>
  );
}
