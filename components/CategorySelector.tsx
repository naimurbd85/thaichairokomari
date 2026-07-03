'use client'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

interface CategorySelectorProps {
  categories: any[]
  onCategorySelect: (id: string) => void
  onRefreshCategories?: () => void
  value?: string | number
  label?: string // এখানে '?' যোগ করুন (অপশনাল)
}

export default function CategorySelector({ categories, onCategorySelect, onRefreshCategories, value, label }: CategorySelectorProps) {
  const supabase = createClient()
  const [isAdding, setIsAdding] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  const handleAdd = async () => {
    if (!newCatName.trim()) return
    await supabase.from('categories').insert([{ name: newCatName }])
    setNewCatName('')
    setIsAdding(false)
    if (onRefreshCategories) onRefreshCategories()
  }

  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-sm font-semibold text-gray-700">{label} *</label>
      <div className="flex gap-2">
        {isAdding ? (
          <div className="flex w-full gap-2">
            <input 
              autoFocus 
              className="w-full p-2 border rounded-lg outline-none" 
              placeholder="নতুন নাম লিখুন..."
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 rounded-lg">✓</button>
          </div>
        ) : (
          <>
            <select 
              value={value} 
              onChange={(e) => onCategorySelect(e.target.value)}
              className="w-full p-2 border rounded-lg outline-none bg-white"
            >
              <option value="">সিলেক্ট করুন</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button 
              onClick={() => setIsAdding(true)} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 rounded-lg font-bold"
            >
              +
            </button>
          </>
        )}
      </div>
    </div>
  )
}