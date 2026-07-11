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
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, [selectedAudience, selectedCategory]);

  const fetchInitialData = async () => {
    // ক্যাটাগরি লোড
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    // প্রোডাক্ট ফিল্টার লজিক
    let query = supabase.from('products').select('*').eq('is_active', true);
    
    if (selectedAudience !== 'all') {
      query = query.eq('target_audience', selectedAudience);
    }
    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    const { data: prodData } = await query;
    if (prodData) setProducts(prodData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Header with Styled Title */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="text-orange-600">Thaichi</span>{" "}
          <span className="text-blue-600">Rokomari</span>
        </h1>
        <p className="text-gray-500 mt-2">Explore our premium collection</p>
      </div>

      <main className="max-w-7xl mx-auto w-full px-6 flex flex-1 gap-8 py-6">
        {/* Filter Sidebar */}
        <aside className="w-64 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm self-start">
          <h3 className="font-bold mb-5 text-gray-800 text-lg border-b pb-2">Filter Products</h3>
          
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Target Audience</label>
          <select 
            className="w-full p-2.5 mb-6 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
          >
            <option value="all">All Collections</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="unisex">Unisex</option>
          </select>
          
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
          <select 
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col">
              <div className="w-full h-52 bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <img 
                  src={product.images?.[0] || '/placeholder.png'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
              <p className="text-orange-600 font-black text-xl mb-2">{product.regular_price} BDT</p>
              
              <button 
                onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                className="text-xs font-semibold text-blue-600 hover:underline mb-2 transition"
              >
                {expandedProductId === product.id ? "▲ Hide Details" : "▼ View Details & Origin"}
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${expandedProductId === product.id ? "max-h-40 opacity-100 mb-4" : "max-h-0 opacity-0 mb-0"}`}>
                <div className="text-sm text-gray-600 border-t pt-2 break-words">
                  <p className="mb-1"><span className="font-bold">Origin:</span> {product.origin || "Imported"}</p>
                  <p>{product.description || "No description available."}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl font-bold hover:bg-gray-700 transition">Add to Cart</button>
                <button className="flex-1 bg-orange-600 text-white py-2.5 rounded-xl font-bold hover:bg-orange-500 transition">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}