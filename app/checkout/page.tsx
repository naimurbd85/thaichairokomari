'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import Navbar from '../../components/Navbar';

export default function CheckoutPage() {
  const supabase = createClient();
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customer_name: '', contact_number: '', email: '',
    division: '', district: '', thana: '', detailed_address: ''
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + (item.regular_price * item.quantity), 0);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ ...formData, total_amount: totalAmount }])
      .select()
      .single();

    if (orderError) return alert("Error saving order");

    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.regular_price
    }));

    await supabase.from('order_items').insert(orderItems);

    const templateParams = {
      order_id: order.id,
      customer_name: formData.customer_name,
      contact_number: formData.contact_number,
      detailed_address: `${formData.detailed_address}, ${formData.thana}, ${formData.district}, ${formData.division}`,
      total_amount: totalAmount,
      orders: cart.map(item => `${item.name} (QTY: ${item.quantity}) - ৳${item.regular_price * item.quantity}`).join('\n')
    };

    try {
      await emailjs.send(
        'service_chg15mr',      
        'template_2dv0c6l',    
        templateParams,
        'mKf2ckp72m_5OXExj'      
      );
    } catch (error) {
      console.error("Email failed:", error);
    }

    localStorage.removeItem('cart');
    alert("Order Placed Successfully!");
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onSearch={() => {}} />
      <main className="max-w-4xl mx-auto w-full p-6 grid md:grid-cols-2 gap-8 flex-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Shipping Details</h2>
          <form onSubmit={handleOrderSubmit} className="space-y-3">
            <input name="customer_name" placeholder="Full Name" onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500" required />
            <input name="contact_number" placeholder="Contact Number" onChange={(e) => setFormData({...formData, contact_number: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500" required />
            <input name="detailed_address" placeholder="Detailed Address (House/Road/Area)" onChange={(e) => setFormData({...formData, detailed_address: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:border-orange-500" required />
            <div className="grid grid-cols-3 gap-2">
              <input placeholder="Division" onChange={(e) => setFormData({...formData, division: e.target.value})} className="p-3 border rounded-xl outline-none focus:border-orange-500 text-sm" required />
              <input placeholder="District" onChange={(e) => setFormData({...formData, district: e.target.value})} className="p-3 border rounded-xl outline-none focus:border-orange-500 text-sm" required />
              <input placeholder="Thana" onChange={(e) => setFormData({...formData, thana: e.target.value})} className="p-3 border rounded-xl outline-none focus:border-orange-500 text-sm" required />
            </div>
            <button className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-green-700 transition mt-4">Confirm Order (Total: ৳{totalAmount})</button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 self-start">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b text-sm">
              <span className="text-gray-600">{item.name} x {item.quantity}</span>
              <span className="font-semibold">৳{item.regular_price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total:</span>
            <span className="text-orange-600">৳{totalAmount}</span>
          </div>
        </div>
      </main>
    </div>
  );
}