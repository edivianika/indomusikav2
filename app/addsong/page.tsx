import { AddSongForm } from '@/components/add-song-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AddSongPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navigation Header */}
      <header className="border-b border-[#282828] bg-[#191414]">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Tambah Jingle Sample Baru
            </h1>
            <p className="text-gray-400">
              Upload jingle sample baru ke dalam database
            </p>
          </div>
          
          <AddSongForm />
        </div>
      </div>
    </div>
  )
}