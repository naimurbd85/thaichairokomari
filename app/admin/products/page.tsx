'use client'
import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/app/utils/supabase'
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

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', target_audience: 'men',
    category_id: '', regular_price: '', wholesale_price: '', cost_price: '',
    discount_type: 'Percentage', discount_amount: '', current_stock: '',
    minimum_stock_alert: '5', stock_status: 'In Stock', variant_available: 'No'
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('id, name, parent_id').order('name', { ascending: true })
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (cats) setCategories(cats)
    if (prods) setProducts(prods)
  }

  useEffect(() => { loadData() }, [])

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      target_audience: product.target_audience || 'men',
      category_id: product.category_id ? String(product.category_id) : '',
      regular_price: product.regular_price ? String(product.regular_price) : '',
      wholesale_price: product.wholesale_price ? String(product.wholesale_price) : '',
      cost_price: product.cost_price ? String(product.cost_price) : '',
      discount_type: product.discount_type || 'Percentage',
      discount_amount: product.discount_amount ? String(product.discount_amount) : '',
      current_stock: product.stock_quantity ? String(product.stock_quantity) : '',
      minimum_stock_alert: product.low_stock_threshold ? String(product.low_stock_threshold) : '5',
      stock_status: product.stock_status || 'In Stock',
      variant_available: product.variant_available ? 'Yes' : 'No'
    });
    setUploadedImages(product.images || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('Error: ' + error.message);
      } else {
        alert('Product deleted successfully!');
        loadData();
      }
    }
  }

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
      setFormData({ name: '', sku: '', description: '', target_audience: 'men', category_id: '', regular_price: '', wholesale_price: '', cost_price: '', discount_type: 'Percentage', discount_amount: '', current_stock: '', minimum_stock_alert: '5', stock_status: 'In Stock', variant_available: 'No' })
      setUploadedImages([])
      loadData()
      alert('Action Successful! 🚀')
    })
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
                <input type="text" value={formData.name || ''} onChange={e => setFormData(prev => ({...prev, name: e.target.value}))} required className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">SKU</label>
                <input type="text" value={formData.sku || ''} onChange={e => setFormData(prev => ({...prev, sku: e.target.value}))} required className="w-full p-2 border rounded-lg bg-gray-50 text-sm font-mono" />
              </div>
            </div>
            
            <label className="block text-xs font-medium mb-1">Description</label>
            <textarea rows={3} value={formData.description || ''} onChange={e => setFormData(prev => ({...prev, description: e.target.value}))} className="w-full p-2 border rounded-lg text-sm" />
            
            <h2 className="text-md font-bold text-gray-700 pt-4 border-b pb-2">💰 Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="block text-xs font-medium mb-1 text-gray-600">Cost Price</label>
                <input type="number" value={formData.cost_price || ''} onChange={e => setFormData(prev => ({...prev, cost_price: e.target.value}))} className="p-2 border rounded-lg text-sm w-full" />
              </div>
              <div className="flex flex-col">
                <label className="block text-xs font-medium mb-1 text-gray-600">Wholesale Price</label>
                <input type="number" value={formData.wholesale_price || ''} onChange={e => setFormData(prev => ({...prev, wholesale_price: e.target.value}))} className="p-2 border rounded-lg text-sm w-full" />
              </div>
              <div className="flex flex-col">
                <label className="block text-xs font-medium mb-1 text-gray-600">Regular Price</label>
                <input type="number" value={formData.regular_price || ''} onChange={e => setFormData(prev => ({...prev, regular_price: e.target.value}))} className="p-2 border rounded-lg text-sm w-full" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
            <h2 className="text-md font-bold text-gray-700 border-b pb-2">Filter and Category</h2>
            <CategorySelector categories={categories} onCategorySelect={(id: string) => setFormData(prev => ({...prev, category_id: id}))} />
              <div className="border-t pt-3">
              <label className="block text-xs font-semibold mb-2">Target Audience</label>
              <select 
                value={formData.target_audience} 
                onChange={(e) => setFormData(prev => ({...prev, target_audience: e.target.value}))} 
                required 
                className="w-full p-2 border rounded-lg bg-white text-xs font-medium text-gray-700"
              >
                <option value="all">All Collection</option>
                <option value="men">Men Collection</option>
                <option value="women">Women Collection</option>
                <option value="kids">Kids Collection</option>
              </select>
            </div>
            
            <div className="border-t pt-3">
              <label className="block text-xs font-semibold mb-2">Variant Available?</label>
              <div className="flex gap-4">
                {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-xs">
                        <input type="radio" checked={formData.variant_available === opt} onChange={() => setFormData(prev => ({...prev, variant_available: opt}))} />
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
      </form>

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
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-3">
                      {product.images?.length > 0 ? (
                        <img src={product.images[0]} className="w-9 h-9 object-cover rounded-full" />
                      ) : <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-[9px] text-gray-400">No Img</div>}
                    </td>
                    <td className="p-3 font-semibold text-gray-800">{product.name}</td>
                    <td className="p-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{product.target_audience}</span></td>
                    <td className="p-3 font-mono text-xs text-gray-400">{product.sku}</td>
                    <td className="p-3 text-right font-medium text-gray-900">৳{product.price}</td>
                    <td className="p-3 text-center font-mono font-bold">{product.stock_quantity}</td>
                    <td className="p-3 text-center space-x-2">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 font-bold text-xs">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 font-bold text-xs">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}