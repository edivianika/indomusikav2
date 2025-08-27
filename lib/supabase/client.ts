import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type JingleSample = {
  id: number
  title: string
  description: string | null
  audio_url: string
  cover_image_url: string | null
  business_type: string | null
  created_at: string
  updated_at: string
}
