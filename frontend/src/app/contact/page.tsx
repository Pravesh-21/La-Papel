import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact | La Papel Salon & Spa",
  description: "Get in touch with La Papel Salon & Spa. Book your luxury experience today.",
};

export default function Page() {
  return <ContactPage />;
}
