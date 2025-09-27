#!/usr/bin/env node

/**
 * Script to fix RLS policies for admin dashboard
 */

const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations
const supabase = createClient(
  'https://xywntlseipqsncywliib.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d250bHNlaXBxc25jeXdsaWliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY2MTE3NywiZXhwIjoyMDcxMjM3MTc3fQ.vsz0mhkC6zbnB0Uq99Fdh-DR3aYgEyaVjeOCMuwjVPs'
);

async function fixRLSPolicy() {
  console.log('🔧 Fixing RLS policies for admin dashboard...');
  
  try {
    // 1. Check current RLS status
    console.log('\n📊 Checking current RLS status...');
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('check_rls_status', { table_name: 'business_inquiries' });
      
    if (rlsError) {
      console.log('ℹ️ RLS check not available, continuing with policy update...');
    }
    
    // 2. Update RLS policies to allow anonymous access for reading
    console.log('\n🔧 Updating RLS policies...');
    
    // Drop existing policies
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Allow authenticated users to read all business inquiries" ON business_inquiries;',
      'DROP POLICY IF EXISTS "Allow authenticated users to insert business inquiries" ON business_inquiries;',
      'DROP POLICY IF EXISTS "Allow authenticated users to update business inquiries" ON business_inquiries;',
      'DROP POLICY IF EXISTS "Allow anonymous users to insert business inquiries" ON business_inquiries;'
    ];
    
    for (const sql of dropPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.log('ℹ️ Policy drop (expected):', error.message);
      }
    }
    
    // Create new policies
    const createPolicies = [
      // Allow anonymous users to read all business inquiries (for admin dashboard)
      `CREATE POLICY "Allow anonymous read business inquiries" ON business_inquiries
       FOR SELECT USING (true);`,
       
      // Allow anonymous users to insert business inquiries (for popup form)
      `CREATE POLICY "Allow anonymous insert business inquiries" ON business_inquiries
       FOR INSERT WITH CHECK (true);`,
       
      // Allow anonymous users to update business inquiries (for status updates)
      `CREATE POLICY "Allow anonymous update business inquiries" ON business_inquiries
       FOR UPDATE USING (true);`
    ];
    
    for (const sql of createPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql });
      if (error) {
        console.log('❌ Policy creation error:', error.message);
      } else {
        console.log('✅ Policy created successfully');
      }
    }
    
    // 3. Test query with anon key
    console.log('\n🧪 Testing query with anon key...');
    const anonSupabase = createClient(
      'https://xywntlseipqsncywliib.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d250bHNlaXBxc25jeXdsaWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjExNzcsImV4cCI6MjA3MTIzNzE3N30.9FhWSnDTceZFpH1pfEX7RWaMa9QQvtqmAdqABqmHINE'
    );
    
    const { data: testData, error: testError } = await anonSupabase
      .from('business_inquiries')
      .select(`
        *,
        customer_services(nama, nohp)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (testError) {
      console.error('❌ Test query error:', testError);
    } else {
      console.log('✅ Test query successful:', testData);
      console.log('📈 Test query count:', testData?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ RLS fix error:', error);
  }
}

fixRLSPolicy().catch(console.error);
