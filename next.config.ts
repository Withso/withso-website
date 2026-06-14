import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a fully static site to `out/`,
  // which Cloudflare Pages serves directly from its CDN (no server runtime).
  output: "export",

  // Pin the workspace root so a stray lockfile in a parent dir can't
  // confuse Turbopack's root inference.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
