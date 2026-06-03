import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // ১. বিল্ড টাইমে (서버/Server-side) যদি ভেরিয়েবল কোনো কারণে মিসিং থাকে, 
  // তবে ক্র্যাশ বা এরর না দিয়ে একটি ফেক/প্লেসহোল্ডার ক্লায়েন্ট রিটার্ন করবে।
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
    console.warn("Supabase credentials are placeholders during build process.")
    return createBrowserClient(
      'https://placeholder-url.supabase.co', 
      'placeholder-anon-key'
    )
  }

  // ২. ব্রাউজারে বা রানটাইমে যখন আসল ভ্যালু থাকবে, তখন এটি পারফেক্টলি কাজ করবে।
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}