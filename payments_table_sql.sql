-- Payments Table Schema
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    photographer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'bank_transfer', etc.
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    transaction_id VARCHAR(255), -- External payment processor transaction ID
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Payment details
    card_last4 VARCHAR(4), -- Last 4 digits of card
    card_brand VARCHAR(20), -- 'visa', 'mastercard', 'amex', etc.
    billing_address JSONB, -- Store billing address as JSON
    payment_notes TEXT,
    
    -- Metadata
    metadata JSONB -- Store additional payment processor data
);

-- Add indexes for better performance
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_photographer_id ON payments(photographer_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Update bookings table to include payment fields (if not already present)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_price DECIMAL(10,2);

-- Add indexes for bookings payment fields
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON bookings(payment_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payments table
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for bookings table
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample payment data for testing (optional)
-- INSERT INTO payments (
--     booking_id,
--     client_id,
--     photographer_id,
--     amount,
--     currency,
--     payment_method,
--     payment_status,
--     transaction_id,
--     card_last4,
--     card_brand,
--     billing_address
-- ) VALUES (
--     'your-booking-id-here',
--     '25308c26-013f-4665-a5cf-d6c1ff345c2b',
--     'fb3cf51f-967a-4f1c-8456-46ca57727151',
--     100.00,
--     'USD',
--     'credit_card',
--     'completed',
--     'txn_test_123',
--     '1234',
--     'visa',
--     '{"address": "Test Address"}'
-- ); 