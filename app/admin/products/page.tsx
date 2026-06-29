'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/app/utils/supabase'
import CategorySelector from './CategorySelector'
import ImageUploader from './ImageUploader'

interface Category {
  id: number
  name: string
  parent_id: number | null
}

export default function AdminProductsPage() {
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()

  // ডাটা স্টেটস
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<any[]>([])

  // ফর্ম ফিল্ড স্টেটস
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [description, setDescription] = useState('')
  const [targetAudience, setTargetAudience] = useState('Men Collection')
  const [categoryId, setCategoryId] = useState<string>('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // প্রাইসিং স্টেট
  const [regularPrice, setRegularPrice] = useState('')
  const [wholesalePrice, setWholesalePrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [discountType, setDiscountType] = useState('Percentage')
  const [discountAmount, setDiscountAmount] = useState('')

  // ইনভেন্টরি স্টেট
  const [currentStock, setCurrentStock] = useState('')
  const [minimumStockAlert, setMinimumStockAlert] = useState('5')
  const [stockStatus, setStockStatus] = useState('In Stock')

  // ভেরিয়েন্ট স্টেট
  const [variantAvailable, setVariantAvailable] = useState('No')

  // ১. ডাটাবেজ থেকে ডাটা লোড করা
  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('id, name, parent_id').order('name', { ascending: true })
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    
    if (cats) setCategories(cats)
    if (prods) setProducts(prods)
  }

  useEffect(() => {
    loadData()
  }, [])

  // ২. অটোমেটিক প্রফেশনাল SKU জেনারেটর (নাম লিখলেই তৈরি হবে)
  useEffect(() => {
    if (name.trim()) {
      const sanitized = name.toUpperCase().replace(/[^A-Z0-9]+/g, '-')
      const randomNumber = Math.floor(1000 + Math.random() * 9000)
      setSku(`${sanitized}-${randomNumber}`)
    } else {
      setSku('')
    }
  }, [name])

  // ৩. ফর্ম সাবমিশন অ্যাকশন
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    startTransition(async () => {
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name,
            slug,
            sku,
            description,
            target_audience: targetAudience,
            category_id: categoryId ? parseInt(categoryId) : null,
            images: uploadedImages,
            
            // প্রাইসিং ডেটা ম্যাপিং
            price: parseFloat(regularPrice) || 0,
            regular_price: parseFloat(regularPrice) || 0,
            wholesale_price: parseFloat(wholesalePrice) || 0,
            cost_price: parseFloat(costPrice) || 0,
            discount_type: discountType,
            discount_amount: parseFloat(discountAmount) || 0,

            // ইনভেন্টরি ডেটা ম্যাপিং
            stock_quantity: parseInt(currentStock) || 0,
            low_stock_threshold: parseInt(minimumStockAlert) || 5,
            stock_status: stockStatus,

            // ভেরিয়েন্ট ম্যাপিং
            variant_available: variantAvailable === 'Yes'
          }
        ])

      if (error) {
        alert('ত্রুটি: ' + error.message)
        return
      }

      // ফর্ম রিসেট করা
      setName('')
      setDescription('')
      setRegularPrice('')
      setWholesalePrice('')
      setCostPrice('')
      setDiscountAmount('')
      setCurrentStock('')
      setUploadedImages([])
      setVariantAvailable('No')
      
      loadData()
      alert('Saved Successfully! 🚀')
    })
  }

  return (
    <div className="p-6 w-full max-w-[97%] mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Thaichi Rokomari ERP - Premium Product Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ২/৩ অংশ জুড়ে থাকা মেইন ফর্ম সেকশন */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h2 className="text-md font-bold text-gray-700 flex items-center gap-2 border-b pb-2">📦 Product Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Product Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Premium Thai Silk Attire" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">SKU (Auto Generated)</label>
                <input 
                  type="text" 
                  value={sku} 
                  onChange={(e) => setSku(e.target.value)} 
                  required 
                  className="w-full p-2 border rounded-lg bg-gray-50 font-mono text-xs text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Product Description</label>
              <textarea 
                rows={3} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder=""
              />
            </div>

            {/* অ্যাডভান্সড প্রাইসিং গ্রিড */}
            <h2 className="text-md font-bold text-gray-700 pt-4 border-b pb-2">💰 Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Regular Price (৳)</label>
                <input type="number" value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} required className="w-full p-2 border rounded-lg text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Wholesale Price (৳)</label>
                <input type="number" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} className="w-full p-2 border rounded-lg text-sm" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Cost Price (৳)</label>
                <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="w-full p-2 border rounded-lg text-sm" placeholder="0.00" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Discount Type</label>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full p-2 border rounded-lg bg-white text-sm">
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed Amount (৳)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Discount Value</label>
                <input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} className="w-full p-2 border rounded-lg text-sm" placeholder="0" />
              </div>
            </div>
          </div>

          {/* ডানের সাইডবার কলাম (ইনভেন্টরি, ক্যাটাগরি ও ফিল্টারস) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
            <h2 className="text-md font-bold text-gray-700 border-b pb-2">📊 Catalog Settings</h2>
            
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Target Audience / Collection</label>
              <select 
                value={targetAudience} 
                onChange={(e) => setTargetAudience(e.target.value)} 
                required 
                className="w-full p-2 border rounded-lg bg-white text-xs font-medium text-gray-700"
              >
                <option value="">Select a Collection</option>
                <option value="all">All Collection</option>
                <option value="men">Men Collection</option>
                <option value="women">Women Collection</option>
                <option value="kids">Kids Collection</option>
                <option value="unisex">Unisex Collection</option>
                <option value="home_kitchen">Home & Kitchen</option>
                <option value="gifts">Gifts Items</option>
                <option value="gadgets_accessories">Gadgets & Mobile Accessories</option>
              </select>
            </div>

            {/* ৩-টায়ার ক্যাটাগরি কম্পোনেন্ট */}
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Product Category Architecture</label>
              <CategorySelector categories={categories} onCategorySelect={(id) => setCategoryId(id)} />
            </div>

            {/* ইনভেন্টরি কন্ট্রোল */}
            <div className="border-t pt-3 space-y-3">
              <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">Inventory & Warehouse</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Current Stock</label>
                  <input type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required className="w-full p-2 border rounded-lg text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Min Alert Stock</label>
                  <input type="number" value={minimumStockAlert} onChange={(e) => setMinimumStockAlert(e.target.value)} required className="w-full p-2 border rounded-lg text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Stock Status</label>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {['In Stock', 'Out of Stock', 'Pre-order'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStockStatus(status)}
                      className={`p-2 border rounded-md font-medium transition ${
                        stockStatus === status ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ভেরিয়েন্ট অপশন */}
            <div className="border-t pt-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Variant Available?</label>
              <div className="flex gap-4 mt-1">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="flex items-center space-x-2 cursor-pointer text-xs">
                    <input 
                      type="radio" 
                      name="variant_available_radio" 
                      checked={variantAvailable === opt}
                      onChange={() => setVariantAvailable(opt)}
                      className="w-4 h-4 text-blue-600" 
                    />
                    <span className={variantAvailable === opt ? 'font-bold text-blue-600' : 'text-gray-600'}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* মাল্টিপল ইমেজ আপলোডার সেকশন */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-md font-bold text-gray-700 mb-3 border-b pb-2">🖼️ Product Photo</h2>
          <ImageUploader onImagesUploaded={(urls) => setUploadedImages(urls)} />
        </div>

        {/* সেভ বাটন */}
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-700 transition shadow disabled:bg-gray-400 text-sm tracking-wide"
        >
          {isPending ? 'Publishing Product System...' : '🚀 Save Product'}
        </button>
      </form>

      {/* প্রোডাক্ট লিস্ট টেবিল (ফুল স্ক্রিন উইডথ) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mt-8">
        <h2 className="text-md font-bold mb-4 text-gray-700">Live Inventory Warehouse ({products.length} Products)</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-3 w-24">Media</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Collection</th>
                <th className="p-3">SKU</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-3">
                      {product.images && product.images.length > 0 ? (
                        <div className="flex -space-x-2 overflow-hidden">
                          {product.images.slice(0, 3).map((imgUrl: string, idx: number) => (
                            <img key={idx} src={imgUrl} alt="thumb" className="w-9 h-9 object-cover rounded-full border-2 border-white bg-white shadow-sm" />
                          ))}
                          {product.images.length > 3 && (
                            <div className="w-9 h-9 bg-gray-800 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                              +{product.images.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-9 h-9 bg-gray-100 rounded-full border flex items-center justify-center text-[9px] text-gray-400 font-medium">No Img</div>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-gray-800">{product.name}</td>
                    <td className="p-3"><span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded text-xs font-medium border border-blue-100">{product.target_audience}</span></td>
                    <td className="p-3 font-mono text-xs text-gray-400">{product.sku}</td>
                    <td className="p-3 text-right font-medium text-gray-900">৳{product.price}</td>
                    <td className="p-3 text-center font-mono font-bold">{product.stock_quantity}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        product.stock_status === 'In Stock' ? 'bg-green-100 text-green-800' :
                        product.stock_status === 'Pre-order' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock_status || 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No products added yet. Start adding above!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}