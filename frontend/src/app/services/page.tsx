import type { Metadata } from "next";
import ServicesPage from "./ServicesPage";

export const metadata: Metadata = {
  title: "Services | La Papel Salon & Spa",
  description: "Explore our signature luxury services — hair styling, bridal makeup, spa wellness, and more.",
};

export default function Page() {
  return <ServicesPage />;
}
