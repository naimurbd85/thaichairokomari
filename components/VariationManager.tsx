'use client'
import { useState } from 'react'

// কালার এবং সাইজের অপশনগুলো এখানে ডিফাইন করা হলো
const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function VariationManager({ onAddVariation }: { onAddVariation: (variation: any) => void }) {
  const [variation, setVariation] = useState({
    color: '', size: '', stock: 0, lowStock: 5, purchasePrice: 0, sellingPrice: 0, image: ''
  })

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-white shadow-lg">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-green-500">≡</span> PRODUCT VARIATIONS
      </h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-xs font-medium mb-1 text-gray-400">COLOR *</label>
            <select 
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" 
              onChange={e => setVariation({...variation, color: e.target.value})}
            >
              <option value="">-- Select Color --</option>
              {COLOR_OPTIONS.map(color => <option key={color} value={color}>{color}</option>)}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-medium mb-1 text-gray-400">SIZE</label>
            <select 
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" 
              onChange={e => setVariation({...variation, size: e.target.value})}
            >
              <option value="">-- Select Size --</option>
              {SIZE_OPTIONS.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium mb-1 text-gray-400">STOCK</label><input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" defaultValue={0} onChange={e => setVariation({...variation, stock: parseInt(e.target.value)})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">LOW STOCK ALERT</label><input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" defaultValue={5} onChange={e => setVariation({...variation, lowStock: parseInt(e.target.value)})} /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs font-medium mb-1 text-gray-400">PURCHASE PRICE</label><input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm" defaultValue={0} onChange={e => setVariation({...variation, purchasePrice: parseInt(e.target.value)})} /></div>
          <div><label className="block text-xs font-medium mb-1 text-gray-400">SELLING PRICE</label><input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-green-500" defaultValue={0} onChange={e => setVariation({...variation, sellingPrice: parseInt(e.target.value)})} /></div>
        </div>

        <div>
            <label className="block text-xs font-medium mb-1 text-gray-400">VARIATION IMAGE</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800">
                <div className="text-gray-400">+ UPLOAD</div>
                <p className="text-[10px] text-gray-500">PNG, JPG, or WEBP up to 2MB</p>
            </div>
        </div>

        <button 
          onClick={() => onAddVariation(variation)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2"
        >
          + ADD VARIATION TO GRID
        </button>
      </div>
    </div>
  )
}