// app/dashboard/page.tsx
import SharedAdminLayout from '../admin-layout';
import { ArrowUpRight, ShoppingBag, ClipboardList, Layers, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // প্রফেশনাল স্ট্যাটাস কার্ডস
  const cards = [
    { title: 'Total Products', value: '120', link: '/admin/products', color: 'text-blue-600', bg: 'bg-blue-50', icon: ShoppingBag },
    { title: 'Total Orders', value: '45', link: '/admin/orders', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ClipboardList },
    { title: 'Categories', value: '12', link: '/admin/categories', color: 'text-purple-600', bg: 'bg-purple-50', icon: Layers },
    { title: 'Account Balance', value: '৳ 50,000', link: '/admin/accounts', color: 'text-amber-600', bg: 'bg-amber-50', icon: Wallet },
  ];

  return (
    <SharedAdminLayout>
      {/* হেডার সেকশন */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Manage your inventory and accounts here.</p>
      </div>

      {/* স্ট্যাটাস কার্ডস গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={22} />
                </div>
                <Link href={card.link} className="text-slate-400 hover:text-slate-600 transition">
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* কুইক অ্যাকশন সেকশন */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 text-lg mb-6">Quick Actions</h3>
        <div className="flex gap-4">
          <Link href="/admin/products" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition shadow-sm">
            Manage Inventory
          </Link>
          <Link href="/admin/orders" className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition">
            View Orders
          </Link>
        </div>
      </div>
    </SharedAdminLayout>
  );
}