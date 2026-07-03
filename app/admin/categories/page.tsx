'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase'
import CategorySelector from '@/components/CategorySelector'

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
    // এখানে তুমি যে স্ট্রাকচারটি সেভ করতে চাও তা হ্যান্ডেল করো
    console.log("Saving structure:", data)
    alert("Category structure ready for DB!")
  }

  // গ্রিড সিস্টেমের জন্য ডাটা ম্যাপ করা
  const mainCategories = categories.filter(c => !c.parent_id)

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
          {mainCategories.map((main) => {
            const subs = categories.filter(c => c.parent_id === main.id)
            
            // যদি কোনো সাব-ক্যাটাগরি না থাকে
            if (subs.length === 0) {
              return (
                <tr key={main.id} className="border-b">
                  <td className="border p-3 font-semibold">{main.name}</td>
                  <td className="border p-3 text-gray-400">-</td>
                  <td className="border p-3 text-gray-400">-</td>
                </tr>
              )
            }

            // সাব-ক্যাটাগরি থাকলে লুপ করা
            return subs.map((sub, index) => {
              const subSubs = categories.filter(c => c.parent_id === sub.id)
              
              return (
                <tr key={sub.id} className="border-b">
                  {index === 0 && <td className="border p-3 font-semibold" rowSpan={subs.length}>{main.name}</td>}
                  <td className="border p-3">{sub.name}</td>
                  <td className="border p-3">
                    {subSubs.length > 0 ? subSubs.map(ss => ss.name).join(', ') : '-'}
                  </td>
                </tr>
              )
            })
          })}
        </tbody>
      </table>
    </div>
  )
}