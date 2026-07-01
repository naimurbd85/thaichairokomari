'use client'

import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void
}

interface PreviewImage {
  file: File
  localUrl: string     // ব্রাউজারের তাৎক্ষণিক দেখার জন্য
  publicUrl: string | null // সুপাবেস আপলোড হওয়ার পর লিঙ্ক
  status: 'pending' | 'uploading' | 'success' | 'error'
}

export default function ImageUploader({ onImagesUploaded }: ImageUploaderProps) {
  const [items, setItems] = useState<PreviewImage[]>([])
  const [globalUploading, setGlobalUploading] = useState(false)
  const supabase = createClient()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const selectedFiles = Array.from(e.target.files)
    
    // ১. ১ মিলিসেকেন্ডের মধ্যে লোকাল প্রিভিউ তৈরি করা (Blob Object)
    const newItems: PreviewImage[] = selectedFiles.map(file => ({
      file,
      localUrl: URL.createObjectURL(file),
      publicUrl: null,
      status: 'pending'
    }))

    const updatedItems = [...items, ...newItems]
    setItems(updatedItems)
    setGlobalUploading(true)

    // ২. এবার ব্যাকগ্রাউন্ডে একটি একটি করে সুপাবেসে আপলোড হবে এবং প্রগ্রেস দেখাবে
    const finalPublicUrls: string[] = items.map(i => i.publicUrl).filter(Boolean) as string[]

    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].status !== 'pending') continue

      updatedItems[i].status = 'uploading'
      setItems([...updatedItems])

      const currentItem = updatedItems[i]
      const fileExt = currentItem.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`
      const filePath = `products/${fileName}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, currentItem.file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
        
        if (data?.publicUrl) {
          updatedItems[i].publicUrl = data.publicUrl
          updatedItems[i].status = 'success'
          finalPublicUrls.push(data.publicUrl)
        } else {
          updatedItems[i].status = 'error'
        }
      } catch (err) {
        console.error('Upload failed:', err)
        updatedItems[i].status = 'error'
      }

      setItems([...updatedItems])
      onImagesUploaded([...finalPublicUrls]) // প্যারেন্ট পেজে ক্লাউড লিঙ্ক পাঠানো
    }

    setGlobalUploading(false)
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const targetItem = items[indexToRemove]
    // মেমোরি লিক বন্ধ করতে লোকাল অবজেক্ট ইউআরএল রিলিজ করা
    if (targetItem.localUrl.startsWith('blob:')) {
      URL.revokeObjectURL(targetItem.localUrl)
    }

    const updatedItems = items.filter((_, index) => index !== indexToRemove)
    setItems(updatedItems)
    
    const remainingPublicUrls = updatedItems.map(i => i.publicUrl).filter(Boolean) as string[]
    onImagesUploaded(remainingPublicUrls)
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white hover:border-blue-500 transition cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={globalUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="text-gray-500 space-y-1">
          <p className="text-xs font-semibold text-blue-600">Click to upload or drag multiple images</p>
          <p className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 5MB</p>
        </div>
      </div>

      {/* লাইভ ইমেজ গ্রিড প্রিভিউ */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mt-4">
          {items.map((item, index) => (
            <div key={index} className="relative aspect-square border rounded-lg bg-white overflow-hidden group shadow-sm">
              <img src={item.localUrl} alt="Preview" className="w-full h-full object-cover" />
              
              {/* স্ট্যাটাস ওভারলে লজিক */}
              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                  <span className="text-[9px] font-medium tracking-wider">UP-ING</span>
                </div>
              )}
              {item.status === 'success' && (
                <div className="absolute top-1 left-1 bg-green-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] shadow">
                  ✓
                </div>
              )}
              {item.status === 'error' && (
                <div className="absolute inset-0 bg-red-600/20 border border-red-500 flex items-center justify-center text-red-600 text-[10px] font-bold">
                  Failed
                </div>
              )}

              {/* রিমুভ বাটন */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-gray-900/80 hover:bg-red-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center shadow transition transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}