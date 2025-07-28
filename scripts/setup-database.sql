-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'photographer', 'editor')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cameraman_profiles table
CREATE TABLE IF NOT EXISTS cameraman_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  equipment TEXT,
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2),
  specialties TEXT[],
  languages TEXT[],
  availability TEXT[],
  location VARCHAR(255),
  cameraman_type VARCHAR(20) NOT NULL CHECK (cameraman_type IN ('elite', 'realtime')),
  is_available BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  awards TEXT,
  celebrity_clients TEXT,
  portfolio TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cameraman_id UUID REFERENCES cameraman_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location VARCHAR(255),
  event_type VARCHAR(50),
  duration VARCHAR(50),
  payment VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cameraman_id UUID REFERENCES cameraman_profiles(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  event_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cameraman_profiles_user_id ON cameraman_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_events_cameraman_id ON events(cameraman_id);
CREATE INDEX IF NOT EXISTS idx_reviews_cameraman_id ON reviews(cameraman_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameraman_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Cameramen can view their own profiles" ON cameraman_profiles FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Cameramen can update their own profiles" ON cameraman_profiles FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Anyone can view verified cameraman profiles" ON cameraman_profiles FOR SELECT USING (is_verified = true);

CREATE POLICY "Users can view their own sessions" ON sessions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own sessions" ON sessions FOR DELETE USING (auth.uid()::text = user_id::text);
