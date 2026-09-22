'use client';
import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 md:px-6 py-12 flex-grow">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <span className="text-xs font-bold uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Legal</span>
          <h1 className="text-3xl font-black text-gray-900 mt-2 mb-4">Terms & Conditions</h1>
          <p className="text-xs text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <h3 className="font-bold text-lg text-gray-900 pt-2">1. Introduction</h3>
            <p>
              By accessing and using Thai-China Komari website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before making any purchase.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">2. Pricing & Product Availability</h3>
            <p>
              All prices are listed in Bangladeshi Taka (Tk). We reserve the right to modify product prices, descriptions, or discontinue items without prior notice. Product availability is subject to change.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">3. Order Acceptance</h3>
            <p>
              We reserve the right to refuse or cancel any order due to stock limitations, pricing errors, or suspicion of fraudulent activity. You will be notified if your order requires modification or cancellation.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">4. User Accounts</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account details, shopping cart, and activity on our platform.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">5. Limitation of Liability</h3>
            <p>
              Thai-China Komari shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website services.
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