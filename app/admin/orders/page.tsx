'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase';

export default function AdminOrders() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false }); // নতুন অর্ডার আগে দেখাবে

    if (data) setOrders(data);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      {loading ? <p>Loading...</p> : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Customer</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2">{order.full_name}</td>
                <td className="border p-2">{order.contact_number}</td>
                <td className="border p-2">{order.address}</td>
                <td className="border p-2">৳{order.total_amount}</td>
                <td className="border p-2">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}