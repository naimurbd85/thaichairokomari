import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// ফ্রন্টএন্ড/ক্লায়েন্ট কম্পোনেন্টের জন্য (আপনার আগের কোড)
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ব্যাকএন্ড/সার্ভার কম্পোনেন্টের জন্য (যা আমাদের প্রোডাক্ট ফর্মে লাগবে)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // এরর হ্যান্ডলিং
        }
      },
    },
  })
}