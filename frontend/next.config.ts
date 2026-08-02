import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://127.0.0.1:8080'}/api/:path*`, // Proxy to Spring Boot Core Gateway (port 8080)
      },
    ];
  },
};

export default nextConfig;
