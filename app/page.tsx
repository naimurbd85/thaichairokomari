'use client';
import { useState, useEffect } from "react";
import { createClient } from '@/app/utils/supabase';
import Navbar from "../components/Navbar";

export default function Home() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // State for the description modal
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, [selectedAudience, selectedCategory]);

  const fetchInitialData = async () => {
    // Fetch categories from database
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    // Fetch products based on filters
    let query = supabase.from('products').select('*').eq('is_active', true);
    if (selectedAudience && selectedAudience !== 'all') query = query.eq('target_audience', selectedAudience);
    if (selectedCategory) query = query.eq('category_id', selectedCategory);

    const { data: prodData } = await query;
    if (prodData) setProducts(prodData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 flex flex-1 gap-8 py-6">
        {/* Filter Sidebar */}
        <aside className="w-64 bg-gray-100 p-6 rounded-xl self-start">
          <h3 className="font-bold mb-4 text-gray-700">Filters</h3>
          
          <label className="block text-sm font-semibold mb-2">Target Audience</label>
          <select 
            className="w-full p-2 mb-6 border rounded cursor-pointer" 
            onChange={(e) => setSelectedAudience(e.target.value)}
          >
            <option value="all">All Collections</option>
            <option value="men">Men Collection</option>
            <option value="women">Women Collection</option>
            <option value="kids">Kids Collection</option>
            <option value="unisex">Unisex</option>
            <option value="home_kitchen">Home & Kitchen</option>
            <option value="gadgets_accessories">Gadgets</option>
          </select>
          
          <label className="block text-sm font-semibold mb-2">Categories</label>
          <select 
            className="w-full p-2 border rounded cursor-pointer" 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 border rounded-xl shadow-sm hover:shadow-md transition flex flex-col">
              {/* Product Image with object-contain to prevent cropping */}
              <div className="w-full h-48 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-orange-600 font-bold text-xl mb-3">{product.regular_price} BDT</p>
              
              {/* Product Details trigger button */}
              <button 
                onClick={() => setSelectedProduct(product)}
                className="w-full mb-3 text-sm text-gray-500 underline hover:text-black transition"
              >
                View Description
              </button>

              <div className="flex gap-2 mt-auto">
                <button className="flex-1 bg-black text-white py-2 rounded-lg font-bold hover:opacity-80 transition">Add to Cart</button>
                <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-bold hover:opacity-80 transition">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Description Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-gray-600 mb-6">{selectedProduct.description || "No description available."}</p>
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="w-full bg-gray-200 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}