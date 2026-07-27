'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Variation {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  image?: string;
  photo?: string;
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
    variations?: Variation[] | any;
    [key: string]: any;
  };
  onVariationSelect?: (variation: Variation) => void;
}

export default function ProductActions({ product, onVariationSelect }: ProductActionsProps) {
  const router = useRouter();
  
  const variations = Array.isArray(product.variations) ? product.variations : [];
  const hasVariations = variations.length > 0;

  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);

  // 👉 এই ফাংশনটি মিসিং থাকার কারণে টাইপ এররটি আসছিল
  const handleVariationClick = (v: Variation) => {
    setSelectedVariation(v);
    if (onVariationSelect) {
      onVariationSelect(v);
    }
  };

  const addToCart = (showNotification = true) => {
    if (hasVariations && !selectedVariation) {
      alert("দয়া করে প্রথমে প্রোডাক্টের ভেরিয়েশন (যেমন: Size/Color) সিলেক্ট করুন।");
      return false;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const cartItemId = hasVariations 
      ? `${product.id}-${selectedVariation?.name || selectedVariation?.sku}` 
      : String(product.id);
    
    const existingItem = cart.find((item: any) => item.cartItemId === cartItemId);
    
    const itemPrice = hasVariations && selectedVariation?.price !== undefined 
      ? Number(selectedVariation.price) 
      : Number(product.regular_price || product.price || 0);

    const finalImage = selectedVariation?.image || selectedVariation?.photo || (Array.isArray(product.images) ? product.images[0] : '');

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        cartItemId,
        selectedVariation: selectedVariation || null,
        regular_price: itemPrice, 
        price: itemPrice,
        quantity: 1,
        selectedImage: finalImage,
        image: finalImage
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
    const success = addToCart(false); 
    if (success) {
      router.push('/checkout');
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {hasVariations && (
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Select Variation:</label>
          <div className="flex flex-wrap gap-2">
            {variations.map((v: Variation, index: number) => {
              const isSelected = selectedVariation === v;
              const variantImg = v.image || v.photo;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleVariationClick(v)}
                  className={`px-3 py-2 border rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    isSelected 
                      ? 'border-orange-600 bg-orange-50 text-orange-600 shadow-sm' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {variantImg && (
                    <img 
                      src={variantImg} 
                      alt="" 
                      className="w-6 h-6 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span>{v.name || v.sku || `Variant ${index + 1}`}</span>
                  {v.price !== undefined ? ` (৳${v.price})` : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* প্রাইস ডিসপ্লে */}
      <div className="text-xl font-bold text-orange-600">
        ৳{selectedVariation?.price !== undefined ? selectedVariation.price : (product.regular_price || product.price)}
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