-- Fix review_trip table to use users table instead of auth.users
-- Run this in your Supabase SQL editor

-- First, let's check if the table exists and drop it if needed
DROP TABLE IF EXISTS review_trip CASCADE;

-- Create review_trip table with correct references
CREATE TABLE IF NOT EXISTS review_trip (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_trip_id UUID NOT NULL REFERENCES booking_trip(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Changed from auth.users to users
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    location VARCHAR(255),
    highlight VARCHAR(100),
    photos_count INTEGER DEFAULT 0,
    avatar_url TEXT,
    location_image_url TEXT,
    review_images TEXT[],
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_review_trip_booking_id ON review_trip(booking_trip_id);
CREATE INDEX IF NOT EXISTS idx_review_trip_client_id ON review_trip(client_id);
CREATE INDEX IF NOT EXISTS idx_review_trip_rating ON review_trip(rating);
CREATE INDEX IF NOT EXISTS idx_review_trip_created_at ON review_trip(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_review_trip_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_review_trip_updated_at
    BEFORE UPDATE ON review_trip
    FOR EACH ROW
    EXECUTE FUNCTION update_review_trip_updated_at();

-- Disable RLS for testing (you can enable it later)
ALTER TABLE review_trip DISABLE ROW LEVEL SECURITY;

-- Add has_review column to booking_trip table if it doesn't exist
ALTER TABLE booking_trip ADD COLUMN IF NOT EXISTS has_review BOOLEAN DEFAULT false;

-- Create index for has_review
CREATE INDEX IF NOT EXISTS idx_booking_trip_has_review ON booking_trip(has_review);

-- Create function to update has_review status
CREATE OR REPLACE FUNCTION update_booking_trip_review_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE booking_trip 
        SET has_review = true 
        WHERE id = NEW.booking_trip_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE booking_trip 
        SET has_review = false 
        WHERE id = OLD.booking_trip_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update has_review
CREATE TRIGGER trigger_update_booking_trip_review_status
    AFTER INSERT OR DELETE ON review_trip
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_trip_review_status();

-- Insert sample reviews (you'll need to adjust the client_id and booking_trip_id based on your actual data)
-- First, let's get some sample user IDs and booking IDs
-- You can run this separately to see what IDs are available:
-- SELECT id, full_name FROM users WHERE user_type = 'client' LIMIT 5;
-- SELECT id, destination FROM booking_trip LIMIT 5;

-- For now, we'll insert sample reviews with placeholder IDs
-- You should replace these with actual IDs from your database

INSERT INTO review_trip (
    booking_trip_id,
    client_id,
    rating,
    review_text,
    location,
    highlight,
    photos_count,
    avatar_url,
    location_image_url,
    is_verified
) VALUES 
(
    (SELECT id FROM booking_trip LIMIT 1), -- Replace with actual booking_trip_id
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1), -- Replace with actual client_id
    5,
    'CamIt made our dream wedding in Tuscany absolutely perfect! From the initial consultation to the final photo delivery, everything was seamless. Our photographer captured every precious moment beautifully, and the team handled all the logistics flawlessly. We couldn''t be happier with the results!',
    'Tuscany, Italy',
    'Wedding Photography',
    150,
    'https://images.unsplash.com/photo-1494790108755-2616c96c5e24?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 1), -- Replace with actual booking_trip_id
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 1), -- Replace with actual client_id
    5,
    'The family vacation photos from our Tokyo trip are absolutely stunning! CamIt connected us with a local photographer who knew all the best spots and timing. The cherry blossom shots are magazine-quality, and our kids loved the experience. Highly recommend for family trips!',
    'Tokyo, Japan',
    'Family Photography',
    85,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 2), -- Replace with actual booking_trip_id
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 2), -- Replace with actual client_id
    5,
    'The Northern Lights photography tour exceeded all expectations! CamIt''s team was incredibly professional and knowledgeable. They knew exactly when and where to capture the aurora, and the results are breathtaking. Worth every penny for this once-in-a-lifetime experience.',
    'Iceland',
    'Adventure Photography',
    120,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531168556467-80aace4d0144?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 3), -- Replace with actual booking_trip_id
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 3), -- Replace with actual client_id
    5,
    'Our anniversary trip to Bali was made even more special by CamIt''s photography service. The photographer was creative, professional, and made us feel comfortable throughout the shoot. The sunset beach photos are absolutely gorgeous, and we''ll treasure them forever.',
    'Bali, Indonesia',
    'Couple Photography',
    95,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 4), -- Replace with actual booking_trip_id
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 4), -- Replace with actual client_id
    4,
    'Great experience overall! The photographer was knowledgeable about local customs and got some amazing shots in the markets and desert. Communication was excellent, and the final photos captured the essence of Morocco beautifully. Minor delay in delivery but quality made up for it.',
    'Morocco',
    'Cultural Photography',
    110,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 5), -- Replace with actual booking_trip_id
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 5), -- Replace with actual client_id
    5,
    'CamIt turned our girls'' trip into a professional photoshoot experience! The photographer was fun, creative, and knew all the Instagram-worthy spots. We felt like models for a day, and the photos are absolutely stunning. Already planning our next trip with them!',
    'Santorini, Greece',
    'Lifestyle Photography',
    200,
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&h=200&fit=crop&crop=center',
    true
);

-- Verify the reviews were inserted
SELECT 
    rt.id,
    rt.rating,
    rt.review_text,
    rt.location,
    rt.highlight,
    rt.is_verified,
    u.full_name as client_name
FROM review_trip rt
LEFT JOIN users u ON rt.client_id = u.id
ORDER BY rt.created_at DESC; 