'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface OptimizedAvatarProps {
  src: string
  alt: string
  size?: number
  className?: string
  priority?: boolean
  fallback?: string
}

export const OptimizedAvatar = ({
  src,
  alt,
  size = 64,
  className = '',
  priority = false,
  fallback = '/placeholder-user.jpg'
}: OptimizedAvatarProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-full" />
      )}
      
      {isInView && (
        <Image
          src={hasError ? fallback : src}
          alt={alt}
          width={size}
          height={size}
          quality={50} // Lower quality for avatars
          className={`rounded-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          sizes={`${size}px`}
        />
      )}
    </div>
  )
}

export default OptimizedAvatar
