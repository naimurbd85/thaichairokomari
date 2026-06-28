'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
  parent_id: number | null
}

interface CategorySelectorProps {
  categories: Category[]
}

export default function CategorySelector({ categories }: CategorySelectorProps) {
  const [rootId, setRootId] = useState<string>('')
  const [subId, setSubId] = useState<string>('')
  const [subSubId, setSubSubId] = useState<string>('')

  // লেয়ার ১ (Root) ক্যাটাগরি ফিল্টার
  const rootCategories = categories.filter(c => c.parent_id === null)

  // লেয়ার ২ (Sub) ক্যাটাগরি ফিল্টার
  const subCategories = categories.filter(c => c.parent_id === Number(rootId))

  // লেয়ার ৩ (Sub-Sub) ক্যাটাগরি ফিল্টার
  const subSubCategories = categories.filter(c => c.parent_id === Number(subId))

  // প্যারেন্ট ক্যাটাগরি চেঞ্জ হলে চাইল্ড ক্যাটাগরি রিসেট করা
  useEffect(() => {
    setSubId('')
    setSubSubId('')
  }, [rootId])

  useEffect(() => {
    setSubSubId('')
  }, [subId])

  return (
    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border">
      <h3 className="md:col-span-3 text-sm font-semibold text-gray-700">Select Product Category (3-Tier)</h3>
      
      {/* লেয়ার ১: মেইন ক্যাটাগরি */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">Main Category</label>
        <select
          value={rootId}
          onChange={(e) => setRootId(e.target.value)}
          className="w-full p-2 border rounded bg-white"
        >
          <option value="">Select Main</option>
          {rootCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* লেয়ার ২: সাব ক্যাটাগরি */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">Sub Category</label>
        <select
          value={subId}
          onChange={(e) => setSubId(e.target.value)}
          disabled={!rootId || subCategories.length === 0}
          className="w-full p-2 border rounded bg-white disabled:bg-gray-100"
        >
          <option value="">Select Sub</option>
          {subCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* লেয়ার ৩: সাব-সাব ক্যাটাগরি */}
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">Sub-Sub Category</label>
        <select
          value={subSubId}
          onChange={(e) => setSubSubId(e.target.value)}
          disabled={!subId || subSubCategories.length === 0}
          className="w-full p-2 border rounded bg-white disabled:bg-gray-100"
        >
          <option value="">Select Sub-Sub</option>
          {subSubCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* এই হিডেন ইনপুটটি ফর্ম সাবমিট করার সময় ফাইনাল ক্যাটাগরি আইডি ব্যাকএন্ডে পাঠাবে */}
      <input 
        type="hidden" 
        name="category_id" 
        value={subSubId || subId || rootId} 
      />
    </div>
  )
}