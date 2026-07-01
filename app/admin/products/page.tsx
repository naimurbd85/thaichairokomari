'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase'
import ProductForm from '@/components/ProductForm'

export default function AdminProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const loadData = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async (formData: any) => {
    if (editingProduct) {
      await supabase.from('products').update(formData).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert([formData])
    }
    loadData()
    setEditingProduct(null) // ফর্ম রিসেট
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id)
      loadData()
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      {/* সরাসরি ফর্মটি টেবিলের উপরে দেখা যাবে */}
      <div className="mb-10 bg-gray-50 p-6 rounded-xl border">
        <ProductForm 
          productToEdit={editingProduct} 
          onSave={handleSave} 
          onCancel={() => setEditingProduct(null)} 
          categories={[]} 
        />
      </div>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-50 text-xs font-bold uppercase">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">SKU</th>
            <th className="p-4">Price</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-t">
              <td className="p-4">{product.name}</td>
              <td className="p-4 font-mono">{product.sku}</td>
              <td className="p-4">৳{product.regular_price}</td>
              <td className="p-4 space-x-2">
                <button 
                  onClick={() => {
                    setEditingProduct(product);
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // এডিট বাটনে ক্লিক করলে উপরে নিয়ে যাবে
                  }} 
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}