-- =====================================================
-- CAMIT - COMPLETE DATABASE SCHEMA
-- Photo & Video Editing Marketplace
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (unified for all user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'photographer', 'editor')),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PHOTOGRAPHER TABLES
-- =====================================================

-- Photographer profiles table
CREATE TABLE photographer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    equipment TEXT,
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    specialties TEXT[], -- Array of specialties
    languages TEXT[], -- Array of languages
    availability TEXT[], -- Array of availability slots
    location VARCHAR(255),
    photographer_type VARCHAR(20) CHECK (photographer_type IN ('elite', 'realtime')),
    is_available BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    awards TEXT,
    celebrity_clients TEXT,
    portfolio TEXT[], -- Array of photo URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EDITOR TABLES
-- =====================================================

-- Editor profiles table
CREATE TABLE editor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    specialties TEXT[], -- Array of specialties
    software_skills TEXT[], -- Array of software
    languages TEXT[], -- Array of languages
    turnaround_time VARCHAR(50),
    sample_rate DECIMAL(10,2),
    full_service_rate TEXT DEFAULT '75-200',
    portfolio TEXT[], -- Array of work samples
    before_after_samples JSONB DEFAULT '[]'::jsonb,
    location TEXT DEFAULT '',
    is_available BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    awards JSONB DEFAULT '[]'::jsonb,
    recent_reviews JSONB DEFAULT '[]'::jsonb,
    earnings JSONB DEFAULT '{"total": 0, "thisMonth": 0, "lastMonth": 0}'::jsonb,
    stats JSONB DEFAULT '{"totalProjects": 0, "completedProjects": 0, "cancelledProjects": 0, "averageRating": 0}'::jsonb,
    -- Social media handles
    instagram_handle TEXT DEFAULT '',
    twitter_handle TEXT DEFAULT '',
    youtube_handle TEXT DEFAULT '',
    facebook_handle TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Editor images table for storing editor portfolio and before/after images
CREATE TABLE editor_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    editor_id UUID NOT NULL REFERENCES editor_profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title TEXT DEFAULT 'Untitled',
    description TEXT DEFAULT '',
    category TEXT DEFAULT 'General',
    image_type TEXT DEFAULT 'portfolio' CHECK (image_type IN ('portfolio', 'before_after', 'sample')),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Editor reviews table
CREATE TABLE editor_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    editor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES editor_bookings(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    project_type TEXT,
    turnaround_time_rating INTEGER CHECK (turnaround_time_rating >= 1 AND turnaround_time_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- BOOKING TABLES
-- =====================================================

-- General bookings table (for photographers)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    photographer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    editor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'photography', 'editing', 'both'
    event_type VARCHAR(100),
    event_date DATE,
    event_time TIME,
    duration_hours INTEGER,
    location TEXT,
    description TEXT,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Editor bookings table
CREATE TABLE editor_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    editor_id UUID NOT NULL REFERENCES editor_profiles(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('photo', 'video', 'both')),
    project_title VARCHAR(255) NOT NULL,
    project_description TEXT,
    number_of_files INTEGER DEFAULT 1,
    deadline_date DATE NOT NULL,
    deadline_time TIME,
    urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'urgent')),
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    special_requirements TEXT,
    file_upload_urls TEXT[], -- Array of uploaded file URLs
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
    estimated_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    editor_notes TEXT,
    client_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REVIEW TABLES
-- =====================================================

-- General reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMMUNICATION TABLES
-- =====================================================

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PAYMENT TABLES
-- =====================================================

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATION TABLES
-- =====================================================

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'booking', 'payment', 'review', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);

-- User sessions indexes
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Photographer profiles indexes
CREATE INDEX idx_photographer_profiles_user_id ON photographer_profiles(user_id);
CREATE INDEX idx_photographer_profiles_location ON photographer_profiles(location);
CREATE INDEX idx_photographer_profiles_available ON photographer_profiles(is_available);

-- Editor profiles indexes
CREATE INDEX idx_editor_profiles_user_id ON editor_profiles(user_id);
CREATE INDEX idx_editor_profiles_location ON editor_profiles(location);
CREATE INDEX idx_editor_profiles_instagram ON editor_profiles(instagram_handle);
CREATE INDEX idx_editor_profiles_twitter ON editor_profiles(twitter_handle);
CREATE INDEX idx_editor_profiles_youtube ON editor_profiles(youtube_handle);
CREATE INDEX idx_editor_profiles_facebook ON editor_profiles(facebook_handle);

