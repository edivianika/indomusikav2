'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState, useEffect } from 'react'

// Dynamic import untuk menghindari chunk loading issues
const PortfolioPage = dynamic(
  () => import('@/components/portfolio-page'),
  {
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat portfolio...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
)

export default function ClientPortfolio() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat portfolio...</p>
        </div>
      </div>
    }>
      <PortfolioPage />
    </Suspense>
  )
}
