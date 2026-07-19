import Link from 'next/link';

export default function DashboardPage() {
  // প্রফেশনাল কার্ডগুলোর ডেটা
  const stats = [
    { title: 'Total Products', value: '120', link: '/admin/products', color: 'bg-blue-500' },
    { title: 'Total Orders', value: '45', link: '/admin/orders', color: 'bg-green-500' },
    { title: 'Categories', value: '12', link: '/admin/categories', color: 'bg-purple-500' },
    { title: 'Account Balance', value: '৳ 50,000', link: '#', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* হেডার */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back! Manage your inventory and accounts here.</p>
      </header>

      {/* স্ট্যাটাস কার্ডস */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link href={stat.link} key={index} className={`${stat.color} p-6 rounded-2xl text-white shadow-lg hover:opacity-90 transition`}>
            <h3 className="text-lg opacity-80">{stat.title}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* কুইক অ্যাকশন বা নেভিগেশন */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/admin/products" className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition">
            Manage Inventory
          </Link>
          <Link href="/admin/orders" className="px-6 py-3 bg-gray-200 text-black rounded-xl font-semibold hover:bg-gray-300 transition">
            View Orders
          </Link>
        </div>
      </section>
    </div>
  );
}