'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        {/* ব্র্যান্ড ব্যানার */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            THAICHI <span className="text-emerald-500">ROKOMARI</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2">Operational Admin Panel</p>
        </div>

        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl font-bold mt-6 transition duration-300 shadow-lg hover:shadow-xl active:scale-95"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}