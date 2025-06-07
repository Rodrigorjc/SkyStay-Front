import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cache.marriott.com", "multimedia.andalucia.org"], // Agrega los dominios permitidos
  },
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