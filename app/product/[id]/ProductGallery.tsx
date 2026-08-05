'use client';
import { useState, useEffect } from 'react';
import ProductActions from './ProductActions';

interface ProductGalleryProps {
  product: any;
  selectedImage?: string | null; 
}

export default function ProductGallery({ product, selectedImage: externalSelectedImage }: ProductGalleryProps) {
  // ডাটাবেজের `images` অ্যারে বা প্লেসহোল্ডার
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['/placeholder.png'];
    
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);

  // যদি বাইরে থেকে বা অন্য কোনো কারণে ইমেজ প্রপস পরিবর্তিত হয়
  useEffect(() => {
    if (externalSelectedImage) {
      setSelectedImage(externalSelectedImage);
    }
  }, [externalSelectedImage]);

  // ভেরিয়েন্ট পরিবর্তনের হ্যান্ডলার
  const handleVariationChange = (variation: any) => {
    setSelectedVariation(variation);
    const variantImg = variation?.image || variation?.photo;
    if (variantImg) {
      setSelectedImage(variantImg);
    }
  };

  // কার্ট বা অন্যান্য কাজের জন্য সিলেক্টেড ডেটা সহ প্রোডাক্ট অবজেক্ট মডিফাই করা
  const productWithSelectedData = {
    ...product,
    images: [selectedImage],
    selectedImage: selectedImage,
    selectedVariation: selectedVariation
  };

  return (
    <div className="space-y-4">
      {/* মূল বড় ছবি */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
        <img 
          src={selectedImage} 
          alt={product.name} 
          className="w-full h-[400px] object-contain rounded-xl transition-all duration-300"
        />
      </div>

      {/* একাধিক ছবি থাকলে থাম্বনেইল লিস্ট */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`border-2 rounded-xl overflow-hidden w-20 h-20 flex-shrink-0 transition-all bg-white p-1 ${
                selectedImage === img ? 'border-orange-600 scale-105 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-contain rounded-lg" 
              />
            </button>
          ))}
        </div>
      )}

      {/* ProductActions কম্পোনেন্ট (hidePrice={true} পাস করা হয়েছে) */}
      <div className="mt-6">
        <ProductActions 
          product={productWithSelectedData} 
          onVariationSelect={handleVariationChange} 
          hidePrice={true}
        />
      </div>
    </div>
  );
}