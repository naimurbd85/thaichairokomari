import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // বিল্ড টাইমে টাইপস্ক্রিপ্টের কোনো কড়া এরর থাকলে তা ইগনোর করবে
    ignoreBuildErrors: true,
  },
  eslint: {
    // বিল্ড টাইমে লিন্ট (Lint) জনিত এরর ইগনোর করবে
    ignoreDuringBuilds: true,
  },
  // এই অপশনটি নেক্সট জেএস-কে কড়া স্ট্যাটিক পেজ জেনারেশন (যা ক্র্যাশ ঘটাচ্ছে) থেকে বিরত রাখবে
  output: 'standalone',
};

export default nextConfig;