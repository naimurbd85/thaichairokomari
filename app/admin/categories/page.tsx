import { createServerSupabaseClient } from '@/app/utils/supabaseServer'
import { revalidatePath } from 'next/cache'

// ক্যাটাগরির টাইপ ইন্টারফেস
interface Category {
  id: number
  name: string
  parent_id: number | null
  slug: string
}

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabaseClient()

  // ১. ডাটাবেজ থেকে সব ক্যাটাগরি নিয়ে আসা
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, parent_id, slug')

  const categories: Category[] = categoriesData || []

  // ২. ক্যাটাগরির ফুল পাথ (যেমন: Toys ➡️ Car ➡️ Hot Wheels Car) বানানোর হেল্পার ফাংশন
  function getCategoryPath(cat: Category): string {
    const path: string[] = [cat.name]
    let current = cat

    // যতক্ষণ প্যারেন্ট আইডি থাকবে, লুপ চালিয়ে মেইন রুট পর্যন্ত নামগুলো নিয়ে আসবে
    while (current.parent_id !== null) {
      const parent = categories.find(c => c.id === current.parent_id)
      if (parent) {
        path.unshift(parent.name) // প্যারেন্টের নাম অ্যারের শুরুতে যোগ করবে
        current = parent
      } else {
        break;
      }
    }

    return path.join(' ➡️ ')
  }

  // ৩. প্রদর্শনের সুবিধার জন্য ক্যাটাগরিগুলোকে পাথের নাম অনুযায়ী সাজানো (Alphabetical Order)
  const displayCategories = categories.map(cat => ({
    ...cat,
    fullPath: getCategoryPath(cat)
  })).sort((a, b) => a.fullPath.localeCompare(b.fullPath))

  // ৪. নতুন ক্যাটাগরি তৈরি করার সার্ভার অ্যাকশন
  async function addCategory(formData: FormData) {
    'use server'

    const supabase = await createServerSupabaseClient()
    const name = formData.get('name') as string
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    const parentInput = formData.get('parent_id') as string
    const parentId = parentInput ? parseInt(parentInput) : null

    const { error } = await supabase
      .from('categories')
      .insert([{ name, slug, parent_id: parentId }])

    if (error) {
      console.error('Error inserting category:', error.message)
      return
    }

    revalidatePath('/admin/categories')
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thaichirokomari ERP - Category Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* বাম পাশে: নতুন ক্যাটাগরি যোগ করার ফর্ম */}
        <div className="bg-white p-6 rounded-lg shadow-md border h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Category</h2>
          <form action={addCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Category Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                placeholder="e.g. Toys, Car, Hot Wheels" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Parent Category (Optional)</label>
              <select name="parent_id" className="w-full p-2 border rounded bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option value="">None (এটি একটি Root/মেইন ক্যাটাগরি)</option>
                {/* ড্রপডাউনেও ফুল পাথ দেখাবে যাতে সিলেক্ট করতে ভুল না হয় */}
                {displayCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.fullPath}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                * যদি সাব-ক্যাটাগরি হয়, তবে তার প্যারেন্ট ক্যাটাগরি সিলেক্ট করুন।
              </p>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition text-sm shadow">
              Create Category
            </button>
          </form>
        </div>

        {/* ডান পাশে: আপগ্রেডেড ক্যাটাগরি লিস্ট (হায়ারার্কি পাথ ভিউ) */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">All Categories (Hierarchy View)</h2>
          <div className="overflow-y-auto max-h-[500px] border rounded shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <th className="p-3 w-16">ID</th>
                  <th className="p-3">Category Structure / Path</th>
                  <th className="p-3 w-24 text-center">Layer</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {displayCategories.length > 0 ? (
                  displayCategories.map((cat) => {
                    // পাথ গুনে লেয়ার লেভেল বের করা (কয়টি তীর চিহ্ন আছে)
                    const layerLevel = cat.fullPath.split('➡️').length

                    return (
                      <tr key={cat.id} className="border-b hover:bg-blue-50/40 transition">
                        <td className="p-3 font-mono text-gray-400 text-xs">{cat.id}</td>
                        <td className="p-3">
                          <span className="font-medium text-gray-800">
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
                      </tr>
                    )
                  })
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