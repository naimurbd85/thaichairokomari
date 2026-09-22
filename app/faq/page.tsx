'use client';
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How can I place an order?",
      a: "Simply browse our products, click 'Buy Now' or 'Add to Cart', go to checkout, fill in your delivery details, and confirm your order. You can choose Cash on Delivery or digital payment methods."
    },
    {
      q: "Are these products imported directly from Thailand and China?",
      a: "Yes! All products listed on Thai-China Komari are directly sourced and imported to guarantee premium quality and best market prices."
    },
    {
      q: "What are the delivery charges and shipping times?",
      a: "Delivery charges vary based on your location (inside or outside Dhaka). Standard delivery inside Dhaka takes 2-3 days, and outside Dhaka takes 3-5 days."
    },
    {
      q: "Can I return or exchange a product?",
      a: "Yes, we have a hassle-free return and exchange policy. If you receive a damaged, defective, or incorrect product, you can notify us within 3 days of delivery."
    },
    {
      q: "What payment methods do you support?",
      a: "We support Cash on Delivery (COD), bKash, Nagad, and secure online card checkouts."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-3xl mx-auto w-full px-4 md:px-6 py-12 flex-grow">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Support Center</span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-3 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-sm">Find answers to common questions regarding orders, shipping, returns, and payments.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border rounded-2xl overflow-hidden shadow-sm transition">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-gray-800 flex justify-between items-center gap-4 hover:bg-gray-50 transition"
              >
                <span>{faq.q}</span>
                <span className="text-xl font-normal text-gray-500">{openIdx === idx ? '−' : '+'}</span>
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-xs border-t border-gray-800">
        <p>© {new Date().getFullYear()} Thai-China Komari. All rights reserved.</p>
      </footer>
    </div>
  );
}