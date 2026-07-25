'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase';
import SharedAdminLayout from '@/app/admin-layout';
import CategorySelector from '@/components/CategorySelector';
import { Trash2, FolderTree, Search, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  slug: string;
}

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tableSearch, setTableSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getFilteredCategories = () => {
    const mainCats = categories.filter(c => !c.parent_id);
    const list: any[] = [];

    mainCats.forEach(main => {
      const subs = categories.filter(c => c.parent_id === main.id);
      if (subs.length === 0) {
        list.push({ main: main.name, sub: '-', subSub: '-', id: main.id, mainId: main.id, subId: null, subSubId: null });
      } else {
        subs.forEach(sub => {
          const subSubs = categories.filter(c => c.parent_id === sub.id);
          if (subSubs.length === 0) {
            list.push({ main: main.name, sub: sub.name, subSub: '-', id: sub.id, mainId: main.id, subId: sub.id, subSubId: null });
          } else {
            subSubs.forEach(ss => {
              list.push({ main: main.name, sub: sub.name, subSub: ss.name, id: ss.id, mainId: main.id, subId: sub.id, subSubId: ss.id });
            });
          }
        });
      }
    });
    
    return list.filter(item => {
      const matchesSearch = item.main.toLowerCase().includes(tableSearch.toLowerCase()) ||
                            item.sub.toLowerCase().includes(tableSearch.toLowerCase()) ||
                            item.subSub.toLowerCase().includes(tableSearch.toLowerCase());
      
      const matchesSelection = selectedCategoryId 
        ? (Number(item.mainId) === Number(selectedCategoryId) || 
           Number(item.subId) === Number(selectedCategoryId) || 
           Number(item.subSubId) === Number(selectedCategoryId))
        : true;

      return matchesSearch && matchesSelection;
    });
  };

  return (
    <SharedAdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Category Management & Filter</h1>

        {/* Add/Filter Category Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FolderTree size={20} className="text-blue-600" /> Add / Filter Category
            </h2>
            {selectedCategoryId && (
              <button 
                onClick={() => setSelectedCategoryId(null)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center gap-1 font-medium"
              >
                Clear Filter <X size={14} />
              </button>
            )}
          </div>
          
          <CategorySelector 
            categories={categories} 
            onRefresh={fetchCategories} 
            onCategorySelect={(id: number | null) => setSelectedCategoryId(id)} 
            selectedCategoryId={selectedCategoryId}
          />
        </div>

        {/* Category Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="font-bold text-slate-800 text-lg">
              Category Table ({getFilteredCategories().length})
            </h2>
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Search categories..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 uppercase text-xs font-bold text-slate-700 tracking-wider">
                  <th className="p-4 border-b">Cat</th>
                  <th className="p-4 border-b">Sub Cat</th>
                  <th className="p-4 border-b">Sub Sub Cat</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {getFilteredCategories().length > 0 ? (
                  getFilteredCategories().map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-semibold text-slate-900">{item.main}</td>
                      <td className="p-4 text-slate-600">
                        {item.sub !== '-' ? (
                          <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-700">{item.sub}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-600">
                        {item.subSub !== '-' ? (
                          <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-700">{item.subSub}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition inline-flex items-center justify-center"
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SharedAdminLayout>
  );
}