-- Editor images indexes
CREATE INDEX idx_editor_images_editor_id ON editor_images(editor_id);
CREATE INDEX idx_editor_images_type ON editor_images(image_type);
CREATE INDEX idx_editor_images_public ON editor_images(is_public);

-- Editor reviews indexes
CREATE INDEX idx_editor_reviews_editor_id ON editor_reviews(editor_id);
CREATE INDEX idx_editor_reviews_reviewer_id ON editor_reviews(reviewer_id);
CREATE INDEX idx_editor_reviews_created_at ON editor_reviews(created_at);

-- Bookings indexes
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_photographer_id ON bookings(photographer_id);
CREATE INDEX idx_bookings_editor_id ON bookings(editor_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Editor bookings indexes
CREATE INDEX idx_editor_bookings_client_id ON editor_bookings(client_id);
CREATE INDEX idx_editor_bookings_editor_id ON editor_bookings(editor_id);
CREATE INDEX idx_editor_bookings_status ON editor_bookings(status);
CREATE INDEX idx_editor_bookings_created_at ON editor_bookings(created_at);

-- Reviews indexes
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Messages indexes
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);

-- Payments indexes
CREATE INDEX idx_payments_booking_id ON payments(booking_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photographer_profiles_updated_at BEFORE UPDATE ON photographer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_editor_profiles_updated_at BEFORE UPDATE ON editor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_editor_images_updated_at BEFORE UPDATE ON editor_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_editor_reviews_updated_at BEFORE UPDATE ON editor_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_editor_bookings_updated_at BEFORE UPDATE ON editor_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on editor_reviews table
ALTER TABLE editor_reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to read all reviews
CREATE POLICY "Allow users to read editor reviews" ON editor_reviews
    FOR SELECT USING (true);

-- Allow authenticated users to create reviews
CREATE POLICY "Allow authenticated users to create reviews" ON editor_reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update their own reviews" ON editor_reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

-- Allow users to delete their own reviews
CREATE POLICY "Allow users to delete their own reviews" ON editor_reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- Enable RLS on editor_bookings table
ALTER TABLE editor_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for editor_bookings
CREATE POLICY "Users can view their own editor bookings" ON editor_bookings
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can insert their own editor bookings" ON editor_bookings
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own editor bookings" ON editor_bookings
    FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Editors can view bookings assigned to them" ON editor_bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM editor_profiles 
            WHERE editor_profiles.id = editor_bookings.editor_id 
            AND editor_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Editors can update bookings assigned to them" ON editor_bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM editor_profiles 
            WHERE editor_profiles.id = editor_bookings.editor_id 
            AND editor_profiles.user_id = auth.uid()
        )
    );

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample users
INSERT INTO users (email, password_hash, full_name, phone_number, user_type, is_verified) VALUES
('john@photographer.com', '$2b$12$sample.hash.here', 'John Smith', '+1 (555) 123-4567', 'photographer', true),
('jane@editor.com', '$2b$12$sample.hash.here', 'Jane Doe', '+1 (555) 987-6543', 'editor', true),
('alex@editor.com', '$2b$12$sample.hash.here', 'Alex Johnson', '+1 (555) 456-7890', 'editor', true),
('sarah@editor.com', '$2b$12$sample.hash.here', 'Sarah Wilson', '+1 (555) 789-0123', 'editor', true),
('mike@client.com', '$2b$12$sample.hash.here', 'Mike Johnson', '+1 (555) 456-7890', 'client', true),
('emma@client.com', '$2b$12$sample.hash.here', 'Emma Davis', '+1 (555) 321-6540', 'client', true),
('david@client.com', '$2b$12$sample.hash.here', 'David Brown', '+1 (555) 654-3210', 'client', true);

