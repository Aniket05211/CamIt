-- Updated SQL to create review_trip table without photographer_id
-- Run this in your Supabase SQL editor

-- Create review_trip table
CREATE TABLE IF NOT EXISTS review_trip (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_trip_id UUID NOT NULL REFERENCES booking_trip(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Enable Row Level Security
ALTER TABLE review_trip ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON review_trip
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON review_trip
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable update for users based on client_id" ON review_trip
    FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Enable delete for users based on client_id" ON review_trip
    FOR DELETE USING (auth.uid() = client_id);

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