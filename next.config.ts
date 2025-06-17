import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    domains: ["cache.marriott.com", "multimedia.andalucia.org", "wallpapers.com", "www.disfrutamadrid.com", "cf.bstatic.com", "unsplash.com", "plus.unsplash.com"],
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
