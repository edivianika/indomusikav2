#!/usr/bin/env node

/**
 * Script to check database tables and data
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://xywntlseipqsncywliib.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d250bHNlaXBxc25jeXdsaWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjExNzcsImV4cCI6MjA3MTIzNzE3N30.9FhWSnDTceZFpH1pfEX7RWaMa9QQvtqmAdqABqmHINE'
);

async function checkDatabase() {
  console.log('🔍 Checking database tables...');
  console.log('📡 Supabase URL: https://xywntlseipqsncywliib.supabase.co');
  
  try {
    // Check if business_inquiries table exists and has data
    console.log('\n📊 Checking business_inquiries table...');
    const { data: inquiries, error: inquiriesError } = await supabase
      .from('business_inquiries')
      .select('*')
      .limit(10);
      
    if (inquiriesError) {
      console.error('❌ Error fetching business_inquiries:', inquiriesError);
    } else {
      console.log('✅ business_inquiries data:', inquiries);
      console.log('📈 Total records:', inquiries?.length || 0);
    }
    
    // Check customer_services table
    console.log('\n👥 Checking customer_services table...');
    const { data: cs, error: csError } = await supabase
      .from('customer_services')
      .select('*');
      
    if (csError) {
      console.error('❌ Error fetching customer_services:', csError);
    } else {
      console.log('✅ customer_services data:', cs);
      console.log('📈 Total CS records:', cs?.length || 0);
    }
    
    // Test insert a sample record
    console.log('\n🧪 Testing insert operation...');
    const { data: insertData, error: insertError } = await supabase
      .from('business_inquiries')
      .insert([
        {
          business_name: 'Test Business ' + Date.now(),
          phone_number: '081234567890',
          status: 'new',
          source: 'admin_test'
        }
      ])
      .select();
      
    if (insertError) {
      console.error('❌ Error inserting test record:', insertError);
    } else {
      console.log('✅ Test record inserted:', insertData);
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

checkDatabase().catch(console.error);
