'use client';
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

interface Product {
  id: number;
  name: string;
  price: number;
  regular_price?: number;
  images: string[];
  stock_status: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*").eq("is_active", true);
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold mb-8">Trending Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <img src={p.images[0]} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-3" />
              <h3 className="font-semibold text-sm truncate">{p.name}</h3>
              <p className="font-bold mt-1">৳{p.price}</p>
              <button className="w-full mt-3 bg-black text-white py-2 rounded-lg text-xs">Add to Cart</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}