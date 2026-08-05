'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Variation {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  image?: string | null;
  photo?: string | null;
  sellingPrice?: number;
  color?: string;
  type?: string;
  [key: string]: any;
}

interface ProductActionsProps {
  product: {
    id: number;
    name: string;
    price: number | string;
    regular_price?: number | string;
    sku: string;
    stock_quantity: number;
    variations?: any;
    [key: string]: any;
  };
  onVariationSelect?: (variation: Variation) => void;
  hidePrice?: boolean; // ডানপাশের কম্পোনেন্টে প্রাইস হাইড রাখার জন্য প্রপস
}

export default function ProductActions({ product, onVariationSelect, hidePrice = false }: ProductActionsProps) {
  const router = useRouter();
  
  // variations স্ট্রিং আকারে থাকলে তা পার্স করে অ্যারেতে রূপান্তর
  let parsedVariations: Variation[] = [];
  try {
    if (typeof product.variations === 'string') {
      parsedVariations = JSON.parse(product.variations);
    } else if (Array.isArray(product.variations)) {
      parsedVariations = product.variations;
    }
  } catch (error) {
    console.error("Failed to parse variations:", error);
  }

  const hasVariations = parsedVariations.length > 0;
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);

  // সুপাবেসের বেজ ইমেজ স্টোরেজ পাথ
  const supabaseStorageBase = "https://oendgqpzvkllagavtglq.supabase.co/storage/v1/object/public/product-images/";

  // ইমেজ পাথ ফরম্যাট করার হেল্পার ফাংশন
  const getFormattedImageUrl = (rawImg: string | null | undefined) => {
    if (!rawImg) return null;
    if (rawImg.startsWith('http')) return rawImg;
    
    // স্ল্যাশ অক্ষুণ্ণ রেখে প্রতিটি segment আলাদা এনকোড করা
    const formattedPath = rawImg
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${supabaseStorageBase}${formattedPath}`;
  };

  const handleVariationClick = (v: Variation) => {
    setSelectedVariation(v);
    if (onVariationSelect) {
      const rawImg = v.image || v.photo;
      const fullImg = getFormattedImageUrl(rawImg);
      
      onVariationSelect({
        ...v,
        image: fullImg
      });
    }
  };

  const addToCart = (showNotification = true) => {
    if (hasVariations && !selectedVariation) {
      alert("দয়া করে প্রথমে প্রোডাক্টের ভেরিয়েশন সিলেক্ট করুন।");
      return false;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const cartItemId = hasVariations 
      ? `${product.id}-${selectedVariation?.sku || selectedVariation?.type || selectedVariation?.color}` 
      : String(product.id);
    
    const existingItem = cart.find((item: any) => item.cartItemId === cartItemId);
    
    const itemPrice = hasVariations && selectedVariation?.sellingPrice !== undefined 
      ? Number(selectedVariation.sellingPrice) 
      : Number(product.regular_price || product.price || 0);

    const rawVariantImg = selectedVariation?.image || selectedVariation?.photo;
    const finalImage = getFormattedImageUrl(rawVariantImg) || (Array.isArray(product.images) ? product.images[0] : '/placeholder.png');

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
            {parsedVariations.map((v: Variation, index: number) => {
              const isSelected = selectedVariation === v;
              const rawImg = v.image || v.photo;
              const variantImg = getFormattedImageUrl(rawImg);

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
                      className="w-6 h-6 object-cover rounded-md flex-shrink-0"
                      onError={(e) => {
                        console.log("Image failed to load:", variantImg);
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span>{v.type || v.color || v.sku || `Variant ${index + 1}`}</span>
                  {v.sellingPrice !== undefined ? ` (৳${v.sellingPrice})` : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* প্রাইস ডিসপ্লে (Buy Now এর উপরে ডানপাশে নেওয়ার জন্য text-right যোগ করা হয়েছে) */}
      {!hidePrice && (
        <div className="text-xl font-bold text-orange-600 text-right pr-1">
          ৳{selectedVariation?.sellingPrice !== undefined ? selectedVariation.sellingPrice : (product.regular_price || product.price)}
        </div>
      )}

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