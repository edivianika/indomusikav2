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

      // Check for updates every 30 seconds in development
      if (process.env.NODE_ENV === 'development') {
        setInterval(() => {
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration) {
              registration.update()
            }
          })
        }, 30000) // 30 seconds
      }
    }
  }, [])

  return <>{children}</>
}

export default PWAProvider
