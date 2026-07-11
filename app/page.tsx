'use client';
import { useState, useEffect } from "react";
import { createClient } from '@/app/utils/supabase';
import Navbar from "../components/Navbar";

export default function Home() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>(''); // সার্চ স্টেট
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedAudience, selectedCategory, searchTerm]);

  const fetchData = async () => {
    // ক্যাটাগরি লোড
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    // প্রোডাক্ট ফিল্টার ও সার্চ লজিক
    let query = supabase.from('products').select('*').eq('is_active', true);
    
    if (selectedAudience !== 'all') query = query.eq('target_audience', selectedAudience);
    if (selectedCategory !== 'all') query = query.eq('category_id', selectedCategory);
    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);

    const { data: prodData } = await query;
    if (prodData) setProducts(prodData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar এ সার্চ ফাংশন পাস করা হলো */}
      <Navbar onSearch={(term) => setSearchTerm(term)} />

      <main className="max-w-7xl mx-auto w-full px-6 flex flex-1 gap-8 py-8">
        {/* Filter Sidebar */}
        <aside className="w-64 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm self-start sticky top-24">
          <h3 className="font-bold mb-5 text-gray-800 text-lg border-b pb-2">Filter Products</h3>
          
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Origin</label>
          <select className="w-full p-2.5 mb-6 border rounded-lg outline-none" value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)}>
            <option value="all">All Origins</option>
            <option value="china">China Product</option>
            <option value="thai">Thailand Product</option>
          </select>
          
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
          <select className="w-full p-2.5 border rounded-lg outline-none" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 border rounded-2xl shadow-sm hover:shadow-lg transition">
              <div className="w-full h-52 bg-gray-50 rounded-xl mb-4 overflow-hidden">
                <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover"/>
              </div>
              
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-orange-600 font-black text-xl mb-3">{product.regular_price} BDT</p>
              
              <button 
                onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                className="text-xs font-semibold text-blue-600 underline mb-3"
              >
                {expandedProductId === product.id ? "Hide Details" : "View Details & Origin"}
              </button>

              {expandedProductId === product.id && (
                <div className="text-sm text-gray-600 border-t pt-2 mb-4 break-words">
                  <p><span className="font-bold">Origin:</span> {product.target_audience || "N/A"}</p>
                  <p>{product.description}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 bg-black text-white py-2 rounded-xl font-bold">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}