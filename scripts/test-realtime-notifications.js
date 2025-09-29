const { createClient } = require('@supabase/supabase-js');

// Hardcoded values for testing
const supabaseUrl = 'https://vbuwanwqbxzrxqaxsxrm.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZidXdhbndxYnh6cnhxYXhzeHJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzU5MTYyMSwiZXhwIjoyMDQzMTY3NjIxfQ.fxNLMjA5Xt-0DpqFy3jPd9hZwLBVjH9B2WdvPjUqT5U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testRealtimeNotifications() {
  try {
    console.log('🧪 Testing real-time notifications...');
    
    // First, get a random CS
    const { data: customerServices } = await supabase
      .from('customer_services')
      .select('*')
      .eq('status', true)
      .limit(1);
    
    if (!customerServices || customerServices.length === 0) {
      console.error('❌ No customer services found');
      return;
    }
    
    const cs = customerServices[0];
    console.log(`📋 Using CS: ${cs.name} (ID: ${cs.id})`);
    
    // Insert a new test lead
    const testLead = {
      business_name: `Test Business ${Date.now()}`,
      phone_number: `0812${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      cs_id: cs.id,
      status: 'new'
    };
    
    console.log('📝 Inserting test lead:', testLead);
    
    const { data, error } = await supabase
      .from('business_inquiries')
      .insert([testLead])
      .select();
    
    if (error) {
      console.error('❌ Error inserting test lead:', error);
      return;
    }
    
    console.log('✅ Test lead inserted successfully!');
    console.log('📊 Lead data:', data[0]);
    console.log('');
    console.log('🎯 Expected behavior:');
    console.log('   1. Admin dashboard should show "New Lead!" badge');
    console.log('   2. Notification sound should play (if enabled)');
    console.log('   3. Lead should appear at the top of the list');
    console.log('   4. Badge should disappear after 5 seconds');
    console.log('');
    console.log('💡 Open your admin dashboard at /admin to see the real-time notification!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testRealtimeNotifications();
