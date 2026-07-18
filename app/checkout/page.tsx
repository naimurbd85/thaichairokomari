'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';

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

    // ১. অর্ডার টেবিলে ডাটা ইনসার্ট
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ ...formData, total_amount: totalAmount }])
      .select()
      .single();

    if (orderError) return alert("Error saving order");

    // ২. অর্ডার আইটেম টেবিলে ডাটা ইনসার্ট
    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.regular_price
    }));

    await supabase.from('order_items').insert(orderItems);

    // ৩. EmailJS দিয়ে নোটিফিকেশন পাঠানো
    const templateParams = {
      order_id: order.id,
      customer_name: formData.customer_name,
      contact_number: formData.contact_number,
      detailed_address: `${formData.detailed_address}, ${formData.thana}, ${formData.district}, ${formData.division}`,
      total_amount: totalAmount,
      orders: cart.map(item => `${item.name} (QTY: ${item.quantity})`).join(', ')
    };

    try {
      await emailjs.send(
        'service_chg15mr',      // আপনার সার্ভিস আইডি
        'YOUR_TEMPLATE_ID',     // আপনার টেমপ্লেট আইডি
        templateParams,
        'YOUR_PUBLIC_KEY'       // আপনার পাবলিক কি
      );
    } catch (error) {
      console.error("Email failed:", error);
    }

    // ৪. সাকসেসফুলি শেষ করা
    localStorage.removeItem('cart');
    alert("Order Placed Successfully!");
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
        <form onSubmit={handleOrderSubmit} className="space-y-3">
          <input name="customer_name" placeholder="Full Name" onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="w-full p-3 border rounded" required />
          <input name="contact_number" placeholder="Contact Number" onChange={(e) => setFormData({...formData, contact_number: e.target.value})} className="w-full p-3 border rounded" required />
          <input name="detailed_address" placeholder="Detailed Address" onChange={(e) => setFormData({...formData, detailed_address: e.target.value})} className="w-full p-3 border rounded" required />
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Division" onChange={(e) => setFormData({...formData, division: e.target.value})} className="p-3 border rounded" required />
            <input placeholder="District" onChange={(e) => setFormData({...formData, district: e.target.value})} className="p-3 border rounded" required />
            <input placeholder="Thana" onChange={(e) => setFormData({...formData, thana: e.target.value})} className="p-3 border rounded" required />
          </div>
          <button className="w-full bg-green-600 text-white py-3 rounded font-bold">Confirm Order (Total: ৳{totalAmount})</button>
        </form>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        {cart.map((item, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>৳{item.regular_price * item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}