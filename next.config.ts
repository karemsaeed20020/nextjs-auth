/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.outletplus.sa",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "up.outletplus.sa",
        pathname: "/products/**", 
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'tse3.mm.bing.net',
        pathname: '/th/**',
      },
      // Add this new configuration for Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Also add source.unsplash.com if you're using those URLs
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
