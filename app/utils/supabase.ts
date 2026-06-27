import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// শুধুমাত্র ফ্রন্টএন্ড/ক্লায়েন্ট কম্পোনেন্টের জন্য
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}