'use client';
import { useState, useEffect } from "react";
import { createClient } from '@/app/utils/supabase';
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allActiveProducts, setAllActiveProducts] = useState<any[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // State for pop-up or modal and selected image state
  const [activeModalProduct, setActiveModalProduct] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const [level1, setLevel1] = useState<string>('');
  const [level2, setLevel2] = useState<string>('');
  const [level3, setLevel3] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch initial categories and base products without filters on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedAudience, level1, level2, level3, searchTerm]);

  const fetchInitialData = async () => {
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    const { data: prodData } = await supabase.from('products').select('*').eq('is_active', true);
    if (prodData) setAllActiveProducts(prodData);
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData);

    let query = supabase.from('products').select('*').eq('is_active', true);

    if (selectedAudience !== 'all') query = query.eq('target_audience', selectedAudience);

    const activeCategoryId = level3 || level2 || level1;
    if (activeCategoryId && catData) {
        const getChildIds = (id: string): string[] => {
            const children = catData.filter(c => c.parent_id === id) || [];
            return [id, ...children.flatMap(child => getChildIds(child.id.toString()))];
        };
        const allRelevantIds = getChildIds(activeCategoryId);
        query = query.in('category_id', allRelevantIds);
    }
    
    if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);

    const { data: prodData } = await query;
    if (prodData) setProducts(prodData);
    setLoading(false);
  };

  // Helper function: Check if a category or its sub-categories contain products
  const hasProductsInCategory = (catId: string) => {
      let baseProducts = allActiveProducts;
      if (selectedAudience !== 'all') {
        baseProducts = baseProducts.filter(p => p.target_audience === selectedAudience);
      }

      const getChildIds = (id: string): string[] => {
        const children = categories.filter(c => String(c.parent_id) === String(id)) || [];
        return [String(id), ...children.flatMap(child => getChildIds(String(child.id)))];
      };

      const relevantCatIds = getChildIds(catId);
      return baseProducts.some(p => relevantCatIds.includes(String(p.category_id)));
  };

  // Set default selected image when opening modal
  const openModal = (product: any) => {
    setActiveModalProduct(product);
    setSelectedImage(product.images?.[0] || '/placeholder.png');
  };

  // Cart functions
  const handleAddToCart = (product: any) => {
    const hasVariations = Array.isArray(product.variations) && product.variations.length > 0;

    if (hasVariations) {
      alert("Please select a variant first!");
      window.location.href = `/product/${product.id}`;
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) { 
      existingItem.quantity += 1; 
    } else { 
      cart.push({ ...product, quantity: 1, selectedImage: typeof selectedImage !== 'undefined' ? selectedImage : (product.images?.[0] || '') }); 
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert("Product added to cart!");
  };

  const handleBuyNow = (product: any) => {
    const hasVariations = Array.isArray(product.variations) && product.variations.length > 0;

    if (hasVariations) {
      alert("Please select a variant first!");
      window.location.href = `/product/${product.id}`;
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (!existingItem) { 
      cart.push({ ...product, quantity: 1, selectedImage: typeof selectedImage !== 'undefined' ? selectedImage : (product.images?.[0] || '') }); 
      localStorage.setItem('cart', JSON.stringify(cart)); 
    }
    
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onSearch={(term) => setSearchTerm(term)} />

      <button 
        onClick={() => setIsFilterOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg font-bold"
      >
        Filter 🔍
      </button>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-white p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filter Products</h2>
            <button onClick={() => setIsFilterOpen(false)} className="text-2xl font-bold">✕</button>
          </div>
          
          <div className="space-y-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Origin</label>
            <select className="w-full p-3 border rounded-lg outline-none" value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)}>
              <option value="all">All Origins</option>
              <option value="china">China Product</option>
              <option value="thai">Thailand Product</option>
            </select>

            <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Categories</h3>
            
            <select className="w-full p-3 border rounded-lg text-sm" value={level1} onChange={(e) => {setLevel1(e.target.value); setLevel2(''); setLevel3('');}}>
              <option value="">Main Category</option>
              {categories
                .filter(c => !c.parent_id && hasProductsInCategory(c.id))
                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select className="w-full p-2.5 border rounded-lg text-sm" value={level2} onChange={(e) => {setLevel2(e.target.value); setLevel3('');}} disabled={!level1}>
              <option value="">Sub Category</option>
              {categories
                .filter(c => String(c.parent_id) === String(level1) && hasProductsInCategory(c.id))
                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select className="w-full p-2.5 border rounded-lg text-sm" value={level3} onChange={(e) => setLevel3(e.target.value)} disabled={!level2}>
              <option value="">Sub Sub Category</option>
              {categories
                .filter(c => String(c.parent_id) === String(level2) && hasProductsInCategory(c.id))
                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button onClick={() => setIsFilterOpen(false)} className="w-full mt-8 bg-black text-white py-3 rounded-xl font-bold">Show Results</button>
        </div>
      )}

      {/* Product Details and Multiple Image Gallery Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
            <button 
              onClick={() => setActiveModalProduct(null)} 
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-700 transition"
            >
              ✕
            </button>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 flex flex-col gap-3">
                <div className="w-full h-72 bg-gray-50 rounded-2xl overflow-hidden p-2 flex items-center justify-center border">
                  <img src={selectedImage} alt={activeModalProduct.name} className="w-full h-full object-contain" />
                </div>
                {activeModalProduct.images && activeModalProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {activeModalProduct.images.map((img: string, idx: number) => (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition ${selectedImage === img ? 'border-orange-600 scale-95 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col">
                <div className="flex gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{activeModalProduct.target_audience || 'General'}</span>
                  <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{categories.find(c => c.id === activeModalProduct.category_id)?.name || 'Uncategorized'}</span>
                </div>
                <h2 className="font-bold text-xl mb-2 text-gray-800">{activeModalProduct.name}</h2>
                <p className="text-orange-600 font-black text-2xl mb-4">
                  Tk {Number(activeModalProduct.regular_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <Link href={`/product/${activeModalProduct.id}`} className="text-xs text-blue-600 hover:underline mb-4 font-semibold">
                  View Full Product Page →
                </Link>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h4 className="font-bold text-gray-800 mb-2">Product Description:</h4>
              <div 
                className="prose prose-sm max-w-full text-gray-600 space-y-2 max-h-48 overflow-y-auto pr-2"
                dangerouslySetInnerHTML={{ __html: activeModalProduct.description }} 
              />
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button onClick={() => handleAddToCart(activeModalProduct)} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition text-sm">
                Add to Cart
              </button>
              <button onClick={() => handleBuyNow(activeModalProduct)} className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition text-sm">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 flex flex-col md:flex-row gap-8 py-8 flex-grow">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 space-y-6 self-start sticky top-24">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4 text-gray-800 text-lg border-b pb-2">Filter Products</h3>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Origin</label>
            <select className="w-full p-2.5 mb-6 border rounded-lg outline-none" value={selectedAudience} onChange={(e) => setSelectedAudience(e.target.value)}>
              <option value="all">All Origins</option>
              <option value="china">China Product</option>
              <option value="thai">Thailand Product</option>
            </select>
            <h3 className="font-bold mb-4 text-gray-800 text-sm border-b pb-2">Categories</h3>
            <div className="space-y-3">
              <select className="w-full p-2.5 border rounded-lg text-sm" value={level1} onChange={(e) => {setLevel1(e.target.value); setLevel2(''); setLevel3('');}}>
                <option value="">Main Category</option>
                {categories.filter(c => !c.parent_id && hasProductsInCategory(c.id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select className="w-full p-2.5 border rounded-lg text-sm" value={level2} onChange={(e) => {setLevel2(e.target.value); setLevel3('');}} disabled={!level1}>
                <option value="">Sub Category</option>
                {categories.filter(c => c.parent_id == level1 && hasProductsInCategory(c.id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select className="w-full p-2.5 border rounded-lg text-sm" value={level3} onChange={(e) => setLevel3(e.target.value)} disabled={!level2}>
                <option value="">Sub Sub Category</option>
                {categories.filter(c => c.parent_id == level2 && hasProductsInCategory(c.id)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-200 rounded-2xl" />)}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {products.map((product) => (
                  <div key={product.id} className="bg-white p-4 border rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <Link href={`/product/${product.id}`} className="w-full h-56 bg-gray-50 rounded-2xl mb-4 overflow-hidden block p-2 group">
                      <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    </Link>
                    
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{product.target_audience || 'General'}</span>
                      <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}</span>
                    </div>

                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition">{product.name}</h3>
                    </Link>
                    
                    <p className="text-orange-600 font-black text-xl mb-3">Tk {Number(product.regular_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    
                    <button onClick={() => openModal(product)} className="text-xs font-semibold text-blue-600 underline mb-3 self-start hover:text-blue-800">
                      View Details
                    </button>
                    
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleAddToCart(product)} className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl font-bold hover:bg-gray-800 transition text-sm">
                        Add to Cart
                      </button>
                      <button onClick={() => handleBuyNow(product)} className="flex-1 bg-orange-600 text-white py-2.5 rounded-xl font-bold hover:bg-orange-700 transition text-sm">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">No products found matching your criteria.</div>
            )}
        </div>
      </main>

      {/* Modern Footer Section */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <h2 className="text-white text-xl font-black tracking-wider">THAI-CHI ROKOMARI</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted online shop. We bring you the finest quality and attractive products from China and Thailand at affordable prices.
            </p>
            <div className="text-sm space-y-1">
              <p><span className="text-white font-semibold">Hotline:</span> +880 1234-567890</p>
              <p><span className="text-white font-semibold">Email:</span> support@example.com</p>
            </div>
          </div>

          {/* Column 2: Customer Care / Services */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-b border-gray-800 pb-2">Customer Care</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/help" className="hover:text-orange-500 transition">Help Center</Link></li>
              <li><Link href="/track-order" className="hover:text-orange-500 transition">Track Order</Link></li>
              <li><Link href="/return-policy" className="hover:text-orange-500 transition">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-orange-500 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-b border-gray-800 pb-2">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-orange-500 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-orange-500 transition">Contact Us</Link></li>
              <li><Link href="/cart" className="hover:text-orange-500 transition">Shopping Cart</Link></li>
              <li><Link href="/checkout" className="hover:text-orange-500 transition">Checkout</Link></li>
            </ul>
          </div>

          {/* Column 4: Policies and Terms */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-b border-gray-800 pb-2">Policies</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-orange-500 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-orange-500 transition">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-orange-500 transition">Refund Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Copyright and Payment Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Thai-Chi Rokomari. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <span>Secure Checkout</span>
            <span>• Cash on Delivery</span>
            <span>• bKash / Nagad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}