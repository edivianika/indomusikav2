const { createClient } = require('@supabase/supabase-js');

// Use service role key to insert test lead
const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your actual URL
const supabaseServiceKey = 'your-service-role-key'; // Replace with your actual service key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertTestLead() {
  console.log('🧪 Inserting test lead manually...');
  
  try {
    const testLead = {
      business_name: `Test Business ${Date.now()}`,
      phone_number: '081234567890',
      status: 'new',
      cs_id: 1,
      created_at: new Date().toISOString()
    };

    console.log('Test lead data:', testLead);

    const { data, error } = await supabase
      .from('business_inquiries')
      .insert([testLead])
      .select();

    if (error) {
      console.error('❌ Error inserting test lead:', error);
    } else {
      console.log('✅ Test lead inserted successfully:', data);
      console.log('Check your admin dashboard for real-time notification!');
    }
  } catch (err) {
    console.error('❌ Error in insertTestLead:', err);
  }
}

// Run the test
insertTestLead();
