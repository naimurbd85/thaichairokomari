'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/app/utils/supabase'

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
  
  // স্টেটস
  const [categories, setCategories] = useState<Category[]>([])
  const [displayCategories, setDisplayCategories] = useState<DisplayCategory[]>([])
  
  // ফর্ম স্টেটস (এডিট ও অ্যাডের জন্য)
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<string>('')
  const [editingId, setEditingId] = useState<number | null>(null) // null মানে Add মোড, আইডি থাকলে Edit মোড

  // ১. সুপাবেস থেকে ডেটা লোড করার ফাংশন
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

    // ফুল পাথ ক্যালকুলেট করা
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

  // ২. ক্যাটাগরি তৈরি অথবা আপডেট করার ফাংশন
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const pId = parentId ? parseInt(parentId) : null

    startTransition(async () => {
      if (editingId) {
        // এডিট/আপডেট মোড
        const { error } = await supabase
          .from('categories')
          .update({ name, slug, parent_id: pId })
          .eq('id', editingId)

        if (error) alert('Error updating: ' + error.message)
      } else {
        // নতুন অ্যাড মোড
        const { error } = await supabase
          .from('categories')
          .insert([{ name, slug, parent_id: pId }])

        if (error) alert('Error inserting: ' + error.message)
      }

      // ফর্ম রিসেট ও রিফ্রেশ
      setName('')
      setParentId('')
      setEditingId(null)
      fetchCategories()
    })
  }

  // ৩. এডিট বাটনে ক্লিক করলে যা হবে
  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id)
    setName(cat.name)
    setParentId(cat.parent_id ? cat.parent_id.toString() : '')
  }

  // ৪. ডিলিট করার ফাংশন
  const handleDeleteClick = async (id: number, name: string) => {
    const confirmDelete = window.confirm(`আপনি কি নিশ্চিত যে "${name}" ক্যাটাগরিডি ডিলিট করতে চান? (মনে রাখবেন: এর আন্ডারে কোনো সাব-ক্যাটাগরি থাকলে তাও ডিলিট হয়ে যেতে পারে!)`)
    
    if (!confirmDelete) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      fetchCategories()
    }
  }

  // এডিট মোড ক্যানসেল করার জন্য
  const handleCancelEdit = () => {
    setEditingId(null)
    setName('')
    setParentId('')
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thaichi Rokomari ERP - Category Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* বাম পাশে: ফর্ম (ডাইনামিক অ্যাড/এডিট মোড) */}
        <div className="bg-white p-6 rounded-lg shadow-md border h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? '⚠️ Edit Category' : '➕ Add Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Category Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="e.g. Toys, Car, Hot Wheels" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Parent Category (Optional)</label>
              <select 
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full p-2 border rounded bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">None (এটি একটি Root/মেইন ক্যাটাগরি)</option>
                {displayCategories
                  // এডিট করার সময় নিজের আইডিকে নিজের প্যারেন্ট বানানো যাবে না, তাই ফিল্টার
                  .filter(cat => cat.id !== editingId)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.fullPath}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isPending}
                className={`flex-1 text-white font-semibold py-2 rounded transition text-sm shadow ${
                  editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isPending ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </button>

              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ডান পাশে: অ্যাকশন বাটন সহ ক্যাটাগরি লিস্ট */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">All Categories (Hierarchy View)</h2>
          <div className="overflow-y-auto max-h-[550px] border rounded shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <th className="p-3 w-12">ID</th>
                  <th className="p-3">Category Structure / Path</th>
                  <th className="p-3 w-20 text-center">Layer</th>
                  <th className="p-3 w-32 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {displayCategories.length > 0 ? (
                  displayCategories.map((cat) => {
                    const layerLevel = cat.fullPath.split('➡️').length

                    return (
                      <tr key={cat.id} className={`border-b transition ${editingId === cat.id ? 'bg-amber-50' : 'hover:bg-blue-50/40'}`}>
                        <td className="p-3 font-mono text-gray-400 text-xs">{cat.id}</td>
                        <td className="p-3">
                          <span className={`font-medium ${editingId === cat.id ? 'text-amber-700' : 'text-gray-800'}`}>
                            {cat.fullPath}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            layerLevel === 1 ? 'bg-green-100 text-green-800' :
                            layerLevel === 2 ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            Tier {layerLevel}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-1">
                          {/* এডিট বাটন */}
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-2 py-1 rounded text-xs font-medium border border-blue-200 transition"
                          >
                            Edit
                          </button>
                          {/* ডিলিট বাটন */}
                          <button
                            onClick={() => handleDeleteClick(cat.id, cat.name)}
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2 py-1 rounded text-xs font-medium border border-red-200 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}