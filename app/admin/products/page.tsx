'use client'
import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/app/utils/supabase'
import CategorySelector from '@/components/CategorySelector'
import ImageUploader from '@/components/ImageUploader'
import VariationManager from '@/components/VariationManager'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
  parent_id: number | null
}

export default function AdminProductsPage() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const router = useRouter()
  
  // ভেরিয়েশন স্টেট যোগ করা হলো
  const [variations, setVariations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', target_audience: 'men',
    category_id: '', regular_price: '', wholesale_price: '', cost_price: '',
    discount_type: 'Percentage', discount_amount: '', 
    weight: '', height: '', width: '', length: '',
    // এই নামগুলো আপডেট করুন
    stock_quantity: '', 
    low_stock_threshold: '5', 
    stock_status: 'In Stock', 
    variant_available: 'No'
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('id, name, parent_id').order('name', { ascending: true })
    const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (cats) setCategories(cats)
    if (prods) setProducts(prods)
  }


  // নতুন স্টেট যোগ করুন
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<any>(null);


  const [uploaderKey, setUploaderKey] = useState(0);


  // বাটন ক্লিক হ্যান্ডলার
  const openVariantModal = (product: any) => {
    setSelectedProductForVariant(product);
    setIsVariantModalOpen(true);
  };

  useEffect(() => { loadData() }, [])

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      target_audience: product.target_audience || 'men',
      category_id: product.category_id ? String(product.category_id) : '',
      regular_price: product.price ? String(product.price) : '', 
      wholesale_price: product.wholesale_price ? String(product.wholesale_price) : '',
      cost_price: product.cost_price ? String(product.cost_price) : '',
      discount_type: product.discount_type || 'Percentage',
      discount_amount: product.discount_amount ? String(product.discount_amount) : '',
      weight: product.weight || '',
      height: product.height || '',
      width: product.width || '',
      length: product.length || '',
      // নিচের লাইনগুলো আপডেট করা হয়েছে
      stock_quantity: product.stock_quantity ? String(product.stock_quantity) : '',
      low_stock_threshold: product.low_stock_threshold ? String(product.low_stock_threshold) : '5',
      stock_status: product.stock_status || 'In Stock',
      variant_available: product.variant_available ? 'Yes' : 'No'
    });
    setUploadedImages(product.images || []);
    setVariations(product.variations || []); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('Error: ' + error.message);
      } else {
        alert('Product deleted successfully!');
        loadData();
      }
    }
  }

  const resetForm = () => {
      setEditingProduct(null);
      setFormData({
        name: '', 
        sku: '', 
        description: '', 
        target_audience: 'men',
        category_id: '', 
        regular_price: '', 
        wholesale_price: '', 
        cost_price: '',
        discount_type: 'Percentage', 
        discount_amount: '', 
        weight: '', height: '', width: '', length: '',
        
        // নতুন নামগুলো এখানে ব্যবহার করুন
        stock_quantity: '', 
        low_stock_threshold: '5', 
        stock_status: 'In Stock', 
        variant_available: 'No'
      });
      setUploadedImages([]);
      setUploaderKey(prev => prev + 1);
      setVariations([]);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
        sku: formData.sku,
        description: formData.description,
        target_audience: formData.target_audience || null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        images: uploadedImages,
        
        // Pricing
        price: parseFloat(formData.regular_price) || 0,
        regular_price: parseFloat(formData.regular_price) || 0,
        wholesale_price: parseFloat(formData.wholesale_price) || 0,
        cost_price: parseFloat(formData.cost_price) || 0,
        
        // Discount
        discount_type: formData.discount_type || 'Percentage',
        discount_amount: parseFloat(formData.discount_amount) || 0,
        
        // Inventory: এখানে ensure করা হচ্ছে যেন ভ্যালু না থাকলে 0 বা 5 হয়
        stock_quantity: formData.stock_quantity !== '' ? parseInt(formData.stock_quantity) : 0,
        low_stock_threshold: formData.low_stock_threshold !== '' ? parseInt(formData.low_stock_threshold) : 5,

        weight: parseFloat(formData.weight) || 0,
        height: parseFloat(formData.height) || 0,
        width: parseFloat(formData.width) || 0,
        length: parseFloat(formData.length) || 0,
        
        stock_status: formData.stock_status || 'In Stock',
        variant_available: formData.variant_available === 'Yes' // Boolean হিসেবে সেভ করা ভালো
      };

    try {
      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }
      alert('Action Successful! 🚀');
      resetForm();
      loadData();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 w-full max-w-[97%] mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Thaichi Rokomari'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* বাম পাশের কলাম */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
            
            {/* Product Origin - আপডেট করা হয়েছে */}
            <div>
              <h2 className="text-md font-bold text-gray-700 bg-blue-50 p-2 rounded mb-3">Product Origin</h2>
              <select 
                value={formData.target_audience} 
                onChange={(e) => setFormData(prev => ({...prev, target_audience: e.target.value}))} 
                className="w-full p-2.5 border rounded-lg bg-white text-sm font-medium text-gray-700"
              >
                <option value="">Select Origin</option>
                <option value="china">China Product</option>
                <option value="thai">Thailand Product</option>
                <option value="others">Others</option>
              </select>
            </div>
            {/* Filter, Category & Origin */}
            <div>
              <h2 className="text-md font-bold text-gray-700 bg-blue-50 p-2 rounded mb-3">Filter, Category</h2>
              <CategorySelector 
                categories={categories} 
                onCategorySelect={(id: string) => setFormData(prev => ({...prev, category_id: id}))} 
              />
            </div>
          </div>

          {/* ডান পাশের কলাম */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <h2 className="text-md font-bold text-gray-700 bg-blue-50 p-2 rounded mb-4">Add Product</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Product Name</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData(prev => ({...prev, name: e.target.value}))} required className="w-full p-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">SKU</label>
                  <input type="text" value={formData.sku || ''} onChange={e => setFormData(prev => ({...prev, sku: e.target.value}))} required className="w-full p-2 border rounded-lg bg-gray-50 text-sm font-mono" />
                </div>
              </div>
              
              <label className="block text-xs font-medium mb-1">Description</label>
              <textarea rows={3} value={formData.description || ''} onChange={e => setFormData(prev => ({...prev, description: e.target.value}))} className="w-full p-2 border rounded-lg text-sm" />
              
              <h2 className="text-md font-bold text-gray-700 bg-blue-50 p-2 rounded mt-4 mb-2">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Cost Price</label>
                  <input type="number" value={formData.cost_price || ''} onChange={e => setFormData(prev => ({...prev, cost_price: e.target.value}))} className="p-2 border rounded-lg text-sm w-full" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Wholesale Price</label>
                  <input type="number" value={formData.wholesale_price || ''} onChange={e => setFormData(prev => ({...prev, wholesale_price: e.target.value}))} className="p-2 border rounded-lg text-sm w-full" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Regular Price</label>
                  <input type="number" value={formData.regular_price || ''} onChange={e => setFormData(prev => ({...prev, regular_price: e.target.value}))} className="p-2 border rounded-lg text-sm w-full" />
                </div>
              </div>

              {/* নতুন যুক্ত করা অংশ: Quantity ও Low Stock Alert */}
              <h2 className="text-md font-bold text-gray-700 bg-blue-50 p-2 rounded mt-4 mb-2">Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Stock Quantity</label>
                  <input 
                    type="number" 
                    value={formData.stock_quantity || ''} 
                    onChange={e => setFormData(prev => ({...prev, stock_quantity: e.target.value}))} 
                    className="p-2 border rounded-lg text-sm w-full" 
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Low Stock Alert Threshold</label>
                  <input 
                    type="number" 
                    value={formData.low_stock_threshold || ''} 
                    onChange={e => setFormData(prev => ({...prev, low_stock_threshold: e.target.value}))} 
                    className="p-2 border rounded-lg text-sm w-full" 
                    placeholder="5"
                  />
                </div>
              </div>

              <h2 className="text-md font-bold text-gray-700 bg-blue-50 p-2 rounded mt-4 mb-2">Dimensions & Weight</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Weight (g)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.weight} 
                    onChange={e => setFormData(prev => ({...prev, weight: e.target.value}))} 
                    className="p-2 border rounded-lg text-sm w-full" 
                    placeholder="0.00" 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Height (cm)</label>
                  <input 
                    type="number" 
                    value={formData.height} 
                    onChange={e => setFormData(prev => ({...prev, height: e.target.value}))} 
                    className="p-2 border rounded-lg text-sm w-full" 
                    placeholder="0" 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Width (cm)</label>
                  <input 
                    type="number" 
                    value={formData.width} 
                    onChange={e => setFormData(prev => ({...prev, width: e.target.value}))} 
                    className="p-2 border rounded-lg text-sm w-full" 
                    placeholder="0" 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-medium mb-1 text-gray-600">Length (cm)</label>
                  <input 
                    type="number" 
                    value={formData.length} 
                    onChange={e => setFormData(prev => ({...prev, length: e.target.value}))} 
                    className="p-2 border rounded-lg text-sm w-full" 
                    placeholder="0" 
                  />
                </div>
              </div>

            </div>

        </div>

        <ImageUploader 
          key={uploaderKey} 
          onImagesUploaded={(urls: string[]) => setUploadedImages(urls)} 
        />
        

        <button 
  type="submit" 
  disabled={isLoading} 
  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl"
