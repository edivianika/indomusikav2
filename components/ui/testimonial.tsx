import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Fixed hydration mismatch by using consistent rotation values

// --- Helper Components & Data ---

// All text data and images are the updated versions.
const testimonials = [
  {
    quote:
      "Awalnya cuma coba-coba, eh ternyata bikin toko kopi aku makin terkenal. Pelanggan malah sering nyanyi-nyanyi jinglenya!",
    name: "Bu Rina",
    designation: "Pemilik Kopi Ndeso",
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&crop=face",
  },
  {
    quote:
      "Nggak nyangka harga segini bisa dapet hasil sekeren ini. Prosesnya cepat & gampang, tim Indomusika sangat profesional.",
    name: "Pak Budi",
    designation: "Pemilik Laundry Express",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face",
  },
  {
    quote:
      "Jingle dari Indomusika bikin warung sembako aku jadi lebih dikenal. Omzet naik 30% setelah pakai jingle mereka!",
    name: "Ibu Sari",
    designation: "Pemilik Warung Sembako Amanah",
    src: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&h=500&fit=crop&crop=face",
  },
  {
    quote:
      "Pelanggan sekarang lebih mudah inget bengkel aku. Jinglenya catchy banget dan sesuai sama karakter usaha bengkel motor.",
    name: "Mas Joko",
    designation: "Pemilik Bengkel Motor Jaya",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face",
  },
  {
    quote:
      "Klien salon aku sering bilang jinglenya bagus dan mudah diingat. Investasi terbaik untuk branding usaha kecantikan!",
    name: "Mbak Dewi",
    designation: "Pemilik Salon Cantik Indah",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop&crop=face",
  },
];

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

// --- Main Animated Testimonials Component ---
// This is the core component that handles the animation and logic.
const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = React.useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext]);

  const isActive = (index: number) => index === active;

  // Use consistent rotation values to avoid hydration mismatch
  const getRotation = (index: number) => {
    const rotations = ['2deg', '-3deg', '4deg', '-1deg', '3deg'];
    return rotations[index % rotations.length];
  };

  return (
    <div className="mx-auto max-w-sm px-4 pt-2 pb-8 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-20">
        {/* Image Section */}
        <div className="flex items-center justify-center">
            <div className="relative h-80 w-full max-w-xs">
              <AnimatePresence>
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.src}
                    // Animation properties reverted to the previous version.
                    initial={{ opacity: 0, scale: 0.9, y: 50, rotate: getRotation(index) }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.5,
                      scale: isActive(index) ? 1 : 0.9,
                      y: isActive(index) ? 0 : 20,
                      zIndex: isActive(index) ? testimonials.length : testimonials.length - Math.abs(index - active),
                      rotate: isActive(index) ? '0deg' : getRotation(index),
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 origin-bottom"
                    style={{ perspective: '1000px' }}
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover shadow-2xl"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/500x500/e2e8f0/64748b?text=${testimonial.name.charAt(0)}`;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        </div>

        {/* Text and Controls Section */}
        <div className="flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              // Animation properties reverted to the previous version.
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col justify-between"
            >
                <div>
                    <h3 className="text-2xl font-bold text-green-400">
                        {testimonials[active].name}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {testimonials[active].designation}
                    </p>
                    <motion.p className="mt-8 text-lg text-white">
                        "{testimonials[active].quote}"
                    </motion.p>
                </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4 pt-12">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 transition-colors hover:bg-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 border border-green-500/30"
            >
              <ArrowLeft className="h-5 w-5 text-green-400 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 transition-colors hover:bg-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 border border-green-500/30"
            >
              <ArrowRight className="h-5 w-5 text-green-400 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Demo Component ---
function AnimatedTestimonialsDemo() {
  return <AnimatedTestimonials testimonials={testimonials} />;
}


// --- Main App Component ---
// This is the root of our application.
export function Component() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-black to-gray-900">
        {/* Content */}
        <div className="z-10">
            <AnimatedTestimonialsDemo />
        </div>
    </div>
  );
}