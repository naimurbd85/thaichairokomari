// app/admin-layout.tsx
'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  ClipboardList, 
  Boxes, 
  Wallet, 
  LogOut 
} from 'lucide-react';

export default function SharedAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient(); // <--- এখানে supabase ডিক্লেয়ার করা হয়েছে

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  // লগআউট হ্যান্ডলার ফাংশন
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const configItems = [
    { name: 'Product Management', href: '/admin/products', icon: ShoppingBag },
    { name: 'Category Management', href: '/admin/categories', icon: Layers },
    { name: 'Order Management', href: '/admin/orders', icon: ClipboardList },
    { name: 'Inventory Management', href: '/admin/inventory', icon: Boxes },
    { name: 'Accounts Management', href: '/admin/accounts', icon: Wallet },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* বাম পাশের সাইডবার */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col z-20 shadow-xl">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-black tracking-wider text-emerald-400">
            THAICHI ROKOMARI
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-7 overflow-y-auto">
          <div>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Config
            </p>
            <div className="space-y-1">
              {configItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ডান পাশের মূল কন্টেন্ট এরিয়া */}
      <div className="pl-64 flex flex-col flex-1 w-full">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="font-extrabold tracking-tighter text-lg">
            <span className="text-orange-600">Thaichi</span> <span className="text-blue-600">Rokomari</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center text-sm shadow-inner">
              A
            </div>
            <div className="text-sm">
              <p className="font-medium text-slate-800 leading-none">Admin</p>
              <p className="text-xs text-slate-500 mt-1">Active Session</p>
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}