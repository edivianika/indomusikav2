'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { trackLead, trackWhatsAppClick, trackPortfolioPlay, trackPricingView, trackButtonClick, trackAddToCart } from '@/components/facebook-pixel';
import { trackLeadServer, trackWhatsAppContactServer, trackAddToCartServer } from '@/lib/facebook-server-actions';
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

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function JasaBuatLaguPage() {
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [customerServices, setCustomerServices] = useState<any[]>([]);
  const [currentCSIndex, setCurrentCSIndex] = useState(0);

  const [portfolioExamples, setPortfolioExamples] = useState([
    {
      id: 1,
      title: "Jingle Laundry Express Ponorogo",
      description: "Biar cucian numpuk, tetap wangi kayak baru!",
      genre: "Pop Catchy",
      duration: "30s",
      audio_url: "/audio/jingle-sample-1.mp3"
    },
    {
      id: 2,
      title: "Jingle Coffee Shop 'Kopi Kita'",
      description: "Nuansa akustik santai, pas buat ambience kedai",
      genre: "Akustik",
      duration: "25s",
      audio_url: "/audio/jingle-sample-2.mp3"
    },
    {
      id: 3,
      title: "Jingle Barbershop",
      description: "Beat energik ala TikTok, bikin anak muda langsung relate",
      genre: "EDM",
      duration: "35s",
      audio_url: "/audio/jingle-sample-3.mp3"
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

  // Fetch customer services from database
  useEffect(() => {
    const fetchCustomerServices = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('customer_services')
          .select('*')
          .eq('status', true)
          .order('id');

        if (error) {
          console.error('Error fetching customer services:', error);
          // Fallback to default CS if database fails
          setCustomerServices([
            { id: 1, nama: 'Ridha', nohp: '6289524955768' },
            { id: 2, nama: 'Trisna', nohp: '6289604419509' },
            { id: 3, nama: 'Lintang', nohp: '6285707538945' }
          ]);
          return;
        }

        if (data && data.length > 0) {
          setCustomerServices(data);
        } else {
          // Fallback if no data
          setCustomerServices([
            { id: 1, nama: 'Ridha', nohp: '6289524955768' },
            { id: 2, nama: 'Trisna', nohp: '6289604419509' },
            { id: 3, nama: 'Lintang', nohp: '6285707538945' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching customer services:', error);
        // Fallback to default CS
        setCustomerServices([
          { id: 1, nama: 'Ridha', nohp: '6289524955768' },
          { id: 2, nama: 'Trisna', nohp: '6289604419509' },
          { id: 3, nama: 'Lintang', nohp: '6285707538945' }
        ]);
      }
    };

    fetchCustomerServices();
  }, []);

  // Initialize current CS index from database
  useEffect(() => {
    const initializeCSIndex = async () => {
      if (customerServices.length > 0) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.rpc('get_current_cs_index');
          
          if (error) {
            console.error('Error getting current CS index:', error);
            setCurrentCSIndex(0);
            return;
          }
          
          const index = data || 0;
          setCurrentCSIndex(index);
          
          console.log('✅ CS Index initialized from database:', index);
        } catch (error) {
          console.error('Error initializing CS index:', error);
          setCurrentCSIndex(0);
        }
      }
    };

    initializeCSIndex();
  }, [customerServices]);

  // Rotate customer service using database
  const getNextCustomerService = async () => {
    if (customerServices.length === 0) return null;
    
    try {
      const supabase = createClient();
      
      // Get next CS index atomically from database
      const { data: csIndex, error } = await supabase.rpc('get_next_cs_index');
      
      if (error) {
        console.error('Database error, using fallback rotation:', error);
        // Fallback to simple rotation
        const fallbackIndex = (currentCSIndex + 1) % customerServices.length;
        setCurrentCSIndex(fallbackIndex);
        return customerServices[fallbackIndex];
      }
      
      // Ensure index is within bounds
      const safeIndex = csIndex % customerServices.length;
      setCurrentCSIndex(safeIndex);
      
      // Get the CS for this index
      const selectedCS = customerServices[safeIndex];
      
      // Debug logging
      console.log('🔄 CS Rotation (Database):', {
        databaseIndex: csIndex,
        safeIndex: safeIndex,
        selectedCS: selectedCS?.nama,
        phone: selectedCS?.nohp,
        totalCS: customerServices.length,
        method: 'database_atomic'
      });
      
      return selectedCS;
      
    } catch (error) {
      console.error('Error in CS rotation:', error);
      // Fallback to simple rotation
      const fallbackIndex = (currentCSIndex + 1) % customerServices.length;
      setCurrentCSIndex(fallbackIndex);
      
      console.log('🔄 CS Rotation (Fallback):', {
        fallbackIndex: fallbackIndex,
        selectedCS: customerServices[fallbackIndex]?.nama,
        method: 'local_fallback'
      });
      
      return customerServices[fallbackIndex];
    }
  };

  const handleWhatsAppClick = () => {
    trackButtonClick('WhatsApp CTA', 'Hero Section');
    setShowPopup(true);
    setPhoneError(''); // Reset error when opening popup
  };

  // Validasi nomor WhatsApp yang lebih ketat
  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, ''); // Hapus semua karakter non-digit
    
    // Cek panjang nomor
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return 'Nomor WhatsApp harus 10-15 digit';
    }

    // Cek format nomor Indonesia
    if (!cleanPhone.match(/^(08|62)/)) {
      return 'Nomor harus dimulai dengan 08 atau 62';
    }

    // Cek nomor yang tidak valid (contoh: semua angka sama)
    if (/^(\d)\1{9,}$/.test(cleanPhone)) {
      return 'Nomor tidak valid';
    }

    // Cek nomor yang terlalu pendek setelah 08
    if (cleanPhone.startsWith('08') && cleanPhone.length < 11) {
      return 'Nomor WhatsApp tidak lengkap';
    }

    return '';
  };

  // Handle perubahan nomor telepon dengan validasi real-time
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value.trim()) {
      const error = validatePhoneNumber(value);
      setPhoneError(error);
    } else {
      setPhoneError('');
    }
  };

  const handleSubmitBusinessName = async () => {
    if (!businessName.trim()) {
      alert('Mohon masukkan nama Anda');
      return;
    }
    
    if (!phoneNumber.trim()) {
      alert('Mohon masukkan nomor WhatsApp Anda');
      return;
    }

    // Validasi nomor WhatsApp dengan fungsi yang lebih ketat
    const phoneValidationError = validatePhoneNumber(phoneNumber);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      alert(phoneValidationError);
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Hapus semua karakter non-digit

    setIsSubmitting(true);
    
        try {
          // Get next customer service for rotation
          const currentCS = await getNextCustomerService();
          const csPhone = currentCS?.nohp || '6289524955768'; // Fallback to Ridha's number
          const csName = currentCS?.nama || 'Customer Service';
          const csId = currentCS?.id || 1; // Fallback to Ridha's ID

      // Try to save to database, but don't block if it fails
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('business_inquiries')
          .insert([
            {
              business_name: businessName.trim(),
              phone_number: cleanPhone,
              created_at: new Date().toISOString(),
              status: 'new',
              cs_id: csId
            }
          ]);

        if (error) {
          console.warn('Database save failed, but continuing with WhatsApp redirect:', error);
          // Continue with WhatsApp redirect even if database save fails
        }
      } catch (dbError) {
        console.warn('Database connection failed, but continuing with WhatsApp redirect:', dbError);
        // Continue with WhatsApp redirect even if database fails
      }

      // Track lead, WhatsApp click, and Add to Cart (Client-side)
      trackLead(businessName.trim(), 'jasabuatlagu_page');
      trackWhatsAppClick(businessName.trim(), csName);
      trackAddToCart(businessName.trim(), 'Paket Jingle UMKM', 199000, 'IDR');
      
      // Track server-side events with phone number
      try {
        await trackLeadServer(businessName.trim(), 'jasabuatlagu_page', undefined, cleanPhone);
        await trackWhatsAppContactServer(businessName.trim(), csName, undefined, cleanPhone);
        await trackAddToCartServer(businessName.trim(), 'Paket Jingle UMKM', 199000, 'IDR', undefined, cleanPhone);
      } catch (serverError) {
        console.warn('Server-side tracking failed:', serverError);
        // Continue with client-side tracking only
      }
      
      // Always redirect to WhatsApp regardless of database status
      const message = encodeURIComponent(
        `Halo ${csName}! 👋

Saya tertarik untuk order jingle original dari Indomusika! 🎵

Saya ingin membuat jingle untuk bisnis saya agar pelanggan lebih mudah mengingat brand saya.

Bisa saya dapatkan info detail tentang:
✨ Paket 2 Lagu Original Rp199K
✨ Proses pembuatan
✨ Timeline pengerjaan

Siap untuk mulai order! 🚀

Nama: ${businessName.trim()}
No WhatsApp: ${cleanPhone}

Terima kasih! 🙏`
      );
      window.location.href = `https://wa.me/${csPhone}?text=${message}`;
      
      // Close popup
      setShowPopup(false);
      setBusinessName('');
      setPhoneNumber('');
      
        } catch (error) {
          console.error('Unexpected error:', error);
          // Even if there's an unexpected error, still try to redirect to WhatsApp
          const currentCS = await getNextCustomerService();
          const csPhone = currentCS?.nohp || '6289524955768'; // Fallback to Ridha's number
          const csName = currentCS?.nama || 'Customer Service';
      
      // Track lead, WhatsApp click, and Add to Cart for fallback (Client-side)
      trackLead(businessName.trim(), 'jasabuatlagu_page');
      trackWhatsAppClick(businessName.trim(), csName);
      trackAddToCart(businessName.trim(), 'Paket Jingle UMKM', 199000, 'IDR');
      
      // Track server-side events with phone number for fallback
      try {
        await trackLeadServer(businessName.trim(), 'jasabuatlagu_page', undefined, cleanPhone);
        await trackWhatsAppContactServer(businessName.trim(), csName, undefined, cleanPhone);
        await trackAddToCartServer(businessName.trim(), 'Paket Jingle UMKM', 199000, 'IDR', undefined, cleanPhone);
      } catch (serverError) {
        console.warn('Server-side tracking failed in fallback:', serverError);
        // Continue with client-side tracking only
      }
      
      const message = encodeURIComponent(
        `Halo ${csName}! 👋

Saya tertarik untuk order jingle original dari Indomusika! 🎵

Saya ingin membuat jingle untuk bisnis saya agar pelanggan lebih mudah mengingat brand saya.

Bisa saya dapatkan info detail tentang:
✨ Paket 2 Lagu Original Rp199K
✨ Proses pembuatan
✨ Timeline pengerjaan

Siap untuk mulai order! 🚀

Nama: ${businessName.trim()}
No WhatsApp: ${cleanPhone}

Terima kasih! 🙏`
      );
      window.location.href = `https://wa.me/${csPhone}?text=${message}`;
      
      setShowPopup(false);
      setBusinessName('');
      setPhoneNumber('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayExample = (id: number) => {
    const track = portfolioExamples.find(t => t.id === id);
    if (track) {
      // Track portfolio play
      trackPortfolioPlay(track.title, track.genre);
      
      // If it's the same track and currently playing, pause it
      if (currentTrack?.id === id && isPlayerPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlayerPlaying(false);
        setIsPlaying(null);
        return;
      }
      
      // Set as current track in player
      setCurrentTrack(track);
      setIsPlaying(id);
      setIsPlayerPlaying(true);
      
      // Play audio immediately
      if (audioRef.current) {
        // Set the source and play immediately
        audioRef.current.src = track.audio_url;
        audioRef.current.load();
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
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
        // Set the source and play immediately
        audioRef.current.src = prevTrack.audio_url;
        audioRef.current.load();
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
        // Set the source and play immediately
        audioRef.current.src = nextTrack.audio_url;
        audioRef.current.load();
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
        
        // First, get all records and shuffle on client side
        const { data, error } = await supabase
          .from('jingle_samples')
          .select('*')
          .limit(20); // Get more records for better randomization

        if (error) {
          console.error('Error fetching portfolio examples:', error);
          return;
        }

        if (data && data.length > 0) {
          // Shuffle the data on client side
          const shuffledData = [...data].sort(() => Math.random() - 0.5).slice(0, 5);
          
          const formattedData = shuffledData.map((item, index) => ({
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
        } else {
          // Fallback data if database is empty
          const fallbackData = [
            {
              id: 1,
              title: "Jingle Laundry Express Ponorogo",
              description: "Biar cucian numpuk, tetap wangi kayak baru!",
              genre: "Pop Catchy",
              duration: "30s",
              audio_url: "/audio/jingle-sample-1.mp3"
            },
            {
              id: 2,
              title: "Jingle Coffee Shop 'Kopi Kita'",
              description: "Nuansa akustik santai, pas buat ambience kedai",
              genre: "Akustik",
              duration: "25s",
              audio_url: "/audio/jingle-sample-2.mp3"
            },
            {
              id: 3,
              title: "Jingle Barbershop",
              description: "Beat energik ala TikTok, bikin anak muda langsung relate",
              genre: "EDM",
              duration: "35s",
              audio_url: "/audio/jingle-sample-3.mp3"
            }
          ];
          
          setPortfolioExamples(fallbackData);
          if (fallbackData.length > 0) {
            setCurrentTrack(fallbackData[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching portfolio examples:', error);
        // Use fallback data on error
        const fallbackData = [
          {
            id: 1,
            title: "Jingle Laundry Express Ponorogo",
            description: "Biar cucian numpuk, tetap wangi kayak baru!",
            genre: "Pop Catchy",
            duration: "30s",
            audio_url: "/audio/jingle-sample-1.mp3"
          },
          {
            id: 2,
            title: "Jingle Coffee Shop 'Kopi Kita'",
            description: "Nuansa akustik santai, pas buat ambience kedai",
            genre: "Akustik",
            duration: "25s",
            audio_url: "/audio/jingle-sample-2.mp3"
          },
          {
            id: 3,
            title: "Jingle Barbershop",
            description: "Beat energik ala TikTok, bikin anak muda langsung relate",
            genre: "EDM",
            duration: "35s",
            audio_url: "/audio/jingle-sample-3.mp3"
          }
        ];
        
        setPortfolioExamples(fallbackData);
        if (fallbackData.length > 0) {
          setCurrentTrack(fallbackData[0]);
        }
      }
    };

    fetchPortfolioExamples();
  }, []);

  // Update audio source when currentTrack changes (only for external changes)
  useEffect(() => {
    if (audioRef.current && currentTrack?.audio_url) {
      // Only update if the source is different
      if (audioRef.current.src !== currentTrack.audio_url) {
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
                <span className="block">Bisnis sepi? <br /> Jangan cuma promo.</span>
                <span className="block text-green-600 mt-2">Biar usaha kamu <u>ingat lewat lagu!</u></span>
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
                  <div className="text-center mb-4">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Lihat deh brand besar: <span className="font-semibold">Indomie, Tokopedia, Grab</span>. Semua punya jingle. Bahkan cukup dengar 3 detik, kita langsung inget.
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <img 
                      src="/brand.png" 
                      alt="Indomie Tokopedia Grab" 
                      className="h-20 sm:h-24 md:h-28 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Solution Box */}
                <div className="bg-gray-100 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5 text-center">
                    Indomusika siap bantu bikin jingle original agar usaha kamu:
                  </h3>
                  <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">🎧</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">Mudah diingat pelanggan</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">🎧</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-900 font-medium">Beda dari kompetitor</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
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
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">Pesan Jingle Saya Sekarang 🚀</span>
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
      <section className="py-8 sm:py-12 bg-green-50" onMouseEnter={() => trackPricingView()}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">$</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Harga Spesial untuk UMKM:
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              Promo terbatas untuk 50 UMKM pertama!
            </p>
            
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-lg">
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600">Rp199.000</span>
                  <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Diskon 60%
                  </div>
                </div>
                <p className="text-lg sm:text-xl text-gray-500 line-through">Rp 497.000</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Music className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">2 Lagu Original</p>
                    <p className="text-sm text-gray-600">custom sesuai brand</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">✍️</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Free Lirik</p>
                    <p className="text-sm text-gray-600">gampang viral</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">⟳</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Free Revisi</p>
                    <p className="text-sm text-gray-600">sampai puas</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">✅</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Bayar Setelah Jadi</p>
                    <p className="text-sm text-gray-600">100% aman</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  trackButtonClick('Pesan Sekarang - Cuma Rp199K', 'Pricing Section');
                  handleWhatsAppClick();
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto whitespace-nowrap"
              >
                <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">Pesan Sekarang - Cuma Rp199K</span>
              </button>
              
              <div className="text-center text-xs text-gray-500">
                Bayar setelah jadi • Free revisi • Hak pakai seral
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
                  onClick={() => {
                    trackButtonClick('Chat WhatsApp Sekarang', 'Bottom CTA Section');
                    handleWhatsAppClick();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">Chat WhatsApp Sekarang</span>
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

      {/* Business Name Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              Sekali buat lagu, seumur hidup dikenal pelanggan.
            </h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Masukkan data Anda, dan dapatkan jingle yang jadi aset branding permanen untuk usaha Anda.
            </p>
            
            <div className="mb-4">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Nama
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Contoh: Warung Makan Sederhana"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                No WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Contoh: 081234567890"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  phoneError 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                disabled={isSubmitting}
                pattern="[0-9]{10,15}"
                title="Masukkan nomor WhatsApp yang valid (10-15 digit, dimulai dengan 08 atau 62)"
              />
              {phoneError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {phoneError}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                <strong>Penting:</strong> Pastikan nomor WhatsApp aktif dan dapat dihubungi
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setBusinessName('');
                  setPhoneNumber('');
                  setPhoneError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitBusinessName}
                disabled={isSubmitting || !!phoneError || !phoneNumber.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Lanjut ke WhatsApp'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
