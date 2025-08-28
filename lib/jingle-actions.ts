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
      return { 
        success: false, 
        error: error.message 
      }
    }

    revalidatePath('/addsong')
    revalidatePath('/')
    
    return { 
      success: true, 
      data: result 
    }
  } catch (error) {
    console.error('Server error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
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
      return { 
        success: false, 
        error: error.message 
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return { 
      success: true, 
      url: publicUrl 
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }
  }
}

export async function createJingleSampleWithFiles(
  title: string,
  description: string,
  businessType: string,
  audioFile: File,
  coverImageFile?: File
) {
  try {
    const supabase = await createClient()
    
    // Generate unique file paths
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const audioFileName = `${timestamp}-${randomId}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const audioPath = `jingles/${audioFileName}`

    // Upload audio file
    const audioUploadResult = await uploadFile(audioFile, 'jingle-files', audioPath)
    
    if (!audioUploadResult.success) {
      // Try fallback to public bucket
      const fallbackAudioResult = await uploadFile(audioFile, 'public', `public/${audioPath}`)
      if (!fallbackAudioResult.success) {
        return {
          success: false,
          error: `Audio upload failed: ${audioUploadResult.error}`
        }
      }
      audioUploadResult.url = fallbackAudioResult.url
    }

    // Upload cover image if provided
    let coverImageUrl = null
    if (coverImageFile) {
      const imageFileName = `${timestamp}-${randomId}-${coverImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const imagePath = `covers/${imageFileName}`
      
      const imageUploadResult = await uploadFile(coverImageFile, 'jingle-files', imagePath)
      
      if (imageUploadResult.success) {
        coverImageUrl = imageUploadResult.url
      } else {
        // Try fallback for image
        const fallbackImageResult = await uploadFile(coverImageFile, 'public', `public/${imagePath}`)
        if (fallbackImageResult.success) {
          coverImageUrl = fallbackImageResult.url
        }
        // Don't fail if image upload fails, just continue without cover image
      }
    }

    // Save to database
    const { data, error } = await supabase
      .from('jingle_samples')
      .insert([{
        title: title,
        description: description || null,
        business_type: businessType || null,
        audio_url: audioUploadResult.url!,
        cover_image_url: coverImageUrl
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return { 
        success: false, 
        error: `Database error: ${error.message}` 
      }
    }

    revalidatePath('/addsong')
    revalidatePath('/')
    
    return { 
      success: true, 
      data: data 
    }
  } catch (error) {
    console.error('Server error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}