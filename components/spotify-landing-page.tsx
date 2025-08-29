"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  Star,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Music,
  MessageSquare,
  Building,
  Music2,
  Headphones,
  Shield,
  Clock,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { submitOrder } from "@/lib/actions"
import { Component as AnimatedTestimonials } from "@/components/ui/testimonial"

declare global {
  interface Window {
    fbq: any
  }
}

const initFacebookPixel = () => {
  if (typeof window !== "undefined" && !window.fbq) {
    ;((f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) => {
      if (f.fbq) return
      n = f.fbq = (...args: any[]) => {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = !0
      n.version = "2.0"
      n.queue = []
      t = b.createElement(e)
      t.async = !0
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js")

    window.fbq("init", "750264264204457")
  }
}

const trackFBEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, parameters)
  }
}

interface FormData {
  nama: string
  noHp: string
  namaUsaha: string
  jenisUsaha: string
  targetAudiens: string
  gayaMusik: string[]
  pesanUtama: string
  tagline: string
}

const MultiStepForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    noHp: "",
    namaUsaha: "",
    jenisUsaha: "",
    targetAudiens: "",
    gayaMusik: [],
    pesanUtama: "",
    tagline: "",
  })

  useEffect(() => {
    if (isOpen) {
      trackFBEvent("AddToCart", {
        content_name: "Jingle Order Form",
        content_category: "Service",
        value: 199000,
        currency: "IDR",
      })
    }
  }, [isOpen])

  const totalSteps = 3

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const result = await submitOrder(formData)

      if (result.success) {
        trackFBEvent("AddPaymentInfo", {
          content_name: "Jingle Order",
          content_category: "Service",
          value: 199000,
          currency: "IDR",
        })

        // Create WhatsApp message
        const message = `Halo ${result.csName}! Saya ingin pesan jingle untuk usaha saya:

🏢 *Nama Usaha:* ${formData.namaUsaha}
🏪 *Jenis Usaha:* ${formData.jenisUsaha}
🎯 *Target Audiens:* ${formData.targetAudiens}
🎵 *Gaya Musik:* ${formData.gayaMusik.join(", ")}
💬 *Pesan Utama:* ${formData.pesanUtama}
${formData.tagline ? `🏷️ *Tagline:* ${formData.tagline}` : ""}

Mohon info lebih lanjut untuk proses pembuatan jingle. Terima kasih!`

        const whatsappUrl = `https://wa.me/${result.csPhone}?text=${encodeURIComponent(message)}`

        // Close form and redirect to WhatsApp
        onClose()
        window.open(whatsappUrl, "_blank")

        // Reset form
        setCurrentStep(1)
        setFormData({
          nama: "",
          noHp: "",
          namaUsaha: "",
          jenisUsaha: "",
          targetAudiens: "",
          gayaMusik: [],
          pesanUtama: "",
          tagline: "",
        })
      } else {
        alert(`Terjadi kesalahan: ${result.error}. Silakan coba lagi.`)
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGayaMusikChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        gayaMusik: [...prev.gayaMusik, value],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        gayaMusik: prev.gayaMusik.filter((item) => item !== value),
      }))
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.nama.trim() !== "" &&
          formData.noHp.trim() !== "" &&
          formData.namaUsaha.trim() !== "" &&
          formData.jenisUsaha.trim() !== ""
        )
      case 2:
        return formData.targetAudiens.trim() !== "" && formData.gayaMusik.length > 0
      case 3:
        return formData.pesanUtama.trim() !== ""
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="nama" className="text-white text-lg font-semibold">
                Nama Lengkap
              </label>
              <p className="text-gray-400 text-sm mb-3">Nama Anda sebagai pemilik usaha</p>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
                placeholder="Masukkan nama lengkap Anda..."
                className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-lg p-4 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="noHp" className="text-white text-lg font-semibold">
                Nomor WhatsApp
              </label>
              <p className="text-gray-400 text-sm mb-3">Nomor yang bisa dihubungi via WhatsApp</p>
              <Input
                id="noHp"
                value={formData.noHp}
                onChange={(e) => setFormData((prev) => ({ ...prev, noHp: e.target.value }))}
                placeholder="Contoh: 08123456789"
                className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-lg p-4 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="namaUsaha" className="text-white text-lg font-semibold">
                Nama Usaha / Brand
              </label>
              <p className="text-gray-400 text-sm mb-3">Contoh: Kopi Sejuk, Toko Jaya Abadi</p>
              <Input
                id="namaUsaha"
                value={formData.namaUsaha}
                onChange={(e) => setFormData((prev) => ({ ...prev, namaUsaha: e.target.value }))}
                placeholder="Masukkan nama usaha Anda..."
                className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-lg p-4 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="jenisUsaha" className="text-white text-lg font-semibold">
                Jenis Usaha / Produk Utama
              </label>
              <p className="text-gray-400 text-sm mb-3">Contoh: kedai kopi, laundry, fashion, jasa konstruksi</p>
              <Input
                id="jenisUsaha"
                value={formData.jenisUsaha}
                onChange={(e) => setFormData((prev) => ({ ...prev, jenisUsaha: e.target.value }))}
                placeholder="Masukkan jenis usaha Anda..."
                className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-lg p-4 focus:border-green-500"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="targetAudiens" className="text-white text-lg font-semibold">
                Target Audiens
              </label>
              <p className="text-gray-400 text-sm mb-3">Contoh: anak muda, keluarga, pekerja kantoran</p>
              <Input
                id="targetAudiens"
                value={formData.targetAudiens}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetAudiens: e.target.value }))}
                placeholder="Siapa target pelanggan Anda..."
                className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-lg p-4 focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-white text-lg font-semibold">Gaya Musik yang Diinginkan</label>
              <p className="text-gray-400 text-sm mb-4">Pilih satu atau lebih gaya musik</p>
              <div className="space-y-3">
                {["Ceria & Enerjik", "Santai & Friendly", "Elegan & Profesional", "Islami / Religius"].map((gaya) => (
                  <div key={gaya} className="flex items-center space-x-3">
                    <Checkbox
                      id={gaya}
                      checked={formData.gayaMusik.includes(gaya)}
                      onCheckedChange={(checked) => handleGayaMusikChange(gaya, checked as boolean)}
                      className="border-[#282828] data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <label htmlFor={gaya} className="text-white text-base cursor-pointer">
                      {gaya}
                    </label>
                  </div>
                ))}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="lainnya"
                    checked={formData.gayaMusik.some(
                      (item) =>
                        !["Ceria & Enerjik", "Santai & Friendly", "Elegan & Profesional", "Islami / Religius"].includes(
                          item,
                        ),
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const customValue = prompt("Masukkan gaya musik lainnya:")
                        if (customValue) {
                          handleGayaMusikChange(customValue, true)
                        }
                      }
                    }}
                    className="border-[#282828] data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <label htmlFor="lainnya" className="text-white text-base cursor-pointer">
                    Lainnya
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="pesanUtama" className="text-white text-lg font-semibold">
                Pesan Utama yang Ingin Disampaikan
              </label>
              <p className="text-gray-400 text-sm mb-3">
                Contoh: murah meriah, kualitas premium, halal, cepat, terpercaya
              </p>
              <Textarea
                id="pesanUtama"
                value={formData.pesanUtama}
                onChange={(e) => setFormData((prev) => ({ ...prev, pesanUtama: e.target.value }))}
                placeholder="Apa pesan utama yang ingin disampaikan dalam jingle..."
                className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-base p-4 min-h-[100px] focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="tagline" className="text-white text-lg font-semibold">
                Tagline / Kata Kunci (opsional)
              </label>
              <p className="text-gray-400 text-sm mb-3">Contoh: "Enak, Hemat, Cepat" / "Luxury Living, Syariah Way"</p>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                placeholder="Tagline atau kata kunci khusus..."
                className="bg-[#121212] border-[#282828] text-white placeholder-gray-400 text-lg p-4 focus:border-green-500"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#121212] rounded-2xl p-6 w-full max-w-md border border-[#282828] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-[#282828]"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Buat Jingle Impian Anda</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-sm text-gray-400">
                Langkah {currentStep} dari {totalSteps}
              </div>
              <div className="flex-1 bg-[#282828] rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="border-[#282828] text-gray-300 hover:bg-[#282828] disabled:opacity-50 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Sebelumnya
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengirim...
                  </>
                ) : (
                  <>🚀 Kirim Pesanan</>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
              >
                Selanjutnya
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const formatTime = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number
  onChange: (value: number) => void
  className?: string
}) => {
  return (
    <motion.div
      className={`relative w-full h-1 bg-white/20 rounded-full cursor-pointer ${className}`}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = (x / rect.width) * 100
        onChange(Math.min(Math.max(percentage, 0), 100))
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  )
}

