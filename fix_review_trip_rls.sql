-- SQL to fix Row Level Security policies for review_trip table
-- Run this in your Supabase SQL editor

-- First, let's check the current RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'review_trip';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON review_trip;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON review_trip;
DROP POLICY IF EXISTS "Enable update for users based on client_id" ON review_trip;
DROP POLICY IF EXISTS "Enable delete for users based on client_id" ON review_trip;
DROP POLICY IF EXISTS "Allow users to update their own review images" ON review_trip;

-- Create new RLS policies that work properly
-- Policy for reading reviews (allow all authenticated users to read)
CREATE POLICY "Enable read access for all users" ON review_trip
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for inserting reviews (allow authenticated users to insert their own reviews)
CREATE POLICY "Enable insert for authenticated users only" ON review_trip
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Policy for updating reviews (allow users to update their own reviews)
CREATE POLICY "Enable update for users based on client_id" ON review_trip
    FOR UPDATE USING (auth.uid() = client_id);

-- Policy for deleting reviews (allow users to delete their own reviews)
CREATE POLICY "Enable delete for users based on client_id" ON review_trip
    FOR DELETE USING (auth.uid() = client_id);

-- Alternative: If you want to disable RLS temporarily for testing
-- ALTER TABLE review_trip DISABLE ROW LEVEL SECURITY;

-- Or if you want to enable RLS but with more permissive policies
-- CREATE POLICY "Allow all operations for authenticated users" ON review_trip
--     FOR ALL USING (auth.role() = 'authenticated');

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'review_trip';

-- Test if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'review_trip'; 