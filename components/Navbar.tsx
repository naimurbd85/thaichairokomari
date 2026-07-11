import Link from "next/link";

interface NavbarProps {
  onSearch?: (term: string) => void;
}

export default function Navbar({ onSearch }: { onSearch?: (term: string) => void }) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/">
          <h1 className="text-2xl font-extrabold tracking-tighter">
            <span className="text-orange-600">Thaichi</span>{" "}
            <span className="text-blue-600">Rokomari</span>
          </h1>
        </Link>

        <div className="flex-1 max-w-lg">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <div className="flex gap-6 font-bold">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </div>
    </nav>
  );
}