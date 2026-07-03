'use client'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function CategorySelector({ categories, onSelect, onRefresh }: any) {
  const supabase = createClient()
  const [level1, setLevel1] = useState<string>('')
  const [level2, setLevel2] = useState<string>('')
  const [level3, setLevel3] = useState<string>('')

  const handleSelect = (id: string, level: number) => {
    if (level === 1) { setLevel1(id); setLevel2(''); setLevel3(''); onSelect(id); }
    if (level === 2) { setLevel2(id); setLevel3(''); onSelect(id); }
    if (level === 3) { setLevel3(id); onSelect(id); }
  }

  const addCategory = async (parentId: string | null) => {
    const name = prompt("নতুন ক্যাটাগরির নাম লিখুন:")
    if (!name) return
    await supabase.from('categories').insert([{ name, parent_id: parentId }])
    if (onRefresh) onRefresh()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {/* Level 1 */}
      <div className="flex gap-1">
        <select onChange={(e) => handleSelect(e.target.value, 1)} className="w-full p-2 border rounded">
          <option value="">Cat</option>
          {categories.filter((c:any) => !c.parent_id).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(null)} className="px-3 bg-blue-500 text-white rounded">+</button>
      </div>

      {/* Level 2 */}
      <div className="flex gap-1">
        <select onChange={(e) => handleSelect(e.target.value, 2)} value={level2} className="w-full p-2 border rounded">
          <option value="">Sub</option>
          {categories.filter((c: any) => c.parent_id == level1).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(level1)} className="px-3 bg-blue-500 text-white rounded" disabled={!level1}>+</button>
      </div>

      {/* Level 3 */}
      <div className="flex gap-1">
        <select onChange={(e) => handleSelect(e.target.value, 3)} value={level3} className="w-full p-2 border rounded">
          <option value="">Sub Sub</option>
          {categories.filter((c: any) => c.parent_id == level2).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(level2)} className="px-3 bg-blue-500 text-white rounded" disabled={!level2}>+</button>
      </div>
    </div>
  )
}