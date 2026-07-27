'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Variation {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  [key: string]: any;
}

interface ProductActionsProps {
  product: {
    id: number;
    name: string;
    price: number;
    regular_price?: number;
    sku: string;
    stock_quantity: number;
    variations?: Variation[];
    [key: string]: any;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  
  // প্রোডাক্টের ভেরিয়েশন আছে কিনা চেক করা
  const variations = Array.isArray(product.variations) ? product.variations : [];
  const hasVariations = variations.length > 0;

  // সিলেক্টেড ভেরিয়েশন স্টেট
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);

  const addToCart = (showNotification = true) => {
    // যদি ভেরিয়েশন থাকে কিন্তু ইউজার সিলেক্ট না করে
    if (hasVariations && !selectedVariation) {
      alert("দয়া করে প্রথমে প্রোডাক্টের ভেরিয়েশন (যেমন: Size/Color) সিলেক্ট করুন।");
      return false;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // ইউনিক কার্ট আইটেম আইডি তৈরি (যাতে ভিন্ন ভেরিয়েশন আলাদা আইটেম হিসেবে থাকে)
    const cartItemId = hasVariations 
      ? `${product.id}-${selectedVariation?.name || selectedVariation?.sku}` 
      : String(product.id);
    
    const existingItem = cart.find((item: any) => item.cartItemId === cartItemId);
    
    // ভেরিয়েশন অনুযায়ী প্রাইস নির্ধারণ
    const itemPrice = hasVariations && selectedVariation?.price 
      ? Number(selectedVariation.price) 
      : Number(product.regular_price || product.price || 0);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        cartItemId,
        selectedVariation: selectedVariation || null,
        regular_price: itemPrice, 
        price: itemPrice,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    
    if (showNotification) {
      alert("Product added to cart successfully! 🛒");
    }
    return true;
  };

  const buyNow = () => {
    const success = addToCart(false); // ভেরিয়েশন সিলেক্ট করা না থাকলে ফলস রিটার্ন করবে এবং থামিয়ে দেবে
    if (success) {
      router.push('/checkout');
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {/* যদি ভেরিয়েশন থাকে তবে বাটন দেখাবে */}
      {hasVariations && (
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Select Variation:</label>
          <div className="flex flex-wrap gap-2">
            {variations.map((v: Variation, index: number) => {
              const isSelected = selectedVariation === v;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedVariation(v)}
                  className={`px-4 py-2 border rounded-xl text-sm font-medium transition ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' 
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

      {/* প্রাইস ডিসপ্লে */}
      <div className="text-xl font-bold text-blue-600">
        ৳{selectedVariation?.price || product.regular_price || product.price}
      </div>

      {/* অ্যাকশন বাটন */}
      <div className="flex gap-4">
        <button 
          type="button" 
          onClick={() => addToCart(true)} 
          className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
        <button 
          type="button" 
          onClick={buyNow} 
          className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}