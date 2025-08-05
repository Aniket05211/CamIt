-- SQL to create review_trip table in Supabase
-- Run this in your Supabase SQL editor

-- Create the review_trip table
CREATE TABLE IF NOT EXISTS review_trip (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_trip_id UUID NOT NULL REFERENCES booking_trip(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photographer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    location VARCHAR(255),
    highlight VARCHAR(100),
    photos_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_review_trip_booking_id ON review_trip(booking_trip_id);
CREATE INDEX IF NOT EXISTS idx_review_trip_client_id ON review_trip(client_id);
CREATE INDEX IF NOT EXISTS idx_review_trip_photographer_id ON review_trip(photographer_id);
CREATE INDEX IF NOT EXISTS idx_review_trip_rating ON review_trip(rating);
CREATE INDEX IF NOT EXISTS idx_review_trip_created_at ON review_trip(created_at);

-- Create a function to update the updated_at timestamp
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

-- Add RLS (Row Level Security) policies
ALTER TABLE review_trip ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read all reviews
CREATE POLICY "Allow read access to all reviews" ON review_trip
    FOR SELECT USING (true);

-- Policy to allow users to insert their own reviews
CREATE POLICY "Allow users to insert their own reviews" ON review_trip
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Policy to allow users to update their own reviews
CREATE POLICY "Allow users to update their own reviews" ON review_trip
    FOR UPDATE USING (auth.uid() = client_id);

-- Policy to allow users to delete their own reviews
CREATE POLICY "Allow users to delete their own reviews" ON review_trip
    FOR DELETE USING (auth.uid() = client_id);

-- Add a column to booking_trip to track if review exists
ALTER TABLE booking_trip 
ADD COLUMN IF NOT EXISTS has_review BOOLEAN DEFAULT false;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_booking_trip_has_review ON booking_trip(has_review);

-- Create a function to update has_review when a review is added/removed
CREATE OR REPLACE FUNCTION update_booking_trip_review_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE booking_trip SET has_review = true WHERE id = NEW.booking_trip_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE booking_trip SET has_review = false WHERE id = OLD.booking_trip_id;
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

-- Insert some sample reviews for testing (optional)
-- INSERT INTO review_trip (booking_trip_id, client_id, photographer_id, rating, review_text, location, highlight, photos_count, is_verified) VALUES
-- ('sample-booking-id-1', 'sample-client-id-1', 'sample-photographer-id-1', 5, 'Amazing experience! The photographer captured every moment perfectly.', 'Bali, Indonesia', 'Sunset Photography', 150, true),
-- ('sample-booking-id-2', 'sample-client-id-2', 'sample-photographer-id-2', 5, 'Professional service and stunning photos. Highly recommended!', 'Santorini, Greece', 'Landscape Photography', 200, true),
-- ('sample-booking-id-3', 'sample-client-id-3', 'sample-photographer-id-3', 4, 'Great experience overall. Beautiful memories captured.', 'Paris, France', 'Street Photography', 120, true); 