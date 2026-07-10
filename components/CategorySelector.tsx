'use client'
import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function CategorySelector({ categories, onRefresh }: any) {
  const supabase = createClient()
  const [level1, setLevel1] = useState('')
  const [level2, setLevel2] = useState('')
  const [level3, setLevel3] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');

  // ফিল্টার করা ক্যাটাগরি (শুধুমাত্র মেইন ক্যাটাগরির সার্চের জন্য এটি কার্যকর হবে)
  const filteredLevel1 = categories.filter((c: any) => 
    !c.parent_id && c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCategory = async (parentId: string | null) => {
    const name = prompt("Enter new category name:");
    if (!name || !name.trim()) return;

    const trimmedName = name.trim();
    let slug = trimmedName.toLowerCase().replace(/\s+/g, '-');
    const isSlugExists = categories.some((c: any) => c.slug === slug);
    
    if (isSlugExists) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert([{ name: trimmedName, parent_id: parentId || null, slug: slug }]);

    if (error) {
      alert("Error saving category: " + error.message);
    } else if (onRefresh) {
      onRefresh();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* সার্চ ইনপুট ব্লক */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search Main Categories..."
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Level 1 Category (এখানে filteredLevel1 ব্যবহার করা হয়েছে) */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium">Main Cat</label>
        <select 
          onChange={(e) => {setLevel1(e.target.value); setLevel2(''); setLevel3('')}} 
          className="flex-1 p-2 border rounded"
          disabled={loading}
        >
          <option value="">Select</option>
          {filteredLevel1.map((c:any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={() => addCategory(null)} className="px-4 bg-gray-200 hover:bg-gray-300 rounded font-bold">+</button>
      </div>

      {/* Level 2 & 3 Category (এগুলো আগের মতোই থাকবে) */}
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