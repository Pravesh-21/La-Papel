import type { Metadata } from "next";
import GalleryPage from "./GalleryPage";

export const metadata: Metadata = {
  title: "Gallery | La Papel Salon & Spa",
  description: "Browse our portfolio of stunning transformations and luxury editorial work.",
};

export default function Page() {
  return <GalleryPage />;
}
