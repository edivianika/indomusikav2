#!/usr/bin/env node

/**
 * Migration script to create business_inquiries table
 * Run this script to set up the database table for storing leads
 */

const fs = require('fs');
const path = require('path');

// Read the SQL migration file
const migrationPath = path.join(__dirname, 'create_business_inquiries_table.sql');
const sqlContent = fs.readFileSync(migrationPath, 'utf8');

console.log('📋 Business Inquiries Table Migration');
console.log('=====================================');
console.log('');
console.log('To create the business_inquiries table, run the following SQL in your Supabase SQL Editor:');
console.log('');
console.log('```sql');
console.log(sqlContent);
console.log('```');
console.log('');
console.log('📝 Migration includes:');
console.log('✅ business_inquiries table with all necessary fields');
console.log('✅ Indexes for better performance');
console.log('✅ Updated_at trigger for automatic timestamp updates');
console.log('✅ RLS (Row Level Security) policies for data protection');
console.log('✅ Anonymous insert policy for popup functionality');
console.log('✅ Sample data for testing');
console.log('');
console.log('🚀 After running the migration:');
console.log('1. The popup will be able to save business names to the database');
console.log('2. You can view leads in your Supabase dashboard');
console.log('3. The table will be ready for production use');
console.log('');
console.log('💡 Next steps:');
console.log('- Run the SQL in Supabase SQL Editor');
console.log('- Test the popup functionality');
console.log('- Check the business_inquiries table in your Supabase dashboard');
