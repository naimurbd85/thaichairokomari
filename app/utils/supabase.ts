import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  // বিল্ড টাইমে যদি Vercel ভেরিয়েবল রিড করতে নাও পারে, আমরা জোর করে একটি বৈধ URL ফরম্যাট দিয়ে রাখব
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}