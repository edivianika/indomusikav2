import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import PWAProvider from "@/components/pwa-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Indomusika - Jasa Jingle UMKM Terpercaya | Mulai Rp199K",
  description:
    "Bikin jingle keren untuk usaha kamu! Jasa pembuatan jingle original untuk UMKM mulai Rp199K. 100% original, cepat, dan berkualitas.",
  generator: "v0.app",
  keywords: ["jingle", "UMKM", "musik", "iklan", "audio", "Indonesia"],
  authors: [{ name: "Indomusika" }],
  openGraph: {
    title: "Indomusika - Jasa Jingle UMKM Terpercaya",
    description: "Bikin jingle keren untuk usaha kamu! Jasa pembuatan jingle original untuk UMKM mulai Rp199K.",
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  themeColor: '#1db954',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
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
      </body>
    </html>
  )
}
