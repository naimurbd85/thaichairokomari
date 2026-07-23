'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onSearch={() => {}} />
      <main className="max-w-4xl mx-auto w-full p-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b bg-white p-4 rounded-xl mb-3 shadow-sm">
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-orange-600 font-semibold">৳{item.regular_price}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 border rounded bg-gray-50">-</button>
              <span className="font-bold">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 border rounded bg-gray-50">+</button>
              <button onClick={() => removeItem(item.id)} className="text-red-500 underline ml-4 text-sm font-medium">Remove</button>
            </div>
          </div>
        ))}
        {cart.length > 0 ? (
          <a href="/checkout" className="block mt-6 bg-orange-600 text-white text-center py-3 rounded-xl font-bold shadow-md hover:bg-orange-700 transition">Proceed to Checkout</a>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm">
            <p className="text-lg">Your cart is empty</p>
            <a href="/" className="inline-block mt-4 bg-black text-white px-6 py-2.5 rounded-xl font-bold">Go to Shop</a>
          </div>
        )}
      </main>
    </div>
  );
}