import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const pagesBasePath = process.env.GITHUB_PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  // GitHub Pages only serves static files. Keep normal Next.js deployments
  // unchanged while allowing the Pages workflow to produce an export in /out.
  ...(githubPages ? {
    output: "export" as const,
    basePath: pagesBasePath,
    assetPrefix: pagesBasePath,
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  },
};

export default nextConfig;
