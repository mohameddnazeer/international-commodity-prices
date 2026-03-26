import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min", "puppeteer"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "admin.prices.idsc.gov.eg",
        pathname: "/Upload/MainIndicator/Image/**",
      },
      {
        protocol: "https",
        hostname: "admin.prices.idsc.gov.eg",
        pathname: "/Upload/MainIndicator/Image/**",
      },
    ],
  },
};

export default nextConfig;
