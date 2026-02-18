import {type NextConfig} from "next";
import withBundleAnalyzer from "@next/bundle-analyzer"

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactCompiler: true,
  reactStrictMode: true,
  transpilePackages: ["@onyx/ui", "@onyx/tailwind-config"],
  sassOptions: {
    includePaths: ['node_modules']
  },
  experimental: {
    scrollRestoration: true,
    cssChunking: true,
    optimizeCss: true
  },
  images: {
    qualities: [1]
  }
};

const configWithAnalyzer = withBundleAnalyzer({
  enabled: true
})

export default configWithAnalyzer(nextConfig);
