-- SQL to check user tables and their structure
-- Run this in your Supabase SQL editor

-- Check if auth.users table exists and has data
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename = 'users';

-- Check if there are any users in auth.users
SELECT COUNT(*) as user_count FROM auth.users;

-- Check if there's a public users table
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- Check if there's a cameramen table (which might contain user data)
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename = 'cameramen';

-- Check the structure of cameramen table if it exists
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cameramen'
ORDER BY ordinal_position;

-- Check if there are any users in cameramen table
SELECT COUNT(*) as cameramen_count FROM cameramen;

-- Check a few sample records from cameramen
SELECT id, full_name, email FROM cameramen LIMIT 5;

-- Check what tables reference user IDs
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND (kcu.column_name LIKE '%user%' OR kcu.column_name LIKE '%client%' OR kcu.column_name LIKE '%cameraman%'); 