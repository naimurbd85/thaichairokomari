'use client'
import { useState, useEffect } from 'react'
import ImageUploader from './ImageUploader'
import CategorySelector from './CategorySelector'

export default function ProductForm({ productToEdit, onSave, onCancel, categories }: any) {
  const initialData = {
    name: '', sku: '', description: '', category_id: '', 
    regular_price: '', wholesale_price: '', cost_price: ''
  }

  const [formData, setFormData] = useState(initialData)

  // productToEdit পরিবর্তন হলে স্টেট আপডেট হবে
  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit)
    } else {
      setFormData(initialData)
    }
  }, [productToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className="p-2 border rounded w-full" placeholder="Product Name" 
        />
        <input 
          value={formData.sku} 
          onChange={e => setFormData({...formData, sku: e.target.value})} 
          className="p-2 border rounded w-full" placeholder="SKU" 
        />
      </div>

      {/* ক্যাটাগরি সিলেক্টর */}
      <CategorySelector 
        categories={categories} 
        value={formData.category_id}
        onCategorySelect={(id: any) => setFormData({...formData, category_id: id})} 
      />

      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          {productToEdit ? 'Update' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-200 px-6 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  )
}