'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase' // আপনার প্রজেক্ট অনুযায়ী utils এর পাথ ঠিক রাখুন

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting to login with Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile?.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
      }
    } catch (err: any) {
      console.error("Caught login crash:", err)
      setError(err.message || "নেটওয়ার্ক কানেকশন ফেইল হয়েছে। অনুগ্রহ করে ইন্টারনেট বা API URL চেক করুন।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">লগইন করুন</h2>
        
        {error && (
          <p className="text-sm text-red-500 bg-red-50 p-2 rounded text-center">
            {error}
          </p>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ইমেইল অ্যাড্রেস</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 text-black"
              placeholder="example@mail.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 text-black"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-2.5 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? 'লোডিং...' : 'সাইন ইন'}
          </button>
        </form>
      </div>
    </div>
  )
}