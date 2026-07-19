'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr'; // পরিবর্তন এখানে
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Supabase client তৈরি করুন
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    // ... আগের ফর্ম কোড একই থাকবে
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 font-bold">Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Sign In</button>
      </form>
    </div>
  );
}