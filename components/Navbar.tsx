import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          {/* লোগো সাইজ বড় করে দেওয়া হয়েছে */}
          <Image src="/tclogo.png" alt="Thaichi Rokomari" width={220} height={60} className="h-14 w-auto" />
        </Link>
        <div className="flex gap-8 text-sm font-bold text-gray-800">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <Link href="/products" className="hover:text-orange-600">Products</Link>
          <Link href="/cart" className="hover:text-orange-600">Cart (0)</Link>
        </div>
      </div>
    </nav>
  );
}