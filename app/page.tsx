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

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<any[]>([])

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [description, setDescription] = useState('')
  // ডিফল্ট ভ্যালু আপডেট করা হয়েছে
  const [targetAudience, setTargetAudience] = useState('All') 
  const [categoryId, setCategoryId] = useState<string>('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const [regularPrice, setRegularPrice] = useState('')
  const [wholesalePrice, setWholesalePrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [discountType, setDiscountType] = useState('Percentage')
  const [discountAmount, setDiscountAmount] = useState('')

  const [currentStock, setCurrentStock] = useState('')
  const [minimumStockAlert, setMinimumStockAlert] = useState('5')
  const [stockStatus, setStockStatus] = useState('In Stock')
  const [variantAvailable, setVariantAvailable] = useState('No')

  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('id, name, parent_id').order('name', { ascending: true })
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    
    if (cats) setCategories(cats)
    if (prods) setProducts(prods)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (name.trim()) {
      const sanitized = name.toUpperCase().replace(/[^A-Z0-9]+/g, '-')
      const randomNumber = Math.floor(1000 + Math.random() * 9000)
      setSku(`${sanitized}-${randomNumber}`)
    } else {
      setSku('')
    }
  }, [name])

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
            images: uploadedImages, // নিশ্চিত করুন ImageUploader থেকে সঠিক অ্যারে আসছে
            price: parseFloat(regularPrice) || 0,
            regular_price: parseFloat(regularPrice) || 0,
            wholesale_price: parseFloat(wholesalePrice) || 0,
            cost_price: parseFloat(costPrice) || 0,
            discount_type: discountType,
            discount_amount: parseFloat(discountAmount) || 0,
            stock_quantity: parseInt(currentStock) || 0,
            low_stock_threshold: parseInt(minimumStockAlert) || 5,
            stock_status: stockStatus,
            variant_available: variantAvailable === 'Yes'
          }
        ])

      if (error) {
        alert('ত্রুটি: ' + error.message)
        return
      }

      setName(''); setDescription(''); setRegularPrice(''); setWholesalePrice(''); 
      setCostPrice(''); setDiscountAmount(''); setCurrentStock(''); 
      setUploadedImages([]); setVariantAvailable('No');
      
      loadData()
      alert('Saved Successfully! 🚀')
    })
  }

  return (
    <div className="p-6 w-full max-w-[97%] mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Thaichi Rokomari ERP - Product Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h2 className="text-md font-bold text-gray-700 flex items-center gap-2 border-b pb-2">📦 Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Product Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">SKU</label>
                <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} required className="w-full p-2 border rounded-lg bg-gray-50 text-xs" />
              </div>
            </div>
            {/* ... বাকি ফিল্ডগুলো আগের মতোই থাকবে ... */}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
            <h2 className="text-md font-bold text-gray-700 border-b pb-2">📊 Catalog Settings</h2>
            
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600">Target Audience</label>
              <select 
                value={targetAudience} 
                onChange={(e) => setTargetAudience(e.target.value)} 
                required 
                className="w-full p-2 border rounded-lg bg-white text-xs"
              >
                <option value="All">All Collection</option>
                <option value="Men">Men Collection</option>
                <option value="Women">Women Collection</option>
                <option value="Kids">Kids Collection</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Gifts">Gifts Items</option>
                <option value="Gadgets">Gadgets & Mobile Accessories</option>
              </select>
            </div>
            {/* ... বাকি ইনভেন্টরি সেকশন ... */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-md font-bold text-gray-700 mb-3 border-b pb-2">🖼️ Product Photo</h2>
          <ImageUploader onImagesUploaded={(urls) => setUploadedImages(urls)} />
        </div>

        <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
          {isPending ? 'Saving...' : 'Save Product'}
        </button>
      </form>
      {/* ... টেবিল সেকশন ... */}
    </div>
  )
}