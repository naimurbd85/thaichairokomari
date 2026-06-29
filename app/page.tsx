'use client';
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      // ক্যাটাগরি ফেচ করা
      const { data: catData } = await supabase.from("categories").select("*");
      if (catData) setCategories(catData);

      // প্রোডাক্ট ফেচ করা
      let query = supabase.from("products").select("*").eq("is_active", true);
      if (selectedAudience !== "All") query = query.eq("target_audience", selectedAudience.toLowerCase());
      if (selectedCategory) query = query.eq("category_id", selectedCategory);
      
      const { data: prodData } = await query;
      if (prodData) setProducts(prodData);
    }
    fetchData();
  }, [selectedAudience, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* সার্চ বার */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <input 
          type="text" 
          placeholder="Search for products..." 
          className="w-full p-4 rounded-xl border border-gray-200 shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-8">
        {/* বাম পাশের সাইডবার */}
        <aside className="w-1/4">
          <h4 className="font-bold mb-4 text-gray-700">Target Audience</h4>
          {["All", "Unisex", "Men", "Women", "Kids"].map(aud => (
            <button key={aud} onClick={() => setSelectedAudience(aud)} className="block w-full text-left py-2 hover:text-orange-600">{aud}</button>
          ))}
          
          <h4 className="font-bold mt-8 mb-4 text-gray-700">Categories</h4>
          <button onClick={() => setSelectedCategory(null)} className="block w-full text-left py-2">All</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="block w-full text-left py-2 hover:text-orange-600">{cat.name}</button>
          ))}
        </aside>

        {/* প্রোডাক্ট গ্রিড */}
        <div className="w-3/4 grid grid-cols-3 gap-6">
          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <div key={p.id} className="bg-white p-4 rounded-xl border shadow-sm">
              {/* ইমেজ ফিক্স: যদি ছবি না থাকে তবে ডিফল্ট ইমেজ */}
              <img src={p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png"} 
                   alt={p.name} className="w-full h-48 object-cover rounded-lg mb-3" />
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-orange-600 font-bold">৳{p.price}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 border py-2 rounded-lg text-xs">Add to Cart</button>
                <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-xs">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}