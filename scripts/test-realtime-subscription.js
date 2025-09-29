const { createClient } = require('@supabase/supabase-js');

// Use anon key for real-time subscription
const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your actual URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your actual anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing real-time subscription...');

// Subscribe to business_inquiries table changes
const channel = supabase
  .channel('test_business_inquiries_changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'business_inquiries'
    },
    (payload) => {
      console.log('✅ Real-time notification received!');
      console.log('New lead detected:', payload);
      console.log('Business name:', payload.new.business_name);
      console.log('Phone:', payload.new.phone_number);
    }
  )
  .subscribe((status) => {
    console.log('Subscription status:', status);
    if (status === 'SUBSCRIBED') {
      console.log('✅ Successfully subscribed to real-time changes');
      console.log('Now try inserting a new lead in Supabase dashboard...');
    } else if (status === 'CHANNEL_ERROR') {
      console.log('❌ Error subscribing to real-time changes');
    }
  });

// Keep the script running
console.log('Listening for real-time changes... Press Ctrl+C to stop');

// Test function to insert a lead (optional)
async function testInsertLead() {
  try {
    console.log('Testing lead insertion...');
    const { data, error } = await supabase
      .from('business_inquiries')
      .insert([
        {
          business_name: 'Test Business ' + Date.now(),
          phone_number: '081234567890',
          status: 'new',
          cs_id: 1
        }
      ]);
    
    if (error) {
      console.error('Error inserting test lead:', error);
    } else {
      console.log('✅ Test lead inserted successfully:', data);
    }
  } catch (err) {
    console.error('Error in testInsertLead:', err);
  }
}

// Uncomment the line below to test lead insertion
// setTimeout(testInsertLead, 5000);
