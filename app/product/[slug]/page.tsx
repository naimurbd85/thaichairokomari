import { createClient } from '@/app/utils/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* ব্যাক বাটন */}
        <Link href="/" className="text-gray-500 hover:text-black mb-6 inline-block font-semibold">
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ইমেজ সেকশন */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border">
            <img 
              src={product.images?.[0] || '/placeholder.png'} 
              alt={product.name} 
              className="w-full h-[400px] object-cover rounded-xl"
            />
          </div>

          {/* প্রোডাক্ট ডিটেইলস */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {product.target_audience || 'General'}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-4">{product.name}</h1>
            
            <p className="text-3xl font-black text-orange-600 mb-6">৳{Number(product.regular_price).toLocaleString()}</p>
            
            <div className="flex gap-4 mb-8">
              <button className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
                Add to Cart
              </button>
              <button className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg">
                Buy Now
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-2">Product Description</h3>
              <div 
                className="prose prose-sm text-gray-600 max-w-none" 
                dangerouslySetInnerHTML={{ __html: product.description }} 
              />
            </div>

            {/* স্টক ইনফো */}
            <div className="mt-6 text-sm">
              <p className="text-gray-500">SKU: <span className="text-gray-900 font-bold">{product.sku}</span></p>
              <p className="text-gray-500 mt-1">Status: 
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