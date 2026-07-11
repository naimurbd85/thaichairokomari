'use client';
import { useState, useEffect } from "react";
import { createClient } from '@/app/utils/supabase';
import Navbar from "../components/Navbar";

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

  useEffect(() => {
    fetchData();
  }, [selectedAudience, level1, level2, level3, searchTerm]);

  const fetchData = async () => {
        setLoading(true); // লোডিং স্টেট চালু রাখুন
        
        // ১. ক্যাটাগরি ডাটা আনুন
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData);

        // ২. মেইন কোয়েরি
        let query = supabase.from('products').select('*').eq('is_active', true);

        // ৩. অডিয়েন্স ফিল্টার (যদি থাকে)
        if (selectedAudience !== 'all') query = query.eq('target_audience', selectedAudience);

        // ৪. রিকার্সিভ ক্যাটাগরি ফিল্টার
        const activeCategoryId = level3 || level2 || level1;
        if (activeCategoryId && catData) {
            const getChildIds = (id: string): string[] => {
                const children = catData.filter(c => c.parent_id == id) || [];
                return [id, ...children.flatMap(child => getChildIds(child.id.toString()))];
            };
            
            const allRelevantIds = getChildIds(activeCategoryId);
            query = query.in('category_id', allRelevantIds);
        }
        
        // ৫. সার্চ ফিল্টার
        if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);

        // ৬. ডাটা ফেচ
        const { data: prodData } = await query;
        if (prodData) setProducts(prodData);
        
        setLoading(false); // লোডিং বন্ধ করুন
    };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onSearch={(term) => setSearchTerm(term)} />

      <main className="max-w-7xl mx-auto w-full px-6 flex flex-1 gap-8 py-8">
        {/* Sidebar */}
        <aside className="w-64 space-y-6 self-start sticky top-24">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4 text-gray-800 text-lg border-b pb-2">Filter Products</h3>
            
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Origin</label>
            <select className="w-full p-2.5 mb-6 border rounded-lg outline-none" value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)}>
              <option value="all">All Origins</option>
              <option value="china">China Product</option>
              <option value="thai">Thailand Product</option>
            </select>

            <h3 className="font-bold mb-4 text-gray-800 text-sm border-b pb-2">Categories</h3>
            <select className="w-full p-2.5 mb-3 border rounded-lg text-sm" value={level1} onChange={(e) => {setLevel1(e.target.value); setLevel2(''); setLevel3('');}}>
              <option value="">Main Category</option>
              {categories.filter(c => !c.parent_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="w-full p-2.5 mb-3 border rounded-lg text-sm" value={level2} onChange={(e) => {setLevel2(e.target.value); setLevel3('');}} disabled={!level1}>
              <option value="">Sub Category</option>
              {categories.filter(c => c.parent_id == level1).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="w-full p-2.5 border rounded-lg text-sm" value={level3} onChange={(e) => setLevel3(e.target.value)} disabled={!level2}>
              <option value="">Sub Sub Category</option>
              {categories.filter(c => c.parent_id == level2).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-200 rounded-2xl" />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-full h-52 bg-gray-50 rounded-xl mb-4 overflow-hidden">
                    <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover"/>
                  </div>
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-orange-600 font-black text-xl mb-3">{product.regular_price} BDT</p>
                  
                  <button onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)} className="text-xs font-semibold text-blue-600 underline mb-3">
                    {expandedProductId === product.id ? "Hide Details" : "View Details & Origin"}
                  </button>

                  {expandedProductId === product.id && (
                    <div className="text-sm text-gray-600 border-t pt-2 mb-4 animate-in fade-in">
                      <p><span className="font-bold">Origin:</span> {product.target_audience || "N/A"}</p>
                      <p className="line-clamp-3">{product.description}</p>
                    </div>
                  )}

                  <button className="w-full bg-black text-white py-2 rounded-xl font-bold hover:bg-gray-800 transition">Add to Cart</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">No products found matching your criteria.</div>
          )}
        </div>
      </main>
    </div>
  );
}