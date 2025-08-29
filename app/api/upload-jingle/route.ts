import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Starting file upload process...')
    
    const formData = await request.formData()
    
    // Log all form data entries
    console.log('API Route: FormData entries:')
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
      return NextResponse.json({ success: false, error: 'Judul wajib diisi' }, { status: 400 })
    }
    
    if (!audio_file || audio_file.size === 0) {
      return NextResponse.json({ success: false, error: 'File audio wajib diupload' }, { status: 400 })
    }

    console.log('API Route: Validation passed, starting file uploads...')

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

    console.log('API Route: Generated paths:', { audioPath, imagePath })

    // Convert File to ArrayBuffer for better compatibility
    const audioBuffer = await audio_file.arrayBuffer()
    const audioBlob = new Blob([audioBuffer], { type: audio_file.type })

    // Upload audio file to jingle-files bucket
    console.log('API Route: Uploading audio file...')
    let audioUrl: string
    let usedBucket = 'jingle-files'

    const { data: audioUpload, error: audioError } = await supabase.storage
      .from('jingle-files')
      .upload(audioPath, audioBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: audio_file.type
      })

    if (audioError) {
      console.error('API Route: Audio upload error to jingle-files:', audioError)
      
      // Fallback to public bucket
      console.log('API Route: Trying fallback to public bucket...')
      usedBucket = 'public'
      const publicAudioPath = `jingles/${audioFileName}`
      
      const { data: publicAudioUpload, error: publicAudioError } = await supabase.storage
        .from('public')
        .upload(publicAudioPath, audioBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: audio_file.type
        })
      
      if (publicAudioError) {
        console.error('API Route: Audio upload failed to both buckets:', publicAudioError)
        return NextResponse.json(
          { success: false, error: `Audio upload failed: ${publicAudioError.message}` },
          { status: 500 }
        )
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(publicAudioPath)
      audioUrl = publicUrl
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('jingle-files')
        .getPublicUrl(audioPath)
      audioUrl = publicUrl
    }

    console.log('API Route: Audio uploaded successfully:', audioUrl)

    // Upload cover image if provided
    let coverImageUrl: string | null = null
    if (cover_image_file && cover_image_file.size > 0 && imagePath) {
      console.log('API Route: Uploading cover image...')
      
      const imageBuffer = await cover_image_file.arrayBuffer()
      const imageBlob = new Blob([imageBuffer], { type: cover_image_file.type })
      
      const finalImagePath = usedBucket === 'public' ? `covers/${imageFileName}` : imagePath
      
      const { data: imageUpload, error: imageError } = await supabase.storage
        .from(usedBucket)
        .upload(finalImagePath, imageBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: cover_image_file.type
        })

      if (!imageError) {
        const { data: { publicUrl } } = supabase.storage
          .from(usedBucket)
          .getPublicUrl(finalImagePath)
        coverImageUrl = publicUrl
        console.log('API Route: Cover image uploaded successfully:', coverImageUrl)
      } else {
        console.warn('API Route: Cover image upload failed (optional):', imageError)
      }
    }

    // Save to database using server-side client (bypasses RLS)
    console.log('API Route: Saving to database...')
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
      console.error('API Route: Database error:', dbError)
      return NextResponse.json(
        { success: false, error: `Database save failed: ${dbError.message}` },
        { status: 500 }
      )
    }

    console.log('API Route: Database save successful:', dbResult)

    return NextResponse.json({
      success: true,
      data: {
        id: dbResult.id,
        title: dbResult.title,
        audio_url: dbResult.audio_url,
        cover_image_url: dbResult.cover_image_url
      },
      message: 'Jingle sample berhasil ditambahkan!'
    })

  } catch (error) {
    console.error('API Route: Unexpected error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengupload' 
      },
      { status: 500 }
    )
  }
}