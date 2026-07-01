'use client'
import { useState, useEffect } from 'react'
import ImageUploader from './ImageUploader'
import CategorySelector from './CategorySelector'

export default function ProductForm({ productToEdit, onSave, onCancel, categories }: any) {
  // প্রাথমিক স্টেট: যদি productToEdit থাকে তবে তা দিয়ে লোড হবে, না হলে খালি
  const [formData, setFormData] = useState(productToEdit || {
    name: '', sku: '', description: '', target_audience: 'Men Collection',
    category_id: '', images: [], regular_price: '', wholesale_price: '',
    cost_price: '', discount_type: 'Percentage', discount_amount: '',
    stock_quantity: '', low_stock_threshold: '5', stock_status: 'In Stock', variant_available: 'No'
  })

  // এডিট মোড হলে ডাটা আপডেট করার জন্য useEffect
  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit)
    }
  }, [productToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData) // পেজে থাকা handleSave ফাংশনটি কল হবে
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border space-y-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {productToEdit ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <input 
          type="text" placeholder="Product Name" value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className="p-2 border rounded" required 
        />
        <input 
          type="text" placeholder="SKU" value={formData.sku} 
          onChange={e => setFormData({...formData, sku: e.target.value})} 
          className="p-2 border rounded bg-gray-50" 
        />
      </div>

      <textarea 
        placeholder="Description" value={formData.description} 
        onChange={e => setFormData({...formData, description: e.target.value})} 
        className="w-full p-2 border rounded" rows={3} 
      />

      <div className="grid grid-cols-3 gap-4">
        <input type="number" placeholder="Regular Price" value={formData.regular_price} onChange={e => setFormData({...formData, regular_price: e.target.value})} className="p-2 border rounded" />
        <input type="number" placeholder="Wholesale" value={formData.wholesale_price} onChange={e => setFormData({...formData, wholesale_price: e.target.value})} className="p-2 border rounded" />
        <input type="number" placeholder="Cost" value={formData.cost_price} onChange={e => setFormData({...formData, cost_price: e.target.value})} className="p-2 border rounded" />
      </div>

      <CategorySelector 
        categories={categories} 
        onCategorySelect={(id: string) => setFormData({...formData, category_id: id})} 
      />

      <ImageUploader 
        onImagesUploaded={(urls: string[]) => setFormData({...formData, images: urls as any})} 
      />

      <div className="flex gap-3 mt-6">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold">
          {productToEdit ? 'Update Product' : 'Save Product'}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 py-2 rounded font-bold">
          Cancel
        </button>
      </div>
    </form>
  )
}