const AudioPlayerCompact = ({
  src,
  title,
  currentlyPlayingAudio,
  setCurrentlyPlayingAudio,
  onPlay,
  isActuallyPlaying,
  trackIndex,
  currentTrackIndex,
  duration,
  onPause,
}: {
  src: string
  title?: string
  currentlyPlayingAudio: string | null
  setCurrentlyPlayingAudio: (src: string | null) => void
  onPlay: () => void
  isActuallyPlaying?: boolean
  trackIndex?: number
  currentTrackIndex?: number | null
  duration?: number
  onPause?: () => void
}) => {
  // MOST PRECISE APPROACH: Check both audio URL AND track index to ensure uniqueness
  const isThisExactTrackPlaying = (
    currentlyPlayingAudio !== null && 
    currentlyPlayingAudio === src && 
    isActuallyPlaying === true &&
    trackIndex !== undefined &&
    currentTrackIndex !== null &&
    trackIndex === currentTrackIndex
  )

  const handlePlay = () => {
    if (isThisExactTrackPlaying) {
      // If this track is currently playing, pause it
      setCurrentlyPlayingAudio(null)
      onPause?.()
    } else {
      // If this track is not playing, start playing it
      onPlay()
    }
  }

  return (
    <div className="bg-[#282828] rounded-lg p-3 space-y-2">
      {/* Progress Bar - Shows active state only when this exact track is playing */}
      <div className="w-full bg-[#404040] rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all duration-300 ${
            isThisExactTrackPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
          }`}
          style={{ width: isThisExactTrackPlaying ? '100%' : '0%' }}
        />
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePlay}
            variant="ghost"
            size="icon"
            className={`text-white h-8 w-8 rounded-full transition-all duration-300 ${
              isThisExactTrackPlaying 
                ? 'bg-green-500 hover:bg-green-600 scale-110 shadow-lg shadow-green-500/30' 
                : 'bg-green-500 hover:bg-green-600 hover:scale-105'
            }`}
          >
            {isThisExactTrackPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <span className={`text-xs transition-colors duration-300 ${
            isThisExactTrackPlaying ? 'text-green-400' : 'text-gray-400'
          }`}>
            {duration === undefined ? '...' : formatTime(duration || 0)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-[#404040] h-6 w-6 rounded-full"
        >
          <Volume2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

const AudioPlayer = ({
  src,
  cover,
  title,
}: {
  src: string
  cover?: string
  title?: string
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(isFinite(progress) ? progress : 0)
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (value / 100) * audioRef.current.duration
      if (isFinite(time)) {
        audioRef.current.currentTime = time
        setProgress(value)
      }
    }
  }

  return (
    <motion.div
      className="relative flex flex-col mx-auto rounded-3xl overflow-hidden bg-[#121212] backdrop-blur-sm shadow-2xl p-4 w-[320px] h-auto border border-green-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} src={src} className="hidden" />

      {cover && (
        <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 overflow-hidden rounded-2xl h-[200px] w-full relative mb-4">
          <img src={cover || "/placeholder.svg"} alt="cover" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="flex flex-col w-full gap-y-3">
        {title && <h3 className="text-white font-bold text-lg text-center">{title}</h3>}

        <div className="flex flex-col gap-y-2">
          <CustomSlider value={progress} onChange={handleSeek} className="w-full" />
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">{formatTime(currentTime)}</span>
            <span className="text-white/70 text-sm">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center w-full">
          <div className="flex items-center gap-3 bg-[#282828] rounded-2xl p-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#404040] h-8 w-8 rounded-full">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#404040] h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-600 h-10 w-10 rounded-full bg-green-500 border border-green-500"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#404040] h-8 w-8 rounded-full">
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#404040] h-8 w-8 rounded-full">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const WaveformAnimation = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-green-400 to-green-600 rounded-full"
          animate={{
            height: [8, 32, 16, 40, 24, 8],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

const FloatingNotes = () => {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (windowWidth === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-400/40"
          initial={{
            x: Math.random() * Math.max(windowWidth, 320),
            y: typeof window !== "undefined" ? window.innerHeight + 50 : 800,
            rotate: 0,
            scale: 0.8 + Math.random() * 0.4,
          }}
          animate={{
            y: -100,
            rotate: 360,
            x: Math.random() * Math.max(windowWidth, 320),
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 1.5,
            ease: "easeInOut",
          }}
        >
          {i % 4 === 0 ? (
            <Music className="h-5 w-5 md:h-6 md:w-6" />
          ) : i % 4 === 1 ? (
            <Music2 className="h-4 w-4 md:h-5 md:w-5" />
          ) : i % 4 === 2 ? (
            <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <Headphones className="h-5 w-5 md:h-6 md:w-6" />
          )}
        </motion.div>
      ))}

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`symbol-${i}`}
          className="absolute text-green-300/20 font-bold text-2xl md:text-3xl"
          initial={{
            x: Math.random() * Math.max(windowWidth, 320),
            y: typeof window !== "undefined" ? window.innerHeight + 50 : 800,
            rotate: 0,
          }}
          animate={{
            y: -50,
            rotate: 180,
            x: Math.random() * Math.max(windowWidth, 320),
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 3,
            ease: "linear",
          }}
        >  
          {i % 3 === 0 ? "♪" : i % 3 === 1 ? "♫" : "♬"}
        </motion.div>
      ))}
    </div>
  )
}

const BottomAudioPlayer = ({
  track,
  trackIndex,
  allTracks,
  onNext,
  onPrev,
  onClose,
  onPlayingStateChange,
}: {
  track: any
  trackIndex: number
  allTracks: any[]
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  onPlayingStateChange?: (isPlaying: boolean) => void
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (audioRef.current) {
      // Reset audio to beginning and start playing new track
      audioRef.current.currentTime = 0
      setProgress(0)
      setCurrentTime(0)
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        onPlayingStateChange?.(true)
      }).catch(error => {
        console.error("Audio play failed:", error)
        setIsPlaying(false)
        onPlayingStateChange?.(false)
      })
    }
  }, [track])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        onPlayingStateChange?.(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
        onPlayingStateChange?.(true)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(isFinite(progress) ? progress : 0)
      setDuration(audioRef.current.duration)
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (value / 100) * audioRef.current.duration
      if (isFinite(time)) {
        audioRef.current.currentTime = time
        setProgress(value)
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
    if (trackIndex < allTracks.length - 1) {
      onNext()
    } else {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
      onPlayingStateChange?.(false)
    }
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-[#282828] p-3"
    >
      <audio
        ref={audioRef}
        src={track.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-2.5">
          <div className="flex items-center gap-2.5">
            <img
              src={track.cover_image_url || '/placeholder.svg'}
              alt={track.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium truncate">{track.title}</h4>
              <p className="text-gray-400 text-xs truncate">{track.business_type || 'Jingle Sample'}</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="w-full bg-[#404040] rounded-full h-1 cursor-pointer"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect()
                   const x = e.clientX - rect.left
                   const percentage = (x / rect.width) * 100
                   handleSeek(Math.min(Math.max(percentage, 0), 100))
                 }}>
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3.5">
            <Button
              onClick={() => {
                onPrev()
              }}
              disabled={trackIndex === 0}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#404040] h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-600 h-10 w-10 rounded-full bg-green-500"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button
              onClick={() => {
                onNext()
              }}
              disabled={trackIndex === allTracks.length - 1}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#404040] h-8 w-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={track.cover_image_url || '/placeholder.svg'}
              alt={track.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h4 className="text-white text-sm font-medium truncate">{track.title}</h4>
              <p className="text-gray-400 text-xs truncate">{track.business_type || 'Jingle Sample'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                onPrev()
              }}
              disabled={trackIndex === 0}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#404040] h-7 w-7 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-600 h-9 w-9 rounded-full bg-green-500"
            >
              {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5" />}
            </Button>
            
            <Button
              onClick={() => {
                onNext()
              }}
              disabled={trackIndex === allTracks.length - 1}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#404040] h-7 w-7 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <span className="text-gray-400 text-[10px] min-w-[36px]">{formatTime(currentTime)}</span>
            <div className="flex-1 bg-[#404040] rounded-full h-[3px] cursor-pointer"
                 onClick={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect()
                   const x = e.clientX - rect.left
                   const percentage = (x / rect.width) * 100
                   handleSeek(Math.min(Math.max(percentage, 0), 100))
                 }}>
              <div 
                className="bg-green-500 h-[3px] rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-gray-400 text-[10px] min-w-[36px]">{formatTime(duration)}</span>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

const SpotifyLandingPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [jingleSamples, setJingleSamples] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [pageDirection, setPageDirection] = useState(1) // 1 for next, -1 for prev
  const [isMobile, setIsMobile] = useState(false)
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<string | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null)
  const [showBottomPlayer, setShowBottomPlayer] = useState(false)
  const [isAudioActuallyPlaying, setIsAudioActuallyPlaying] = useState(false)
  const [isLoadingSamples, setIsLoadingSamples] = useState(true)
  const [audioDurations, setAudioDurations] = useState<{[key: string]: number}>({})
  const [dragX, setDragX] = useState(0) // Track drag position for preview
  const jingleSectionRef = useRef<HTMLElement>(null)
  const samplesPerPage = 4
  const mobilePerPage = 1

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset page when switching between mobile/desktop
  useEffect(() => {
    setCurrentPage(0)
  }, [isMobile])

  const currentSamplesPerPage = isMobile ? mobilePerPage : samplesPerPage
  const totalPages = Math.ceil(jingleSamples.length / currentSamplesPerPage)

  useEffect(() => {
    initFacebookPixel()
    trackFBEvent("ViewContent", {
      content_name: "Indomusika Landing Page",
      content_category: "Service Page",
    })
  }, [])

  const fetchJingleSamples = async () => {
    setIsLoadingSamples(true)
    try {
      // First, get all available jingle samples
      const { data, error } = await createClient()
        .from("jingle_samples")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Database error fetching jingle samples:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // Show a single informative message when there's a database error
        setJingleSamples([
          {
            id: 0,
            title: "Error Koneksi Database",
            description: "Tidak dapat mengakses data jingle. Silakan refresh halaman atau hubungi admin jika masalah berlanjut.",
            audio_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            cover_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
            business_type: "Error",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
      } else {
        // Show actual database data with proper random sampling
        console.log("Successfully fetched jingle samples:", data?.length || 0, "records")
        if (data && data.length > 0) {
          // Implement client-side randomization and limit to 20 samples
          const shuffled = [...data].sort(() => Math.random() - 0.5)
          const samplesToShow = data.length > 20 ? shuffled.slice(0, 20) : shuffled
          setJingleSamples(samplesToShow)
          // Load audio durations for all samples
          loadAudioDurations(samplesToShow)
        } else {
          // If database returns empty result, show message to add data
          console.log("No jingle samples found in database")
          setJingleSamples([
            {
              id: 0,
              title: "Belum Ada Data Jingle",
              description: "Silakan tambah jingle sample melalui halaman /addsong untuk melihat contoh jingle di sini.",
              audio_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
              cover_image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
              business_type: "Info",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ])
        }
      }
    } catch (error) {
      console.error("Network/Connection error:", {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        type: typeof error
      })
      
      // Only on network errors, show a single connection error item
      setJingleSamples([
        {
          id: 0,
          title: "Koneksi Terputus",
          description: "Tidak dapat terhubung ke server. Silakan periksa koneksi internet dan refresh halaman.",
          audio_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          cover_image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
          business_type: "Error",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
    } finally {
      setIsLoadingSamples(false)
    }
  }

  // Function to load audio duration for each sample
  const loadAudioDurations = async (samples: any[]) => {
    const durations: {[key: string]: number} = {}
    
    // Load durations for all samples concurrently
    const promises = samples.map((sample) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio()
        audio.crossOrigin = "anonymous"
        
        const handleLoadedMetadata = () => {
          if (isFinite(audio.duration)) {
            durations[sample.audio_url] = audio.duration
          } else {
            durations[sample.audio_url] = 0
          }
          cleanup()
          resolve()
        }
        
        const handleError = () => {
          console.warn(`Failed to load duration for: ${sample.title}`)
          durations[sample.audio_url] = 0
          cleanup()
          resolve()
        }
        
        const cleanup = () => {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
          audio.removeEventListener('error', handleError)
          audio.src = ''
        }
        
        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('error', handleError)
        audio.src = sample.audio_url
        
        // Timeout after 10 seconds
        setTimeout(() => {
          if (!durations.hasOwnProperty(sample.audio_url)) {
            durations[sample.audio_url] = 0
            cleanup()
            resolve()
          }
        }, 10000)
      })
    })
    
    await Promise.all(promises)
    setAudioDurations(durations)
  }

  useEffect(() => {
    fetchJingleSamples()
    // Ensure audio playing state starts as false
    setIsAudioActuallyPlaying(false)
  }, [])

  // Auto-scroll to currently playing track on mobile (only when track starts playing)
  useEffect(() => {
    if (currentTrackIndex !== null && isMobile && isAudioActuallyPlaying) {
      const targetPage = Math.floor(currentTrackIndex / currentSamplesPerPage)
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage)
      }
    }
  }, [currentTrackIndex, isMobile, currentSamplesPerPage, isAudioActuallyPlaying])

  const playTrack = (trackIndex: number) => {
    // Reset all audio states first to ensure clean state
    setIsAudioActuallyPlaying(false)
    setCurrentTrackIndex(trackIndex)
    setCurrentlyPlayingAudio(jingleSamples[trackIndex].audio_url)
    setShowBottomPlayer(true)
  }

  const handleNext = () => {
    if (currentTrackIndex !== null && currentTrackIndex < jingleSamples.length - 1) {
      const nextIndex = currentTrackIndex + 1
      // Always reset the playing state when switching tracks
      setIsAudioActuallyPlaying(false)
      setCurrentTrackIndex(nextIndex)
      setCurrentlyPlayingAudio(jingleSamples[nextIndex].audio_url)
      // Ensure bottom player stays open
      setShowBottomPlayer(true)
      
      // Auto-scroll to the page containing the next track
      const currentSamplesPerPage = isMobile ? mobilePerPage : samplesPerPage
      const targetPage = Math.floor(nextIndex / currentSamplesPerPage)
      if (targetPage !== currentPage) {
        console.log('Auto-scrolling to page:', targetPage, 'for track:', nextIndex)
        setCurrentPage(targetPage)
        // Smooth scroll to jingle section after a short delay
        setTimeout(() => {
          if (jingleSectionRef.current) {
            jingleSectionRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        }, 300)
      }
    }
  }

  const handlePrev = () => {
    if (currentTrackIndex !== null && currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1
      // Always reset the playing state when switching tracks
      setIsAudioActuallyPlaying(false)
      setCurrentTrackIndex(prevIndex)
      setCurrentlyPlayingAudio(jingleSamples[prevIndex].audio_url)
      // Ensure bottom player stays open
      setShowBottomPlayer(true)
      
      // Auto-scroll to the page containing the previous track
      const currentSamplesPerPage = isMobile ? mobilePerPage : samplesPerPage
      const targetPage = Math.floor(prevIndex / currentSamplesPerPage)
      if (targetPage !== currentPage) {
        console.log('Auto-scrolling to page:', targetPage, 'for track:', prevIndex)
        setCurrentPage(targetPage)
        // Smooth scroll to jingle section after a short delay
        setTimeout(() => {
          if (jingleSectionRef.current) {
            jingleSectionRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        }, 300)
      }
    }
  }

  const handleClosePlayer = () => {
    setShowBottomPlayer(false)
    setCurrentTrackIndex(null)
    setCurrentlyPlayingAudio(null)
    setIsAudioActuallyPlaying(false)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-hidden relative">
      {/* Musical Notes Animation */}
      <div className="fixed inset-0 pointer-events-none z-10"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#191414] via-[#121212] to-black">
        <div className="absolute inset-0 bg-[url('/happy-business-owner-with-headphones-listening-to-.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-[#121212]/80 to-black/90"></div>

        {/* Top notification badges with mobile-responsive positioning */}
        <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-3xl px-4">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-3 md:gap-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="whitespace-nowrap font-medium">🔥 1000+ Jingle Sudah Dibuat</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm">
              <span className="whitespace-nowrap font-medium">⭐ Rating 4.9/5</span>
            </div>
          </div>
        </div>

        <FloatingNotes />

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute border border-white/10 rounded-full"
              style={{
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.6,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-32 sm:mt-28 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight sm:leading-snug">
              <span className="block mb-1 sm:mb-1">👉 Biar Usaha Kamu</span>
              <span className="block mb-1 sm:mb-1">Makin Dikenal,</span>
              <span className="text-green-400 block">Bikin Jingle yang Nempel di Kepala!</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Bayangin pelanggan nyebut nama usaha kamu sambil nyanyi. Seru kan?<br className="hidden sm:block" />
              Tapi bukan cuma seru — jingle bikin usaha kamu lebih gampang diingat, lebih dipercaya, dan beda dari pesaing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12"
          >
            <Button
              size="lg"
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto transform hover:scale-105"
            >
              🚀 Pesan Sekarang Mulai Rp199K
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (jingleSamples.length > 0) {
                  const randomIndex = Math.floor(Math.random() * jingleSamples.length)
                  playTrack(randomIndex)
                }
              }}
              className="border-green-500 text-green-400 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/25 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl rounded-full bg-transparent w-full sm:w-auto hover:border-green-300 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
            >
              <span className="flex items-center gap-2">
                <span className="group-hover:animate-pulse">🎧</span>
                <span>Dengar Contoh Jingle</span>
              </span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-400 mb-8"
          >
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm font-medium">
              2 Lagu Original
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm font-medium">
              Free Lirik
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm font-medium">
              Hak Pakai Komersial
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm font-medium">
              Fast Delivery
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <WaveformAnimation />
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-8 px-4">
              Kenapa Usaha Kamu Perlu{" "}
              <span className="text-green-400 block sm:inline mt-2 sm:mt-0">Jingle?</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
              Mari kita lihat kenapa jingle sangat penting untuk bisnis Anda
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
                {[
                  {
                    text: "Promosi cuma pakai gambar & teks cepat dilupain pelanggan",
                    icon: "📱"
                  },
                  {
                    text: "Susah bedain usaha dari kompetitor yang serupa",
                    icon: "🔍"
                  },
                  {
                    text: "Pelanggan nggak punya sesuatu yang mudah diingat dari brand kamu",
                    icon: "🧠"
                  }
                ].map((problem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-red-500/10 border-red-500/30 p-4 sm:p-6 hover:bg-red-500/15 transition-colors duration-300">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="text-xl sm:text-2xl flex-shrink-0">{problem.icon}</div>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{problem.text}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-r from-green-800/60 to-green-900/60 border-2 border-green-400/80 p-4 sm:p-6 hover:from-green-800/70 hover:to-green-900/70 transition-all duration-300 shadow-xl backdrop-blur-sm">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-4xl flex-shrink-0 bg-yellow-400/20 rounded-full p-2">✨</div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-white mb-3 drop-shadow-lg">
                        Solusinya adalah Jingle!
                      </p>
                      <p className="text-sm sm:text-base text-gray-100 leading-relaxed font-medium">
                        Dengan jingle, brand kamu jadi lebih mudah diingat, beda dari kompetitor, dan bikin pelanggan pengen balik lagi.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center order-1 lg:order-2"
            >
              <div className="relative">
                <motion.div 
                  className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-br from-green-400/20 to-purple-600/20 rounded-full flex items-center justify-center relative overflow-hidden"
                  animate={{
                    background: [
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)",
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)",
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Rotating cassette tape effect */}
                  <motion.div
                    className="absolute inset-4 rounded-full border-2 border-green-400/30"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute inset-8 rounded-full border border-green-400/20"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Music className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-green-400 drop-shadow-lg" />
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-lg sm:text-xl md:text-2xl">🎵</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Kenapa Bikin Jingle di <span className="text-green-400">Indomusika?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Music className="w-8 h-8 md:w-12 md:h-12" />,
                title: "100% Original",
                description: "bukan musik template.",
                color: "from-green-400 to-green-600",
              },
              {
                icon: <ArrowRight className="w-8 h-8 md:w-12 md:h-12" />,
                title: "Cepat",
                description: "1 hari, revisi sampai puas.",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: <Building className="w-8 h-8 md:w-12 md:h-12" />,
                title: "Harga Aman Buat UMKM",
                description: "mulai Rp199K aja.",
                color: "from-blue-400 to-blue-600",
              },
              {
                icon: <Star className="w-8 h-8 md:w-12 md:h-12" />,
                title: "Langsung Dipakai",
                description: "cocok buat iklan, sosmed, atau radio.",
                color: "from-purple-400 to-purple-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-[#121212] border-[#282828] p-4 md:p-6 h-full hover:border-green-500/50 transition-all duration-300">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0">
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-white text-center md:text-left">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base text-center md:text-left">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section ref={jingleSectionRef} className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
              Dengerin Dulu Contoh Jingle Kita <span className="text-green-400">🎧</span>
            </h2>
            {isLoadingSamples ? (
              <div className="flex items-center justify-center gap-2 text-lg text-gray-400 mb-8">
                <div className="animate-spin w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"></div>
                <span>Memuat contoh jingle...</span>
              </div>
            ) : (
              <p className="text-lg text-gray-400 mb-8">
                Pilih dari {jingleSamples.length} contoh jingle berkualitas untuk berbagai jenis usaha
              </p>
            )}
          </motion.div>

          {/* Desktop Navigation (above cards) */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">
                Halaman {currentPage + 1} dari {totalPages}
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              Menampilkan {Math.min((currentPage + 1) * currentSamplesPerPage, jingleSamples.length)} dari {jingleSamples.length} jingle
            </div>
          </div>

          {/* Mobile Page Counter */}
          <div className="md:hidden text-center mb-4">
            <span className="text-white text-sm">
              {currentPage + 1} dari {totalPages}
            </span>
          </div>

          {/* Cards Container with Side Navigation */}
          <div className="relative pointer-events-none">
            {/* Loading State */}
            {isLoadingSamples ? (
              <div className="relative">
                {/* Mobile Loading Skeleton */}
                <div className="md:hidden relative h-[420px] overflow-visible px-6 flex items-center justify-center">
                  <Card className="bg-[#1a1a1a]/50 border-green-500/20 w-full max-w-[280px] mx-auto animate-pulse">
                    <div className="p-4">
                      <div className="bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-xl h-[180px] w-full mb-4">
                        <div className="w-full h-full bg-gray-700/30 rounded-xl animate-pulse" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-5 bg-gray-700/40 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-gray-800/40 rounded w-1/2 animate-pulse" />
                        <div className="bg-[#282828]/50 rounded-lg p-3 space-y-2">
                          <div className="w-full bg-[#404040]/50 rounded-full h-1" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-500/30 rounded-full animate-pulse" />
                              <div className="h-3 bg-gray-600/40 rounded w-8 animate-pulse" />
                            </div>
                            <div className="w-6 h-6 bg-gray-600/40 rounded-full animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Desktop Loading Skeleton */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index} className="bg-[#1a1a1a]/50 border-green-500/20 animate-pulse">
                      <div className="p-4">
                        <div className="bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-xl h-[160px] w-full mb-4">
                          <div className="w-full h-full bg-gray-700/30 rounded-xl animate-pulse" />
                        </div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-700/40 rounded w-3/4 animate-pulse" />
                          <div className="h-3 bg-gray-800/40 rounded w-1/2 animate-pulse" />
                          <div className="bg-[#282828]/50 rounded-lg p-3 space-y-2">
                            <div className="w-full bg-[#404040]/50 rounded-full h-1" />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-500/30 rounded-full animate-pulse" />
                                <div className="h-3 bg-gray-600/40 rounded w-8 animate-pulse" />
                              </div>
                              <div className="w-6 h-6 bg-gray-600/40 rounded-full animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Navigation Buttons - Only show when not loading */}
                {/* Left Navigation Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const newPage = Math.max(0, currentPage - 1)
                    setPageDirection(-1)
                    setCurrentPage(newPage)
                  }}
                  disabled={currentPage === 0}
                  className="absolute left-2 md:-left-16 top-1/2 transform -translate-y-1/2 z-[70] border-2 border-green-500 text-green-400 hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed bg-black/95 backdrop-blur-sm px-4 py-4 hover:scale-110 shadow-xl transition-all duration-200 min-h-[52px] min-w-[52px] touch-manipulation rounded-lg pointer-events-auto"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>

                {/* Right Navigation Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const newPage = Math.min(totalPages - 1, currentPage + 1)
                    setPageDirection(1)
                    setCurrentPage(newPage)
                  }}
                  disabled={currentPage >= totalPages - 1}
                  className="absolute right-2 md:-right-16 top-1/2 transform -translate-y-1/2 z-[70] border-2 border-green-500 text-green-400 hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed bg-black/95 backdrop-blur-sm px-4 py-4 hover:scale-110 shadow-xl transition-all duration-200 min-h-[52px] min-w-[52px] touch-manipulation rounded-lg pointer-events-auto"
                >
                  <ArrowRight className="h-6 w-6" />
                </Button>

            {/* Mobile Carousel Layout */}
            <div className="md:hidden relative h-[420px] overflow-visible px-6 pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div 
                  className="flex items-center justify-center h-full relative"
                  key={currentPage}
                  initial={{ x: pageDirection * 300, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: pageDirection * -300, opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 600, 
                    damping: 40,
                    mass: 0.3,
                    duration: 0.25
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDrag={(event, info) => {
                    // Update drag position for real-time preview
                    setDragX(info.offset.x)
                  }}
                  onDragEnd={(event, info) => {
                    // Reset drag position
                    setDragX(0)
                    
                    const threshold = 50
                    const velocity = Math.abs(info.velocity.x)
                    
                    // Consider both distance and velocity for responsive swipes
                    if ((info.offset.x > threshold || (info.offset.x > 25 && velocity > 500)) && currentPage > 0) {
                      // Swipe right - go to previous page
                      setPageDirection(-1)
                      setCurrentPage(currentPage - 1)
                    } else if ((info.offset.x < -threshold || (info.offset.x < -25 && velocity > 500)) && currentPage < totalPages - 1) {
                      // Swipe left - go to next page
                      setPageDirection(1)
                      setCurrentPage(currentPage + 1)
                    }
                  }}
                >
                {/* Swipe Indicators */}
                {currentPage > 0 && (
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 opacity-30">
                    <div className="flex items-center gap-1 text-green-400">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="text-xs">Swipe</span>
                    </div>
                  </div>
                )}
                {currentPage < totalPages - 1 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-30">
                    <div className="flex items-center gap-1 text-green-400">
                      <span className="text-xs">Swipe</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                )}
                {jingleSamples
                  .slice(currentPage * currentSamplesPerPage, (currentPage + 1) * currentSamplesPerPage)
                  .map((sample, index) => {
                    return (
                      <motion.div
                        key={sample.id}
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ 
                          scale: 1,
                          opacity: 1,
                          y: 0
                        }}
                        exit={{
                          scale: 0.8,
                          opacity: 0,
                          y: -20
                        }}
                        transition={{ 
                          delay: 0.05,
                          duration: 0.3,
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                        whileHover={{
                          scale: 1.05,
                          y: -8,
                          transition: {
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            duration: 0.2
                          }
                        }}
                        whileTap={{ scale: 0.95, y: -3 }}
                        className="relative z-10"
                      >
                        {/* Real-time Preview Cards */}
                        {/* Previous item preview */}
                        {currentPage > 0 && (() => {
                          const prevSample = jingleSamples[(currentPage - 1) * currentSamplesPerPage]
                          const dragProgress = Math.max(0, Math.min(1, dragX / 100)) // 0 to 1 based on drag
                          const isVisible = dragX > 25 // Show when dragging right past 25px
                          
                          return (
                            <motion.div
                              className="absolute -left-16 top-0 z-5 pointer-events-none"
                              initial={{ x: -60, opacity: 0, scale: 0.7 }}
                              animate={{ 
                                x: isVisible ? -20 + (dragProgress * 40) : -60,
                                opacity: isVisible ? 0.6 + (dragProgress * 0.4) : 0,
                                scale: isVisible ? 0.85 + (dragProgress * 0.1) : 0.7
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 30,
                                duration: 0.2
                              }}
                            >
                              <Card className="bg-[#1a1a1a] border-green-500/20 w-[240px] h-[350px] overflow-hidden">
                                <div className="p-3 h-full">
                                  <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-xl h-[140px] w-full mb-3 relative overflow-hidden">
                                    <img 
                                      src={prevSample?.cover_image_url || "/placeholder.svg"} 
                                      alt={prevSample?.title || "Previous"}
                                      className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-2 right-2">
                                      <Badge className="bg-green-500/80 text-white text-xs px-2 py-1">
                                        {prevSample?.business_type || 'Umum'}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="text-white font-bold text-sm line-clamp-2">{prevSample?.title || 'Previous Track'}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2">
                                      {prevSample?.description || 'Previous jingle sample'}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          )
                        })()}
                        
                        {/* Next item preview */}
                        {currentPage < totalPages - 1 && (() => {
                          const nextSample = jingleSamples[(currentPage + 1) * currentSamplesPerPage]
                          const dragProgress = Math.max(0, Math.min(1, Math.abs(dragX) / 100)) // 0 to 1 based on drag
                          const isVisible = dragX < -25 // Show when dragging left past -25px
                          
                          return (
                            <motion.div
                              className="absolute -right-16 top-0 z-5 pointer-events-none"
                              initial={{ x: 60, opacity: 0, scale: 0.7 }}
                              animate={{ 
                                x: isVisible ? 20 - (dragProgress * 40) : 60,
                                opacity: isVisible ? 0.6 + (dragProgress * 0.4) : 0,
                                scale: isVisible ? 0.85 + (dragProgress * 0.1) : 0.7
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 30,
                                duration: 0.2
                              }}
                            >
                              <Card className="bg-[#1a1a1a] border-green-500/20 w-[240px] h-[350px] overflow-hidden">
                                <div className="p-3 h-full">
                                  <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-xl h-[140px] w-full mb-3 relative overflow-hidden">
                                    <img 
                                      src={nextSample?.cover_image_url || "/placeholder.svg"} 
                                      alt={nextSample?.title || "Next"}
                                      className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-2 right-2">
                                      <Badge className="bg-green-500/80 text-white text-xs px-2 py-1">
                                        {nextSample?.business_type || 'Umum'}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="text-white font-bold text-sm line-clamp-2">{nextSample?.title || 'Next Track'}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2">
                                      {nextSample?.description || 'Next jingle sample'}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          )
                        })()}

                        {/* Main card with drag responsiveness */}
                        <motion.div
                          whileHover={{ 
                            scale: 1.05, 
                            y: -5,
                            transition: { type: "spring", stiffness: 400, damping: 25 }
                          }}
                          animate={{
                            y: [0, -1, 0],
                            x: dragX, // Follow drag position
                            scale: Math.max(0.95, 1 - Math.abs(dragX) * 0.001), // Subtle scale based on drag
                            opacity: Math.max(0.7, 1 - Math.abs(dragX) * 0.003) // Slight opacity change
                          }}
                          transition={{
                            y: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            },
                            x: {
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                              mass: 0.5
                            },
                            scale: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25
                            },
                            opacity: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25
                            }
                          }}
                          className="mx-3 relative z-20"
                        >
                          <Card className={`bg-[#1a1a1a] overflow-hidden group transition-all duration-500 w-full max-w-[280px] mx-auto relative z-10 ${
                            currentlyPlayingAudio !== null && 
                            currentlyPlayingAudio === sample.audio_url && 
                            isAudioActuallyPlaying === true &&
                            currentTrackIndex === jingleSamples.indexOf(sample)
                              ? 'border-2 border-green-500 shadow-2xl shadow-green-500/30 scale-105' 
                              : 'border-green-500/20 hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10'
                          }`}>
                            <div className="p-4">
                              {/* Cover Image */}
                              <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 overflow-hidden rounded-xl h-[180px] w-full relative mb-4">
                                <img 
                                  src={sample.cover_image_url || "/placeholder.svg"} 
                                  alt={sample.title} 
                                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-green-500/80 text-white text-xs px-2 py-1">
                                    {sample.business_type || 'Umum'}
                                  </Badge>
                                </div>
                                
                                {/* Now Playing Indicator */}
                                {currentlyPlayingAudio !== null && 
                                 currentlyPlayingAudio === sample.audio_url && 
                                 isAudioActuallyPlaying === true &&
                                 currentTrackIndex === jingleSamples.indexOf(sample) && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute top-2 left-2"
                                  >
                                    <Badge className="bg-green-500 text-white text-xs px-2 py-1 flex items-center gap-1">
                                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                      Now Playing
                                    </Badge>
                                  </motion.div>
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="space-y-3">
                                <h3 className="text-white font-bold text-lg line-clamp-1">{sample.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2">
                                  {sample.description || 'Jingle berkualitas untuk usaha Anda'}
                                </p>
                                
                                {/* Audio Player Compact */}
                                <AudioPlayerCompact 
                                  src={sample.audio_url} 
                                  title={sample.title}
                                  currentlyPlayingAudio={currentlyPlayingAudio}
                                  setCurrentlyPlayingAudio={setCurrentlyPlayingAudio}
                                  onPlay={() => playTrack(jingleSamples.indexOf(sample))}
                                  isActuallyPlaying={isAudioActuallyPlaying}
                                  trackIndex={jingleSamples.indexOf(sample)}
                                  currentTrackIndex={currentTrackIndex}
                                  duration={audioDurations[sample.audio_url]}
                                  onPause={() => {
                                    setIsAudioActuallyPlaying(false)
                                    setShowBottomPlayer(false)
                                    setCurrentTrackIndex(null)
                                  }}
                                />
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </motion.div>
                    )
                  })
                }
              </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Grid Layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ x: pageDirection * 200, opacity: 0, scale: 0.95 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: pageDirection * -200, opacity: 0, scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 35,
                    mass: 0.4,
                    duration: 0.3
                  }}
                  className="contents"
                >
                  {jingleSamples
                    .slice(currentPage * currentSamplesPerPage, (currentPage + 1) * currentSamplesPerPage)
                    .map((sample, index) => (
                      <motion.div
                        key={sample.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -10,
                          transition: { 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 25,
                            duration: 0.2
                          }
                        }}
                        whileTap={{ scale: 0.95, y: -5 }}
                        className="flex justify-center"
                      >
                        <Card className={`bg-[#1a1a1a] overflow-hidden group transition-all duration-500 ${
                          currentlyPlayingAudio !== null && 
                          currentlyPlayingAudio === sample.audio_url && 
                          isAudioActuallyPlaying === true &&
                          currentTrackIndex === jingleSamples.indexOf(sample)
                            ? 'border-2 border-green-500 shadow-2xl shadow-green-500/30 scale-105' 
                            : 'border-green-500/20 hover:border-green-500/40 hover:shadow-xl hover:shadow-green-500/10'
                        }`}>
                          <div className="p-4">
                            {/* Cover Image */}
                            <div className="bg-gradient-to-br from-green-400/20 to-green-600/20 overflow-hidden rounded-xl h-[160px] w-full relative mb-4">
                              <img 
                                src={sample.cover_image_url || "/placeholder.svg"} 
                                alt={sample.title} 
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-green-500/80 text-white text-xs px-2 py-1">
                                  {sample.business_type || 'Umum'}
                                </Badge>
                              </div>
                              
                              {/* Now Playing Indicator */}
                              {currentlyPlayingAudio !== null && 
                               currentlyPlayingAudio === sample.audio_url && 
                               isAudioActuallyPlaying === true &&
                               currentTrackIndex === jingleSamples.indexOf(sample) && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="absolute top-2 left-2"
                                >
                                  <Badge className="bg-green-500 text-white text-xs px-2 py-1 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    Now Playing
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="space-y-3">
                              <h3 className="text-white font-bold text-lg line-clamp-1">{sample.title}</h3>
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {sample.description || 'Jingle berkualitas untuk usaha Anda'}
                              </p>
                              
                              {/* Audio Player Compact */}
                              <AudioPlayerCompact 
                                src={sample.audio_url} 
                                title={sample.title}
                                currentlyPlayingAudio={currentlyPlayingAudio}
                                setCurrentlyPlayingAudio={setCurrentlyPlayingAudio}
                                onPlay={() => playTrack(jingleSamples.indexOf(sample))}
                                isActuallyPlaying={isAudioActuallyPlaying}
                                trackIndex={jingleSamples.indexOf(sample)}
                                currentTrackIndex={currentTrackIndex}
                                duration={audioDurations[sample.audio_url]}
                                onPause={() => {
                                  setIsAudioActuallyPlaying(false)
                                  setShowBottomPlayer(false)
                                  setCurrentTrackIndex(null)
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  }
                </motion.div>
              </AnimatePresence>
            </div>
              </>
            )}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage 
                    ? 'bg-green-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              onClick={() => setIsFormOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
            >
              🎵 Pesan Jingle Sekarang
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-b from-black to-gray-900">
        <div className="text-center pt-12 pb-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Kata Mereka yang Udah Coba <span className="text-green-400">👇</span>
          </h2>
        </div>
        <AnimatedTestimonials />
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-900/20 via-black to-purple-900/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">🎉 Promo Spesial Buat 10 Pembeli Pertama!</h2>
            <p className="text-xl text-gray-300">Harga normal Rp450K → sekarang cuma Rp199K!</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="bg-[#121212] border-[#282828] p-4 sm:p-8 relative overflow-hidden">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                <Badge className="bg-red-500 text-white font-bold px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm">🔥 HOT DEAL</Badge>
              </div>

              <div className="text-center mb-6 sm:mb-8 mt-8 sm:mt-0">
                <h3 className="text-lg sm:text-2xl font-bold text-green-400 mb-2">🟢 PAKET PROMO – 10 Pembeli Pertama</h3>
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
                  <span className="text-lg sm:text-2xl text-gray-500 line-through">Rp450K</span>
                  <span className="text-2xl sm:text-4xl font-bold text-green-400">Rp199K</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 sm:mb-8">
                {["2 Lagu Original", "Free Lirik", "Minor Revisi*", "Hak Pakai Komersial", "1 Hari Selesai"].map(
                  (feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base">{feature}</span>
                    </div>
                  ),
                )}
              </div>

              <Button
                size="lg"
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full"
              >
                🔥 Ambil Promo Sekarang
              </Button>

              <p className="text-xs sm:text-sm text-gray-400 text-center mt-4">
                Promo terbatas hanya untuk 10 orang pertama. Jangan kelewatan!
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                  <span>Tersisa 7 dari 10 slot</span>
                  <span>70%</span>
                </div>
                <div className="w-full bg-[#282828] rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-[70%]"></div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-[#121212]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Pertanyaan yang Sering <span className="text-green-400">Ditanyain</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "Berapa lama prosesnya?",
                  answer: "1 hari kerja. Kami bekerja cepat tanpa mengurangi kualitas.",
                },
                {
                  question: "Bisa request genre?",
                  answer: "Bisa banget, dari dangdut sampai pop! Kami bisa menyesuaikan dengan karakter brand kamu.",
                },
                {
                  question: "Harga udah termasuk hak pakai komersial?",
                  answer: "Iya, bebas buat iklan & sosmed. Kamu bisa pakai jingle untuk semua keperluan bisnis.",
                },
                {
                  question: "Gimana kalau hasilnya nggak sesuai?",
                  answer: "Tenang, ada revisi gratis sampai kamu puas dengan hasilnya.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-[#191414] border-[#282828] rounded-lg px-6"
                >
                  <AccordionTrigger className="text-white hover:text-green-400">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-green-900/20 to-black relative overflow-hidden">
        <FloatingNotes />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              👉 Sekarang Giliran Usaha Kamu
              <br />
              <span className="text-green-400">Punya Jingle yang Nempel!</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Mulai dari Rp199K aja, brand kamu bisa punya suara sendiri. Yuk bikin pelanggan gampang inget nama
              usahamu!
            </p>

            <Button
              size="lg"
              onClick={() => setIsFormOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
            >
              🚀 Miliki Jingle Sekarang
            </Button>

            <div className="mt-12">
              <WaveformAnimation />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#121212]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Garansi 100%</h3>
              <p className="text-gray-400">Tidak puas? Uang kembali tanpa ribet</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Pengerjaan Cepat</h3>
              <p className="text-gray-400">Jingle siap dalam 1 hari kerja</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Tim Profesional</h3>
              <p className="text-gray-400">Musisi dan sound engineer berpengalaman</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#191414]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-8">Dipercaya oleh 1000+ UMKM di seluruh Indonesia</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Warung Makan", "Toko Fashion", "Salon Kecantikan", "Bengkel Motor", "Kafe", "Laundry"].map(
              (business, i) => (
                <div key={i} className="bg-[#282828] px-4 py-2 rounded-lg text-sm font-medium text-gray-300">
                  {business}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <MultiStepForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      
      {/* Bottom Audio Player */}
      <AnimatePresence>
        {showBottomPlayer && currentTrackIndex !== null && (
          <BottomAudioPlayer
            track={jingleSamples[currentTrackIndex]}
            trackIndex={currentTrackIndex}
            allTracks={jingleSamples}
            onNext={handleNext}
            onPrev={handlePrev}
            onClose={handleClosePlayer}
            onPlayingStateChange={setIsAudioActuallyPlaying}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SpotifyLandingPage
