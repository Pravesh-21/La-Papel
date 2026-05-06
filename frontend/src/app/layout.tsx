import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import CustomCursor from "../components/CustomCursor";
import { BookingProvider } from "../context/BookingContext";
import BookingModal from "../components/BookingModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "La Papel Salon | Hair · Skin · Makeup",
  description:
    "A Family Salon by Paras. Transforming looks, creating confidence. Hair | Skin | Makeup in Nagpur.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="antialiased">
        {/* SVG Noise Overlay Filter */}
        <svg style={{ display: "none" }}>
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
        </svg>
        <div className="noise-overlay" style={{ filter: "url(#noiseFilter)" }} />

        <ClerkProvider>
          <BookingProvider>
            <CustomCursor />
            <SmoothScroll>
              <Navbar />
              {children}
              <Footer />
              <BookingModal />
            </SmoothScroll>
          </BookingProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
