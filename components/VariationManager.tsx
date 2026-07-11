'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase'

const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function VariationManager({ onAddVariation, initialData }: { onAddVariation: (variation: any) => void, initialData?: any }) {
  const [variation, setVariation] = useState(initialData || {
    sku: '', color: '', size: '', stock: '', lowStock: '', type: '',
    purchasePrice: '', wholesalePrice: '', sellingPrice: '', image: ''
  });

  useEffect(() => {
    if (initialData) setVariation(initialData);
  }, [initialData]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const supabase = createClient();

      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) {
        alert("Error uploading image: " + error.message);
        return;
      }

      setVariation({...variation, image: data.path});
      alert('Image uploaded successfully!');
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-white shadow-lg">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-green-500">≡</span> {initialData ? 'EDIT VARIATION' : 'PRODUCT VARIATIONS'}
      </h2>
      <div className="space-y-4">
        {/* কালার এবং সাইজ */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-xs font-medium mb-1 text-gray-400">COLOR</label>
            <select value={variation.color} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, color: e.target.value})}>
              <option value="">-- Select Color --</option>
              {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-medium mb-1 text-gray-400">SIZE</label>
            <select value={variation.size} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, size: e.target.value})}>
              <option value="">-- Select Size --</option>
              {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* স্টক এবং লো স্টক */}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium mb-1 text-gray-400">STOCK</label><input type="number" value={variation.stock} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, stock: parseInt(e.target.value) || 0})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">LOW STOCK ALERT</label><input type="number" value={variation.lowStock} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, lowStock: parseInt(e.target.value) || 0})} /></div>
        </div>

        {/* প্রাইসসমূহ */}
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-xs font-medium mb-1 text-gray-400">Cost Price</label><input type="number" value={variation.purchasePrice} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, purchasePrice: parseInt(e.target.value) || 0})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">Wholesale Price</label><input type="number" value={variation.wholesalePrice} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-yellow-500" onChange={e => setVariation({...variation, wholesalePrice: parseInt(e.target.value) || 0})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">Regular Price</label><input type="number" value={variation.sellingPrice} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-green-500" onChange={e => setVariation({...variation, sellingPrice: parseInt(e.target.value) || 0})} /></div>
        </div>

        {/* TYPE (বাম) এবং SKU (ডান) পাশাপাশি */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-400">TYPE</label>
            <input 
              type="text" 
              value={variation.type} 
              placeholder="e.g. Regular, Premium" 
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" 
              onChange={e => setVariation({...variation, type: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-400">SKU *</label>
            <input 
              type="text" 
              value={variation.sku} 
              required 
              placeholder="Enter SKU" 
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm uppercase" 
              onChange={e => setVariation({...variation, sku: e.target.value})} 
            />
          </div>
        </div>

        {/* ইমেজ আপলোড */}
        <div className="mt-6">
          <label className="block text-xs font-medium mb-1 text-gray-400">VARIATION IMAGE</label>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => fileInputRef.current?.click()}>
            <div className="text-gray-400 font-medium truncate">{variation.image ? variation.image : "Upload Variant Photo"}</div>
          </div>
        </div>

        {/* সাবমিট বাটন */}
        <button onClick={() => onAddVariation(variation)} className={`w-full font-bold py-3 rounded-lg mt-2 ${initialData ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
          {initialData ? 'UPDATE VARIATION' : '+ ADD VARIATION TO GRID'}
        </button>
      </div>
    </div>
  )
}