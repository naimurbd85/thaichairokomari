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
  const [tableSearch, setTableSearch] = useState('')
  // নতুন স্টেট: সিলেক্ট করা ক্যাটাগরির আইডি রাখার জন্য
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await supabase.from('categories').delete().eq('id', id)
      fetchCategories()
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const getFilteredCategories = () => {
    const mainCats = categories.filter(c => !c.parent_id)
    const list: any[] = []

    mainCats.forEach(main => {
      const subs = categories.filter(c => c.parent_id === main.id)
      if (subs.length === 0) {
        list.push({ main: main.name, sub: '-', subSub: '-', id: main.id })
      } else {
        subs.forEach(sub => {
          const subSubs = categories.filter(c => c.parent_id === sub.id)
          if (subSubs.length === 0) {
            list.push({ main: main.name, sub: sub.name, subSub: '-', id: sub.id })
          } else {
            subSubs.forEach(ss => {
              list.push({ main: main.name, sub: sub.name, subSub: ss.name, id: ss.id })
            })
          }
        })
      }
    })
    
    // ফিল্টারিং লজিক: 
    // ১. সার্চ বার অনুযায়ী ফিল্টার
    // ২. যদি কোনো ক্যাটাগরি সিলেক্ট করা থাকে, তবে তার সাথে ম্যাচ করে এমনগুলো দেখাবে
    return list.filter(item => {
      const matchesSearch = item.main.toLowerCase().includes(tableSearch.toLowerCase()) ||
                            item.sub.toLowerCase().includes(tableSearch.toLowerCase()) ||
                            item.subSub.toLowerCase().includes(tableSearch.toLowerCase())
      
      // এখানে আইডি ম্যাচিং লজিক (item.id চেক করা হচ্ছে, যা flattened লিস্টে রাখা হয়েছে)
      const matchesSelection = selectedCategoryId 
        ? (item.id === selectedCategoryId || categories.find(c => c.id === selectedCategoryId)?.parent_id === item.id || categories.find(c => c.id === selectedCategoryId)?.id === item.id) 
        : true;

      return matchesSearch && matchesSelection
    })
  }

  return (
    <div>
      <div className="sticky top-0 z-50 bg-blue-600 text-white p-4 shadow-md text-center font-bold text-xl">
        Thaichi Rokomari
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-white p-8 border rounded-lg shadow-sm mb-10">
          <h2 className="text-xl font-bold mb-6">Add/Filter Category</h2>
          <CategorySelector 
            categories={categories} 
            onRefresh={fetchCategories} 
            onCategorySelect={(id: number | null) => setSelectedCategoryId(id)} 
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Category Table:</h2>
          <input 
            type="text" 
            placeholder="Search categories..."
            className="p-2 border border-gray-300 rounded-lg w-64 text-sm"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
          />
        </div>

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
            {getFilteredCategories().map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="border p-3">{item.main}</td>
                <td className="border p-3">{item.sub}</td>
                <td className="border p-3">{item.subSub}</td>
                <td className="border p-3">
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="text-red-600 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}