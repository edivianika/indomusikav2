import ClientPortfolio from '@/components/client-portfolio'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Jingle UMKM Terbaik | Indomusika - Jasa Pembuatan Lagu Iklan',
  description: 'Lihat koleksi jingle terbaik untuk UMKM: restoran, toko, salon, bengkel, apotek, fashion. Jasa pembuatan lagu iklan profesional dengan harga terjangkau. 1000+ jingle sudah dibuat!',
  keywords: [
    // Primary keywords
    'jasa pembuatan jingle',
    'jasa pembuatan lagu iklan',
    'jingle UMKM',
    'lagu iklan bisnis',
    'musik iklan toko',
    'jingle restoran',
    'lagu iklan salon',
    'jingle bengkel',
    'musik iklan apotek',
    'jingle fashion',
    
    // Secondary keywords
    'portfolio jingle',
    'karya musik iklan',
    'contoh jingle UMKM',
    'jingle kuliner',
    'lagu iklan elektronik',
    'jingle kecantikan',
    'musik iklan otomotif',
    'jingle kesehatan',
    'lagu iklan pendidikan',
    'jingle hiburan',
    
    // Long-tail keywords
    'jasa pembuatan jingle murah',
    'buat jingle untuk toko',
    'lagu iklan untuk UMKM',
    'jingle profesional untuk bisnis',
    'musik iklan custom',
    'jasa komposer jingle',
    'pembuatan lagu iklan online',
    'jingle branding bisnis',
    'lagu iklan radio',
    'musik iklan TV',
    
    // Location-based keywords
    'jasa jingle Jakarta',
    'pembuatan lagu iklan Indonesia',
    'jingle UMKM Indonesia',
    'musik iklan lokal',
    
    // Industry-specific keywords
    'jingle kuliner Indonesia',
    'lagu iklan fashion',
    'musik iklan teknologi',
    'jingle real estate',
    'lagu iklan keuangan',
    'musik iklan travel',
    'jingle olahraga',
    'lagu iklan konstruksi',
    'musik iklan pertanian',
    'jingle transportasi'
  ],
  authors: [{ name: 'Indomusika Team' }],
  creator: 'Indomusika',
  publisher: 'Indomusika',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://indomusika.com/portfolio',
    siteName: 'Indomusika',
    title: 'Portfolio Jingle UMKM Terbaik | Indomusika - Jasa Pembuatan Lagu Iklan',
    description: 'Lihat koleksi jingle terbaik untuk UMKM: restoran, toko, salon, bengkel, apotek, fashion. Jasa pembuatan lagu iklan profesional dengan harga terjangkau. 1000+ jingle sudah dibuat!',
    images: [
      {
        url: 'https://indomusika.com/og-portfolio.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio Jingle UMKM Indomusika - Koleksi Lagu Iklan Terbaik',
        type: 'image/jpeg',
      },
      {
        url: 'https://indomusika.com/og-portfolio-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Portfolio Jingle UMKM Indomusika',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@indomusika',
    creator: '@indomusika',
    title: 'Portfolio Jingle UMKM Terbaik | Indomusika',
    description: 'Lihat koleksi jingle terbaik untuk UMKM. Jasa pembuatan lagu iklan profesional dengan harga terjangkau. 1000+ jingle sudah dibuat!',
    images: ['https://indomusika.com/og-portfolio.jpg'],
  },
  alternates: {
    canonical: 'https://indomusika.com/portfolio',
  },
  category: 'Business',
  classification: 'Jasa Pembuatan Jingle dan Lagu Iklan untuk UMKM',
  other: {
    'application-name': 'Indomusika Portfolio',
    'apple-mobile-web-app-title': 'Portfolio Indomusika',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#000000',
  },
}

export default function Portfolio() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Portfolio Jingle UMKM Terbaik",
            "description": "Koleksi jingle terbaik untuk UMKM: restoran, toko, salon, bengkel, apotek, fashion. Jasa pembuatan lagu iklan profesional dengan harga terjangkau.",
            "url": "https://indomusika.com/portfolio",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Portfolio Jingle UMKM",
              "description": "Daftar jingle yang telah dibuat untuk berbagai UMKM",
              "numberOfItems": 18,
              "itemListElement": [
                {
                  "@type": "MusicRecording",
                  "position": 1,
                  "name": "Jingle Restoran Nusantara",
                  "description": "Jingle untuk restoran kuliner Indonesia",
                  "genre": "Kuliner",
                  "duration": "PT30S",
                  "creator": {
                    "@type": "Organization",
                    "name": "Indomusika",
                    "url": "https://indomusika.com"
                  }
                }
              ]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Beranda",
                  "item": "https://indomusika.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Portfolio",
                  "item": "https://indomusika.com/portfolio"
                }
              ]
            },
            "provider": {
              "@type": "Organization",
              "name": "Indomusika",
              "url": "https://indomusika.com",
              "logo": "https://indomusika.com/logo.png",
              "description": "Jasa pembuatan jingle dan lagu iklan untuk UMKM",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ID",
                "addressLocality": "Jakarta"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Indonesian"
              }
            }
          })
        }}
      />
      <ClientPortfolio />
    </>
  )
}
