'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase';
import SharedAdminLayout from '@/app/admin-layout';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminOrders() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // অর্ডার ডিটেইলস মোডালের জন্য স্টেট
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  };

  // অর্ডারের স্ট্যাটাস আপডেট করার ফাংশন (Confirmed / Cancelled / Pending)
  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('id', id);

    if (!error) {
      setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
    } else {
      alert("Failed to update status");
    }
  };

  // নির্দিষ্ট অর্ডারের পণ্যগুলো ফেচ করার ফাংশন
  const viewOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (data) setOrderItems(data);
    setIsModalOpen(true);
  };

  return (
    <SharedAdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Order Management</h1>
        
        {loading ? (
          <p className="text-slate-500">Loading orders...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider">
                  <th className="p-4 border-b">Customer</th>
                  <th className="p-4 border-b">Phone</th>
                  <th className="p-4 border-b">Address</th>
                  <th className="p-4 border-b">Total</th>
                  <th className="p-4 border-b">Status</th>
                  <th className="p-4 border-b">Date</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-medium text-slate-900">{order.customer_name}</td>
                    <td className="p-4 text-slate-600">{order.contact_number}</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{order.detailed_address}</td>
                    <td className="p-4 font-semibold text-emerald-600">৳{order.total_amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      {/* ডিটেইলস দেখার বাটন */}
                      <button 
                        onClick={() => viewOrderDetails(order)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {/* কনফার্ম বাটন */}
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                        title="Confirm Order"
                      >
                        <CheckCircle size={16} />
                      </button>
                      {/* ক্যানসেল বাটন */}
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Cancel Order"
                      >
                        <XCircle size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* অর্ডার ডিটেইলস মোডাল (Popup) */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <h2 className="text-xl font-bold mb-4 text-slate-800">Order Items Details</h2>
              <div className="mb-4 text-sm text-slate-600 space-y-1">
                <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Phone:</strong> {selectedOrder.contact_number}</p>
                <p><strong>Address:</strong> {selectedOrder.detailed_address}</p>
              </div>

              <div className="border-t border-b border-slate-100 py-3 max-h-60 overflow-y-auto space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">{item.product_name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-700">৳{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 pt-2 font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-emerald-600">৳{selectedOrder.total_amount}</span>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </SharedAdminLayout>
  );
}