'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/app/utils/supabase'
import CategorySelector from '@/components/CategorySelector'
import ImageUploader from '@/components/ImageUploader'
import ProductForm from '@/components/ProductForm' // আপনি আগের স্ট্রাকচারে এটি তৈরি করেছিলেন

export default function AdminProductsPage() {
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [products, setProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // ডাটা লোড
  const loadData = async () => {
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (prods) setProducts(prods)
  }

  useEffect(() => { loadData() }, [])

  // সেভ বা আপডেট লজিক
  const handleSave = async (formData: any) => {
    startTransition(async () => {
      if (editingProduct) {
        // আপডেট মোড
        await supabase.from('products').update(formData).eq('id', editingProduct.id)
      } else {
        // ইনসার্ট মোড
        await supabase.from('products').insert([formData])
      }
      loadData()
      setIsFormOpen(false)
      setEditingProduct(null)
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadData();
  }

  return (
    <div className="p-6 w-full max-w-[97%] mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800">Thaichi Rokomari ERP</h1>
        <button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg">+ Add Product</button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <ProductForm 
                productToEdit={editingProduct} 
                onSave={handleSave} 
                onCancel={() => setIsFormOpen(false)} 
                categories={[]} // এখানে আপনার ক্যাটাগরি ডাটা পাস করুন
             />
          </div>
        </div>
      )}

      {/* টেবিল লজিক */}
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        {/* টেবিল হেডার ও বডি */}
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <button onClick={() => { setEditingProduct(product); setIsFormOpen(true); }} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}