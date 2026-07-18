'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar({ onSearch }: { onSearch?: (term: string) => void }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // কার্ট থেকে ডাটা নিয়ে সংখ্যা আপডেট করার লজিক
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/"><h1 className="text-2xl font-extrabold tracking-tighter">
          <span className="text-orange-600">Thaichi</span> <span className="text-blue-600">Rokomari</span>
        </h1></Link>
        
        <div className="flex-1 max-w-lg">
          <input type="text" placeholder="Search..." className="w-full px-4 py-2 rounded-full border border-gray-300 outline-none text-sm" onChange={(e) => onSearch?.(e.target.value)} />
        </div>

        <div className="flex gap-6 font-bold">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart ({cartCount})</Link>
        </div>
      </div>
    </nav>
  );
}