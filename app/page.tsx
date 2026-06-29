'use client';
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-6 flex flex-1 gap-8 py-6">
        {/* ফিল্টার সাইডবার */}
        <aside className="w-64 bg-gray-100 p-6 rounded-xl self-start">
          <h3 className="font-bold mb-4 text-gray-700">Filters</h3>
          <label className="block text-sm font-semibold mb-2">Target Audience</label>
          <select className="w-full p-2 mb-6 border rounded cursor-pointer">
            <option>All Collection</option>
            <option>Men Collection</option>
            <option>Women Collection</option>
            <option>Kids Collection</option>
          </select>
          <label className="block text-sm font-semibold mb-2">Categories</label>
          <select className="w-full p-2 border rounded cursor-pointer">
            <option>All Categories</option>
            <option>Home & Kitchen</option>
            <option>Gadgets</option>
          </select>
        </aside>

        {/* প্রোডাক্ট গ্রিড */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 border rounded-xl shadow-sm hover:shadow-md transition">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div> {/* ইমেজ প্লেসহোল্ডার */}
            <h3 className="font-bold text-lg">Premium Product</h3>
            <p className="text-orange-600 font-bold text-xl">৳১,৫০০</p>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:opacity-80 transition cursor-pointer">Add to Cart</button>
              <button className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:opacity-80 transition cursor-pointer">Buy Now</button>
            </div>
          </div>
        </div>
      </main>

      {/* ফুটার */}
      <footer className="bg-gray-900 text-white p-10 text-center mt-10">
        <div className="flex justify-center gap-6 mb-4 underline text-sm">
          <a href="#">About Us</a> <a href="#">Refund Policy</a> <a href="#">Contact</a>
        </div>
        <p className="text-xs text-gray-400">&copy; 2026 Thaichi Rokomari. All Rights Reserved.</p>
      </footer>
    </div>
  );
}