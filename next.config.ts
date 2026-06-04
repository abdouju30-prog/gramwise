import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    };
    // Spline v4 only exports ESM subpaths — alias to the actual dist file
    config.resolve.alias = {
      ...config.resolve.alias,
      "@splinetool/react-spline/next": path.resolve(
        "node_modules/@splinetool/react-spline/dist/react-spline-next.js"
      ),
    };
    return config;
  },
};

export default nextConfig;
