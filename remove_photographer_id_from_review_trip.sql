-- SQL to remove photographer_id column from review_trip table
-- Run this in your Supabase SQL editor

-- Remove the photographer_id column
ALTER TABLE review_trip DROP COLUMN IF EXISTS photographer_id;

-- Verify the column was removed
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'review_trip'
ORDER BY ordinal_position;

-- Update any RLS policies that might reference photographer_id
-- (This will be handled automatically since the column is removed) 