import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',

  // ইমেজ পারমিশন
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // devIndicators ডেভেলপমেন্ট মোডের জন্য, বিল্ড করার সময় এটি সরিয়ে ফেলুন
};

export default nextConfig;