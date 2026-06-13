import type { Metadata } from "next";
import { DM_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "withso — We build software and AI for every kind of work.",
  description:
    "We create software and AI products across many industries, and help other teams build theirs — simple, reliable, and made with care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${dmMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
