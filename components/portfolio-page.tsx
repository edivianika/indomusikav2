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
  Filter,
  Search,
  Music,
  Clock,
  Users,
  Star,
  Heart
} from 'lucide-react'
import OptimizedImage from './optimized-image'
import PortfolioPlayer from './portfolio-player'
import { createClient } from '@/lib/supabase/client'

// Interface untuk data portfolio dari database
interface PortfolioItem {
  id: number
  title: string
  description: string
  audio_url: string
  cover_image_url: string
  business_type: string
  created_at: string
  updated_at: string
  client_name?: string
  location?: string
  rating?: number
  tags?: string[]
  duration?: string
}

// Categories akan diambil dari database

interface FilterOptions {
  category: string
}

export default function PortfolioPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "Semua"
  })
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTrack, setCurrentTrack] = useState<PortfolioItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlist, setPlaylist] = useState<PortfolioItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Fetch data dari database
  const fetchPortfolioData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const { data, error: dbError } = await supabase
        .from('jingle_samples')
        .select('*')
        .order('created_at', { ascending: false })

      if (dbError) {
        console.error('Database error:', dbError)
        setError('Gagal memuat data portfolio')
        // Fallback data jika database error
        setPortfolioData([
          {
            id: 0,
            title: "Error Koneksi Database",
            description: "Tidak dapat mengakses data portfolio. Silakan refresh halaman atau hubungi admin jika masalah berlanjut.",
            audio_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            cover_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
            business_type: "Error",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            client_name: "System",
            location: "Unknown",
            rating: 0,
            tags: ["error"],
            duration: "0:00"
          }
        ])
      } else {
        console.log('Successfully fetched portfolio data:', data?.length || 0, 'records')
        if (data && data.length > 0) {
          // Extract unique categories from database
          const uniqueCategories = Array.from(new Set(data.map(item => item.business_type)))
          setCategories(['Semua', ...uniqueCategories])
          
          // Transform data untuk kompatibilitas dengan UI
          const transformedData = data.map((item, index) => {
            // Generate more realistic and varied durations
            let duration = item.duration
            if (!duration) {
              // More realistic jingle durations based on business type
              const durations = {
                'Kuliner': ['0:15', '0:18', '0:22', '0:25', '0:28', '0:30'],
                'Elektronik': ['0:12', '0:15', '0:18', '0:20', '0:22', '0:25'],
                'Kecantikan': ['0:20', '0:25', '0:28', '0:30', '0:32', '0:35'],
                'Otomotif': ['0:15', '0:18', '0:20', '0:22', '0:25', '0:28'],
                'Kesehatan': ['0:18', '0:20', '0:22', '0:25', '0:28', '0:30'],
                'Fashion': ['0:15', '0:18', '0:20', '0:22', '0:25', '0:27'],
                'Error': ['0:00']
              }
              const typeDurations = durations[item.business_type as keyof typeof durations] || ['0:15', '0:18', '0:20', '0:22', '0:25']
              // Use a more varied selection based on item ID for consistency
              const durationIndex = (item.id + index) % typeDurations.length
              duration = typeDurations[durationIndex]
            }
            
            return {
              ...item,
              client_name: item.client_name || `Klien ${index + 1}`,
              location: item.location || "Jakarta",
              rating: item.rating || 5,
              tags: item.tags || [item.business_type.toLowerCase()],
              duration: duration
            }
          })
          setPortfolioData(transformedData)
        } else {
          setError('Belum ada data portfolio')
          setPortfolioData([])
        }
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Terjadi kesalahan saat memuat data')
      setPortfolioData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  // Filter data based on category only
  const filteredData = portfolioData.filter(item => {
    return filters.category === "Semua" || item.business_type === filters.category
  })

  const handlePlayTrack = (track: PortfolioItem, index: number) => {
    setCurrentTrack(track)
    setCurrentIndex(index)
    setPlaylist(filteredData)
    setIsPlaying(true)
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleClose = () => setCurrentTrack(null)

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentTrack(playlist[nextIndex])
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentTrack(playlist[prevIndex])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Portfolio <span className="text-green-400">Karya</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Koleksi jingle terbaik yang telah kami buat untuk berbagai UMKM
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilters({ category })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.category === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-900 rounded-lg animate-pulse">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
            <button
              onClick={fetchPortfolioData}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Portfolio List */}
        {!isLoading && !error && (
          <div className="space-y-2">
            {filteredData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer"
                onClick={() => handlePlayTrack(item, index)}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Track Number / Play Button */}
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (currentTrack?.id === item.id && isPlaying) {
                          handlePause()
                        } else {
                          handlePlayTrack(item, index)
                        }
                      }}
                      className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      {currentTrack?.id === item.id && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Album Art */}
                  <div className="w-12 h-12 flex-shrink-0">
                    <OptimizedImage
                      src={item.cover_image_url}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {item.business_type}
                    </p>
                  </div>

                  {/* Love Icon */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Implement love/favorite functionality
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Tidak ada jingle ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Player */}
      <PortfolioPlayer
        currentTrack={currentTrack}
        playlist={playlist}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNext={handleNext}
        onPrev={handlePrev}
        onTrackSelect={handlePlayTrack}
        onClose={handleClose}
      />
    </div>
  )
}