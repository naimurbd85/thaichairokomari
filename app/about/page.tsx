'use client';
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 md:px-6 py-12 flex-grow">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
          
          <div>
            <span className="text-xs font-bold uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Who We Are</span>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-3 mb-4">About Us</h1>
            <p className="text-gray-600 leading-relaxed text-base">
              Welcome to <span className="font-bold text-gray-900">ThaiChi Rokomari</span>, your trusted online shopping destination for quality products across a wide range of categories. From fashion, beauty, jewellery, bags, baby essentials, home & kitchen items to gadgets and mobile accessories—we bring everything together in one convenient place.
            </p>
          </div>

          <div className="border-t pt-8">
            <h3 className="font-bold text-2xl text-gray-900 mb-6">Why Shop With Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-lg text-gray-900">✦ Uncompromising Quality</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Every product in our collection is carefully selected and quality-checked to ensure it meets your expectations.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-lg text-gray-900">✦ Affordable Pricing</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We believe quality shouldn't come at an excessive price. Enjoy premium products at fair and reasonable prices.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-lg text-gray-900">✦ Fast & Reliable Delivery</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your orders are processed efficiently and delivered to your doorstep quickly and safely.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <h4 className="font-bold text-lg text-gray-900">✦ Hassle-Free Easy Returns</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Shop with confidence. If a product doesn't meet your expectations or arrives damaged, our simple return process is here to help.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <h4 className="font-bold text-lg text-gray-900">✦ Dedicated Online Support</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Have a question or need assistance? Our support team is always ready to help and answer your queries.
              </p>
            </div>
          </div>

          <div className="border-t pt-8 text-center">
            <p className="font-bold text-lg text-gray-900">
              ThaiChi Rokomari — Trust in Every Choice.
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <Link href="/" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition text-sm">
              Explore Products
            </Link>
            <Link href="/contact" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-sm">
              Contact Support
            </Link>
          </div>

        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-xs border-t border-gray-800">
        <p>© {new Date().getFullYear()} ThaiChi Rokomari. All rights reserved.</p>
      </footer>
    </div>
  );
}