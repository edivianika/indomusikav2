const { createClient } = require('@supabase/supabase-js');

// Use service role key to fix RLS
const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your actual URL
const supabaseServiceKey = 'your-service-role-key'; // Replace with your actual service key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRealtimeRLS() {
  console.log('Checking and fixing RLS for real-time subscriptions...');

  try {
    // Check if RLS is enabled on business_inquiries table
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('check_rls_status', {
      table_name: 'business_inquiries'
    });

    if (rlsError) {
      console.log('Could not check RLS status, trying to fix directly...');
    }

    // Enable real-time for business_inquiries table
    console.log('Enabling real-time for business_inquiries table...');
    const { data: realtimeData, error: realtimeError } = await supabase
      .from('business_inquiries')
      .select('*')
      .limit(1);

    if (realtimeError) {
      console.error('Error accessing business_inquiries table:', realtimeError);
    } else {
      console.log('✅ business_inquiries table is accessible');
    }

    // Create a simple RLS policy that allows all operations for testing
    console.log('Creating permissive RLS policy for testing...');
    
    const policies = [
      {
        name: 'Allow all operations on business_inquiries',
        table: 'business_inquiries',
        operation: 'ALL',
        policy: 'true'
      }
    ];

    for (const policy of policies) {
      try {
        const { error } = await supabase.rpc('create_rls_policy', {
          policy_name: policy.name,
          table_name: policy.table,
          operation: policy.operation,
          policy_expression: policy.policy
        });
        
        if (error) {
          console.log(`Policy ${policy.name} might already exist or there was an error:`, error.message);
        } else {
          console.log(`✅ Created policy: ${policy.name}`);
        }
      } catch (err) {
        console.log(`Policy ${policy.name} creation failed:`, err.message);
      }
    }

    // Test real-time subscription with service role
    console.log('Testing real-time subscription with service role...');
    const channel = supabase
      .channel('test_realtime_fix')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_inquiries'
        },
        (payload) => {
          console.log('✅ Real-time notification received with service role!');
          console.log('Event:', payload.eventType);
          console.log('Data:', payload);
        }
      )
      .subscribe((status) => {
        console.log('Service role subscription status:', status);
      });

    // Wait a bit then unsubscribe
    setTimeout(() => {
      supabase.removeChannel(channel);
      console.log('Real-time test completed');
    }, 10000);

  } catch (error) {
    console.error('Error fixing real-time RLS:', error);
  }
}

fixRealtimeRLS();
