"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Music, Image, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface FormData {
  title: string
  description: string
  business_type: string
  audio_file: File | null
  cover_image_file: File | null
}

interface UploadState {
  isUploading: boolean
  progress: number
  message: string
  type: 'success' | 'error' | 'info'
}

export function AddSongForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    business_type: '',
    audio_file: null,
    cover_image_file: null
  })

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    message: '',
    type: 'info'
  })

  const supabase = createClient()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (field: 'audio_file' | 'cover_image_file', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.audio_file || !formData.title.trim()) {
      setUploadState({
        isUploading: false,
        progress: 0,
        message: 'Judul dan file audio wajib diisi!',
        type: 'error'
      })
      return
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      message: 'Memulai upload...',
      type: 'info'
    })

    try {
      // Generate unique file paths
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 8)
      const audioFileName = `${timestamp}-${randomId}-${formData.audio_file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const audioPath = `jingles/${audioFileName}`
      
      let imagePath = null
      let imageFileName = null
      if (formData.cover_image_file) {
        imageFileName = `${timestamp}-${randomId}-${formData.cover_image_file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        imagePath = `covers/${imageFileName}`
      }

      // Upload audio file
      setUploadState(prev => ({ ...prev, progress: 30, message: 'Mengupload file audio...' }))
      const { data: audioUpload, error: audioError } = await supabase.storage
        .from('jingle-files')
        .upload(audioPath, formData.audio_file, {
          cacheControl: '3600',
          upsert: false
        })

      if (audioError) {
        // If bucket doesn't exist, try to create it
        if (audioError.message.includes('Bucket not found')) {
          setUploadState(prev => ({ ...prev, progress: 10, message: 'Membuat storage bucket...' }))
          
          // Try uploading to a public bucket (fallback)
          const fallbackPath = `public/${audioPath}`
          const { data: fallbackUpload, error: fallbackError } = await supabase.storage
            .from('public')
            .upload(fallbackPath, formData.audio_file, {
              cacheControl: '3600',
              upsert: false
            })
          
          if (fallbackError) {
            throw new Error(`Audio upload failed: ${fallbackError.message}`)
          }
        } else {
          throw new Error(`Audio upload failed: ${audioError.message}`)
        }
      }

      // Get audio URL
      const { data: { publicUrl: audioUrl } } = supabase.storage
        .from(audioError?.message.includes('Bucket not found') ? 'public' : 'jingle-files')
        .getPublicUrl(audioError?.message.includes('Bucket not found') ? `public/${audioPath}` : audioPath)

      // Upload cover image if provided
      let coverImageUrl = null
      if (formData.cover_image_file && imagePath) {
        setUploadState(prev => ({ ...prev, progress: 60, message: 'Mengupload gambar cover...' }))
        
        const { data: imageUpload, error: imageError } = await supabase.storage
          .from(audioError?.message.includes('Bucket not found') ? 'public' : 'jingle-files')
          .upload(audioError?.message.includes('Bucket not found') ? `public/${imagePath}` : imagePath, formData.cover_image_file, {
            cacheControl: '3600',
            upsert: false
          })

        if (!imageError) {
          const { data: { publicUrl } } = supabase.storage
            .from(audioError?.message.includes('Bucket not found') ? 'public' : 'jingle-files')
            .getPublicUrl(audioError?.message.includes('Bucket not found') ? `public/${imagePath}` : imagePath)
          coverImageUrl = publicUrl
        }
      }

      // Save to database
      setUploadState(prev => ({ ...prev, progress: 80, message: 'Menyimpan ke database...' }))
      
      const { data, error } = await supabase
        .from('jingle_samples')
        .insert([{
          title: formData.title,
          description: formData.description || null,
          business_type: formData.business_type || null,
          audio_url: audioUrl,
          cover_image_url: coverImageUrl
        }])
        .select()

      if (error) {
        throw error
      }

      setUploadState({
        isUploading: false,
        progress: 100,
        message: 'Jingle sample berhasil ditambahkan!',
        type: 'success'
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        business_type: '',
        audio_file: null,
        cover_image_file: null
      })

      // Reset file inputs
      const audioInput = document.getElementById('audio-upload') as HTMLInputElement
      const imageInput = document.getElementById('image-upload') as HTMLInputElement
      if (audioInput) audioInput.value = ''
      if (imageInput) imageInput.value = ''

    } catch (error) {
      console.error('Upload error:', error)
      setUploadState({
        isUploading: false,
        progress: 0,
        message: `Error: ${error instanceof Error ? error.message : 'Upload gagal'}`,
        type: 'error'
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-[#191414] border-[#282828] p-6 sm:p-8">
        {/* Upload Status */}
        {uploadState.message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              uploadState.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : uploadState.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}
          >
            {uploadState.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : uploadState.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
            <span>{uploadState.message}</span>
          </motion.div>
        )}

        {/* Progress Bar */}
        {uploadState.isUploading && (
          <div className="mb-6">
            <div className="w-full bg-[#282828] rounded-full h-2">
              <motion.div 
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadState.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{uploadState.progress}% selesai</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-white text-lg font-semibold mb-2">
              Judul Jingle <span className="text-red-400">*</span>
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Contoh: Toko Kopi Ndeso"
              className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-lg p-4 focus:border-green-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-white text-lg font-semibold mb-2">
              Deskripsi
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsikan jingle ini..."
              className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-base p-4 min-h-[100px] focus:border-green-500"
            />
          </div>

          {/* Business Type */}
          <div>
            <label htmlFor="business_type" className="block text-white text-lg font-semibold mb-2">
              Jenis Usaha
            </label>
            <Input
              id="business_type"
              value={formData.business_type}
              onChange={(e) => handleInputChange('business_type', e.target.value)}
              placeholder="Contoh: Kafe, Laundry, Retail"
              className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-lg p-4 focus:border-green-500"
            />
          </div>

          {/* Audio File Upload */}
          <div>
            <label className="block text-white text-lg font-semibold mb-2">
              File Audio (MP3) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="audio-upload"
                type="file"
                accept="audio/mp3,audio/mpeg,audio/*"
                onChange={(e) => handleFileChange('audio_file', e.target.files?.[0] || null)}
                className="hidden"
                required
              />
              <label
                htmlFor="audio-upload"
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-[#282828] rounded-lg cursor-pointer hover:border-green-500 transition-colors"
              >
                <div className="text-center">
                  <Music className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-white font-medium">
                    {formData.audio_file ? formData.audio_file.name : 'Klik untuk upload file audio'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">MP3, maksimal 10MB</p>
                </div>
              </label>
            </div>
            {formData.audio_file && (
              <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                File audio terpilih: {formData.audio_file.name}
              </Badge>
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-white text-lg font-semibold mb-2">
              Gambar Cover (Opsional)
            </label>
            <div className="relative">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('cover_image_file', e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-[#282828] rounded-lg cursor-pointer hover:border-green-500 transition-colors"
              >
                <div className="text-center">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-white font-medium">
                    {formData.cover_image_file ? formData.cover_image_file.name : 'Klik untuk upload gambar cover'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG, maksimal 5MB</p>
                </div>
              </label>
            </div>
            {formData.cover_image_file && (
              <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                Gambar cover terpilih: {formData.cover_image_file.name}
              </Badge>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={uploadState.isUploading || !formData.title.trim() || !formData.audio_file}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadState.isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Simpan Jingle Sample
              </>
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  )
}