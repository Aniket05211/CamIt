-- SQL to ensure booking_event and booking_trip tables have all necessary payment columns
-- Run these commands in your Supabase SQL editor

-- Check and add payment-related columns to booking_event table
ALTER TABLE booking_event 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

ALTER TABLE booking_event 
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE booking_event 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

ALTER TABLE booking_event 
ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100);

ALTER TABLE booking_event 
ADD COLUMN IF NOT EXISTS card_last4 VARCHAR(4);

ALTER TABLE booking_event 
ADD COLUMN IF NOT EXISTS card_brand VARCHAR(20);

ALTER TABLE booking_event 
ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- Check and add payment-related columns to booking_trip table
ALTER TABLE booking_trip 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

ALTER TABLE booking_trip 
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE booking_trip 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

ALTER TABLE booking_trip 
ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100);

ALTER TABLE booking_trip 
ADD COLUMN IF NOT EXISTS card_last4 VARCHAR(4);

ALTER TABLE booking_trip 
ADD COLUMN IF NOT EXISTS card_brand VARCHAR(20);

ALTER TABLE booking_trip 
ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_booking_event_payment_status ON booking_event(payment_status);
CREATE INDEX IF NOT EXISTS idx_booking_trip_payment_status ON booking_trip(payment_status);

-- Update existing records to have default payment_status
UPDATE booking_event 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

UPDATE booking_trip 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Add check constraints to ensure valid payment status values
ALTER TABLE booking_event 
ADD CONSTRAINT check_booking_event_payment_status 
CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded'));

ALTER TABLE booking_trip 
ADD CONSTRAINT check_booking_trip_payment_status 
CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded')); 