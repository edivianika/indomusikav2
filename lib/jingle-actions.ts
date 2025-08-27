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