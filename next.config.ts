import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify usa o runtime Next.js nativo; "standalone" é para Hostinger/VPS.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
