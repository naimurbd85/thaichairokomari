'use client';
import Navbar from "@/components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 md:px-6 py-12 flex-grow">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <span className="text-xs font-bold uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Legal</span>
          <h1 className="text-3xl font-black text-gray-900 mt-2 mb-4">Privacy Policy</h1>
          <p className="text-xs text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <h3 className="font-bold text-lg text-gray-900 pt-2">1. Information We Collect</h3>
            <p>
              When you visit Thai-China Komari or place an order, we collect personal details such as your name, phone number, delivery address, and email address to fulfill your order and provide customer support.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">2. How We Use Your Information</h3>
            <p>
              Your information is used strictly to process transactions, manage deliveries, send order status updates, and improve our services. We never sell, rent, or trade your personal data to third parties.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">3. Data Security</h3>
            <p>
              We implement industry-standard security measures to safeguard your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">4. Cookies</h3>
            <p>
              Our website uses local storage and cookies to maintain your shopping cart items, preferences, and streamline your overall browsing experience.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">5. Policy Updates</h3>
            <p>
              We reserve the right to modify this Privacy Policy at any time. Changes will be posted directly on this page with an updated revision date.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-xs border-t border-gray-800">
        <p>© {new Date().getFullYear()} Thai-China Komari. All rights reserved.</p>
      </footer>
    </div>
  );
}