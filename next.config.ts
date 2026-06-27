import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Next.js ১৬+ এ সাধারণত output: 'standalone' এবং বাকি কনফিগারেশনগুলো এভাবেই রাখা হয়।
  // তবে Turbopack-এর নতুন আপডেটে eslint/typescript অপশনগুলো সরাসরি এখানে সাপোর্ট নাও করতে পারে।
  output: 'standalone',
};

export default nextConfig;