'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bell, Volume2, VolumeX } from 'lucide-react';

interface Lead {
  id: number;
  business_name: string;
  phone_number: string;
  created_at: string;
  status: string;
  cs_name?: string;
  cs_id?: number;
}

interface LeadStats {
  totalLeads: number;
  pendingLeads: number;
  completedLeads: number;
  newLeads: number;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    totalLeads: 0,
    pendingLeads: 0,
    completedLeads: 0,
    newLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [csFilter, setCsFilter] = useState<string>('');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showNewLeadBadge, setShowNewLeadBadge] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  // Fetch leads data
  const fetchLeads = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || {
        totalLeads: 0,
        pendingLeads: 0,
        completedLeads: 0,
        newLeads: 0
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  // Handle CS filter change
  const handleCsFilterChange = (cs: string) => {
    setCsFilter(cs);
    if (searchParams) {
      const params = new URLSearchParams(searchParams);
      if (cs) {
        params.set('cs', cs);
      } else {
        params.delete('cs');
      }
      router.push(`/admin?${params.toString()}`);
    }
  };

  // Open WhatsApp
  const openWhatsApp = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
    
    // Add country code if not present
    const whatsappNumber = cleanNumber.startsWith('62') ? cleanNumber : `62${cleanNumber}`;
    
    // Follow-up message for admin
    const followUpMessage = encodeURIComponent(`Halo Kak 👋
Terima kasih sudah tertarik dengan layanan pembuatan jingle di Indomusika.
Apakah Kakak ingin lanjutkan pemesanan jinglenya? 😊

Kami siap membantu membuat jingle yang sesuai dengan kebutuhan bisnis Kakak!`);

    window.open(`https://wa.me/${whatsappNumber}?text=${followUpMessage}`, '_blank');
  };

  // Update lead status
  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead status');
      }

      // Update local state
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      // Refresh stats
      await fetchLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'followup':
        return 'bg-yellow-100 text-yellow-800';
      case 'membuat lirik':
        return 'bg-purple-100 text-purple-800';
      case 'cancel':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'no tidak terdaftar':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone_number.includes(searchTerm);
    const matchesCS = !csFilter || lead.cs_name?.toLowerCase().includes(csFilter.toLowerCase());
    return matchesSearch && matchesCS;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Initialize
  useEffect(() => {
    if (searchParams) {
      const cs = searchParams.get('cs');
      if (cs) {
        setCsFilter(cs);
      }
    }
    fetchLeads();
  }, [searchParams, fetchLeads]);

  // Real-time subscription for new leads
  useEffect(() => {
    const channel = supabase
      .channel('business_inquiries_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'business_inquiries'
        },
        (payload) => {
          console.log('New lead detected:', payload);
          
          // Show notification
          setNotifications(prev => [
            ...prev,
            `New lead: ${payload.new.business_name}`
          ]);
          
          // Show new lead badge
          setShowNewLeadBadge(true);
          
          // Play sound
          playNotificationSound();
          
          // Refresh data
          fetchLeads();
          
          // Hide badge after 5 seconds
          setTimeout(() => {
            setShowNewLeadBadge(false);
          }, 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchLeads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor leads and customer service performance</p>
          </div>
          
          {/* Sound toggle and notification badge */}
          <div className="flex items-center space-x-4">
            {showNewLeadBadge && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                New Lead!
              </div>
            )}
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={soundEnabled ? 'Disable sound notifications' : 'Enable sound notifications'}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Bell className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Leads
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by business name or phone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by CS
            </label>
            <input
              type="text"
              value={csFilter}
              onChange={(e) => handleCsFilterChange(e.target.value)}
              placeholder="Filter by CS name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Leads ({filteredLeads.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CS Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.business_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openWhatsApp(lead.phone_number)}
                      className="text-sm text-green-600 hover:text-green-800 font-medium"
                    >
                      {lead.phone_number}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.cs_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)} border-0 focus:ring-2 focus:ring-green-500`}
                    >
                      <option value="new">New</option>
                      <option value="followup">Followup</option>
                      <option value="membuat lirik">Membuat Lirik</option>
                      <option value="cancel">Cancel</option>
                      <option value="closed">Closed</option>
                      <option value="no tidak terdaftar">No Tidak Terdaftar</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openWhatsApp(lead.phone_number)}
                      className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audio element for notification sounds */}
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/sound.wav" type="audio/wav" />
      </audio>
    </div>
  );
}
