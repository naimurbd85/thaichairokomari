'use client'
import { useState, useEffect } from 'react'
import ImageUploader from './ImageUploader'
import CategorySelector from './CategorySelector'

export default function ProductForm({ productToEdit, onSave, onCancel, categories }: any) {
  // প্রাথমিক ডাটা স্ট্রাকচার
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', category_id: '', 
    regular_price: '', wholesale_price: '', cost_price: ''
  })

  // এডিট মোড হলে ডাটা সেট করা
  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit)
    } else {
      setFormData({
        name: '', sku: '', description: '', category_id: '', 
        regular_price: '', wholesale_price: '', cost_price: ''
      })
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
          // value যদি null বা undefined হয় তবে খালি স্ট্রিং "" ব্যবহার করুন
          value={formData.name || ''} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className="p-2 border rounded w-full" placeholder="Product Name" 
        />
        <input 
          value={formData.sku || ''} 
          onChange={e => setFormData({...formData, sku: e.target.value})} 
          className="p-2 border rounded w-full" placeholder="SKU" 
        />
      </div>

      <CategorySelector 
        categories={categories} 
        value={formData.category_id || ''}
        onCategorySelect={(id: any) => setFormData(prev => ({...prev, category_id: id}))} 
      />

      <div className="flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          {productToEdit ? 'Update' : 'Save'}
        </button>
        <button type="button" onClick={() => {
            onCancel();
            setFormData({ name: '', sku: '', description: '', category_id: '', regular_price: '', wholesale_price: '', cost_price: '' });
        }} className="bg-gray-200 px-6 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  )
}