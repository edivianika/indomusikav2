'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  Search, 
  X, 
  SlidersHorizontal,
  Tag,
  Star,
  Clock,
  MapPin
} from 'lucide-react'

interface FilterOptions {
  category: string
  search: string
  rating: number
  duration: string
  location: string
  tags: string[]
}

interface PortfolioFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  categories: string[]
  locations: string[]
  tags: string[]
}

export default function PortfolioFilters({
  filters,
  onFiltersChange,
  categories,
  locations,
  tags
}: PortfolioFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags)

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category })
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, rating })
  }

  const handleDurationChange = (duration: string) => {
    onFiltersChange({ ...filters, duration })
  }

  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    onFiltersChange({ ...filters, tags: newTags })
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: "Semua",
      search: "",
      rating: 0,
      duration: "Semua",
      location: "Semua",
      tags: []
    }
    setSelectedTags([])
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.category !== "Semua" || 
                          filters.search !== "" || 
                          filters.rating > 0 || 
                          filters.duration !== "Semua" || 
                          filters.location !== "Semua" || 
                          filters.tags.length > 0

  return (
    <div className="bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari jingle, klien, atau tag..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filter Lanjutan</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Hapus Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.category === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-800 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Star className="w-4 h-4 inline mr-1" />
                    Rating Minimum
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRatingChange(rating)}
                        className={`p-1 rounded ${
                          filters.rating >= rating
                            ? "text-yellow-400"
                            : "text-gray-500 hover:text-yellow-300"
                        }`}
                      >
                        <Star className={`w-5 h-5 ${filters.rating >= rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Durasi
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  >
                    <option value="Semua">Semua Durasi</option>
                    <option value="0-15">0-15 detik</option>
                    <option value="15-30">15-30 detik</option>
                    <option value="30-45">30-45 detik</option>
                    <option value="45+">45+ detik</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Lokasi
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  >
                    <option value="Semua">Semua Lokasi</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Active Filters Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-400">
                    {hasActiveFilters ? (
                      <span className="text-green-400">
                        {[
                          filters.category !== "Semua" ? 1 : 0,
                          filters.search ? 1 : 0,
                          filters.rating > 0 ? 1 : 0,
                          filters.duration !== "Semua" ? 1 : 0,
                          filters.location !== "Semua" ? 1 : 0,
                          filters.tags.length
                        ].reduce((a, b) => a + b, 0)} filter aktif
                      </span>
                    ) : (
                      "Tidak ada filter"
                    )}
                  </div>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-green-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
