import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test database connection
    const { data, error, count } = await supabase
      .from('jingle_samples')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      count: count || 0
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ 
      success: true, 
      message: 'Test POST successful',
      received: body
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to parse JSON'
    }, { status: 400 })
  }
}