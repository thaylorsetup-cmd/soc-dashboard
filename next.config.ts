import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/soc-dashboard",
  async rewrites() {
    return [
      {
        source: "/api/soc/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://app.bbttransportes.com.br"}/api/soc/:path*`,
      },
    ];
  },
};

export default nextConfig;
