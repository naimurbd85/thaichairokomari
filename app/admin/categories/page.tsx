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
    // এখানে তোমার সেভ লজিক বসাও
    console.log("Saving structure:", data)
    alert("Structure captured! Implement your Supabase update logic here.")
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
          {categories.filter(c => !c.parent_id).map((main) => {
            const subs = categories.filter(c => c.parent_id === main.id)
            
            if (subs.length === 0) {
              return (
                <tr key={main.id} className="border-b">
                  <td className="border p-3 font-semibold">{main.name}</td>
                  <td className="border p-3 text-gray-400">-</td>
                  <td className="border p-3 text-gray-400">-</td>
                </tr>
              )
            }

            return subs.map((sub, subIndex) => {
              const subSubs = categories.filter(c => c.parent_id === sub.id)
              
              if (subSubs.length === 0) {
                return (
                  <tr key={sub.id} className="border-b">
                    {subIndex === 0 && <td className="border p-3 font-semibold" rowSpan={subs.length}>{main.name}</td>}
                    <td className="border p-3">{sub.name}</td>
                    <td className="border p-3 text-gray-400">-</td>
                  </tr>
                )
              }

              return subSubs.map((ss, ssIndex) => (
                <tr key={ss.id} className="border-b">
                  {subIndex === 0 && ssIndex === 0 && <td className="border p-3 font-semibold" rowSpan={subs.reduce((acc, s) => acc + Math.max(categories.filter(c => c.parent_id === s.id).length, 1), 0)}>{main.name}</td>}
                  {ssIndex === 0 && <td className="border p-3" rowSpan={subSubs.length}>{sub.name}</td>}
                  <td className="border p-3">{ss.name}</td>
                </tr>
              ))
            })
          })}
        </tbody>
      </table>
    </div>
  )
}