'use client'

import { useEffect, useState } from 'react'

interface OptimizedScriptLoaderProps {
  src: string
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive'
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedScriptLoader = ({
  src,
  strategy = 'lazyOnload',
  onLoad,
  onError
}: OptimizedScriptLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (isLoaded || hasError) return

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = strategy === 'lazyOnload'

    const handleLoad = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    const handleError = () => {
      setHasError(true)
      onError?.()
    }

    script.onload = handleLoad
    script.onerror = handleError

    if (strategy === 'afterInteractive') {
      // Load after page is interactive
      if (document.readyState === 'complete') {
        document.head.appendChild(script)
      } else {
        window.addEventListener('load', () => {
          document.head.appendChild(script)
        })
      }
    } else if (strategy === 'lazyOnload') {
      // Load when user scrolls or after 3 seconds
      const loadScript = () => {
        document.head.appendChild(script)
      }

      // Load after 3 seconds if user hasn't scrolled
      const timeoutId = setTimeout(loadScript, 3000)

      // Load immediately if user scrolls
      const handleScroll = () => {
        clearTimeout(timeoutId)
        loadScript()
        window.removeEventListener('scroll', handleScroll)
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
    } else {
      // beforeInteractive - load immediately
      document.head.appendChild(script)
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [src, strategy, onLoad, onError, isLoaded, hasError])

  return null
}

export default OptimizedScriptLoader
