'use client'

import { useEffect } from 'react'

export const PWAProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })

      // Handle updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }, [])

  return <>{children}</>
}

export default PWAProvider
