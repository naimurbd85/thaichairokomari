'use client'

import { useState } from 'react'
import { createClient } from '@/app/utils/supabase'

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void // ইমেজ ইউআরএল লিস্ট মেইন পেজে পাঠানোর জন্য
}

export default function ImageUploader({ onImagesUploaded }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    const files = Array.from(e.target.files)
    const uploadedUrls: string[] = [...images]

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload Error:', uploadError.message)
        continue
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
      
      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl)
      }
    }

    setImages(uploadedUrls)
    onImagesUploaded(uploadedUrls) // প্যারেন্ট পেজকে ইনস্ট্যান্টলি নতুন অ্যারে পাস করা
    setUploading(false)
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    setImages(updatedImages)
    onImagesUploaded(updatedImages) // রিমুভ করার পর প্যারেন্ট পেজকে জানানো
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {uploading && <p className="text-xs text-blue-600 mt-2 animate-pulse font-medium">Uploading images, please wait...</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mt-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square border rounded-md bg-white overflow-hidden group">
              {/* eslint-disable-next-html-element/allowed-string-attribute */}
              <img src={url} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow opacity-80 hover:opacity-100"
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