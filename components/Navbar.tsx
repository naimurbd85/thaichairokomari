import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/tclogo.png" alt="Logo" width={150} height={40} className="h-10 w-auto" />
        </Link>
        <div className="flex gap-6 text-sm font-semibold text-gray-700">
          <Link href="/" className="hover:text-orange-600 transition">Home</Link>
          <Link href="/cart" className="hover:text-orange-600 transition">Cart</Link>
        </div>
      </div>
    </nav>
  );
}