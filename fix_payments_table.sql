-- SQL to fix payments table for multi-table booking support
-- Run these commands in your Supabase SQL editor

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE payments 
DROP CONSTRAINT IF EXISTS payments_booking_id_fkey;

-- Step 2: Add a new column to track booking type
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS booking_type VARCHAR(20) DEFAULT 'original';

-- Step 3: Add a new column to track the original table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS booking_table VARCHAR(50) DEFAULT 'bookings';

-- Step 4: Add a new column for the original booking ID (for event/trip bookings)
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS original_booking_id UUID;

-- Step 5: Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_payments_booking_type ON payments(booking_type);
CREATE INDEX IF NOT EXISTS idx_payments_booking_table ON payments(booking_table);

-- Step 6: Update existing payments to have the correct booking_type
UPDATE payments 
SET booking_type = 'original', booking_table = 'bookings' 
WHERE booking_type IS NULL;

-- Optional: Add a check constraint to ensure valid booking types
ALTER TABLE payments 
ADD CONSTRAINT check_booking_type 
CHECK (booking_type IN ('original', 'event', 'trip'));

-- Optional: Add a check constraint to ensure valid booking tables
ALTER TABLE payments 
ADD CONSTRAINT check_booking_table 
CHECK (booking_table IN ('bookings', 'booking_event', 'booking_trip'));
