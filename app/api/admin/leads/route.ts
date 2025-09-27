import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch leads with CS information using service role
    const { data: leadsData, error: leadsError } = await supabase
      .from('business_inquiries')
      .select(`
        *,
        customer_services(nama, nohp)
      `)
      .order('created_at', { ascending: false });

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    // Transform data to include CS name
    const transformedLeads = leadsData?.map(lead => ({
      ...lead,
      cs_name: lead.customer_services?.nama || 'Unknown CS'
    })) || [];

    // Calculate stats
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalLeads = transformedLeads.length;
    const todayLeads = transformedLeads.filter(lead => 
      new Date(lead.created_at) >= today
    ).length;
    const thisWeekLeads = transformedLeads.filter(lead => 
      new Date(lead.created_at) >= weekAgo
    ).length;
    const thisMonthLeads = transformedLeads.filter(lead => 
      new Date(lead.created_at) >= monthAgo
    ).length;
    const pendingLeads = transformedLeads.filter(lead => 
      lead.status === 'new' || lead.status === 'pending'
    ).length;
    const completedLeads = transformedLeads.filter(lead => 
      lead.status === 'completed' || lead.status === 'closed'
    ).length;

    const stats = {
      total_leads: totalLeads,
      today_leads: todayLeads,
      this_week_leads: thisWeekLeads,
      this_month_leads: thisMonthLeads,
      pending_leads: pendingLeads,
      completed_leads: completedLeads
    };

    return NextResponse.json({
      leads: transformedLeads,
      stats
    });

  } catch (error) {
    console.error('Error in admin leads API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
