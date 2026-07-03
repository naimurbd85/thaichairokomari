'use client'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function CategorySelector({ categories, onSave, onRefresh }: any) {
  const supabase = createClient()
  const [level1, setLevel1] = useState('')
  const [level2, setLevel2] = useState('')
  const [level3, setLevel3] = useState('')

  const addCategory = async (parentId: string | null) => {
    const name = prompt("নতুন ক্যাটাগরির নাম লিখুন:")
    if (!name) return
    await supabase.from('categories').insert([{ name, parent_id: parentId }])
    if (onRefresh) onRefresh()
  }

  return (
    <div className="space-y-4">
      {/* ক্যাটাগরি লেভেল ১ */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium">Main Cat</label>
        <select onChange={(e) => {setLevel1(e.target.value); setLevel2(''); setLevel3('')}} className="flex-1 p-2 border rounded">
          <option value="">Select</option>
          {categories.filter((c:any) => !c.parent_id).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(null)} className="px-4 bg-gray-200 rounded font-bold">+</button>
      </div>

      {/* ক্যাটাগরি লেভেল ২ */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium">Sub Cat</label>
        <select onChange={(e) => {setLevel2(e.target.value); setLevel3('')}} value={level2} className="flex-1 p-2 border rounded">
          <option value="">Select</option>
          {categories.filter((c:any) => c.parent_id == level1).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(level1 || null)} className="px-4 bg-gray-200 rounded font-bold">+</button>
      </div>

      {/* ক্যাটাগরি লেভেল ৩ */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium">Sub Sub Cat</label>
        <select onChange={(e) => setLevel3(e.target.value)} value={level3} className="flex-1 p-2 border rounded">
          <option value="">Select</option>
          {categories.filter((c:any) => c.parent_id == level2).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(level2 || null)} className="px-4 bg-gray-200 rounded font-bold">+</button>
      </div>

      <button onClick={() => onSave({ level1, level2, level3 })} className="bg-green-500 text-white px-6 py-2 rounded font-bold">
        Save Button
      </button>
    </div>
  )
}