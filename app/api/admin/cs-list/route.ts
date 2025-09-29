import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch customer services list
    const { data: csData, error: csError } = await supabase
      .from('customer_services')
      .select('id, nama')
      .eq('status', true)
      .order('nama', { ascending: true });

    if (csError) {
      console.error('Error fetching CS list:', csError);
      return NextResponse.json({ error: 'Failed to fetch CS list' }, { status: 500 });
    }

    return NextResponse.json({
      csList: csData || []
    });

  } catch (error) {
    console.error('Error in admin CS list API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
