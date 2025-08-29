'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface JingleSampleData {
  title: string
  description?: string
  business_type?: string
  audio_url: string
  cover_image_url?: string
}

export async function createJingleSample(data: JingleSampleData) {
  try {
    const supabase = await createClient()
    
    const { data: result, error } = await supabase
      .from('jingle_samples')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return `ERROR:${error.message}`
    }

    try {
      revalidatePath('/addsong')
      revalidatePath('/')
    } catch (revalidateError) {
      console.warn('Revalidation failed (non-critical):', revalidateError)
    }
    
    return 'SUCCESS:Jingle sample berhasil dibuat'
  } catch (error) {
    console.error('Server error:', error)
    return `ERROR:${error instanceof Error ? error.message : 'Unknown error'}`
  }
}

export async function uploadFile(file: File, bucket: string, path: string) {
  try {
    const supabase = await createClient()
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return `ERROR:${error.message}`
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return `SUCCESS:${publicUrl}`
  } catch (error) {
    console.error('Upload error:', error)
    return `ERROR:${error instanceof Error ? error.message : 'Upload failed'}`
  }
}

// Complete server action for handling both file upload and database insertion
export async function createJingleSampleWithFiles(formData: FormData) {
  try {
    console.log('Server action started with FormData entries:')
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value)
    }

    const supabase = await createClient()
    
    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const business_type = formData.get('business_type') as string
    const audio_file = formData.get('audio_file') as File
    const cover_image_file = formData.get('cover_image_file') as File | null

    // Validate required fields
    if (!title?.trim()) {
      return 'ERROR:Judul wajib diisi'
    }
    
    if (!audio_file || audio_file.size === 0) {
      return 'ERROR:File audio wajib diupload'
    }

    console.log('Validation passed, starting file uploads...')

    // Generate unique file paths
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    
    const audioFileName = `${timestamp}-${randomId}-${audio_file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const audioPath = `jingles/${audioFileName}`
    
    let imageFileName: string | null = null
    let imagePath: string | null = null
    
    if (cover_image_file && cover_image_file.size > 0) {
      imageFileName = `${timestamp}-${randomId}-${cover_image_file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      imagePath = `covers/${imageFileName}`
    }

    console.log('Generated paths:', { audioPath, imagePath })

    // Upload audio file
    console.log('Uploading audio file...')
    const { data: audioUpload, error: audioError } = await supabase.storage
      .from('jingle-files')
      .upload(audioPath, audio_file, {
        cacheControl: '3600',
        upsert: false
      })

    if (audioError) {
      console.error('Audio upload error:', audioError)
      
      // Fallback to public bucket if jingle-files doesn't exist
      if (audioError.message.includes('Bucket not found')) {
        console.log('Trying fallback to public bucket...')
        const { data: audioUploadFallback, error: audioErrorFallback } = await supabase.storage
          .from('public')
          .upload(`jingles/${audioFileName}`, audio_file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (audioErrorFallback) {
          return `ERROR:Audio upload failed: ${audioErrorFallback.message}`
        }
      } else {
        return `ERROR:Audio upload failed: ${audioError.message}`
      }
    }

    // Get audio public URL
    const bucket = audioError?.message.includes('Bucket not found') ? 'public' : 'jingle-files'
    const finalAudioPath = audioError?.message.includes('Bucket not found') ? `jingles/${audioFileName}` : audioPath
    
    const { data: { publicUrl: audioUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(finalAudioPath)

    console.log('Audio uploaded successfully:', audioUrl)

    // Upload cover image if provided
    let coverImageUrl: string | null = null
    if (cover_image_file && cover_image_file.size > 0 && imagePath) {
      console.log('Uploading cover image...')
      
      const { data: imageUpload, error: imageError } = await supabase.storage
        .from(bucket)
        .upload(bucket === 'public' ? `covers/${imageFileName}` : imagePath, cover_image_file, {
          cacheControl: '3600',
          upsert: false
        })

      if (!imageError) {
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(bucket === 'public' ? `covers/${imageFileName}` : imagePath)
        coverImageUrl = publicUrl
        console.log('Cover image uploaded successfully:', coverImageUrl)
      } else {
        console.warn('Cover image upload failed (optional):', imageError)
      }
    }

    // Save to database using server-side client (bypasses RLS)
    console.log('Saving to database...')
    const { data: dbResult, error: dbError } = await supabase
      .from('jingle_samples')
      .insert([{
        title: title.trim(),
        description: description?.trim() || null,
        business_type: business_type?.trim() || null,
        audio_url: audioUrl,
        cover_image_url: coverImageUrl
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return `ERROR:Database save failed: ${dbError.message}`
    }

    console.log('Database save successful:', dbResult)

    // Revalidate paths (treat as non-critical)
    try {
      revalidatePath('/addsong')
      revalidatePath('/')
    } catch (revalidateError) {
      console.warn('Revalidation failed (non-critical):', revalidateError)
    }
    
    return 'SUCCESS:Jingle sample berhasil ditambahkan!'
  } catch (error) {
    console.error('Server action error:', error)
    return `ERROR:${error instanceof Error ? error.message : 'Terjadi kesalahan saat mengupload'}`
  }
}