-- Insert sample editor profiles
INSERT INTO editor_profiles (user_id, bio, experience_years, hourly_rate, specialties, software_skills, languages, turnaround_time, sample_rate, full_service_rate, location, awards, instagram_handle, twitter_handle, youtube_handle, facebook_handle) VALUES
(
    (SELECT id FROM users WHERE email = 'jane@editor.com'),
    'Professional photo and video editor with 8+ years of experience. Specializing in wedding photography editing, portrait retouching, and cinematic video editing.',
    8,
    75.00,
    ARRAY['Portrait Retouching', 'Wedding Editing', 'Color Grading'],
    ARRAY['Adobe Photoshop', 'Adobe Lightroom', 'Adobe Premiere Pro', 'DaVinci Resolve'],
    ARRAY['English', 'Spanish'],
    '24-48 hours',
    15.00,
    '75-200',
    'New York, NY',
    '[{"title": "Best Editor 2023", "year": 2023}, {"title": "Excellence Award 2022", "year": 2022}]',
    '@janeeditor',
    '@janeeditor',
    '@janeeditor',
    'janeeditor'
),
(
    (SELECT id FROM users WHERE email = 'alex@editor.com'),
    'Creative video editor and motion graphics specialist. Passionate about storytelling through visual media.',
    5,
    60.00,
    ARRAY['Video Editing', 'Motion Graphics', 'Color Correction'],
    ARRAY['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Cinema 4D'],
    ARRAY['English', 'French'],
    '48-72 hours',
    12.00,
    '60-150',
    'Los Angeles, CA',
    '[{"title": "Creative Excellence 2023", "year": 2023}]',
    '@alexeditor',
    '@alexeditor',
    '@alexeditor',
    'alexeditor'
),
(
    (SELECT id FROM users WHERE email = 'sarah@editor.com'),
    'Expert in commercial photography editing and product retouching. Delivering high-quality results for brands and businesses.',
    6,
    85.00,
    ARRAY['Commercial Editing', 'Product Photography', 'Fashion Retouching'],
    ARRAY['Adobe Photoshop', 'Capture One', 'Adobe Lightroom'],
    ARRAY['English', 'German'],
    '24-36 hours',
    18.00,
    '85-250',
    'Chicago, IL',
    '[{"title": "Commercial Editor of the Year 2022", "year": 2022}]',
    '@saraheditor',
    '@saraheditor',
    '@saraheditor',
    'saraheditor'
);

-- Insert sample editor images
INSERT INTO editor_images (editor_id, image_url, title, description, category, image_type) VALUES
(
    (SELECT id FROM editor_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'jane@editor.com')),
    'https://images.unsplash.com/photo-1610901157620-340856d0a50f?q=80&w=2070',
    'Wedding Portrait Enhancement',
    'Before and after wedding portrait editing',
    'Portrait',
    'before_after'
),
(
    (SELECT id FROM editor_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'jane@editor.com')),
    'https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=2070',
    'Color Grading Sample',
    'Professional color grading for cinematic look',
    'Color Grading',
    'portfolio'
),
(
    (SELECT id FROM editor_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'alex@editor.com')),
    'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106',
    'Video Editing Portfolio',
    'Commercial video editing showcase',
    'Video',
    'portfolio'
);

-- Insert sample editor reviews
INSERT INTO editor_reviews (editor_id, reviewer_id, rating, review_text, project_type, turnaround_time_rating, communication_rating, quality_rating, is_verified) VALUES
(
    (SELECT id FROM users WHERE email = 'jane@editor.com'),
    (SELECT id FROM users WHERE email = 'mike@client.com'),
    5,
    'Jane did an amazing job editing our wedding photos. The colors are perfect and she captured the emotion beautifully. Highly recommend!',
    'Wedding Photography',
    5,
    5,
    5,
    true
),
(
    (SELECT id FROM users WHERE email = 'jane@editor.com'),
    (SELECT id FROM users WHERE email = 'emma@client.com'),
    5,
    'Professional, timely, and excellent quality. Jane transformed our family portraits into something magical.',
    'Portrait Photography',
    4,
    5,
    5,
    true
),
(
    (SELECT id FROM users WHERE email = 'alex@editor.com'),
    (SELECT id FROM users WHERE email = 'david@client.com'),
    4,
    'Great video editing work. Alex was creative and delivered exactly what we wanted. Minor delay but quality was worth it.',
    'Commercial Video',
    4,
    5,
    4,
    true
);

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
