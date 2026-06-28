'use client'

import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

export default function ImageUploader() {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    const files = Array.from(e.target.files)
    const uploadedUrls: string[] = [...images]

    for (const file of files) {
      // ফাইলের ইউনিক নাম তৈরি করা (যাতে এক নামের ফাইল ওলটপালট না হয়)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `products/${fileName}`

      // Supabase Storage-এ আপলোড করা
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading image:', uploadError.message)
        continue
      }

      // আপলোড করা ফাইলের Public URL নিয়ে আসা
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
      
      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl)
      }
    }

    setImages(uploadedUrls)
    setUploading(false)
  }

  // কোনো ছবি রিমুভ করতে চাইলে
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="md:col-span-2 bg-gray-50 p-4 rounded border">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images (Multiple)</label>
      
      {/* ফাইল ইনপুট ফিল্ড */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
        className="w-full p-2 border rounded bg-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {uploading && <p className="text-sm text-blue-600 mt-2 animate-pulse">Uploading images, please wait...</p>}

      {/* আপলোড করা ছবির প্রিভিউ গ্রেড */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square border rounded bg-white overflow-hidden">
              {/* eslint-disable-next-html-element/allowed-string-attribute */}
              <img src={url} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-90 hover:opacity-100"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* এই হিডেন ইনপুটটি পুরো ইমেজ অ্যারেটি টেক্সট হিসেবে সার্ভার অ্যাকশনে পাঠাবে */}
      <input type="hidden" name="uploaded_images" value={JSON.stringify(images)} />
    </div>
  )
}