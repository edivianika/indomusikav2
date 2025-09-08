'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LazySectionProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  fallback?: ReactNode
  animation?: {
    initial?: any
    animate?: any
    transition?: any
  }
}

export const LazySection = ({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
  fallback,
  animation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasBeenVisible(true)
          // Stop observing once visible to improve performance
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible || hasBeenVisible ? (
        <motion.div
          initial={animation.initial}
          animate={isVisible ? animation.animate : animation.initial}
          transition={animation.transition}
        >
          {children}
        </motion.div>
      ) : (
        fallback || (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 rounded-lg w-full h-full" />
          </div>
        )
      )}
    </div>
  )
}

export default LazySection
