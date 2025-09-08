'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface OptimizedAudioPlayerProps {
  src: string
  title?: string
  cover?: string
  className?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  preload?: 'none' | 'metadata' | 'auto'
  lazy?: boolean
}

export const OptimizedAudioPlayer = ({
  src,
  title,
  cover,
  className = '',
  onPlay,
  onPause,
  onEnded,
  preload = 'none',
  lazy = true,
}: OptimizedAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lazy loading: only load audio when user interacts
  const [shouldLoad, setShouldLoad] = useState(!lazy)

  const handleLoadAudio = useCallback(() => {
    if (!shouldLoad && audioRef.current) {
      setShouldLoad(true)
      setIsLoading(true)
      audioRef.current.load()
    }
  }, [shouldLoad])

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        onPause?.()
      } else {
        // Load audio if not loaded yet
        if (!shouldLoad) {
          handleLoadAudio()
        }
        
        await audioRef.current.play()
        setIsPlaying(true)
        onPlay?.()
      }
    } catch (error) {
      console.error('Audio play failed:', error)
      setError('Gagal memutar audio')
    }
  }, [isPlaying, shouldLoad, handleLoadAudio, onPlay, onPause])

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(isFinite(progress) ? progress : 0)
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }, [])

  const handleSeek = useCallback((value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (value / 100) * audioRef.current.duration
      if (isFinite(time)) {
        audioRef.current.currentTime = time
        setProgress(value)
      }
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const formatTime = useCallback((time: number) => {
    if (!isFinite(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }, [])

  const handleLoadedData = useCallback(() => {
    setIsLoaded(true)
    setIsLoading(false)
    setError(null)
  }, [])

  const handleError = useCallback(() => {
    setError('Gagal memuat audio')
    setIsLoading(false)
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    onEnded?.()
  }, [onEnded])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  return (
    <motion.div
      className={`bg-[#1a1a1a] rounded-lg p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Audio element - hidden */}
      <audio
        ref={audioRef}
        src={shouldLoad ? src : ''}
        preload={preload}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onError={handleError}
        onEnded={handleEnded}
        className="hidden"
      />

      {/* Cover and Info */}
      <div className="flex items-center gap-4 mb-4">
        {cover && (
          <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={cover}
              alt={title || 'Audio cover'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">
            {title || 'Audio Track'}
          </h3>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          {isLoading && (
            <p className="text-gray-400 text-sm">Memuat audio...</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div
          className="w-full bg-gray-700 rounded-full h-2 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const percent = (e.clientX - rect.left) / rect.width
            handleSeek(percent * 100)
          }}
        >
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white p-2 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white p-2 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {!shouldLoad && (
          <button
            onClick={handleLoadAudio}
            className="text-green-400 hover:text-green-300 text-sm transition-colors"
          >
            Muat Audio
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default OptimizedAudioPlayer
