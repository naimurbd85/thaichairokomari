'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/app/utils/supabase'
import CategorySelector from '@/components/CategorySelector'

interface Category {
  id: number
  name: string
  parent_id: number | null
  slug: string
}

interface DisplayCategory extends Category {
  fullPath: string
}

export default function AdminCategoriesPage() {
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  
  const [categories, setCategories] = useState<Category[]>([])
  const [displayCategories, setDisplayCategories] = useState<DisplayCategory[]>([])
  
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<string>('')
  const [editingId, setEditingId] = useState<number | null>(null)

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, parent_id, slug')
    
    if (error) {
      console.error('Error fetching:', error.message)
      return
    }

    const rawCategories: Category[] = data || []
    setCategories(rawCategories)

    const getCategoryPath = (cat: Category): string => {
      const path: string[] = [cat.name]
      let current = cat
      while (current.parent_id !== null) {
        const parent = rawCategories.find(c => c.id === current.parent_id)
        if (parent) {
          path.unshift(parent.name)
          current = parent
        } else {
          break
        }
      }
      return path.join(' ➡️ ')
    }

    const processed = rawCategories.map(cat => ({
      ...cat,
      fullPath: getCategoryPath(cat)
    })).sort((a, b) => a.fullPath.localeCompare(b.fullPath))

    setDisplayCategories(processed)
  };

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const pId = parentId ? parseInt(parentId) : null

    startTransition(async () => {
      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({ name, slug, parent_id: pId })
          .eq('id', editingId)
        if (error) alert('Error updating: ' + error.message)
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{ name, slug, parent_id: pId }])
        if (error) alert('Error inserting: ' + error.message)
      }

      setName('')
      setParentId('')
      setEditingId(null)
      fetchCategories()
    })
  }

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id)
    setName(cat.name)
    setParentId(cat.parent_id ? cat.parent_id.toString() : '')
    // পেজের উপরে স্ক্রল করা যাতে ফর্মটি দেখা যায়
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteClick = async (id: number, name: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত "${name}" ডিলিট করতে চান?`)) return

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) alert('Error: ' + error.message)
    else fetchCategories()
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thaichi Rokomari ERP - Category Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? '⚠️ Edit Category' : '➕ Add Category'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                className="w-full p-2 border rounded text-sm outline-none" placeholder="Category Name" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Parent Category Selection</label>
              <CategorySelector 
                categories={categories} 
                onCategorySelect={(id) => setParentId(id)} 
                onRefreshCategories={fetchCategories}
                value={parentId}
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={isPending} className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">
                {isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setName(''); setParentId('') }} className="px-4 py-2 bg-gray-300 rounded font-semibold">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">All Categories</h2>
          <div className="overflow-y-auto max-h-[550px] border rounded">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="p-3 border-b">Structure</th>
                  <th className="p-3 w-32 text-center border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayCategories.map((cat) => (
                  <tr key={cat.id} className={`border-b hover:bg-gray-50 ${editingId === cat.id ? 'bg-amber-50' : ''}`}>
                    <td className="p-3 text-sm">{cat.fullPath}</td>
                    <td className="p-3 text-center space-x-2">
                      <button onClick={() => handleEditClick(cat)} className="text-blue-600 text-xs font-bold">Edit</button>
                      <button onClick={() => handleDeleteClick(cat.id, cat.name)} className="text-red-600 text-xs font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}