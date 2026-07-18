'use client';
import { useState, useEffect } from 'react';

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
    window.dispatchEvent(new Event('storage')); // Navbar আপডেট করার জন্য
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.map(item => (
        <div key={item.id} className="flex items-center justify-between border-b py-4">
          <div>
            <h3 className="font-bold">{item.name}</h3>
            <p>৳{item.regular_price}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 border">-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 border">+</button>
            <button onClick={() => removeItem(item.id)} className="text-red-500 underline ml-4">Remove</button>
          </div>
        </div>
      ))}
      {cart.length > 0 ? (
        <a href="/checkout" className="block mt-6 bg-orange-600 text-white text-center py-3 rounded-lg font-bold">Proceed to Checkout</a>
      ) : <p>Cart is empty</p>}
    </div>
  );
}