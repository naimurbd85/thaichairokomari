'use client'
import { useState, useEffect, useTransition } from 'react' // এটি নিশ্চিত করুন যে 'react' থেকে ইমপোর্ট হচ্ছে
import { createClient } from '@/app/utils/supabase'

// আপনার 'components' ফোল্ডারটি 'app' ফোল্ডারের ভেতরে থাকলে:
import ProductForm from '@/components/ProductForm'
import CategorySelector from '@/components/CategorySelector'
import ImageUploader from '@/components/ImageUploader'
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
  const [editingProduct, setEditingProduct] = useState<any>(null)

  // ফর্ম ফিল্ড স্টেট
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', target_audience: 'Men Collection',
    category_id: '', regular_price: '', wholesale_price: '', cost_price: '',
    discount_type: 'Percentage', discount_amount: '', current_stock: '',
    minimum_stock_alert: '5', stock_status: 'In Stock', variant_available: 'No'
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // ডাটা লোড ফাংশন
  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('id, name, parent_id').order('name', { ascending: true })
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (cats) setCategories(cats)
    if (prods) setProducts(prods)
  }

  useEffect(() => { loadData() }, [])

  // অটোমেটিক SKU জেনারেটর (শুধুমাত্র নতুন প্রোডাক্টের জন্য)
  useEffect(() => {
    if (!editingProduct && formData.name.trim()) {
      const sanitized = formData.name.toUpperCase().replace(/[^A-Z0-9]+/g, '-')
      const random = Math.floor(1000 + Math.random() * 9000)
      setFormData(prev => ({ ...prev, sku: `${sanitized}-${random}` }))
    }
  }, [formData.name, editingProduct])

  // এডিট বাটনে ক্লিক করলে ফর্ম ফিল্ড ফিলাপ হবে
  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name, sku: product.sku, description: product.description,
      target_audience: product.target_audience, category_id: String(product.category_id || ''),
      regular_price: String(product.regular_price || ''), wholesale_price: String(product.wholesale_price || ''),
      cost_price: String(product.cost_price || ''), discount_type: product.discount_type,
      discount_amount: String(product.discount_amount || ''), current_stock: String(product.stock_quantity || ''),
      minimum_stock_alert: String(product.low_stock_threshold || '5'),
      stock_status: product.stock_status, variant_available: product.variant_available ? 'Yes' : 'No'
    })
    setUploadedImages(product.images || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ফর্ম সাবমিশন (Update বা Insert)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: formData.sku,
        description: formData.description,
        target_audience: formData.target_audience,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        images: uploadedImages,
        price: parseFloat(formData.regular_price) || 0,
        regular_price: parseFloat(formData.regular_price) || 0,
        wholesale_price: parseFloat(formData.wholesale_price) || 0,
        cost_price: parseFloat(formData.cost_price) || 0,
        discount_type: formData.discount_type,
        discount_amount: parseFloat(formData.discount_amount) || 0,
        stock_quantity: parseInt(formData.current_stock) || 0,
        low_stock_threshold: parseInt(formData.minimum_stock_alert) || 5,
        stock_status: formData.stock_status,
        variant_available: formData.variant_available === 'Yes'
      }

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id)
        if (error) alert('Error: ' + error.message)
      } else {
        const { error } = await supabase.from('products').insert([payload])
        if (error) alert('Error: ' + error.message)
      }

      setEditingProduct(null)
      setFormData({ name: '', sku: '', description: '', target_audience: 'Men Collection', category_id: '', regular_price: '', wholesale_price: '', cost_price: '', discount_type: 'Percentage', discount_amount: '', current_stock: '', minimum_stock_alert: '5', stock_status: 'In Stock', variant_available: 'No' })
      setUploadedImages([])
      loadData()
      alert('Action Successful! 🚀')
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this?')) return
    await supabase.from('products').delete().eq('id', id)
    loadData()
  }

  return (
    <div className="p-6 w-full max-w-[97%] mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Thaichi Rokomari'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h2 className="text-md font-bold text-gray-700 border-b pb-2">📦 Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Product Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">SKU</label>
                <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required className="w-full p-2 border rounded-lg bg-gray-50 text-sm font-mono" />
              </div>
            </div>
            
            {/* আরও ইনপুট ফিল্ডগুলো এখানে আপনার আগের ডিজাইনের মতোই বসান */}
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="Description" />
            
            <h2 className="text-md font-bold text-gray-700 pt-4 border-b pb-2">💰 Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cost Price */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium mb-1 text-gray-600">Cost Price</label>
                <input 
                  type="number" 
                  value={formData.cost_price} 
                  onChange={e => setFormData({...formData, cost_price: e.target.value})} 
                  placeholder="0.00" 
                  className="p-2 border rounded-lg text-sm w-full" 
                />
              </div>

              {/* Wholesale Price */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium mb-1 text-gray-600">Wholesale Price</label>
                <input 
                  type="number" 
                  value={formData.wholesale_price} 
                  onChange={e => setFormData({...formData, wholesale_price: e.target.value})} 
                  placeholder="0.00" 
                  className="p-2 border rounded-lg text-sm w-full" 
                />
              </div>

              {/* Regular Price */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium mb-1 text-gray-600">Regular Price</label>
                <input 
                  type="number" 
                  value={formData.regular_price} 
                  onChange={e => setFormData({...formData, regular_price: e.target.value})} 
                  placeholder="0.00" 
                  className="p-2 border rounded-lg text-sm w-full" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
            <h2 className="text-md font-bold text-gray-700 border-b pb-2">Filter and Category</h2>
            <CategorySelector categories={categories} onCategorySelect={(id: string) => setFormData({...formData, category_id: id})} />
            
            <div className="border-t pt-3">
              <label className="block text-xs font-semibold mb-2">Variant Available?</label>
              <div className="flex gap-4">
                {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-xs">
                        <input type="radio" checked={formData.variant_available === opt} onChange={() => setFormData({...formData, variant_available: opt})} />
                        {opt}
                    </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ImageUploader onImagesUploaded={(urls: string[]) => setUploadedImages(urls)} />

        <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl">
          {isPending ? 'Processing...' : (editingProduct ? 'Update Product' : '🚀 Save Product')}
        </button>
        {editingProduct && (
          <button type="button" onClick={() => { setEditingProduct(null); setFormData({name:'', sku:'', description:'', target_audience:'Men Collection', category_id:'', regular_price:'', wholesale_price:'', cost_price:'', discount_type:'Percentage', discount_amount:'', current_stock:'', minimum_stock_alert:'5', stock_status:'In Stock', variant_available:'No'}); }} className="w-full bg-gray-400 text-white py-3.5 rounded-xl">Cancel Edit</button>
        )}
      </form>

      {/* টেবিল অংশটি আগের মতোই থাকবে */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mt-8">
        <table className="w-full text-left">
           <thead><tr className="border-b bg-gray-50 text-xs uppercase font-bold text-gray-500">
               <th className="p-3">Product</th><th className="p-3">SKU</th><th className="p-3">Price</th><th className="p-3">Actions</th>
           </tr></thead>
           <tbody>
             {products.map(product => (
               <tr key={product.id} className="border-b">
                 <td className="p-3 font-semibold">{product.name}</td>
                 <td className="p-3 font-mono text-xs">{product.sku}</td>
                 <td className="p-3">৳{product.regular_price}</td>
                 <td className="p-3 space-x-2">
                   <button onClick={() => handleEdit(product)} className="text-blue-600 font-bold text-xs">Edit</button>
                   <button onClick={() => handleDelete(product.id)} className="text-red-600 font-bold text-xs">Delete</button>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  )
}