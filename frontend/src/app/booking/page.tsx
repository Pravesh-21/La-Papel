import type { Metadata } from "next";
import BookingPage from "./BookingPage";

export const metadata: Metadata = {
  title: "Book Appointment | La Papel Salon & Spa",
  description: "Reserve your bespoke luxury salon experience at La Papel.",
};

export default function Page() {
  return <BookingPage />;
}
