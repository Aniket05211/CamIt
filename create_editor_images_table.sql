-- Create editor_images table for storing editor portfolio and before/after images
CREATE TABLE IF NOT EXISTS editor_images (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    editor_id uuid NOT NULL REFERENCES editor_profiles(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    title text DEFAULT 'Untitled',
    description text DEFAULT '',
    category text DEFAULT 'General',
    image_type text DEFAULT 'portfolio' CHECK (image_type IN ('portfolio', 'before_after', 'sample')),
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_editor_images_editor_id ON editor_images(editor_id);
CREATE INDEX IF NOT EXISTS idx_editor_images_type ON editor_images(image_type);
CREATE INDEX IF NOT EXISTS idx_editor_images_public ON editor_images(is_public);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_editor_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_editor_images_updated_at
    BEFORE UPDATE ON editor_images
    FOR EACH ROW
    EXECUTE FUNCTION update_editor_images_updated_at();

-- Add before_after_samples column to editor_profiles table if it doesn't exist
ALTER TABLE editor_profiles 
ADD COLUMN IF NOT EXISTS before_after_samples jsonb DEFAULT '[]'::jsonb;

-- Add location column to editor_profiles if it doesn't exist
ALTER TABLE editor_profiles 
ADD COLUMN IF NOT EXISTS location text DEFAULT '';

-- Update editor_profiles table to ensure all required columns exist
ALTER TABLE editor_profiles
ADD COLUMN IF NOT EXISTS full_service_rate text DEFAULT '75-200',
ADD COLUMN IF NOT EXISTS recent_reviews jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS earnings jsonb DEFAULT '{"total": 0, "thisMonth": 0, "lastMonth": 0}'::jsonb,
ADD COLUMN IF NOT EXISTS stats jsonb DEFAULT '{"totalProjects": 0, "completedProjects": 0, "cancelledProjects": 0, "averageRating": 0}'::jsonb;

-- Create indexes for editor_profiles
CREATE INDEX IF NOT EXISTS idx_editor_profiles_location ON editor_profiles(location);
CREATE INDEX IF NOT EXISTS idx_editor_profiles_availability_status ON editor_profiles(availability_status);

-- Sample data for testing (optional)
-- INSERT INTO editor_images (editor_id, image_url, title, description, category, image_type) VALUES
-- ('your-editor-profile-id', 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?q=80&w=2070', 'Sample Portfolio', 'Professional editing work', 'Portfolio', 'portfolio'); 