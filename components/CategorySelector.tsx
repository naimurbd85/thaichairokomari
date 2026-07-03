'use client'
import { useState } from 'react'

export default function CategorySelector({ categories, onSave }: any) {
  const [level1, setLevel1] = useState('')
  const [level2, setLevel2] = useState('')
  const [level3, setLevel3] = useState('')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <select onChange={(e) => {setLevel1(e.target.value); setLevel2(''); setLevel3('')}} className="p-2 border rounded">
          <option value="">Category</option>
          {categories.filter((c:any) => !c.parent_id).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select onChange={(e) => {setLevel2(e.target.value); setLevel3('')}} value={level2} className="p-2 border rounded">
          <option value="">Sub Cat</option>
          {categories.filter((c:any) => c.parent_id == level1).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select onChange={(e) => setLevel3(e.target.value)} value={level3} className="p-2 border rounded">
          <option value="">Sub Sub Cat</option>
          {categories.filter((c:any) => c.parent_id == level2).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <button 
        onClick={() => onSave({ level1, level2, level3 })} 
        className="bg-green-500 text-white px-6 py-2 rounded font-bold"
      >
        Save Button
      </button>
    </div>
  )
}