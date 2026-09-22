'use client';
import Navbar from "@/components/Navbar";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 md:px-6 py-12 flex-grow">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <span className="text-xs font-bold uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Policies</span>
          <h1 className="text-3xl font-black text-gray-900 mt-2 mb-4">Refund & Return Policy</h1>
          <p className="text-xs text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <h3 className="font-bold text-lg text-gray-900 pt-2">1. Return Eligibility</h3>
            <p>
              You are eligible to request a return or exchange within 3 days of receiving your order if the product is damaged, defective, or incorrect upon delivery.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">2. Conditions for Return</h3>
            <p>
              Items must be unused, in their original packaging, with all tags and accessories intact. Products that have been used, washed, or physically damaged by the customer are not eligible for return.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">3. Refund Processing</h3>
            <p>
              Once your returned item is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed via bKash, Nagad, or bank transfer within 5-7 working days.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">4. Shipping Costs for Returns</h3>
            <p>
              If the return is due to our error (e.g., incorrect or defective item), Thai-China Komari will bear the return shipping costs. Otherwise, the customer will be responsible for shipping charges.
            </p>

            <h3 className="font-bold text-lg text-gray-900 pt-2">5. Contact for Support</h3>
            <p>
              For any return or refund assistance, please contact our support hotline or email us with your order number and photo evidence of the issue.
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