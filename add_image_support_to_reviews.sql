-- SQL to add image support to review_trip table
-- Run this in your Supabase SQL editor

-- Add image columns to review_trip table
ALTER TABLE review_trip 
ADD COLUMN IF NOT EXISTS review_images TEXT[] DEFAULT '{}';

-- Add avatar column for user profile images
ALTER TABLE review_trip 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add location image column
ALTER TABLE review_trip 
ADD COLUMN IF NOT EXISTS location_image_url TEXT;

-- Create index for image searches
CREATE INDEX IF NOT EXISTS idx_review_trip_has_images ON review_trip USING gin(review_images);

-- Update the review_trip table to support image metadata
ALTER TABLE review_trip 
ADD COLUMN IF NOT EXISTS image_metadata JSONB DEFAULT '{}';

-- Add a function to validate image URLs
CREATE OR REPLACE FUNCTION validate_image_url(url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic URL validation for images
  RETURN url ~ '^https?://.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$';
END;
$$ LANGUAGE plpgsql;

-- Add check constraint for valid image URLs
ALTER TABLE review_trip 
ADD CONSTRAINT check_valid_avatar_url 
CHECK (avatar_url IS NULL OR validate_image_url(avatar_url));

ALTER TABLE review_trip 
ADD CONSTRAINT check_valid_location_image_url 
CHECK (location_image_url IS NULL OR validate_image_url(location_image_url));

-- Create a function to update image metadata
CREATE OR REPLACE FUNCTION update_review_image_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Update image metadata when images are added/removed
  NEW.image_metadata = jsonb_build_object(
    'has_images', array_length(NEW.review_images, 1) > 0,
    'image_count', array_length(NEW.review_images, 1),
    'has_avatar', NEW.avatar_url IS NOT NULL,
    'has_location_image', NEW.location_image_url IS NOT NULL,
    'updated_at', now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update image metadata
CREATE TRIGGER trigger_update_review_image_metadata
    BEFORE INSERT OR UPDATE ON review_trip
    FOR EACH ROW
    EXECUTE FUNCTION update_review_image_metadata();

-- Update RLS policies to allow image uploads
-- Note: You may need to adjust these based on your storage setup
CREATE POLICY "Allow users to update their own review images" ON review_trip
    FOR UPDATE USING (auth.uid() = client_id);

-- Add storage bucket for review images (if using Supabase Storage)
-- This is optional and depends on your Supabase setup
-- INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true);

-- Create a function to get review with images
CREATE OR REPLACE FUNCTION get_review_with_images(review_id UUID)
RETURNS TABLE (
    id UUID,
    booking_trip_id UUID,
    client_id UUID,
    rating INTEGER,
    review_text TEXT,
    location VARCHAR(255),
    highlight VARCHAR(100),
    photos_count INTEGER,
    is_verified BOOLEAN,
    review_images TEXT[],
    avatar_url TEXT,
    location_image_url TEXT,
    image_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rt.id,
    rt.booking_trip_id,
    rt.client_id,
    rt.rating,
    rt.review_text,
    rt.location,
    rt.highlight,
    rt.photos_count,
    rt.is_verified,
    rt.review_images,
    rt.avatar_url,
    rt.location_image_url,
    rt.image_metadata,
    rt.created_at,
    rt.updated_at
  FROM review_trip rt
  WHERE rt.id = review_id;
END;
$$ LANGUAGE plpgsql; 