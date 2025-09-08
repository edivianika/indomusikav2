'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AggressiveLazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
  threshold?: number
  rootMargin?: string
}

export const AggressiveLazyImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 60, // Reduced quality for faster loading
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  style,
  threshold = 0.1,
  rootMargin = '100px', // Load earlier
}: AggressiveLazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority) // Start loading immediately if priority
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
        threshold,
        rootMargin,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView, threshold, rootMargin])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={style}
      >
        <span className="text-gray-500 text-sm">Gambar tidak dapat dimuat</span>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={style}>
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          sizes={sizes}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  )
}

export default AggressiveLazyImage
