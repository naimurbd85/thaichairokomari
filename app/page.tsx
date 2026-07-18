'use client';
import { useState, useEffect } from "react";
import { createClient } from '@/app/utils/supabase';
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [level1, setLevel1] = useState<string>('');
  const [level2, setLevel2] = useState<string>('');
  const [level3, setLevel3] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedAudience, level1, level2, level3, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    let query = supabase.from('products').select('*').eq('is_active', true);

    if (selectedAudience !== 'all') query = query.eq('target_audience', selectedAudience);

    const activeCategoryId = level3 || level2 || level1;
    if (activeCategoryId && catData) {
        const getChildIds = (id: string): string[] => {
            const children = catData.filter(c => c.parent_id == id) || [];
            return [id, ...children.flatMap(child => getChildIds(child.id.toString()))];
        };
        const allRelevantIds = getChildIds(activeCategoryId);
        query = query.in('category_id', allRelevantIds);
    }
    
    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);

    const { data: prodData } = await query;
    if (prodData) setProducts(prodData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onSearch={(term) => setSearchTerm(term)} />

      <button 
        onClick={() => setIsFilterOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg font-bold"
      >
        Filter 🔍
      </button>

      {isFilterOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-white p-6 overflow-y-auto">
          {/* আপনার ফিল্টার কন্টেন্ট */}
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 flex flex-col md:flex-row gap-8 py-8">
        <aside className="hidden md:block w-64 space-y-6 self-start sticky top-24">
          {/* আপনার সাইডবার কন্টেন্ট */}
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-200 rounded-2xl" />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                  {/* প্রোডাক্ট ইমেজ */}
                  <Link href={`/product/${product.id}`} className="w-full h-52 bg-gray-50 rounded-xl mb-4 overflow-hidden block">
                    <img 
                      src={product.images?.[0] || '/placeholder.png'} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Origin এবং Category ব্যাজ */}
                  <div className="flex gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {product.target_audience || 'General'}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                    </span>
                  </div>

                  {/* প্রোডাক্ট নাম */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition">{product.name}</h3>
                  </Link>
                  
                  {/* প্রাইস */}
                  <p className="text-orange-600 font-black text-xl mb-3">৳{Number(product.regular_price || 0).toLocaleString()}</p>
                  
                  {/* বাটন কন্টেইনার */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-gray-900 text-white py-2 rounded-xl font-bold hover:bg-gray-800 transition text-sm">Add to Cart</button>
                    <button className="flex-1 bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700 transition text-sm">Buy Now</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">No products found.</div>
          )}
        </div>
      </main>
    </div>
  );
}