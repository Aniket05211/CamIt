-- SQL to check review_trip table structure
-- Run this in your Supabase SQL editor to verify the table exists and has correct structure

-- Check if review_trip table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'review_trip'
) as table_exists;

-- Get table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'review_trip'
ORDER BY ordinal_position;

-- Check if required columns exist
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'review_trip' 
        AND column_name = 'review_images'
    ) THEN 'review_images column exists' ELSE 'review_images column missing' END as review_images_check,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'review_trip' 
        AND column_name = 'avatar_url'
    ) THEN 'avatar_url column exists' ELSE 'avatar_url column missing' END as avatar_url_check,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'review_trip' 
        AND column_name = 'location_image_url'
    ) THEN 'location_image_url column exists' ELSE 'location_image_url column missing' END as location_image_url_check;

-- Check constraints
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
AND table_name = 'review_trip';

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'review_trip';

-- Test insert (optional - uncomment to test)
-- INSERT INTO review_trip (
--     booking_trip_id,
--     client_id,
--     rating,
--     review_text,
--     location,
--     highlight,
--     photos_count,
--     review_images,
--     avatar_url,
--     location_image_url
-- ) VALUES (
--     '00000000-0000-0000-0000-000000000000', -- Replace with actual booking_trip_id
--     '00000000-0000-0000-0000-000000000000', -- Replace with actual client_id
--     5,
--     'Test review',
--     'Test Location',
--     'Test Highlight',
--     10,
--     ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
--     'https://example.com/avatar.jpg',
--     'https://example.com/location.jpg'
-- ); 