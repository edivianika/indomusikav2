'use client';
import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

const JasaBuatLaguPage = dynamic(
  () => import('@/components/jasabuatlagu-page'),
  {
    loading: () => (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat halaman...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function ClientJasaBuatLagu() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat halaman...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Memuat halaman...</p>
        </div>
      </div>
    }>
      <JasaBuatLaguPage />
    </Suspense>
  );
}
