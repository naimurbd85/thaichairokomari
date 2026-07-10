'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase'
import VariationManager from '@/components/VariationManager'

export default function ManageVariationsPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editingIndex, setEditingIndex] = useState<number | null>(null) // এডিট মোডের জন্য

  const loadProduct = async () => {
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    if (data) setProduct(data)
    setLoading(false)
  }

  useEffect(() => { loadProduct() }, [id])

  // নতুন এবং এডিট করা ভেরিয়েন্ট সেভ করার ফাংশন
  const handleSaveVariation = async (variationData: any) => {
    let updatedVariations = [...(product.variations || [])]

    if (editingIndex !== null) {
      // এডিট মোড: নির্দিষ্ট ইনডেক্সের ডেটা আপডেট করা
      updatedVariations[editingIndex] = variationData
      setEditingIndex(null)
    } else {
      // নতুন এড মোড
      updatedVariations.push(variationData)
    }
    
    const { error } = await supabase
      .from('products')
      .update({ variations: updatedVariations })
      .eq('id', id)

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert(editingIndex !== null ? "Variation Updated!" : "Variation Added!")
      loadProduct()
    }
  }

  const deleteVariation = async (index: number) => {
    if (!confirm("Are you sure?")) return
    const updated = product.variations.filter((_: any, i: number) => i !== index)
    
    await supabase.from('products').update({ variations: updated }).eq('id', id)
    loadProduct()
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 underline">← Back to Products</button>
      <h1 className="text-2xl font-bold mb-6">Manage Variations: {product.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* বাম পাশে ফর্ম - এডিট মোড হলে initialData পাস হবে */}
        <div className="lg:col-span-1">
          <VariationManager 
            onAddVariation={handleSaveVariation} 
            initialData={editingIndex !== null ? product.variations[editingIndex] : null} 
          />
          {editingIndex !== null && (
            <button 
              onClick={() => setEditingIndex(null)}
              className="w-full mt-4 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* ডান পাশে বর্তমান ভেরিয়েন্ট লিস্ট */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-bold mb-4">Existing Variations</h2>
          <div className="space-y-3">
            {product.variations?.map((v: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  {/* ভেরিয়েন্ট ইমেজ */}
                  <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center border">
                    {v.image ? (
                       <div className="text-[8px] text-gray-400">{v.image}</div> 
                       // যদি ইমেজ ইউআরএল থাকে তবে <img src={v.image} /> ব্যবহার করবেন
                    ) : <span className="text-[10px] text-gray-400">No Img</span>}
                  </div>
                  <div>
                    <p className="font-bold">{v.color} - {v.size}</p>
                    <p className="text-xs text-gray-500">SKU: {v.sku} | Cost: ৳{v.purchasePrice} | Sell: ৳{v.sellingPrice}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingIndex(index)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs font-bold"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteVariation(index)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}