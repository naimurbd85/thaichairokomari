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

  // ডিলিট ফাংশন
  const handleDelete = async (id: number) => {
    if (confirm("সত্যিই কি ডিলিট করতে চান?")) {
      await supabase.from('categories').delete().eq('id', id)
      fetchCategories()
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSave = async (data: { level1: string; level2: string; level3: string }) => {
    alert("Saved!")
  }

  return (
    // max-w-4xl থেকে 6xl করে দিয়েছি যেন দুই পাশে জায়গা নেয়
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-white p-8 border rounded-lg shadow-sm mb-10">
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
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.filter(c => !c.parent_id).map((main) => {
            const subs = categories.filter(c => c.parent_id === main.id)
            return subs.map((sub, sIdx) => {
              const subSubs = categories.filter(c => c.parent_id === sub.id)
              return subSubs.length > 0 ? subSubs.map((ss, ssIdx) => (
                <tr key={ss.id} className="border-b">
                  {sIdx === 0 && ssIdx === 0 && <td className="border p-3" rowSpan={subs.length + subSubs.length}>{main.name}</td>}
                  {ssIdx === 0 && <td className="border p-3">{sub.name}</td>}
                  <td className="border p-3">{ss.name}</td>
                  <td className="border p-3 flex gap-2">
                    <button className="text-blue-500">Edit</button>
                    <button onClick={() => handleDelete(ss.id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr key={sub.id} className="border-b">
                  {sIdx === 0 && <td className="border p-3">{main.name}</td>}
                  <td className="border p-3">{sub.name}</td>
                  <td className="border p-3">-</td>
                  <td className="border p-3 flex gap-2">
                    <button className="text-blue-500">Edit</button>
                    <button onClick={() => handleDelete(sub.id)} className="text-red-500">Delete</button>
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