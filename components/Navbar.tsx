'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Next.js এর Image কম্পোনেন্ট امপোর্ট করা হলো

interface NavbarProps {
  onSearch?: (term: string) => void;
  showSearchAndCart?: boolean;
}

export default function Navbar({ onSearch, showSearchAndCart = true }: NavbarProps) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!showSearchAndCart) return;

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, [showSearchAndCart]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/">
          {/* টেক্সট হেডিং সরিয়ে এখানে লোগো ইমেজ বসানো হলো */}
          <div className="flex items-center">
            <Image 
              src="/logo.png" // public ফোল্ডারে রাখা লোগোর পাথ (আপনার ফাইলের নাম অনুযায়ী পরিবর্তন করে নিতে পারেন)
              alt="ThaiChi Rokomari Logo" 
              width={160} 
              height={45} 
              className="h-10 w-auto object-contain" 
              priority
            />
          </div>
        </Link>
        
        {/* যদি showSearchAndCart true হয় তবেই সার্চ বার ও কার্ট দেখাবে */}
        {showSearchAndCart ? (
          <>
            <div className="flex-1 max-w-lg">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full px-4 py-2 rounded-full border border-gray-300 outline-none focus:border-orange-500 text-sm" 
                onChange={(e) => onSearch?.(e.target.value)} 
              />
            </div>

            <div className="flex items-center gap-6 font-bold text-gray-700">
              <Link href="/" className="hover:text-orange-600 transition">Home</Link>
              <Link href="/cart" className="hover:text-orange-600 transition">Cart ({cartCount})</Link>
            </div>
          </>
        ) : (
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-orange-600 transition">
            ← Back to Shop
          </Link>
        )}
      </div>
    </nav>
  );
}