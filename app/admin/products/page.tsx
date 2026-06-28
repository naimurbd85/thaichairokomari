import { createServerSupabaseClient } from '@/app/utils/supabaseServer'
import { revalidatePath } from 'next/cache'
import CategorySelector from './CategorySelector'
import ImageUploader from './ImageUploader'

export default async function AdminProductsPage() {
  const supabase = await createServerSupabaseClient()

  // ১. সুপাবেস থেকে ক্যাটাগরি লিস্ট নিয়ে আসা (৩-টায়ার ড্রপডাউনের জন্য)
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name, parent_id')
    .order('name', { ascending: true })

  const categories = categoriesData || []

  // ২. ফর্ম সাবমিশনের জন্য সার্ভার অ্যাকশন
  async function addProduct(formData: FormData) {
    'use server'
    
    const supabase = await createServerSupabaseClient()
    
    const name = formData.get('name') as string
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const price = parseFloat(formData.get('price') as string)
    const sku = formData.get('sku') as string
    const stock = parseInt(formData.get('stock') as string)
    
    // নতুন ৩টি ফিল্ডের ডেটা ধরা
    const categoryId = formData.get('category_id') ? parseInt(formData.get('category_id') as string) : null
    const targetAudience = formData.get('target_audience') as string // men, women, kids, unisex
    const uploadedImagesJson = formData.get('uploaded_images') as string // JSON string array
    
    let imagesArray: string[] = []
    try {
      if (uploadedImagesJson) {
        imagesArray = JSON.parse(uploadedImagesJson)
      }
    } catch (e) {
      console.error('Error parsing uploaded images:', e)
    }

    // Supabase-এ নতুন প্রডাক্ট ইনসার্ট করা
    const { error } = await supabase
      .from('products')
      .insert([
        { 
          name, 
          slug, 
          price, 
          sku, 
          stock_quantity: stock,
          low_stock_threshold: 5,
          category_id: categoryId,      // ৩-টায়ার ক্যাটাগরি আইডি
          target_audience: targetAudience, // জেন্ডার ইন্ডিকেটর ফিল্টার
          images: imagesArray          // সুপাবেস স্টোরেজের ইমেজের লিংক অ্যারে
        }
      ])

    if (error) {
      console.error('Error inserting product:', error.message)
      return
    }

    revalidatePath('/admin/products')
  }

  // ৩. বিদ্যমান প্রডাক্ট লিস্ট নিয়ে আসা (টেবিলে দেখানোর জন্য)
  const { data: products } = await supabase.from('products').select('*')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thaichirokomari ERP - Admin Panel</h1>
      
      {/* নতুন প্রোডাক্ট যোগ করার ফর্ম */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product (Advanced)</h2>
        <form action={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input type="text" name="name" required className="w-full p-2 border rounded" placeholder="e.g. Thai Window Frame" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">SKU (Unique Code)</label>
            <input type="text" name="sku" required className="w-full p-2 border rounded" placeholder="e.g. TH-WD-001" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price (৳)</label>
            <input type="number" name="price" required step="0.01" className="w-full p-2 border rounded" placeholder="0.00" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input type="number" name="stock" required className="w-full p-2 border rounded" placeholder="0" />
          </div>

          {/* জেন্ডার / ইন্ডিকেটর ড্রপডাউন (মেল, ফিমেল, বাচ্চা) */}
          <div>
            <label className="block text-sm font-medium mb-1">Target Audience (Filter)</label>
            <select name="target_audience" required className="w-full p-2 border rounded bg-white">
              <option value="unisex">Unisex (সবার জন্য)</option>
              <option value="men">Men (পুরুষ)</option>
              <option value="women">Women (মহিলা)</option>
              <option value="kids">Kids (বাচ্চা)</option>
            </select>
          </div>

          <div className="hidden md:block"></div> {/* গ্রিড ব্যালেন্স করার জন্য খালি ডিভ */}

          {/* ডাইনামিক ৩-টায়ার ক্যাটাগরি সিলেক্টর কম্পোনেন্ট */}
          <CategorySelector categories={categories} />

          {/* মাল্টিপল ইমেজ আপলোডার কম্পোনেন্ট */}
          <ImageUploader />

          <div className="md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded hover:bg-blue-700 transition shadow">
              Save Product & Upload Data
            </button>
          </div>
        </form>
      </div>

      {/* প্রোডাক্ট লিস্ট টেবিল */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Current Stock & Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Audience</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {product.images && product.images.length > 0 ? (
                        // eslint-disable-next-html-element/allowed-string-attribute
                        <img src={product.images[0]} alt="thumb" className="w-10 h-10 object-cover rounded border" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                    </td>
                    <td className="p-2 font-medium">{product.name}</td>
                    <td className="p-2 text-sm capitalize"><span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{product.target_audience}</span></td>
                    <td className="p-2 font-mono text-sm">{product.sku}</td>
                    <td className="p-2">৳{product.price}</td>
                    <td className="p-2">{product.stock_quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">No products added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}