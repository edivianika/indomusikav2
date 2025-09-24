'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { 
  Music, 
  CheckCircle, 
  Star, 
  MessageCircle, 
  ArrowRight, 
  Play,
  Headphones,
  Zap,
  Shield,
  Clock,
  Gift,
  Users,
  TrendingUp,
  Heart,
  Sparkles,
  SkipBack,
  SkipForward
} from 'lucide-react';

export default function JasaBuatLaguPage() {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [portfolioExamples, setPortfolioExamples] = useState([
    {
      id: 1,
      title: "Jingle Laundry Express Ponorogo",
      description: "Biar cucian numpuk, tetap wangi kayak baru!",
      genre: "Pop Catchy",
      duration: "30s"
    },
    {
      id: 2,
      title: "Jingle Coffee Shop 'Kopi Kita'",
      description: "Nuansa akustik santai, pas buat ambience kedai",
      genre: "Akustik",
      duration: "25s"
    },
    {
      id: 3,
      title: "Jingle Barbershop",
      description: "Beat energik ala TikTok, bikin anak muda langsung relate",
      genre: "EDM",
      duration: "35s"
    }
  ]);

  const benefits = [
    {
      icon: Music,
      title: "2 Lagu Original",
      description: "Custom sesuai brand"
    },
    {
      icon: Gift,
      title: "Free Lirik",
      description: "Sampai cocok"
    },
    {
      icon: Zap,
      title: "Free Revisi",
      description: "Sampai cocok"
    },
    {
      icon: Shield,
      title: "Hak Komersial",
      description: "Selamanya aman"
    },
    {
      icon: Clock,
      title: "Cepat",
      description: "Langsung bisa dipakai"
    },
    {
      icon: Heart,
      title: "Bayar Setelah Jadi",
      description: "100% aman"
    }
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Halo! Saya tertarik dengan jasa buat lagu UMKM. Bisa info lebih detail tentang paket 2 lagu original dengan harga Rp199K?"
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
  };

  const handlePlayExample = (id: number) => {
    const track = portfolioExamples.find(t => t.id === id);
    if (track) {
      // Set as current track in player
      setCurrentTrack(track);
      setIsPlaying(id);
      setIsPlayerPlaying(true);
      
      // Play audio immediately
      if (audioRef.current) {
        // If it's the same track, just toggle play/pause
        if (currentTrack?.id === id && isPlayerPlaying) {
          audioRef.current.pause();
          setIsPlayerPlaying(false);
          setIsPlaying(null);
        } else {
          // Play the track
          audioRef.current.play().catch(error => {
            console.error('Error playing audio:', error);
          });
        }
      }
    }
  };

  // Audio player functions
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlayerPlaying) {
        audioRef.current.pause();
        setIsPlayerPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlayerPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(e.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handlePrevious = () => {
    if (portfolioExamples.length > 0) {
      const currentIndex = portfolioExamples.findIndex(track => track.id === currentTrack?.id);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : portfolioExamples.length - 1;
      const prevTrack = portfolioExamples[prevIndex];
      setCurrentTrack(prevTrack);
      setIsPlaying(prevTrack.id);
      setIsPlayerPlaying(true);
      
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
  };

  const handleNext = () => {
    if (portfolioExamples.length > 0) {
      const currentIndex = portfolioExamples.findIndex(track => track.id === currentTrack?.id);
      const nextIndex = currentIndex < portfolioExamples.length - 1 ? currentIndex + 1 : 0;
      const nextTrack = portfolioExamples[nextIndex];
      setCurrentTrack(nextTrack);
      setIsPlaying(nextTrack.id);
      setIsPlayerPlaying(true);
      
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fetch random portfolio examples from database
  useEffect(() => {
    const fetchPortfolioExamples = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('jingle_samples')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching portfolio examples:', error);
          return;
        }

        if (data && data.length > 0) {
          const formattedData = data.map((item, index) => ({
            id: item.id,
            title: item.title || `Jingle ${item.business_type || 'UMKM'}`,
            description: item.description || `Jingle untuk ${item.business_type || 'UMKM'}`,
            genre: item.business_type || 'Pop',
            duration: item.duration || '30s',
            audio_url: item.audio_url || null
          }));
          setPortfolioExamples(formattedData);
          // Set first track as current track
          if (formattedData.length > 0) {
            setCurrentTrack(formattedData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching portfolio examples:', error);
      }
    };

    fetchPortfolioExamples();
  }, []);

  // Update audio source when currentTrack changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.audio_url) {
      // Pause current audio first
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Set new source
      audioRef.current.src = currentTrack.audio_url;
      audioRef.current.load();
      
      // Reset time tracking
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentTrack]);

  // Sync isPlayerPlaying with actual audio state
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handlePlay = () => setIsPlayerPlaying(true);
      const handlePause = () => setIsPlayerPlaying(false);
      const handleEnded = () => {
        setIsPlayerPlaying(false);
        setIsPlaying(null);
      };
      
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Indomusika</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a href="/" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-50">Beranda</a>
              <a href="/portfolio" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-50">Portfolio</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Hook Headline */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                <span className="block">Bisnis sepi? Jangan cuma promo.</span>
                <span className="block text-green-600 mt-2">Biar usaha kamu ingat lewat lagu!</span>
              </h1>
            </div>

            {/* CTA Banner */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-gray-100 rounded-lg px-4 py-3 sm:px-6 sm:py-4 inline-block">
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  Pesan Jingle Rp199K - Bayar Setelah Jadi
                </p>
              </div>
            </div>

            {/* Opening Problem */}
            <div className="mb-6 sm:mb-8">
              <div className="max-w-2xl mx-auto">
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                  Pernah nggak, iklan udah jalan, promosi udah gencar, tapi orang lupa sama brand kamu?<br className="hidden sm:block" />
                  <span className="block sm:inline">Mereka mampir sekali, habis itu hilang.</span>
                </p>
              </div>
            </div>

            {/* Brand Examples */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-center space-x-6 sm:space-x-8">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Indomie</div>
                  <div className="w-full h-0.5 bg-green-600"></div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Tokopedia</div>
                  <div className="w-2 h-2 bg-green-600 rounded-full mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Grab</div>
                  <div className="w-2 h-2 bg-green-600 rounded-full mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Solution Box */}
            <div className="bg-gray-100 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5 text-center">
                Indomusika siap bantu bikin jingle original agar usaha kamu:
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🎧</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-900 font-medium">Mudah diingat pelanggan</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🎧</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-900 font-medium">Beda dari kompetitor</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🎧</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-900 font-medium">Top of mind di kepala orang</p>
                </div>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Bikin Lagu untuk Usaha Saya Sekarang
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 sm:mb-10"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-2xl sm:text-3xl">💡</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Paket UMKM Indomusika
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700">
              2 Lagu Original • Sesuai brand kamu
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow text-center"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Examples */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-yellow-500">✨</span>
              <span className="text-yellow-500">✨</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Contoh Portfolio
              </h2>
            </div>
          </motion.div>

          {/* Audio Player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => {
                handleNext();
              }}
              className="hidden"
            />
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePlayPause}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
              >
                {isPlayerPlaying ? (
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>
              <div className="flex-1">
                <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gray-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-white text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePrevious}
                  className="w-8 h-8 text-white hover:text-gray-300 transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-8 h-8 text-white hover:text-gray-300 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>
            {currentTrack && (
              <div className="mt-3 text-white">
                <h4 className="font-semibold text-sm">{currentTrack.title}</h4>
                <p className="text-xs text-gray-300">{currentTrack.description}</p>
              </div>
            )}
          </motion.div>

          {/* Song List */}
          <div className="space-y-3">
            {portfolioExamples.map((example, index) => (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <button
                      onClick={() => handlePlayExample(example.id)}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      {isPlaying === example.id ? (
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{example.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{example.genre}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{example.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="flex items-center space-x-1 text-yellow-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">5.0</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-8 sm:py-12 bg-green-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
              💰 Harga Spesial untuk UMKM:
            </h2>
            
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-md">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <span className="text-lg sm:text-xl text-gray-500 line-through">Rp497.000</span>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">Rp199.000</span>
                </div>
                <p className="text-sm sm:text-base text-gray-700">Sekarang cukup Rp199.000 aja!</p>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <Music className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-sm sm:text-base font-semibold">2 Lagu Original</span>
                </div>
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-sm sm:text-base font-semibold">Free Lirik</span>
                </div>
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-sm sm:text-base font-semibold">Free Revisi</span>
                </div>
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-sm sm:text-base font-semibold">Bayar Setelah Jadi (100% aman)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
              👉 Jangan tunggu sampai kompetitor kamu duluan punya jingle.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8">
              Klik tombol WhatsApp di bawah ini,<br className="hidden sm:block" />
              <span className="block sm:inline">dan mulai bikin lagu bisnis kamu sendiri bareng Indomusika 🎶</span>
            </p>
            
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 sm:space-x-3 mx-auto"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Chat WhatsApp Sekarang</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <p className="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
              💬 Response dalam 5 menit • 🎵 Konsultasi gratis • ⚡ Proses cepat
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <Music className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Indomusika</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Jasa pembuatan lagu original untuk UMKM
          </p>
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900 transition-colors">Beranda</a>
            <a href="/portfolio" className="hover:text-gray-900 transition-colors">Portfolio</a>
            <a href="/jasabuatlagu" className="hover:text-gray-900 transition-colors">Jasa Buat Lagu</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
