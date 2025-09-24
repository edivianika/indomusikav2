import ClientJasaBuatLagu from '@/components/client-jasabuatlagu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jasa Buat Lagu UMKM | Indomusika - Lagu Original untuk Bisnis Anda',
  description: 'Bikin lagu original untuk UMKM! 2 lagu custom, free lirik, free revisi, hak pakai komersial. Harga spesial Rp199K (dari Rp497K). Bayar setelah jadi, 100% aman!',
  keywords: [
    'jasa buat lagu', 'lagu original UMKM', 'jingle bisnis', 'lagu custom', 'musik bisnis',
    'lagu iklan', 'jingle toko', 'lagu restoran', 'musik branding', 'lagu promosi',
    'jasa musik', 'lagu usaha', 'musik UMKM', 'lagu cafe', 'jingle laundry',
    'lagu barbershop', 'musik salon', 'lagu apotek', 'jingle bengkel', 'lagu fashion',
    'musik original', 'lagu catchy', 'jingle viral', 'lagu branding', 'musik promosi'
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
    url: 'https://indomusika.com/jasabuatlagu',
    siteName: 'Indomusika',
    title: 'Jasa Buat Lagu UMKM | Indomusika - Lagu Original untuk Bisnis Anda',
    description: 'Bikin lagu original untuk UMKM! 2 lagu custom, free lirik, free revisi, hak pakai komersial. Harga spesial Rp199K (dari Rp497K). Bayar setelah jadi, 100% aman!',
    images: [
      {
        url: 'https://indomusika.com/og-jasabuatlagu.jpg',
        width: 1200,
        height: 630,
        alt: 'Jasa Buat Lagu UMKM - Indomusika',
        type: 'image/jpeg',
      },
      {
        url: 'https://indomusika.com/og-jasabuatlagu-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Jasa Buat Lagu UMKM - Indomusika',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@indomusika',
    creator: '@indomusika',
    title: 'Jasa Buat Lagu UMKM | Indomusika',
    description: 'Bikin lagu original untuk UMKM! 2 lagu custom, free lirik, free revisi, hak pakai komersial. Harga spesial Rp199K.',
    images: ['https://indomusika.com/og-jasabuatlagu.jpg'],
  },
  alternates: {
    canonical: 'https://indomusika.com/jasabuatlagu',
  },
  category: 'Business',
  classification: 'Jasa Pembuatan Lagu Original untuk UMKM',
  other: {
    'application-name': 'Indomusika Jasa Buat Lagu',
    'apple-mobile-web-app-title': 'Jasa Buat Lagu Indomusika',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#ffffff',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#ffffff',
  },
};

export default function JasaBuatLagu() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Jasa Buat Lagu UMKM",
            "description": "Jasa pembuatan lagu original untuk UMKM dengan 2 lagu custom, free lirik, free revisi, dan hak pakai komersial. Harga spesial Rp199K.",
            "url": "https://indomusika.com/jasabuatlagu",
            "provider": {
              "@type": "Organization",
              "name": "Indomusika",
              "url": "https://indomusika.com",
              "logo": "https://indomusika.com/logo.png",
              "description": "Jasa pembuatan lagu dan jingle untuk UMKM",
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
            },
            "offers": {
              "@type": "Offer",
              "name": "Paket UMKM - 2 Lagu Original",
              "description": "2 lagu custom, free lirik, free revisi, hak pakai komersial",
              "price": "199000",
              "priceCurrency": "IDR",
              "availability": "https://schema.org/InStock",
              "validFrom": "2024-01-01",
              "priceValidUntil": "2024-12-31"
            },
            "serviceType": "Musical Composition Service",
            "areaServed": {
              "@type": "Country",
              "name": "Indonesia"
            }
          })
        }}
      />
      <ClientJasaBuatLagu />
    </>
  );
}
