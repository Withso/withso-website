import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile in a parent dir can't
  // confuse Turbopack's root inference.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
