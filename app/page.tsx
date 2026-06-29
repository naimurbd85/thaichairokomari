'use client';
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [activeCollection, setActiveCollection] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-10 px-6">
        
        {/* Collection / Target Audience Filter */}
        <section className="mb-10">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Shop By Collection</h3>
          <div className="flex gap-4">
            {["All", "Men", "Women", "Kids", "Corporate"].map((coll) => (
              <button 
                key={coll}
                onClick={() => setActiveCollection(coll)}
                className={`px-8 py-3 rounded-xl font-bold transition ${activeCollection === coll ? 'bg-black text-white' : 'bg-white border text-black'}`}
              >
                {coll}
              </button>
            ))}
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-10">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Product Categories</h3>
          <div className="flex gap-3">
            {["All", "Electronics", "Stationery", "Home Decor"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm ${activeCategory === cat ? 'bg-orange-600 text-white' : 'bg-white border'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {/* প্রোডাক্ট কার্ড এখন আগের চেয়েও ক্লিন ও প্রফেশনাল */}
          <div className="bg-white p-4 rounded-2xl border shadow-sm group">
            <div className="relative overflow-hidden rounded-xl">
                <img src="/laptop.jpg" className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h3 className="font-bold mt-4 text-gray-900">Asus Premium Laptop</h3>
            <p className="text-orange-600 font-extrabold text-xl mt-1">৳85,000</p>
            
            <div className="flex gap-2 mt-4">
              <button className="flex-1 border-2 border-black font-bold py-2.5 rounded-xl text-xs hover:bg-black hover:text-white transition">Add to Cart</button>
              <button className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-orange-700 transition">Buy Now</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}