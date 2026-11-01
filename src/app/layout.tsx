import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polarrr — Make moments tangible",
  description: "Turn your favourite photos into little Polaroid-style keepsakes. Made in your browser.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
