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

// New FormData-based server action to fix serialization issues
export async function createJingleSampleFromForm(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Extract form fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const businessType = formData.get('business_type') as string
    const audioFile = formData.get('audio_file') as File
    const coverImageFile = formData.get('cover_image_file') as File
    
    if (!title || title.trim() === '') {
      return {
        success: false,
        error: 'Title is required'
      }
    }

    if (!audioFile || audioFile.size === 0) {
      return {
        success: false,
        error: 'Audio file is required'
      }
    }

    // Generate unique file paths
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const audioFileName = `${timestamp}-${randomId}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const audioPath = `jingles/${audioFileName}`

    // Upload audio file
    const { data: audioData, error: audioError } = await supabase.storage
      .from('jingle-files')
      .upload(audioPath, audioFile, {
        cacheControl: '3600',
        upsert: false
      })

    let audioUrl = ''
    
    if (audioError) {
      // Try fallback to public bucket
      const fallbackPath = `public/${audioPath}`
      const { data: fallbackAudioData, error: fallbackAudioError } = await supabase.storage
        .from('public')
        .upload(fallbackPath, audioFile, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (fallbackAudioError) {
        return {
          success: false,
          error: `Audio upload failed: ${audioError.message}`
        }
      }
      
      const { data: { publicUrl: fallbackUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(fallbackPath)
      audioUrl = fallbackUrl
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('jingle-files')
        .getPublicUrl(audioPath)
      audioUrl = publicUrl
    }

    // Upload cover image if provided
    let coverImageUrl = null
    if (coverImageFile && coverImageFile.size > 0) {
      const imageFileName = `${timestamp}-${randomId}-${coverImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const imagePath = `covers/${imageFileName}`
      
      const { data: imageData, error: imageError } = await supabase.storage
        .from('jingle-files')
        .upload(imagePath, coverImageFile, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (imageError) {
        // Try fallback for image
        const fallbackImagePath = `public/${imagePath}`
        const { data: fallbackImageData, error: fallbackImageError } = await supabase.storage
          .from('public')
          .upload(fallbackImagePath, coverImageFile, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (!fallbackImageError) {
          const { data: { publicUrl: fallbackImageUrl } } = supabase.storage
            .from('public')
            .getPublicUrl(fallbackImagePath)
          coverImageUrl = fallbackImageUrl
        }
      } else {
        const { data: { publicUrl: imagePublicUrl } } = supabase.storage
          .from('jingle-files')
          .getPublicUrl(imagePath)
        coverImageUrl = imagePublicUrl
      }
    }

    // Save to database
    const { data, error } = await supabase
      .from('jingle_samples')
      .insert([{
        title: title.trim(),
        description: description?.trim() || null,
        business_type: businessType?.trim() || null,
        audio_url: audioUrl,
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
      error: error instanceof Error ? error.message : 'Unknown server error' 
    }
  }
}