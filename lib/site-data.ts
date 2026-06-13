// ---------------------------------------------------------------------------
// withso site content — all copy lives here for easy iteration.
// ---------------------------------------------------------------------------

export type ProductIcon = "zeros" | "nammatn";

export type Product = {
  name: string;
  icon: ProductIcon;
  category: string;
  tag: string;
  description: string;
  href: string;
};

export const nav = {
  cta: { label: "Talk to us", href: "mailto:contact@withso.com" },
};

export const hero = {
  tagline: "We build software and AI for every kind of work.",
};

export const products: Product[] = [
  {
    name: "Zeros",
    icon: "zeros",
    category: "AI development",
    tag: "macOS app",
    description:
      "A native macOS workspace for running many AI coding agents in parallel — each isolated on its own branch, with an infinite canvas and a clean review-and-merge loop.",
    href: "https://zeros.build",
  },
  {
    name: "NammaTN",
    icon: "nammatn",
    category: "Civic technology",
    tag: "Free & open",
    description:
      "A free, open platform for Tamil Nadu — report local issues, track how the government responds, and see who governs your district.",
    href: "https://nammatn.in/welcome",
  },
];

// Used inside the NammaTN card preview.
export const nammatn = {
  cardTagline: ["Report civic issues.", "Track your government."],
  stats: [
    { value: "38", label: "districts" },
    { value: "Free", label: "always" },
    { value: "Open", label: "data" },
  ],
};

export const footer = {
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms of Service", href: "/legal/terms" },
  ],
};
