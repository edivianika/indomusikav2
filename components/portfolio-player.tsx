'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Share2,
  MoreHorizontal,
  Clock,
  List,
  X
} from 'lucide-react'
import OptimizedImage from './optimized-image'

interface Track {
  id: number
  title: string
  business_type: string
  description: string
  audio_url: string
  cover_image_url: string
  duration?: string
  created_at?: string
  updated_at?: string
  client_name?: string
  location?: string
  rating?: number
  tags?: string[]
}

interface PortfolioPlayerProps {
  currentTrack: Track | null
  playlist: Track[]
  currentIndex: number
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrev: () => void
  onTrackSelect: (track: Track, index: number) => void
  onClose: () => void
}

export default function PortfolioPlayer({
  currentTrack,
  playlist,
  currentIndex,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onTrackSelect,
  onClose
}: PortfolioPlayerProps) {
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audio_url
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrack, isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(isFinite(progress) ? progress : 0)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const time = percent * audioRef.current.duration
      audioRef.current.currentTime = time
      setProgress(percent * 100)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else if (repeatMode === 'all' || currentIndex < playlist.length - 1) {
      onNext()
    } else {
      onPause()
    }
  }

  if (!currentTrack) return null

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      {/* Main Player */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-1">
            <div
              className="bg-green-600 h-1 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-4">
            <div className="flex items-center gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <OptimizedImage
                  src={currentTrack.cover_image_url}
                  alt={currentTrack.title}
                  width={60}
                  height={60}
                  className="rounded-lg flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold truncate">{currentTrack.title}</h4>
                  <p className="text-sm text-gray-400 truncate">{currentTrack.business_type}</p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 rounded-full transition-colors ${
                    isShuffled ? 'text-green-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                <button
                  onClick={onPrev}
                  disabled={currentIndex === 0}
                  className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={isPlaying ? onPause : onPlay}
                  className="bg-green-600 hover:bg-green-700 p-3 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                
                <button
                  onClick={onNext}
                  disabled={currentIndex === playlist.length - 1}
                  className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setRepeatMode(
                    repeatMode === 'none' ? 'all' : 
                    repeatMode === 'all' ? 'one' : 'none'
                  )}
                  className={`p-2 rounded-full transition-colors ${
                    repeatMode !== 'none' ? 'text-green-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              </div>

              {/* Volume and Additional Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                <button className="p-2 text-gray-400 hover:text-white rounded-full">
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-1.5 rounded-full transition-colors ${
                    showPlaylist ? 'text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Playlist"
                >
                  <List className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white rounded-full"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compact Playlist Modal - Mobile Friendly */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center p-2 md:p-4"
            onClick={() => setShowPlaylist(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-gray-900 rounded-t-xl md:rounded-xl w-full max-w-xs md:max-w-sm max-h-72 md:max-h-80 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 md:p-3 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs md:text-sm font-semibold">Playlist</h3>
                  <p className="text-xs text-gray-400">{playlist.length} tracks</p>
                </div>
                <button
                  onClick={() => setShowPlaylist(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-56 md:max-h-64">
                {playlist.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => onTrackSelect(track, index)}
                    className={`px-2 py-1.5 hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-2 ${
                      index === currentIndex ? 'bg-gray-800' : ''
                    }`}
                  >
                    {/* Track Number / Play Icon */}
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      {index === currentIndex ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isPlaying) {
                              onPause()
                            } else {
                              onPlay()
                            }
                          }}
                          className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-2 h-2 text-black" />
                          ) : (
                            <Play className="w-2 h-2 text-black ml-0.5" />
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Album Art */}
                    <div className="w-6 h-6 flex-shrink-0">
                      <OptimizedImage
                        src={track.cover_image_url}
                        alt={track.title}
                        width={24}
                        height={24}
                        className="rounded-sm"
                      />
                    </div>
                    
                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs truncate leading-tight">{track.title}</h4>
                      <p className="text-xs text-gray-400 truncate leading-tight">{track.business_type}</p>
                    </div>
                    
                    {/* Love Icon */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement love/favorite functionality
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
