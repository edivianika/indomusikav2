-- Fix Row-Level Security policies for jingle_samples table
-- This script resolves the "new row violates row-level security policy" error

-- First, check if RLS is enabled and disable it temporarily if needed
ALTER TABLE jingle_samples DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access for all users" ON jingle_samples;
DROP POLICY IF EXISTS "Enable insert access for all users" ON jingle_samples;
DROP POLICY IF EXISTS "Enable update access for all users" ON jingle_samples;
DROP POLICY IF EXISTS "Enable delete access for all users" ON jingle_samples;

-- Re-enable RLS
ALTER TABLE jingle_samples ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all operations
-- Since this is a public landing page with jingle samples, we allow public access

-- Allow public read access (for displaying samples on the website)
CREATE POLICY "Enable read access for all users" ON jingle_samples
    FOR SELECT USING (true);

-- Allow public insert access (for adding new jingle samples via /addsong)
CREATE POLICY "Enable insert access for all users" ON jingle_samples
    FOR INSERT WITH CHECK (true);

-- Allow public update access (for potential future admin features)
CREATE POLICY "Enable update access for all users" ON jingle_samples
    FOR UPDATE USING (true) WITH CHECK (true);

-- Allow public delete access (for potential future admin features)
CREATE POLICY "Enable delete access for all users" ON jingle_samples
    FOR DELETE USING (true);

-- Verify the policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'jingle_samples';

-- Grant necessary permissions to anon and authenticated roles
GRANT ALL ON jingle_samples TO anon;
GRANT ALL ON jingle_samples TO authenticated;
GRANT USAGE ON SEQUENCE jingle_samples_id_seq TO anon;
GRANT USAGE ON SEQUENCE jingle_samples_id_seq TO authenticated;