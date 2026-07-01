'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
  parent_id: number | null
}

interface CategorySelectorProps {
  categories: Category[]
  onCategorySelect: (id: string) => void // টাইপস্ক্রিপ্ট এরর ফিক্স করার জন্য প্রপ্স ডিফাইন
}

export default function CategorySelector({ categories, onCategorySelect }: CategorySelectorProps) {
  const [rootId, setRootId] = useState<string>('')
  const [subId, setSubId] = useState<string>('')
  const [subSubId, setSubSubId] = useState<string>('')

  const rootCategories = categories.filter(c => c.parent_id === null)
  const subCategories = categories.filter(c => c.parent_id === Number(rootId))
  const subSubCategories = categories.filter(c => c.parent_id === Number(subId))

  useEffect(() => {
    setSubId('')
    setSubSubId('')
  }, [rootId])

  useEffect(() => {
    setSubSubId('')
  }, [subId])

  // যখনই কোনো লেয়ার সিলেক্ট হবে, মেইন পেজের স্টেটকে আপডেট করবে
  useEffect(() => {
    const finalId = subSubId || subId || rootId
    onCategorySelect(finalId)
  }, [rootId, subId, subSubId, onCategorySelect])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg border">
      <div>
        <label className="block text-[11px] font-medium mb-1 text-gray-500">Main Category</label>
        <select
          value={rootId}
          onChange={(e) => setRootId(e.target.value)}
          className="w-full p-2 border rounded-md bg-white text-xs outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Main</option>
          {rootCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-medium mb-1 text-gray-500">Sub Category</label>
        <select
          value={subId}
          onChange={(e) => setSubId(e.target.value)}
          disabled={!rootId || subCategories.length === 0}
          className="w-full p-2 border rounded-md bg-white text-xs outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Select Sub</option>
          {subCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-medium mb-1 text-gray-500">Sub-Sub Category</label>
        <select
          value={subSubId}
          onChange={(e) => setSubSubId(e.target.value)}
          disabled={!subId || subSubCategories.length === 0}
          className="w-full p-2 border rounded-md bg-white text-xs outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Select Sub-Sub</option>
          {subSubCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}