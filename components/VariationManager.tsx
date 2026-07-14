'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function VariationManager({ onAddVariation, initialData }: { onAddVariation: (variation: any) => void, initialData?: any }) {
  // ডাইনামিক লিস্টের স্টেট
  const [colorOptions, setColorOptions] = useState(['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Powder Blue', 'Dusty Rose Pink', 'Mint Green', 'Jet Black', 'Hot Pink', 'Peach Nude']);
  const [sizeOptions, setSizeOptions] = useState(['S', 'M', 'L', 'XL', 'XXL', 'Free Size']);
  
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');

  const [variation, setVariation] = useState(initialData || {
    sku: '', color: '', size: '', stock: 0, lowStock: 0, type: '',
    purchasePrice: 0, wholesalePrice: 0, sellingPrice: 0, image: ''
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
      const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) { alert("Error: " + error.message); return; }
      setVariation({...variation, image: data.path});
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-white shadow-lg">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-green-500">≡</span> {initialData ? 'EDIT VARIATION' : 'PRODUCT VARIATIONS'}
      </h2>
      
      <div className="space-y-4">
        {/* কালার এবং সাইজ সেকশন */}
        <div className="flex gap-4">
          {/* COLOR */}
          <div className="w-1/2">
            <label className="block text-xs font-medium mb-1 text-gray-400">COLOR</label>
            <div className="flex gap-1 mb-2">
              <input placeholder="New Color" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" value={newColor} onChange={e => setNewColor(e.target.value)} />
              <button className="bg-green-700 px-3 rounded-lg hover:bg-green-600" onClick={() => {if(newColor) {setColorOptions([...colorOptions, newColor]); setNewColor('')}}}>+</button>
            </div>
            <div className="flex gap-2">
              <select className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" value={variation.color} onChange={e => setVariation({...variation, color: e.target.value})}>
                <option value="">-- Select Color --</option>
                {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="text-red-500 hover:text-red-300 px-1" onClick={() => setColorOptions(colorOptions.filter(c => c !== variation.color))}>✕</button>
            </div>
          </div>
          
          {/* SIZE */}
          <div className="w-1/2">
            <label className="block text-xs font-medium mb-1 text-gray-400">SIZE</label>
            <div className="flex gap-1 mb-2">
              <input placeholder="New Size" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" value={newSize} onChange={e => setNewSize(e.target.value)} />
              <button className="bg-green-700 px-3 rounded-lg hover:bg-green-600" onClick={() => {if(newSize) {setSizeOptions([...sizeOptions, newSize]); setNewSize('')}}}>+</button>
            </div>
            <div className="flex gap-2">
              <select className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" value={variation.size} onChange={e => setVariation({...variation, size: e.target.value})}>
                <option value="">-- Select Size --</option>
                {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="text-red-500 hover:text-red-300 px-1" onClick={() => setSizeOptions(sizeOptions.filter(s => s !== variation.size))}>✕</button>
            </div>
          </div>
        </div>

        {/* স্টক এবং প্রাইস সেকশন (আপনার আগের কোড অনুযায়ী) */}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium mb-1 text-gray-400">STOCK</label><input type="number" value={variation.stock} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, stock: parseInt(e.target.value) || 0})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">LOW STOCK ALERT</label><input type="number" value={variation.lowStock} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, lowStock: parseInt(e.target.value) || 0})} /></div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-xs font-medium mb-1 text-gray-400">Cost Price</label><input type="number" value={variation.purchasePrice} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, purchasePrice: parseInt(e.target.value) || 0})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">Wholesale Price</label><input type="number" value={variation.wholesalePrice} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-yellow-500" onChange={e => setVariation({...variation, wholesalePrice: parseInt(e.target.value) || 0})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">Regular Price</label><input type="number" value={variation.sellingPrice} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-green-500" onChange={e => setVariation({...variation, sellingPrice: parseInt(e.target.value) || 0})} /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium mb-1 text-gray-400">TYPE</label><input type="text" value={variation.type} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" onChange={e => setVariation({...variation, type: e.target.value})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">SKU *</label><input type="text" required value={variation.sku} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm uppercase" onChange={e => setVariation({...variation, sku: e.target.value})} /></div>
        </div>

        {/* ইমেজ আপলোড */}
        <div className="mt-6">
          <label className="block text-xs font-medium mb-1 text-gray-400">VARIATION IMAGE</label>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800" onClick={() => fileInputRef.current?.click()}>
            <div className="text-gray-400 font-medium truncate">{variation.image ? variation.image : "Upload Variant Photo"}</div>
          </div>
        </div>

        <button onClick={() => onAddVariation(variation)} className={`w-full font-bold py-3 rounded-lg mt-2 ${initialData ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
          {initialData ? 'UPDATE VARIATION' : '+ ADD VARIATION TO GRID'}
        </button>
      </div>
    </div>
  )
}