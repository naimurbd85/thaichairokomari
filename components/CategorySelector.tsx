'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function CategorySelector({ categories, onRefresh, onCategorySelect, value }: any) {
  const supabase = createClient()
  const [level1, setLevel1] = useState('')
  const [level2, setLevel2] = useState('')
  const [level3, setLevel3] = useState('')
  const [loading, setLoading] = useState(false)

  // এডিট মোডে ক্যাটাগরি লোড করার জন্য লজিক
  useEffect(() => {
    if (value && categories.length > 0) {
      const targetCat = categories.find((c: any) => c.id === parseInt(value));
      if (!targetCat) return;

      // যদি লেভেল ৩ হয়
      if (targetCat.parent_id) {
        const parent = categories.find((c: any) => c.id === targetCat.parent_id);
        if (parent && parent.parent_id) {
          // এটি লেভেল ৩
          setLevel1(String(parent.parent_id));
          setLevel2(String(parent.id));
          setLevel3(String(targetCat.id));
        } else {
          // এটি লেভেল ২
          setLevel1(String(targetCat.parent_id));
          setLevel2(String(targetCat.id));
          setLevel3('');
        }
      } else {
        // এটি লেভেল ১
        setLevel1(String(targetCat.id));
        setLevel2('');
        setLevel3('');
      }
    } else if (!value) {
      setLevel1(''); setLevel2(''); setLevel3('');
    }
  }, [value, categories]);

  const handleSelection = (id: string) => {
    onCategorySelect(id ? Number(id) : null);
  }

  const addCategory = async (parentId: string | null) => {
    const name = prompt("Enter new category name:");
    if (!name || !name.trim()) return;

    const trimmedName = name.trim();
    let slug = trimmedName.toLowerCase().replace(/\s+/g, '-');
    const isSlugExists = categories.some((c: any) => c.slug === slug);
    if (isSlugExists) slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert([{ name: trimmedName, parent_id: parentId ? Number(parentId) : null, slug: slug }]);

    if (error) alert("Error: " + error.message);
    else if (onRefresh) onRefresh();
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Level 1 */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium text-xs">Main Cat</label>
        <select 
          onChange={(e) => { const val = e.target.value; setLevel1(val); setLevel2(''); setLevel3(''); handleSelection(val); }} 
          value={level1} className="flex-1 p-2 border rounded text-sm" disabled={loading}
        >
          <option value="">Select</option>
          {categories.filter((c:any) => !c.parent_id).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(null)} className="px-3 bg-gray-200 rounded font-bold text-sm">+</button>
      </div>

      {/* Level 2 */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium text-xs">Sub Cat</label>
        <select 
          onChange={(e) => { const val = e.target.value; setLevel2(val); setLevel3(''); handleSelection(val); }} 
          value={level2} disabled={!level1 || loading} className="flex-1 p-2 border rounded text-sm"
        >
          <option value="">Select</option>
          {categories.filter((c:any) => String(c.parent_id) === level1).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(level1)} className="px-3 bg-gray-200 rounded font-bold text-sm" disabled={!level1}>+</button>
      </div>

      {/* Level 3 */}
      <div className="flex gap-2">
        <label className="w-24 self-center font-medium text-xs">Sub Sub Cat</label>
        <select 
          onChange={(e) => { const val = e.target.value; setLevel3(val); handleSelection(val); }} 
          value={level3} disabled={!level2 || loading} className="flex-1 p-2 border rounded text-sm"
        >
          <option value="">Select</option>
          {categories.filter((c:any) => String(c.parent_id) === level2).map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => addCategory(level2)} className="px-3 bg-gray-200 rounded font-bold text-sm" disabled={!level2}>+</button>
      </div>
    </div>
  )
}