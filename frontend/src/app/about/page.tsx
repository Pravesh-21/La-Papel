import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "About | La Papel Salon & Spa",
  description: "Discover the story, philosophy, and artists behind La Papel's decade of luxury excellence.",
};

export default function Page() {
  return <AboutPage />;
}
