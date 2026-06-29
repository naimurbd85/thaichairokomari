import { createServerSupabaseClient } from '@/app/utils/supabaseServer'
import { revalidatePath } from 'next/cache'

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabaseClient()

  // ১. ডাটাবেজ থেকে বিদ্যমান সব ক্যাটাগরি নিয়ে আসা
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, parent_id')
    .order('name', { ascending: true })

  const categories = categoriesData || []

  // ২. নতুন ক্যাটাগরি তৈরি করার সার্ভার অ্যাকশন
  async function addCategory(formData: FormData) {
    'use server'

    const supabase = await createServerSupabaseClient()
    const name = formData.get('name') as string
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // parent_id যদি খালি থাকে তবে NULL হবে, আর সিলেক্ট করলে সেই আইডি বসবে
    const parentInput = formData.get('parent_id') as string
    const parentId = parentInput ? parseInt(parentInput) : null

    const { error } = await supabase
      .from('categories')
      .insert([
        { 
          name, 
          slug, 
          parent_id: parentId 
        }
      ])

    if (error) {
      console.error('Error inserting category:', error.message)
      return
    }

    revalidatePath('/admin/categories')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thaichi Rokomari ERP - Category Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* বাম পাশে: নতুন ক্যাটাগরি যোগ করার ফর্ম */}
        <div className="bg-white p-6 rounded-lg shadow-md border h-fit">
          <h2 className="text-xl font-semibold mb-4">Add Category</h2>
          <form action={addCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full p-2 border rounded text-sm" 
                placeholder="e.g. Panjabi, Men, Traditional" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Parent Category (Optional)</label>
              <select name="parent_id" className="w-full p-2 border rounded bg-white text-sm">
                <option value="">None (এটি একটি Root/মেইন ক্যাটাগরি)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                * যদি এটি সাব-ক্যাটাগরি হয়, তবে তার মেইন প্যারেন্ট সিলেক্ট করুন। ৩-টায়ারের জন্য ক্রমান্বয়ে সিলেক্ট করবেন।
              </p>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition text-sm">
              Create Category
            </button>
          </form>
        </div>

        {/* ডান পাশে: ক্যাটাগরি লিস্ট (সরল ভিউ) */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">All Categories</h2>
          <div className="overflow-y-auto max-h-[400px] border rounded">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-sm font-semibold text-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Category Name</th>
                  <th className="p-3">Parent ID</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-gray-500">{cat.id}</td>
                      <td className="p-3 font-medium text-gray-800">{cat.name}</td>
                      <td className="p-3 text-gray-600">{cat.parent_id ? cat.parent_id : <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Root</span>}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">No categories found.</td>
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