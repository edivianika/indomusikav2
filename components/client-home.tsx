'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamic import untuk code splitting
const SpotifyLandingPage = dynamic(
  () => import('@/components/spotify-landing-page'),
  {
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat halaman...</p>
        </div>
      </div>
    ),
    ssr: false, // Disable SSR untuk komponen yang berat
  }
)

export default function ClientHome() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat halaman...</p>
        </div>
      </div>
    }>
      <SpotifyLandingPage />
    </Suspense>
  )
}
