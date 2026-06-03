import { createBrowserClient } from '@supabase/ssr'

// যদি এনভায়রনমেন্ট ভেরিয়েবল খালি থাকে, তবে বিল্ড টাইমে ক্র্যাশ এড়াতে একটি ডেমো ইউআরএল ব্যাকআপ হিসেবে দেওয়া হলো
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const createClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables are missing in this environment!");
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}