import { createServerSupabaseClient } from '@/app/utils/supabaseServer';
import { notFound } from 'next/navigation';
import ProductGallery from './ProductGallery';
import Navbar from '@/components/Navbar';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  
  const supabase = await createServerSupabaseClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // যদি প্রোডাক্ট না পাওয়া যায় বা এরর হয়
  if (error || !product) {
    console.error("Supabase Error:", error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 🔝 কার্ট পেজের মতো টপ হেডার বার (সার্চ ও কার্ট হাইড করা) */}
      <Navbar showSearchAndCart={false} />

      {/* 📦 মূল প্রডাক্ট ডিটেইলস সেকশন */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ইমেজ সেকশন ও গ্যালারি */}
          <ProductGallery product={product} />

          {/* প্রোডাক্ট ডিটেইলস */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-4">
                {product.name}
              </h1>
              
              <p className="text-3xl font-black text-orange-600 mb-6">
                ৳{Number(product.regular_price || 0).toLocaleString()}
              </p>
              
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-2">Product Description</h3>
                <div 
                  className="prose prose-sm text-gray-600 max-w-none break-words overflow-hidden" 
                  dangerouslySetInnerHTML={{ __html: product.description || '' }} 
                />
              </div>
            </div>

            {/* স্টক ইনফো */}
            <div className="mt-6 text-sm border-t pt-4">
              <p className="text-gray-500">
                SKU: <span className="text-gray-900 font-bold">{product.sku}</span>
              </p>
              <p className="text-gray-500 mt-1">
                Status: 
                <span className={`ml-2 font-bold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}