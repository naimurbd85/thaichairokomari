'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase'

interface Category {
  id: number
  name: string
  parent_id: number | null
}

interface CategorySelectorProps {
  categories: Category[]
  onCategorySelect: (id: string) => void
  onRefreshCategories?: () => void // এখানে '?' যোগ করুন
  value?: string | number
}

export default function CategorySelector({ categories, onCategorySelect, onRefreshCategories, value }: CategorySelectorProps) {
  const supabase = createClient()
  const [rootId, setRootId] = useState<string>('')
  const [subId, setSubId] = useState<string>('')
  const [subSubId, setSubSubId] = useState<string>('')

  // নতুন ক্যাটাগরি যোগ করার জন্য লোকাল স্টেট
  const [addingTo, setAddingTo] = useState<{ type: 'root' | 'sub' | 'subSub' | null, parentId: number | null }>({ type: null, parentId: null })
  const [newCatName, setNewCatName] = useState('')

  // ডাইনামিক ক্যাটাগরি ফিল্টারিং
  const rootCategories = categories.filter(c => c.parent_id === null)
  const subCategories = categories.filter(c => c.parent_id === Number(rootId))
  const subSubCategories = categories.filter(c => c.parent_id === Number(subId))

  const handleAddCategory = async () => {
  if (!newCatName.trim()) return
  const { error } = await supabase.from('categories').insert([{ name: newCatName, parent_id: addingTo.parentId }])
  if (!error) {
    setNewCatName('')
    setAddingTo({ type: null, parentId: null })
    if (onRefreshCategories) { // এখানে চেক করে নিন
      onRefreshCategories()
    }
  }
}

  const renderAddInput = (type: 'root' | 'sub' | 'subSub', parentId: number | null) => (
    addingTo.type === type && addingTo.parentId === parentId ? (
      <div className="flex gap-1 mt-1">
        <input autoFocus className="w-full p-1 text-xs border rounded" onChange={e => setNewCatName(e.target.value)} />
        <button onClick={handleAddCategory} className="bg-green-600 text-white px-2 rounded text-xs">✓</button>
      </div>
    ) : (
      <button onClick={() => setAddingTo({ type, parentId })} className="text-blue-600 text-xs font-bold px-2 hover:bg-blue-50">+</button>
    )
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border">
      {/* Root Layer */}
      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase">Main Category {renderAddInput('root', null)}</label>
        <select value={rootId} onChange={(e) => { setRootId(e.target.value); setSubId(''); setSubSubId('') }} className="w-full p-2 border rounded text-xs">
          <option value="">Select Main</option>
          {rootCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Sub Layer */}
      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase">Sub Category {rootId && renderAddInput('sub', Number(rootId))}</label>
        <select value={subId} onChange={(e) => { setSubId(e.target.value); setSubSubId('') }} disabled={!rootId} className="w-full p-2 border rounded text-xs">
          <option value="">Select Sub</option>
          {subCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Sub-Sub Layer */}
      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase">Sub-Sub Category {subId && renderAddInput('subSub', Number(subId))}</label>
        <select value={subSubId} onChange={(e) => setSubSubId(e.target.value)} disabled={!subId} className="w-full p-2 border rounded text-xs">
          <option value="">Select Sub-Sub</option>
          {subSubCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>
  )
}