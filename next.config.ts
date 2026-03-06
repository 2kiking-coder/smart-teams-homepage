import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: isProd ? "/smart-teams-homepage" : "",
  assetPrefix: isProd ? "/smart-teams-homepage/" : "",
};

export default nextConfig;