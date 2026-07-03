'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase'
import CategorySelector from '@/components/CategorySelector' // তোমার তৈরি করা নতুন কম্পোনেন্ট

interface Category {
  id: number
  name: string
  parent_id: number | null
  slug: string
}

export default function AdminCategoriesPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSave = async (data: { level1: string; level2: string; level3: string }) => {
    // এখানে তোমার সেভ লজিক হবে
    console.log("Saving:", data)
    alert("Category structure saved!")
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 border rounded-lg shadow-sm mb-10">
        <h2 className="text-xl font-bold mb-6">Add Category</h2>
        <CategorySelector categories={categories} onSave={handleSave} onRefresh={fetchCategories} />
      </div>

      <h2 className="text-xl font-bold mb-4">Grid System:</h2>
      <table className="w-full text-left border-collapse border">
        <thead>
          <tr className="bg-gray-100 uppercase text-sm">
            <th className="border p-3">Cat</th>
            <th className="border p-3">Sub Cat</th>
            <th className="border p-3">Sub Sub Cat</th>
          </tr>
        </thead>
        <tbody>
           {/* এখানে তোর ডাটাগুলো এক্সেলের মতো করে ম্যাপ করবি */}
           {categories.filter(c => !c.parent_id).map(cat => (
             <tr key={cat.id} className="border-b">
               <td className="border p-3">{cat.name}</td>
               <td className="border p-3">...sub data...</td>
               <td className="border p-3">...sub sub data...</td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  )
}