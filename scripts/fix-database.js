#!/usr/bin/env node

/**
 * Script to fix database issues
 */

const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations
const supabase = createClient(
  'https://xywntlseipqsncywliib.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d250bHNlaXBxc25jeXdsaWliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY2MTE3NywiZXhwIjoyMDcxMjM3MTc3fQ.vsz0mhkC6zbnB0Uq99Fdh-DR3aYgEyaVjeOCMuwjVPs'
);

async function fixDatabase() {
  console.log('🔧 Fixing database issues...');
  
  try {
    // 1. Insert sample data to business_inquiries
    console.log('\n📊 Inserting sample data to business_inquiries...');
    const { data: insertData, error: insertError } = await supabase
      .from('business_inquiries')
      .insert([
        {
          business_name: 'Warung Makan Sederhana',
          phone_number: '081234567890',
          status: 'new',
          source: 'jasabuatlagu_page',
          cs_id: 1
        },
        {
          business_name: 'Toko Kelontong Jaya',
          phone_number: '081234567891',
          status: 'pending',
          source: 'jasabuatlagu_page',
          cs_id: 2
        },
        {
          business_name: 'Salon Cantik',
          phone_number: '081234567892',
          status: 'completed',
          source: 'jasabuatlagu_page',
          cs_id: 3
        },
        {
          business_name: 'Cafe Santai',
          phone_number: '081234567893',
          status: 'new',
          source: 'jasabuatlagu_page',
          cs_id: 1
        },
        {
          business_name: 'Bengkel Motor',
          phone_number: '081234567894',
          status: 'pending',
          source: 'jasabuatlagu_page',
          cs_id: 2
        }
      ])
      .select();
      
    if (insertError) {
      console.error('❌ Error inserting sample data:', insertError);
    } else {
      console.log('✅ Sample data inserted:', insertData);
    }
    
    // 2. Check if data is now available
    console.log('\n📊 Checking business_inquiries after insert...');
    const { data: inquiries, error: inquiriesError } = await supabase
      .from('business_inquiries')
      .select(`
        *,
        customer_services!inner(nama, nohp)
      `)
      .order('created_at', { ascending: false });
      
    if (inquiriesError) {
      console.error('❌ Error fetching business_inquiries:', inquiriesError);
    } else {
      console.log('✅ business_inquiries data:', inquiries);
      console.log('📈 Total records:', inquiries?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Database fix error:', error);
  }
}

fixDatabase().catch(console.error);