>
  {isLoading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Save Product')}
</button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow-sm border mt-8">
        <h2 className="text-md font-bold mb-4 text-gray-700">Product Management ({products.length} Products)</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-3 w-16">Media</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Origin</th>
                <th className="p-3">SKU</th>
                <th className="p-3 text-right">Cost</th>      {/* নতুন */}
                <th className="p-3 text-right">Wholesale</th>  {/* নতুন */}
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition">
                    {/* মিডিয়া এবং নাম */}
                    <td className="p-3">
                      {product.images?.length > 0 ? (
                        <img src={product.images[0]} className="w-9 h-9 object-cover rounded-full" />
                      ) : (
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-[9px] text-gray-400">No Img</div>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-gray-800">{product.name}</td>
                    
                    {/* অরিজিন */}
                    <td className="p-3">
                      {product.target_audience ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          product.target_audience === 'china' ? 'bg-red-50 text-red-700' :
                          product.target_audience === 'thai' ? 'bg-green-50 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {product.target_audience}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">N/A</span>
                      )}
                    </td>

                    <td className="p-3 font-mono text-xs text-gray-400">{product.sku}</td>
                    
                    {/* নতুন কলামগুলো */}
                    <td className="p-3 text-right font-medium text-gray-600">৳{product.cost_price || 0}</td>
                    <td className="p-3 text-right font-medium text-gray-600">৳{product.wholesale_price || 0}</td>
                    
                    <td className="p-3 text-right font-medium text-gray-900">৳{product.price || 0}</td>
                    <td className="p-3 text-center font-mono font-bold">{product.stock_quantity}</td>
                    
                    {/* অ্যাকশন বাটন */}
                    <td className="p-3 text-center space-x-2">
                      <button 
                        onClick={() => openVariantModal(product)} 
                        className="text-green-600 hover:text-green-800 font-bold text-xs"
                      >
                        Add Variant
                      </button>

                      {/* যদি প্রোডাক্টের ভেরিয়েন্ট থেকে থাকে, তবেই বাটনটি দেখাবে */}
                      {product.variations && product.variations.length > 0 && (
                        <button 
                          onClick={() => router.push(`/admin/products/${product.id}/variations`)} 
                          className="text-purple-600 hover:text-purple-800 font-bold text-xs"
                        >
                          Edit Variant
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                      >
                        Edit
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="text-red-600 hover:text-red-800 font-bold text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={9} className="p-8 text-center text-gray-400">No products found.</td></tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

              {isVariantModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-[90%] max-w-lg shadow-2xl">
      <h2 className="text-lg font-bold mb-4">
        Add Variant: {selectedProductForVariant?.name}
      </h2>
      
      {/* key ব্যবহার করে কম্পোনেন্টটি রি-রেন্ডার করা হচ্ছে */}
            <VariationManager 
              key={selectedProductForVariant?.variations?.length || 0} 
              onAddVariation={async (v) => {
                try {
                  const updatedVariations = [...(selectedProductForVariant.variations || []), v];
                  
                  const { error } = await supabase
                    .from('products')
                    .update({ variations: updatedVariations })
                    .eq('id', selectedProductForVariant.id);

                  if (error) throw error;

                  alert("Variant added successfully! 🚀");
                  
                  // মেইন টেবিল আপডেট করার জন্য
                  loadData(); 
                  
                  // মডাল স্টেট আপডেট করা যাতে পরের ভেরিয়েন্টটিও সঠিক বিদ্যমান ডেটা পায়
                  setSelectedProductForVariant((prev: any) => ({
                    ...prev,
                    variations: updatedVariations
                  }));
                  
                } catch (err: any) {
                  console.error("Error saving variant:", err);
                  alert("Failed to save variant: " + err.message);
                }
              }} 
            />
            
            <button 
              onClick={() => setIsVariantModalOpen(false)} 
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>

  )
}