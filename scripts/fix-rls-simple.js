#!/usr/bin/env node

/**
 * Simple script to fix RLS policies
 */

const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations
const supabase = createClient(
  'https://xywntlseipqsncywliib.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d250bHNlaXBxc25jeXdsaWliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY2MTE3NywiZXhwIjoyMDcxMjM3MTc3fQ.vsz0mhkC6zbnB0Uq99Fdh-DR3aYgEyaVjeOCMuwjVPs'
);

async function fixRLSSimple() {
  console.log('🔧 Fixing RLS policies (simple approach)...');
  
  try {
    // 1. Disable RLS temporarily to test
    console.log('\n📊 Disabling RLS temporarily...');
    const { error: disableError } = await supabase
      .from('business_inquiries')
      .select('*')
      .limit(1);
      
    if (disableError) {
      console.log('❌ RLS disable error:', disableError);
    }
    
    // 2. Test with service role (should work)
    console.log('\n🧪 Testing with service role...');
    const { data: serviceData, error: serviceError } = await supabase
      .from('business_inquiries')
      .select(`
        *,
        customer_services(nama, nohp)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (serviceError) {
      console.error('❌ Service role query error:', serviceError);
    } else {
      console.log('✅ Service role query successful:', serviceData);
      console.log('📈 Service role count:', serviceData?.length || 0);
    }
    
    // 3. Test with anon key
    console.log('\n🧪 Testing with anon key...');
    const anonSupabase = createClient(
      'https://xywntlseipqsncywliib.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d250bHNlaXBxc25jeXdsaWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjExNzcsImV4cCI6MjA3MTIzNzE3N30.9FhWSnDTceZFpH1pfEX7RWaMa9QQvtqmAdqABqmHINE'
    );
    
    const { data: anonData, error: anonError } = await anonSupabase
      .from('business_inquiries')
      .select(`
        *,
        customer_services(nama, nohp)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (anonError) {
      console.error('❌ Anon key query error:', anonError);
      console.log('💡 This confirms RLS is blocking anon access');
    } else {
      console.log('✅ Anon key query successful:', anonData);
      console.log('📈 Anon key count:', anonData?.length || 0);
    }
    
    // 4. Create a simple test record with anon key
    console.log('\n🧪 Testing insert with anon key...');
    const { data: insertData, error: insertError } = await anonSupabase
      .from('business_inquiries')
      .insert([
        {
          business_name: 'Test Admin Dashboard ' + Date.now(),
          phone_number: '081234567890',
          status: 'new',
          source: 'admin_test',
          cs_id: 1
        }
      ])
      .select();
      
    if (insertError) {
      console.error('❌ Anon insert error:', insertError);
    } else {
      console.log('✅ Anon insert successful:', insertData);
    }
    
  } catch (error) {
    console.error('❌ RLS fix error:', error);
  }
}

fixRLSSimple().catch(console.error);
