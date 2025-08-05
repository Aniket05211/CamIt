-- Booking Event Table Schema
CREATE TABLE booking_event (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'wedding', 'corporate', 'party', 'portrait'
  service_type VARCHAR(50) NOT NULL, -- 'photo', 'video', 'both'
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  number_of_guests INTEGER,
  special_requirements TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  photographer_id UUID REFERENCES users(id),
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional metadata
  notes TEXT,
  cancellation_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes for better performance
  CONSTRAINT valid_event_type CHECK (event_type IN ('wedding', 'corporate', 'party', 'portrait')),
  CONSTRAINT valid_service_type CHECK (service_type IN ('photo', 'video', 'both')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded'))
);

-- Booking Trip Table Schema
CREATE TABLE booking_trip (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  group_size INTEGER NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  photography_style VARCHAR(100) NOT NULL, -- 'documentary', 'portrait', 'landscape', 'street', 'adventure'
  special_requests TEXT,
  hear_about_us VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  photographer_id UUID REFERENCES users(id),
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional metadata
  notes TEXT,
  cancellation_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes for better performance
  CONSTRAINT valid_trip_status CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  CONSTRAINT valid_trip_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  CONSTRAINT valid_photography_style CHECK (photography_style IN ('documentary', 'portrait', 'landscape', 'street', 'adventure', 'wedding', 'corporate', 'lifestyle', 'architectural', 'wildlife', 'sports', 'fashion', 'food', 'travel', 'other'))
);

-- Create indexes for better performance
CREATE INDEX idx_booking_event_client_id ON booking_event(client_id);
CREATE INDEX idx_booking_event_photographer_id ON booking_event(photographer_id);
CREATE INDEX idx_booking_event_status ON booking_event(status);
CREATE INDEX idx_booking_event_date ON booking_event(event_date);
CREATE INDEX idx_booking_event_created_at ON booking_event(created_at);

CREATE INDEX idx_booking_trip_client_id ON booking_trip(client_id);
CREATE INDEX idx_booking_trip_photographer_id ON booking_trip(photographer_id);
CREATE INDEX idx_booking_trip_status ON booking_trip(status);
CREATE INDEX idx_booking_trip_start_date ON booking_trip(start_date);
CREATE INDEX idx_booking_trip_created_at ON booking_trip(created_at);

-- Create triggers to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for both tables
CREATE TRIGGER update_booking_event_updated_at 
    BEFORE UPDATE ON booking_event 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_trip_updated_at 
    BEFORE UPDATE ON booking_trip 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- INSERT INTO booking_event (
--   client_id,
--   event_type,
--   service_type,
--   event_date,
--   event_time,
--   location,
--   number_of_guests,
--   special_requirements,
--   status
-- ) VALUES (
--   '25308c26-013f-4665-a5cf-d6c1ff345c2b',
--   'wedding',
--   'both',
--   '2024-12-15',
--   '14:00:00',
--   'Grand Hotel, New York',
--   150,
--   'Need drone footage and live streaming',
--   'pending'
-- );

-- INSERT INTO booking_trip (
--   client_id,
--   full_name,
--   email,
--   phone,
--   destination,
--   start_date,
--   end_date,
--   group_size,
--   budget,
--   photography_style,
--   special_requests,
--   status
-- ) VALUES (
--   '25308c26-013f-4665-a5cf-d6c1ff345c2b',
--   'John Doe',
--   'john@example.com',
--   '+1234567890',
--   'Santorini, Greece',
--   '2024-06-15',
--   '2024-06-22',
--   2,
--   2500.00,
--   'documentary',
--   'Want to capture sunset photos and local culture',
--   'pending'
-- ); 