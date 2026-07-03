'use client'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function CategorySelector({ categories, onSelect, onRefresh }: any) {
  const supabase = createClient()
  const [level1, setLevel1] = useState<string>('')
  const [level2, setLevel2] = useState<string>('')
  const [level3, setLevel3] = useState<string>('')

  // সিলেক্ট করা আইডিটা মেইন পেজে পাঠানো
  const handleSelect = (finalId: string) => {
    onSelect(finalId)
  }

  // নতুন ক্যাটাগরি যোগের লজিক (তোর এক্সেলের বাটন মডেল)
  const addCategory = async (parentId: string | null) => {
    const name = prompt("নতুন ক্যাটাগরির নাম লিখুন:")
    if (!name) return
    await supabase.from('categories').insert([{ name, parent_id: parentId }])
    if (onRefresh) onRefresh()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
      {/* লেভেল ১ */}
      <div className="flex gap-1">
        <select onChange={(e) => {setLevel1(e.target.value); setLevel2(''); setLevel3(''); handleSelect(e.target.value)}} className="w-full p-2 border rounded">
          <option value="">Category</option>
          {categories.filter((c:any) => !c.parent_id).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(null)} className="px-2 bg-blue-500 text-white rounded">+</button>
      </div>

      {/* লেভেল ২ */}
      <div className="flex gap-1">
        <select onChange={(e) => {setLevel2(e.target.value); setLevel3(''); handleSelect(e.target.value)}} value={level2} className="w-full p-2 border rounded" disabled={!level1}>
          <option value="">Sub Cat</option>
          {categories.filter((c: any) => c.parent_id == level1).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(level1)} className="px-2 bg-blue-500 text-white rounded" disabled={!level1}>+</button>
      </div>

      {/* লেভেল ৩ */}
      <div className="flex gap-1">
        <select onChange={(e) => {setLevel3(e.target.value); handleSelect(e.target.value)}} value={level3} className="w-full p-2 border rounded" disabled={!level2}>
          <option value="">Sub Sub Cat</option>
          {categories.filter((c: any) => c.parent_id == level2).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(level2)} className="px-2 bg-blue-500 text-white rounded" disabled={!level2}>+</button>
      </div>
    </div>
  )
}