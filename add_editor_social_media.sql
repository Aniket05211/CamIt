-- Add social media columns to editor_profiles table
ALTER TABLE editor_profiles
ADD COLUMN IF NOT EXISTS instagram_handle text DEFAULT '',
ADD COLUMN IF NOT EXISTS twitter_handle text DEFAULT '',
ADD COLUMN IF NOT EXISTS youtube_handle text DEFAULT '',
ADD COLUMN IF NOT EXISTS facebook_handle text DEFAULT '';

-- Create indexes for social media handles
CREATE INDEX IF NOT EXISTS idx_editor_profiles_instagram ON editor_profiles(instagram_handle);
CREATE INDEX IF NOT EXISTS idx_editor_profiles_twitter ON editor_profiles(twitter_handle);
CREATE INDEX IF NOT EXISTS idx_editor_profiles_youtube ON editor_profiles(youtube_handle);
CREATE INDEX IF NOT EXISTS idx_editor_profiles_facebook ON editor_profiles(facebook_handle); 