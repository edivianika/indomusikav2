import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import PWAProvider from "@/components/pwa-provider"
import FacebookPixel from "@/components/facebook-pixel"
import "./globals.css"

export const metadata: Metadata = {
  title: "Indomusika - Jasa Pembuatan Jingle UMKM Terpercaya | Mulai Rp199K",
  description:
    "Jasa pembuatan jingle original untuk UMKM: restoran, toko, salon, bengkel, apotek, fashion. Mulai Rp199K, 100% original, cepat selesai, berkualitas profesional. 1000+ jingle sudah dibuat!",
  generator: "Next.js",
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
    'jasa jingle murah',
    'buat jingle untuk toko',
    'lagu iklan untuk UMKM',
    'jingle profesional untuk bisnis',
    'musik iklan custom',
    'jasa komposer jingle',
    'pembuatan lagu iklan online',
    'jingle branding bisnis',
    'lagu iklan radio',
    'musik iklan TV',
    
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
    'jingle transportasi',
    
    // Location-based keywords
    'jasa jingle Jakarta',
    'pembuatan lagu iklan Indonesia',
    'jingle UMKM Indonesia',
    'musik iklan lokal',
    
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
    'musik iklan TV'
  ],
  authors: [{ name: "Indomusika Team" }],
  creator: "Indomusika",
  publisher: "Indomusika",
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
    type: "website",
    locale: "id_ID",
    url: "https://indomusika.com",
    siteName: "Indomusika",
    title: "Indomusika - Jasa Pembuatan Jingle UMKM Terpercaya | Mulai Rp199K",
    description: "Jasa pembuatan jingle original untuk UMKM: restoran, toko, salon, bengkel, apotek, fashion. Mulai Rp199K, 100% original, cepat selesai, berkualitas profesional.",
    images: [
      {
        url: "https://indomusika.com/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Indomusika - Jasa Pembuatan Jingle UMKM Terpercaya",
        type: "image/jpeg",
      },
      {
        url: "https://indomusika.com/og-home-square.jpg",
        width: 1200,
        height: 1200,
        alt: "Indomusika - Jasa Pembuatan Jingle UMKM",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@indomusika",
    creator: "@indomusika",
    title: "Indomusika - Jasa Pembuatan Jingle UMKM Terpercaya",
    description: "Jasa pembuatan jingle original untuk UMKM. Mulai Rp199K, 100% original, cepat selesai, berkualitas profesional.",
    images: ["https://indomusika.com/og-home.jpg"],
  },
  alternates: {
    canonical: "https://indomusika.com",
  },
  category: "Business",
  classification: "Jasa Pembuatan Jingle dan Lagu Iklan untuk UMKM",
  other: {
    'application-name': 'Indomusika',
    'apple-mobile-web-app-title': 'Indomusika',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#1db954',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#1db954',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1db954',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1db954" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Structured Data for Home Page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Indomusika",
              "url": "https://indomusika.com",
              "logo": "https://indomusika.com/logo.png",
              "description": "Jasa pembuatan jingle dan lagu iklan untuk UMKM. Mulai Rp199K, 100% original, cepat selesai, berkualitas profesional.",
              "foundingDate": "2024",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ID",
                "addressLocality": "Jakarta"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Indonesian",
                "areaServed": "ID"
              },
              "sameAs": [
                "https://instagram.com/indomusika",
                "https://facebook.com/indomusika",
                "https://twitter.com/indomusika"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Jasa Pembuatan Jingle UMKM",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Jasa Pembuatan Jingle UMKM",
                      "description": "Jasa pembuatan jingle original untuk UMKM dengan harga mulai Rp199K"
                    },
                    "price": "199000",
                    "priceCurrency": "IDR",
                    "availability": "https://schema.org/InStock"
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1000",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
        
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased">
        <PWAProvider>
          {children}
        </PWAProvider>
        <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'YOUR_PIXEL_ID'} />
      </body>
    </html>
  )
}
