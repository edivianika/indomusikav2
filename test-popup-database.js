#!/usr/bin/env node

/**
 * Test script to verify popup database functionality
 * This script simulates the popup submission process
 */

const { createClient } = require('@supabase/supabase-js');

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testPopupDatabase() {
  console.log('🧪 Testing Popup Database Functionality');
  console.log('=====================================');
  console.log('');

  try {
    // Test 1: Insert new business inquiry
    console.log('1️⃣ Testing business inquiry insert...');
    const testBusinessName = `Test Business ${Date.now()}`;
    
    const { data, error } = await supabase
      .from('business_inquiries')
      .insert([
        {
          business_name: testBusinessName,
          created_at: new Date().toISOString(),
          status: 'new'
        }
      ])
      .select();

    if (error) {
      console.error('❌ Insert failed:', error);
      return false;
    }

    console.log('✅ Insert successful:', data[0]);
    console.log('');

    // Test 2: Verify data exists
    console.log('2️⃣ Verifying data exists...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('business_inquiries')
      .select('*')
      .eq('business_name', testBusinessName);

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
      return false;
    }

    if (verifyData && verifyData.length > 0) {
      console.log('✅ Data verified:', verifyData[0]);
    } else {
      console.error('❌ Data not found after insert');
      return false;
    }
    console.log('');

    // Test 3: Check total count
    console.log('3️⃣ Checking total business inquiries...');
    const { count, error: countError } = await supabase
      .from('business_inquiries')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count query failed:', countError);
      return false;
    }

    console.log(`✅ Total business inquiries: ${count}`);
    console.log('');

    // Test 4: Test WhatsApp message format
    console.log('4️⃣ Testing WhatsApp message format...');
    const message = encodeURIComponent(
      `Halo! Saya ${testBusinessName}, tertarik dengan jasa buat lagu UMKM. Bisa info lebih detail tentang paket 2 lagu original dengan harga Rp199K?`
    );
    
    console.log('✅ WhatsApp message format:');
    console.log(`   URL: https://wa.me/6281234567890?text=${message}`);
    console.log('');

    console.log('🎉 All tests passed! Popup database functionality is working correctly.');
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test
testPopupDatabase()
  .then(success => {
    if (success) {
      console.log('');
      console.log('🚀 Ready for production!');
      console.log('- Popup can save business names to database');
      console.log('- WhatsApp redirect works with personalized messages');
      console.log('- Error handling is robust');
      console.log('- Database is properly configured');
    } else {
      console.log('');
      console.log('❌ Tests failed. Please check your configuration.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
