'use client';
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const addToCart = (p: any) => alert(`Added ${p.name} to cart!`);
  const buyNow = (p: any) => alert(`Redirecting to Checkout for ${p.name}...`);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* সার্চবার ওপরে */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4">
        <input type="text" placeholder="Search products..." className="w-full p-3 rounded-lg border" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 flex flex-1 gap-8 py-6">
        {/* সাইডবার - হালকা ব্যাকগ্রাউন্ড */}
        <aside className="w-64 bg-gray-100 p-6 rounded-xl self-start">
          <label className="font-bold block mb-2">Target Audience</label>
          <select className="w-full p-2 mb-6 border rounded cursor-pointer">
            <option>All</option><option>Men</option><option>Women</option>
          </select>
          <label className="font-bold block mb-2">Categories</label>
          <select className="w-full p-2 border rounded cursor-pointer">
            <option>All</option><option>Toys</option><option>Cars</option>
          </select>
        </aside>

        {/* প্রোডাক্ট */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-4 border rounded-xl shadow-sm">
             <img src="/laptop.jpg" className="w-full h-40 object-cover mb-2" />
             <h3 className="font-bold">Asus Laptop</h3>
             <p className="text-orange-600 font-bold">৳100</p>
             <div className="flex gap-2 mt-4">
               <button onClick={() => addToCart({name: "Asus"})} className="flex-1 bg-black text-white py-2 rounded cursor-pointer hover:opacity-80">Add to Cart</button>
               <button onClick={() => buyNow({name: "Asus"})} className="flex-1 bg-orange-600 text-white py-2 rounded cursor-pointer hover:opacity-80">Buy Now</button>
             </div>
           </div>
        </div>
      </div>

      {/* ফুটার */}
      <footer className="bg-gray-900 text-white p-10 text-center mt-auto">
        <div className="flex justify-center gap-6 mb-4 underline">
          <a href="#">About Us</a> <a href="#">Refund Policy</a>
        </div>
        <p>&copy; 2026 Thaichi Rokomari. All Rights Reserved.</p>
      </footer>
    </div>
  );
}