'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase'
import ProductForm from '@/components/ProductForm'

export default function AdminProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([]) // ক্যাটাগরি স্টেট
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const loadData = async () => {
    // ক্যাটাগরি এবং প্রোডাক্ট একসাথে লোড করুন
    const { data: catData } = await supabase.from('categories').select('*')
    const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    
    if (catData) setCategories(catData)
    if (prodData) setProducts(prodData)
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async (formData: any) => {
    if (editingProduct) {
      await supabase.from('products').update(formData).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert([formData])
    }
    setEditingProduct(null) // ফর্ম রিসেট
    loadData() // ডাটা রিফ্রেশ
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      {/* ফর্মটি এখন সবসময় উপরে থাকবে */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
        <ProductForm 
          key={editingProduct ? editingProduct.id : 'new'} // কি পরিবর্তন হলে ফর্ম রিফ্রেশ হবে
          productToEdit={editingProduct} 
          onSave={handleSave} 
          onCancel={() => setEditingProduct(null)} 
          categories={categories} 
        />
      </div>

      {/* প্রোডাক্ট টেবিল */}
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        {/* টেবিল বডি */}
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="p-4">{product.name}</td>
              <td className="p-4 font-mono">{product.sku}</td>
              <td className="p-4">
                <button onClick={() => setEditingProduct(product)} className="text-blue-600 mr-4">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}