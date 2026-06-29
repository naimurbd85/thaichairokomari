import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',

  // ইমেজ পারমিশন যোগ করা
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // এটি দিলে যেকোনো HTTPS সোর্স থেকে ছবি লোড হতে পারবে
      },
    ],
  },
};

export default nextConfig;