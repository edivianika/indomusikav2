import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const leadId = parseInt(params.id);

    if (!status || !leadId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Update lead status using service role
    const { data, error } = await supabase
      .from('business_inquiries')
      .update({ status })
      .eq('id', leadId)
      .select();

    if (error) {
      console.error('Error updating lead status:', error);
      return NextResponse.json({ error: 'Failed to update lead status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Error in admin lead update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
