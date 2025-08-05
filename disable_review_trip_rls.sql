-- SQL to temporarily disable RLS for review_trip table for testing
-- Run this in your Supabase SQL editor

-- Disable RLS temporarily
ALTER TABLE review_trip DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'review_trip';

-- To re-enable RLS later, run:
-- ALTER TABLE review_trip ENABLE ROW LEVEL SECURITY; 