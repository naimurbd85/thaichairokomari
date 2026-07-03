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
      <h1 className="text-2xl font-bold mb-6">Thaichi Rokomari ERP - Category Management</h1>
      
      {/* ফর্ম উপরে */}
      <div className="bg-white p-6 border rounded-lg shadow-sm mb-10">
        <h2 className="text-lg font-semibold mb-4">Add Category</h2>
        <CategorySelector categories={categories} onSave={handleSave} />
      </div>

      {/* গ্রিড সিস্টেম নিচে */}
      <h2 className="text-xl font-bold mb-4">Grid System:</h2>
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b uppercase text-sm text-gray-600">
              <th className="p-2">Cat</th>
              <th className="p-2">Sub Cat</th>
              <th className="p-2">Sub Sub Cat</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b text-sm">
                <td className="p-2">{!cat.parent_id ? cat.name : '-'}</td>
                <td className="p-2">{cat.parent_id ? cat.name : '-'}</td>
                <td className="p-2">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}