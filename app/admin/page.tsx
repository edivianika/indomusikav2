import type { Metadata } from 'next';
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
      <AdminDashboard />
    </div>
  );
}
