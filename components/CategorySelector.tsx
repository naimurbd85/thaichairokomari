'use client'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function CategorySelector({ categories, onRefresh }: any) {
  const supabase = createClient()
  const [level1, setLevel1] = useState('')
  const [level2, setLevel2] = useState('')
  const [level3, setLevel3] = useState('')
  const [loading, setLoading] = useState(false)

  const addCategory = async (parentId: string | null) => {
    const name = prompt("Enter new category name:")
    if (!name || !name.trim()) return

    // Auto-generate slug from name
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-')

    setLoading(true)
    const { error } = await supabase
      .from('categories')
      .insert([{ 
          name: name.trim(), 
          parent_id: parentId || null,
          slug: slug 
      }])

    if (error) {
      alert("Error saving category: " + error.message)
    } else if (onRefresh) {
      onRefresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Level 1 Category */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium">Main Cat</label>
        <select 
          onChange={(e) => {setLevel1(e.target.value); setLevel2(''); setLevel3('')}} 
          className="flex-1 p-2 border rounded"
          disabled={loading}
        >
          <option value="">Select</option>
          {categories.filter((c:any) => !c.parent_id).map((c:any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={() => addCategory(null)} className="px-4 bg-gray-200 hover:bg-gray-300 rounded font-bold">+</button>
      </div>

      {/* Level 2 Category */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium">Sub Cat</label>
        <select 
          onChange={(e) => {setLevel2(e.target.value); setLevel3('')}} 
          value={level2} 
          disabled={!level1 || loading}
          className="flex-1 p-2 border rounded"
        >
          <option value="">Select</option>
          {categories.filter((c:any) => c.parent_id == level1).map((c:any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={() => addCategory(level1)} className="px-4 bg-gray-200 hover:bg-gray-300 rounded font-bold" disabled={!level1}>+</button>
      </div>

      {/* Level 3 Category */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium">Sub Sub Cat</label>
        <select 
          onChange={(e) => setLevel3(e.target.value)} 
          value={level3} 
          disabled={!level2 || loading}
          className="flex-1 p-2 border rounded"
        >
          <option value="">Select</option>
          {categories.filter((c:any) => c.parent_id == level2).map((c:any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={() => addCategory(level2)} className="px-4 bg-gray-200 hover:bg-gray-300 rounded font-bold" disabled={!level2}>+</button>
      </div>
    </div>
  )
}