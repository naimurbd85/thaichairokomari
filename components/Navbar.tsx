import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* লোগো */}
        <Link href="/">
          <Image src="/tclogo.png" alt="Thaichi Rokomari" width={200} height={50} className="h-12 w-auto" />
        </Link>

        {/* সার্চ বার (এখন হেডারের ভেতরে) */}
        <div className="flex-1 max-w-lg">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>

        {/* নেভিগেশন মেনু (বড় টেক্সট) */}
        <div className="flex gap-8 text-base font-bold text-gray-800">
          <Link href="/" className="hover:text-orange-600 transition">Home</Link>
          <Link href="/products" className="hover:text-orange-600 transition">Products</Link>
          <Link href="/cart" className="hover:text-orange-600 transition">Cart (0)</Link>
        </div>
      </div>
    </nav>
  );
}