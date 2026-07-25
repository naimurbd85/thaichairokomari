// app/product/[id]/ProductGallery.tsx
'use client';
import { useState } from 'react';
import ProductActions from './ProductActions';

export default function ProductGallery({ product }: { product: any }) {
  const images = product.images?.length > 0 ? product.images : ['/placeholder.png'];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  // সিলেক্ট করা ইমেজটি কার্টে পাঠানোর জন্য প্রোডাক্ট অবজেক্টের সাথে যুক্ত করা হলো
  const productWithSelectedImage = {
    ...product,
    images: [selectedImage] 
  };

  return (
    <div className="space-y-4">
      {/* মূল বড় ছবি */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <img 
          src={selectedImage} 
          alt={product.name} 
          className="w-full h-[400px] object-cover rounded-xl transition-all duration-300"
        />
      </div>

      {/* একাধিক ছবি থাকলে থাম্বনেইল লিস্ট */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`border-2 rounded-xl overflow-hidden w-20 h-20 flex-shrink-0 transition-all ${
                selectedImage === img ? 'border-orange-600 scale-105 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ProductActions কম্পোনেন্ট */}
      <div className="mt-6">
        <ProductActions product={productWithSelectedImage} />
      </div>
    </div>
  );
}