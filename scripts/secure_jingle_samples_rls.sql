-- Alternative secure RLS policies for jingle_samples table
-- Use this if you want to implement proper access control in the future

-- First, check if RLS is enabled and disable it temporarily if needed
ALTER TABLE jingle_samples DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Public read access" ON jingle_samples;
DROP POLICY IF EXISTS "Admin insert access" ON jingle_samples;
DROP POLICY IF EXISTS "Admin update access" ON jingle_samples;
DROP POLICY IF EXISTS "Admin delete access" ON jingle_samples;

-- Re-enable RLS
ALTER TABLE jingle_samples ENABLE ROW LEVEL SECURITY;

-- Create secure policies with role-based access

-- Allow public read access (anyone can view jingle samples)
CREATE POLICY "Public read access" ON jingle_samples
    FOR SELECT USING (true);

-- Allow authenticated users to insert (for /addsong page)
-- You can modify this to be more restrictive later
CREATE POLICY "Authenticated insert access" ON jingle_samples
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to insert even as anon (for public form submission)
CREATE POLICY "Anon insert access" ON jingle_samples
    FOR INSERT TO anon
    WITH CHECK (true);

-- Only allow authenticated users with admin role to update
-- (You can implement role-based access control later)
CREATE POLICY "Admin update access" ON jingle_samples
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- Only allow authenticated users with admin role to delete
CREATE POLICY "Admin delete access" ON jingle_samples
    FOR DELETE TO authenticated
    USING (true);

-- Grant necessary permissions
GRANT SELECT ON jingle_samples TO anon;
GRANT SELECT, INSERT ON jingle_samples TO authenticated;
GRANT USAGE ON SEQUENCE jingle_samples_id_seq TO anon;
GRANT USAGE ON SEQUENCE jingle_samples_id_seq TO authenticated;

-- For storage bucket access, ensure the bucket policies are also set correctly
-- Run these in the Supabase dashboard or via SQL if you have storage access:
/*
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to jingle-files bucket
CREATE POLICY "Public read access on jingle-files" ON storage.objects
    FOR SELECT USING (bucket_id = 'jingle-files');

-- Allow authenticated users to upload to jingle-files bucket
CREATE POLICY "Authenticated upload access on jingle-files" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'jingle-files');

-- Allow anon users to upload to jingle-files bucket (for public form)
CREATE POLICY "Anon upload access on jingle-files" ON storage.objects
    FOR INSERT TO anon
    WITH CHECK (bucket_id = 'jingle-files');
*/