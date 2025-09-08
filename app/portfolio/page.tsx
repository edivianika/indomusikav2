import ClientPortfolio from '@/components/client-portfolio'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio - Indomusika | Karya Jingle Terbaik',
  description: 'Lihat koleksi jingle terbaik yang telah kami buat untuk berbagai UMKM. Dari restoran, toko, hingga salon - setiap jingle dibuat dengan cinta dan profesionalisme.',
  keywords: ['portfolio', 'jingle', 'karya', 'UMKM', 'musik', 'audio'],
}

export default function Portfolio() {
  return <ClientPortfolio />
}
