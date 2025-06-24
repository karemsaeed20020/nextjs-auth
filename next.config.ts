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
    ],
  },
};

export default nextConfig;
