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
        list.push({ main: main.name, sub: '-', subSub: '-', id: main.id, mainId: main.id, subId: null, subSubId: null })
      } else {
        subs.forEach(sub => {
          const subSubs = categories.filter(c => c.parent_id === sub.id)
          if (subSubs.length === 0) {
            list.push({ main: main.name, sub: sub.name, subSub: '-', id: sub.id, mainId: main.id, subId: sub.id, subSubId: null })
          } else {
            subSubs.forEach(ss => {
              list.push({ main: main.name, sub: sub.name, subSub: ss.name, id: ss.id, mainId: main.id, subId: sub.id, subSubId: ss.id })
            })
          }
        })
      }
    })
    
    return list.filter(item => {
      // সার্চ লজিক
      const matchesSearch = item.main.toLowerCase().includes(tableSearch.toLowerCase()) ||
                            item.sub.toLowerCase().includes(tableSearch.toLowerCase()) ||
                            item.subSub.toLowerCase().includes(tableSearch.toLowerCase())
      
      // সিলেকশন লজিক: সিলেক্টেড আইডি যদি মেইন, সাব বা সাব-সাব আইডির সাথে মিলে যায়
      const matchesSelection = selectedCategoryId 
        ? (Number(item.mainId) === Number(selectedCategoryId) || 
           Number(item.subId) === Number(selectedCategoryId) || 
           Number(item.subSubId) === Number(selectedCategoryId))
        : true

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