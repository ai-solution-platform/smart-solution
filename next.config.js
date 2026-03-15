/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Base path for GitHub Pages (repo name)
  basePath: '/smart-website',

  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  // Trailing slashes for static hosting compatibility
  trailingSlash: true,

  // Powered by header removal for security
  poweredByHeader: false,

  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

module.exports = nextConfig;
