'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
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
  Sparkles
} from 'lucide-react';

export default function JasaBuatLaguPage() {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  const portfolioExamples = [
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
  ];

  const benefits = [
    {
      icon: Music,
      title: "2 Lagu Original",
      description: "Custom sesuai brand dan gaya bisnis kamu"
    },
    {
      icon: Gift,
      title: "Free Lirik",
      description: "Mudah dinyanyiin, gampang viral"
    },
    {
      icon: Zap,
      title: "Free Revisi",
      description: "Sampai cocok dengan keinginan kamu"
    },
    {
      icon: Shield,
      title: "Hak Pakai Komersial",
      description: "Aman buat usaha kamu, bisa dipakai selamanya"
    },
    {
      icon: Clock,
      title: "Delivery Cepat",
      description: "Nggak pake lama, bisa langsung dipake"
    },
    {
      icon: Heart,
      title: "Bayar Setelah Jadi",
      description: "100% aman, kamu puas baru bayar"
    }
  ];

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Halo! Saya tertarik dengan jasa buat lagu UMKM. Bisa info lebih detail tentang paket 2 lagu original dengan harga Rp199K?"
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
  };

  const handlePlayExample = (id: number) => {
    setIsPlaying(isPlaying === id ? null : id);
  };

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
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Hook Headline */}
            <div className="mb-8 sm:mb-12">
              <div className="flex justify-center mb-4">
                <span className="text-3xl sm:text-4xl lg:text-5xl">🎶</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight sm:leading-tight">
                <span className="block">"Bisnis sepi? Jangan cuma pasang promo.</span>
                <span className="block text-green-600 mt-2 sm:mt-3">Bikin orang otomatis inget usaha</span>
                <span className="block text-green-600">kamu lewat lagunya!"</span>
              </h1>
            </div>

            {/* Opening Problem */}
            <div className="mb-8 sm:mb-12 lg:mb-16">
              <div className="max-w-3xl mx-auto">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
                  Pernah nggak, iklan udah jalan, promosi udah gencar, tapi orang lupa sama brand kamu?<br className="hidden sm:block" />
                  <span className="block sm:inline">Mereka mampir sekali, habis itu hilang.</span>
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                  <strong className="text-gray-900 font-semibold">Kenapa? Karena nggak ada yang nempel di kepala mereka.</strong>
                </p>
              </div>
            </div>

            {/* Problem → Solution */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Lihat deh brand besar: Indomie, Tokopedia, Grab.
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 text-center">
                Semua punya jingle.<br className="hidden sm:block" />
                <span className="block sm:inline">Bahkan cukup dengar 3 detik, kita langsung inget.</span>
              </p>
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                  Nah, Indomusika bantuin UMKM kayak kamu bikin lagu/jingle original yang:
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Bikin nama usaha kamu langsung nempel di kepala orang</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Bisa dipakai di iklan, konten IG/TikTok, sampai diputar di toko/kedai kamu sendiri</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Simple, catchy, dan sesuai gaya bisnismu (koplo, pop, EDM, akustik, apa aja bisa!)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              💡 Paket UMKM Indomusika:
            </h2>
            <p className="text-lg text-gray-700">
              2 Lagu Original (custom sesuai brand)
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <p className="text-xl font-bold text-gray-900">
              Cuma sekali bayar → bisa dipakai selamanya!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Examples */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ✨ Contoh Portfolio:
            </h2>
          </motion.div>

          <div className="space-y-6">
            {portfolioExamples.map((example, index) => (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handlePlayExample(example.id)}
                      className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      {isPlaying === example.id ? (
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-semibold text-gray-900">{example.title}</h3>
                      <p className="text-gray-600">{example.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">{example.genre}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{example.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Rating 5.0</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              💰 Harga Spesial untuk UMKM:
            </h2>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl text-gray-500 line-through">Rp497.000</span>
                  <span className="text-4xl sm:text-5xl font-bold text-green-600">Rp199.000</span>
                </div>
                <p className="text-lg text-gray-700">Sekarang cukup Rp199.000 aja!</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-3">
                  <Music className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-semibold">2 Lagu Original</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Gift className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-semibold">Free Lirik</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Zap className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-semibold">Free Revisi</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-semibold">Bayar Setelah Jadi (100% aman)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              👉 Jangan tunggu sampai kompetitor kamu duluan punya jingle.
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Klik tombol WhatsApp di bawah ini,<br />
              dan mulai bikin lagu bisnis kamu sendiri bareng Indomusika 🎶
            </p>
            
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Chat WhatsApp Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <p className="text-sm text-gray-400 mt-4">
              💬 Response dalam 5 menit • 🎵 Konsultasi gratis • ⚡ Proses cepat
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Music className="w-8 h-8 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">Indomusika</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Jasa pembuatan lagu original untuk UMKM
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900 transition-colors">Beranda</a>
            <a href="/portfolio" className="hover:text-gray-900 transition-colors">Portfolio</a>
            <a href="/jasabuatlagu" className="hover:text-gray-900 transition-colors">Jasa Buat Lagu</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
