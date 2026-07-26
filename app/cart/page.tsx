// app/cart/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (identifier: any, delta: number) => {
    const newCart = cart.map(item => {
      const uniqueKey = item.cartItemId || item.id;
      if (uniqueKey === identifier) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (identifier: any) => {
    const newCart = cart.filter(item => (item.cartItemId || item.id) !== identifier);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar showSearchAndCart={false} />
      <main className="max-w-4xl mx-auto w-full p-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        
        {cart.length > 0 ? (
          <>
            {cart.map((item, index) => {
              const uniqueKey = item.cartItemId || item.id || index;
              return (
                <div key={uniqueKey} className="flex items-center justify-between border-b bg-white p-4 rounded-xl mb-3 shadow-sm gap-4">
                  {/* প্রোডাক্ট ইমেজ ও নাম */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.images?.[0] || '/placeholder.png'} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      
                      {/* ভেরিয়েশন শো করার জন্য */}
                      {item.selectedVariation && (
                        <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mt-1">
                          Variant: {item.selectedVariation.name || item.selectedVariation.sku}
                        </p>
                      )}

                      <p className="text-orange-600 font-semibold mt-1">৳{Number(item.regular_price || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* কোয়ান্টিটি ও রিমুভ বাটন */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg bg-gray-50 overflow-hidden">
                      <button onClick={() => updateQuantity(uniqueKey, -1)} className="px-3 py-1 hover:bg-gray-200 transition font-bold">-</button>
                      <span className="px-3 font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(uniqueKey, 1)} className="px-3 py-1 hover:bg-gray-200 transition font-bold">+</button>
                    </div>
                    <button onClick={() => removeItem(uniqueKey)} className="text-red-500 hover:text-red-700 underline text-sm font-medium">Remove</button>
                  </div>
                </div>
              );
            })}

            <a href="/checkout" className="block mt-6 bg-orange-600 text-white text-center py-3.5 rounded-xl font-bold shadow-md hover:bg-orange-700 transition">
              Proceed to Checkout
            </a>
          </>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-lg font-medium">Your cart is empty</p>
            <a href="/" className="inline-block mt-4 bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition">
              Go to Shop
            </a>
          </div>
        )}
      </main>
    </div>
  );
}