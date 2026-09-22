'use client';
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 py-12 flex-grow">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Get in Touch</span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-3 mb-2">Contact Us</h1>
          <p className="text-gray-600 text-sm">Have any questions about our products, orders, or delivery? Feel free to reach out to us anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Contact Details Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 md:col-span-1">
            <h3 className="font-bold text-xl text-gray-900">Reach Us</h3>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-bold text-gray-900">Hotline:</p>
                <p>+880 1234-567890</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">Email Address:</p>
                <p>support@example.com</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">Office Address:</p>
                <p>Dhaka, Bangladesh</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">Working Hours:</p>
                <p>Saturday – Thursday: 10:00 AM – 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm md:col-span-2">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-600 text-sm">Thank you for reaching out. Our support team will get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-xl text-gray-900 mb-4">Send a Message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full p-3 border rounded-xl outline-none text-sm focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input required type="text" placeholder="+880 1XXXXXXXXX" className="w-full p-3 border rounded-xl outline-none text-sm focus:border-black" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full p-3 border rounded-xl outline-none text-sm focus:border-black" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Message</label>
                  <textarea required rows={4} placeholder="Write your message here..." className="w-full p-3 border rounded-xl outline-none text-sm focus:border-black resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:bg-orange-700 transition text-sm">
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-xs border-t border-gray-800">
        <p>© {new Date().getFullYear()} Thai-China Komari. All rights reserved.</p>
      </footer>
    </div>
  );
}