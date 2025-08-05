-- SQL to fix check constraints for review_trip table
-- Run this in your Supabase SQL editor

-- Drop existing check constraints
ALTER TABLE review_trip DROP CONSTRAINT IF EXISTS check_valid_avatar_url;
ALTER TABLE review_trip DROP CONSTRAINT IF EXISTS check_valid_location_image_url;

-- Create more flexible check constraints that allow empty strings
ALTER TABLE review_trip 
ADD CONSTRAINT check_valid_avatar_url 
CHECK (avatar_url IS NULL OR avatar_url = '' OR avatar_url ~ '^https?://.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$');

ALTER TABLE review_trip 
ADD CONSTRAINT check_valid_location_image_url 
CHECK (location_image_url IS NULL OR location_image_url = '' OR location_image_url ~ '^https?://.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$');

-- Verify the constraints were created
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name IN ('check_valid_avatar_url', 'check_valid_location_image_url'); 