import type { Metadata } from 'next';
import { Suspense } from 'react';
import AdminDashboard from '@/components/admin-dashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Lead Monitoring | Indomusika',
  description: 'Monitor leads, customer service performance, and business inquiries for Indomusika',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      }>
        <AdminDashboard />
      </Suspense>
    </div>
  );
}
