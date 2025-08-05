-- Check if editor_profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'editor_profiles'
) as table_exists;

-- If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS editor_profiles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_rate numeric,
    rating numeric DEFAULT 0.0,
    total_reviews integer DEFAULT 0,
    turnaround_time integer,
    experience_years integer,
    hourly_rate numeric,
    bio text,
    portfolio_urls text[],
    availability_status character varying DEFAULT 'available',
    languages text[],
    specializations text[],
    software_skills text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_editor_profiles_user_id ON editor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_editor_profiles_availability ON editor_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_editor_profiles_rating ON editor_profiles(rating DESC);

-- Add check constraints
ALTER TABLE editor_profiles 
DROP CONSTRAINT IF EXISTS check_rating_range;

ALTER TABLE editor_profiles 
ADD CONSTRAINT check_rating_range 
CHECK (rating >= 0 AND rating <= 5);

ALTER TABLE editor_profiles 
DROP CONSTRAINT IF EXISTS check_availability_status;

ALTER TABLE editor_profiles 
ADD CONSTRAINT check_availability_status 
CHECK (availability_status IN ('available', 'busy', 'unavailable'));

-- Check current data
SELECT COUNT(*) as editor_count FROM editor_profiles;

-- Show sample data
SELECT 
    ep.id,
    ep.user_id,
    u.full_name,
    u.email,
    ep.project_rate,
    ep.rating,
    ep.bio,
    ep.availability_status
FROM editor_profiles ep
LEFT JOIN users u ON ep.user_id = u.id
LIMIT 5; 