'use client'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function CategorySelector({ categories, onSave, onRefresh }: any) {
  const supabase = createClient()
  const [level1, setLevel1] = useState('')
  const [level2, setLevel2] = useState('')
  const [level3, setLevel3] = useState('')
  const [loading, setLoading] = useState(false)

  // নতুন ক্যাটাগরি যোগ করার লজিক (এরর হ্যান্ডলিং সহ)
  const addCategory = async (parentId: string | null) => {
    const name = prompt("নতুন ক্যাটাগরির নাম লিখুন:")
    if (!name || !name.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('categories')
      .insert([{ name: name.trim(), parent_id: parentId || null }])

    if (error) {
      alert("সেভ করতে সমস্যা হয়েছে: " + error.message)
    } else if (onRefresh) {
      onRefresh() // সাকসেসফুল হলে গ্রিড রিফ্রেশ হবে
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* ক্যাটাগরি লেভেল ১ */}
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

      {/* ক্যাটাগরি লেভেল ২ */}
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

      {/* ক্যাটাগরি লেভেল ৩ */}
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

      <button 
        onClick={() => onSave({ level1, level2, level3 })} 
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-bold w-full md:w-auto"
      >
        Save Button
      </button>
    </div>
  )
}