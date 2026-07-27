'use client';
import { useState } from 'react';
import ProductGallery from './ProductGallery';
import ProductActions from './ProductActions';

export default function ProductMainContent({ product }: { product: any }) {
  // সিলেক্টেড ভেরিয়েন্টের ছবি রাখার স্টেট
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* ইমেজ সেকশন ও গ্যালারি */}
      <ProductGallery product={product} selectedImage={selectedImage} />

      {/* প্রোডাক্ট ডিটেইলস ও অ্যাকশন */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-4">{product.name}</h1>
          
          {/* ভেরিয়েন্ট সিলেক্ট হলে ইমেজ স্টেট আপডেট করার লজিক */}
          <ProductActions 
            product={product} 
            onVariationSelect={(v: any) => {
              const variantImg = v?.image || v?.photo;
              if (variantImg) {
                setSelectedImage(variantImg);
              }
            }} 
          />
          
          <div className="border-t pt-6 mt-6">
            <h3 className="font-bold text-gray-900 mb-2">Product Description</h3>
            <div 
              className="prose prose-sm text-gray-600 max-w-none break-words overflow-hidden" 
              dangerouslySetInnerHTML={{ __html: product.description || '' }} 
            />
          </div>
        </div>

        {/* স্টক ইনফো */}
        <div className="mt-6 text-sm border-t pt-4">
          <p className="text-gray-500">SKU: <span className="text-gray-900 font-bold">{product.sku}</span></p>
          <p className="text-gray-500 mt-1">Status: 
            <span className={`ml-2 font-bold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}