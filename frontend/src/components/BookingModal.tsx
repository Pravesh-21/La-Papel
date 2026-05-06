"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { SignInButton, useUser } from "@clerk/nextjs";
import styles from "./BookingModal.module.css";

interface Service {
  id: number;
  title: string;
}

export default function BookingModal() {
  const { isModalOpen, closeModal } = useBooking();
  const { user } = useUser();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    date: "",
    time: "",
    serviceId: "",
  });

  // Pre-fill user data when they sign in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        clientName: user.fullName || prev.clientName,
        email: user.primaryEmailAddress?.emailAddress || prev.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isModalOpen) {
      // Fetch services for the dropdown
      fetch("http://localhost:3002/services")
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error("Failed to fetch services", err));
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3002/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          serviceId: parseInt(formData.serviceId),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          closeModal();
          setSuccess(false);
          setFormData({ clientName: "", email: "", date: "", time: "", serviceId: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Booking failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.overlay} ${isModalOpen ? styles.open : ""}`}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={closeModal}>
          <X size={24} />
        </button>

        {success ? (
          <div className={styles.successMessage}>
            <h3 className={styles.successTitle}>Appointment Confirmed</h3>
            <p className={styles.successText}>
              Thank you, {formData.clientName}! Your luxury session has been secured. We will email you the details shortly.
            </p>
          </div>
        ) : (
          <>
            <h2 className={`${styles.title} gold-shimmer`}>Book Session</h2>
            <p className={styles.subtitle}>Reserve your exclusive experience</p>

            {user ? (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    required
                    className={styles.input}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Select Service</label>
                  <select
                    required
                    className={styles.select}
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  >
                    <option value="" disabled>
                      Choose a service...
                    </option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Date</label>
                    <input
                      type="date"
                      required
                      className={styles.input}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Time</label>
                    <input
                      type="time"
                      required
                      className={styles.input}
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Confirming..." : "Confirm Booking"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontFamily: "var(--font-jost)" }}>
                  Please sign in or create an account to book your luxury session with La Papel.
                </p>
                <SignInButton mode="modal">
                  <button className={styles.submitBtn}>
                    Sign In to Book
                  </button>
                </SignInButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
