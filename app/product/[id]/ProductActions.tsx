// app/product/[id]/ProductActions.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductActions({ product }: { product: any }) {
  const router = useRouter();
  
  // প্রোডাক্টের ভেরিয়েশন আছে কিনা চেক করা
  const variations = Array.isArray(product.variations) ? product.variations : [];
  const hasVariations = variations.length > 0;

  // সিলেক্টেড ভেরিয়েশন স্টেট
  const [selectedVariation, setSelectedVariation] = useState<any>(null);

  const addToCart = (showNotification = true) => {
    // যদি ভেরিয়েশন থাকে কিন্তু ইউজার সিলেক্ট না করে
    if (hasVariations && !selectedVariation) {
      alert("দয়া করে প্রথমে প্রোডাক্টের ভেরিয়েশন (যেমন: Size/Color) সিলেক্ট করুন।");
      return false;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // কার্টে ইউনিক আইটেম হিসেবে রাখার জন্য আইডি + ভেরিয়েশন আইডি বা নাম মিলিয়ে চেক করা
    const cartItemId = hasVariations ? `${product.id}-${selectedVariation.name || selectedVariation.sku}` : product.id;
    
    const existingItem = cart.find((item: any) => item.cartItemId === cartItemId);
    
    // যদি ভেরিয়েশন সিলেক্টেড থাকে, তবে প্রাইস ভেরিয়েশন অনুযায়ী আপডেট হবে
    const itemPrice = hasVariations && selectedVariation.price ? Number(selectedVariation.price) : Number(product.regular_price || 0);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        cartItemId,
        selectedVariation: selectedVariation || null,
        regular_price: itemPrice, 
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    if (showNotification) {
      alert("Added to cart!");
    }
    return true;
  };

  const buyNow = () => {
    const success = addToCart(false); // ভেরিয়েশন সিলেক্ট করা না থাকলে ফলস রিটার্ন করবে
    if (success) {
      router.push('/checkout');
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {/* যদি ভেরিয়েশন থাকে তবে ড্রপডাউন বা বাটন দেখাবে */}
      {hasVariations && (
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Select Variation:</label>
          <div className="flex flex-wrap gap-2">
            {variations.map((v: any, index: number) => {
              const isSelected = selectedVariation === v;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedVariation(v)}
                  className={`px-4 py-2 border rounded-xl text-sm font-medium transition ${
                    isSelected 
                      ? 'border-orange-600 bg-orange-50 text-orange-600 shadow-sm' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {v.name || v.sku || `Variant ${index + 1}`} 
                  {v.price ? ` (৳${v.price})` : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* অ্যাকশন বাটন */}
      <div className="flex gap-4">
        <button onClick={() => addToCart()} className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition">
          Add to Cart
        </button>
        <button onClick={buyNow} className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition">
          Buy Now
        </button>
      </div>
    </div>
  );
}