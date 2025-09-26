/**
 * Example component showing how to implement Add to Cart tracking
 * when data is submitted
 */

'use client';

import { useState } from 'react';
import { trackAddToCart } from './facebook-pixel';
import { trackAddToCartServer } from '@/lib/facebook-server-actions';

interface FormData {
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  message?: string;
}

export default function AddToCartExample() {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Client-side Add to Cart tracking
      trackAddToCart(
        formData.businessName,
        'Paket Jingle UMKM',
        199000,
        'IDR'
      );

      // 2. Server-side Add to Cart tracking
      const serverResult = await trackAddToCartServer(
        formData.businessName,
        'Paket Jingle UMKM',
        199000,
        'IDR',
        formData.email,
        formData.phone
      );

      console.log('Add to Cart tracking result:', serverResult);

      // 3. Submit form data (your existing logic)
      const response = await fetch('/api/submit-business-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Data berhasil dikirim! Add to Cart event telah di-track.');
        // Reset form
        setFormData({
          businessName: '',
          businessType: '',
          contactName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Business Inquiry Form
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            Nama Bisnis *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Contoh: Warung Makan Sederhana"
          />
        </div>

        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
            Jenis Bisnis *
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Pilih jenis bisnis</option>
            <option value="restoran">Restoran</option>
            <option value="toko">Toko</option>
            <option value="laundry">Laundry</option>
            <option value="kafe">Kafe</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
            Nama Kontak *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nama lengkap Anda"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Nomor Telepon *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="+6281234567890"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Pesan (Opsional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tuliskan kebutuhan jingle Anda..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Data & Track Add to Cart'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Ketika form di-submit, sistem akan otomatis track:
        </p>
        <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
          <li>Add to Cart event (client-side + server-side)</li>
          <li>Lead event untuk business inquiry</li>
          <li>User data untuk Facebook attribution</li>
        </ul>
      </div>
    </div>
  );
}
