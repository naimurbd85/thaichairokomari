'use client'
import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
  parent_id: number | null
}

interface CategorySelectorProps {
  categories: Category[]
  onCategorySelect: (id: string) => void
  value?: string | number // এডিট মোডের জন্য ভ্যালু রিসিভ করবে
}

export default function CategorySelector({ categories, onCategorySelect, value }: CategorySelectorProps) {
  const [rootId, setRootId] = useState<string>('')
  const [subId, setSubId] = useState<string>('')
  const [subSubId, setSubSubId] = useState<string>('')

  // এডিট মোডে থাকলে ক্যাটাগরি ট্রি খুঁজে বের করার লজিক
  useEffect(() => {
    if (value) {
      const selected = categories.find(c => c.id === Number(value))
      if (!selected) return

      if (selected.parent_id === null) {
        setRootId(String(selected.id))
      } else {
        const parent = categories.find(c => c.id === selected.parent_id)
        if (parent?.parent_id === null) {
          setRootId(String(parent.id))
          setSubId(String(selected.id))
        } else if (parent) {
          const grandParent = categories.find(c => c.id === parent.parent_id)
          setRootId(String(grandParent?.id))
          setSubId(String(parent.id))
          setSubSubId(String(selected.id))
        }
      }
    }
  }, [value, categories])

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