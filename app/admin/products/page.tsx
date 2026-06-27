import { createClient } from '../../../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // ফর্ম সাবমিশনের জন্য সার্ভার অ্যাকশন (Server Action)
  async function addProduct(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') // অটোমেটিক স্ল্যাগ তৈরি
    const price = parseFloat(formData.get('price') as string)
    const sku = formData.get('sku') as string
    const stock = parseInt(formData.get('stock') as string)

    // Supabase-এ প্রোডাক্ট ইনসার্ট করা
    const { error } = await supabase
      .from('products')
      .insert([
        { 
          name, 
          slug, 
          price, 
          sku, 
          stock_quantity: stock,
          low_stock_threshold: 5 // ডিফল্ট থ্রেশহোল্ড
        }
      ])

    if (error) {
      console.error('Error inserting product:', error.message)
      return
    }

    // পেজের ডেটা রিফ্রেশ করা
    revalidatePath('/admin/products')
  }

  // বিদ্যমান প্রোডাক্টগুলোর লিস্ট নিয়ে আসা
  const { data: products } = await supabase.from('products').select('*')

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Thaichirokomari ERP - Admin Panel</h1>
      
      {/* নতুন প্রোডাক্ট যোগ করার ফর্ম */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
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
          <div className="md:col-span-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Save Product
            </button>
          </div>
        </form>
      </div>

      {/* প্রোডাক্ট লিস্ট টেবিল */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Current Stock & Products</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2">Name</th>
              <th className="p-2">SKU</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2 font-mono text-sm">{product.sku}</td>
                  <td className="p-2">৳{product.price}</td>
                  <td className="p-2">{product.stock_quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No products added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}