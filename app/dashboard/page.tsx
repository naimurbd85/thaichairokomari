// app/dashboard/page.tsx
import SharedAdminLayout from '../admin-layout';
import { ArrowUpRight, ShoppingBag, ClipboardList, Layers, Wallet } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/app/utils/supabase';

export default async function DashboardPage() {
  const supabase = createClient();

  // ১. Supabase থেকে রিয়েল ডেটা কাউন্ট বা ফেচ করা
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  // একাউন্ট ব্যালেন্স যদি কোনো টেবিল বা টোটাল থেকে হিসাব করতে চান (এখানে উদাহরণের জন্য 0 রাখা হয়েছে, আপনার টেবিল অনুযায়ী কুয়েরি করে নিতে পারেন)
  // const accountBalance = 50000; 

  // প্রফেশনাল স্ট্যাটাস কার্ডস (ডাইনামিক ভ্যালুসহ)
  const cards = [
    { 
      title: 'Total Products', 
      value: productCount !== null ? productCount.toLocaleString() : '0', 
      link: '/admin/products', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      icon: ShoppingBag 
    },
    { 
      title: 'Total Orders', 
      value: orderCount !== null ? orderCount.toLocaleString() : '0', 
      link: '/admin/orders', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      icon: ClipboardList 
    },
    { 
      title: 'Categories', 
      value: categoryCount !== null ? categoryCount.toLocaleString() : '0', 
      link: '/admin/categories', 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      icon: Layers 
    },
    { 
      title: 'Account Balance', 
      value: '৳ 50,000', // আপনার অ্যাকাউন্ট বা ট্রানজেকশন টেবিল থাকলে সেখান থেকে ডেটা এনে এখানে বসাতে পারেন
      link: '/admin/accounts', 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      icon: Wallet 
    },
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
    </SharedAdminLayout>
  );
}