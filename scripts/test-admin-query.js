#!/usr/bin/env node

/**
 * Script to test admin dashboard query
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://xywntlseipqsncywliib.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d250bHNlaXBxc25jeXdsaWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NjExNzcsImV4cCI6MjA3MTIzNzE3N30.9FhWSnDTceZFpH1pfEX7RWaMa9QQvtqmAdqABqmHINE'
);

async function testAdminQuery() {
  console.log('🔍 Testing admin dashboard query...');
  
  try {
    // Test 1: Simple query without JOIN
    console.log('\n📊 Test 1: Simple business_inquiries query...');
    const { data: simpleData, error: simpleError } = await supabase
      .from('business_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (simpleError) {
      console.error('❌ Simple query error:', simpleError);
    } else {
      console.log('✅ Simple query result:', simpleData);
      console.log('📈 Simple query count:', simpleData?.length || 0);
    }
    
    // Test 2: JOIN query (same as admin dashboard)
    console.log('\n📊 Test 2: JOIN query (admin dashboard style)...');
    const { data: joinData, error: joinError } = await supabase
      .from('business_inquiries')
      .select(`
        *,
        customer_services!inner(nama, nohp)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (joinError) {
      console.error('❌ JOIN query error:', joinError);
    } else {
      console.log('✅ JOIN query result:', joinData);
      console.log('📈 JOIN query count:', joinData?.length || 0);
    }
    
    // Test 3: LEFT JOIN query (alternative)
    console.log('\n📊 Test 3: LEFT JOIN query (alternative)...');
    const { data: leftJoinData, error: leftJoinError } = await supabase
      .from('business_inquiries')
      .select(`
        *,
        customer_services(nama, nohp)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (leftJoinError) {
      console.error('❌ LEFT JOIN query error:', leftJoinError);
    } else {
      console.log('✅ LEFT JOIN query result:', leftJoinData);
      console.log('📈 LEFT JOIN query count:', leftJoinData?.length || 0);
    }
    
    // Test 4: Check customer_services table
    console.log('\n👥 Test 4: Customer services table...');
    const { data: csData, error: csError } = await supabase
      .from('customer_services')
      .select('*');
      
    if (csError) {
      console.error('❌ Customer services error:', csError);
    } else {
      console.log('✅ Customer services result:', csData);
      console.log('📈 Customer services count:', csData?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAdminQuery().catch(console.error);
