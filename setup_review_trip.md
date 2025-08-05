# Setup Review Trip Table

## Step 1: Create the review_trip table

Run this SQL in your Supabase SQL editor:

```sql
-- Create review_trip table with correct references
CREATE TABLE IF NOT EXISTS review_trip (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_trip_id UUID NOT NULL REFERENCES booking_trip(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    location VARCHAR(255),
    highlight VARCHAR(100),
    photos_count INTEGER DEFAULT 0,
    avatar_url TEXT,
    location_image_url TEXT,
    review_images TEXT[],
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_review_trip_booking_id ON review_trip(booking_trip_id);
CREATE INDEX IF NOT EXISTS idx_review_trip_client_id ON review_trip(client_id);
CREATE INDEX IF NOT EXISTS idx_review_trip_rating ON review_trip(rating);
CREATE INDEX IF NOT EXISTS idx_review_trip_created_at ON review_trip(created_at);

-- Disable RLS for testing
ALTER TABLE review_trip DISABLE ROW LEVEL SECURITY;
```

## Step 2: Check if you have users and booking_trip data

Run these queries to see what data you have:

```sql
-- Check users table
SELECT id, full_name, user_type FROM users WHERE user_type = 'client' LIMIT 5;

-- Check booking_trip table
SELECT id, destination FROM booking_trip LIMIT 5;
```

## Step 3: Insert sample reviews

After you have some users and booking_trip data, run this to insert sample reviews:

```sql
-- Insert sample reviews (replace the IDs with actual ones from your database)
INSERT INTO review_trip (
    booking_trip_id,
    client_id,
    rating,
    review_text,
    location,
    highlight,
    photos_count,
    avatar_url,
    location_image_url,
    is_verified
) VALUES 
(
    (SELECT id FROM booking_trip LIMIT 1),
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1),
    5,
    'CamIt made our dream wedding in Tuscany absolutely perfect! From the initial consultation to the final photo delivery, everything was seamless. Our photographer captured every precious moment beautifully, and the team handled all the logistics flawlessly. We couldn''t be happier with the results!',
    'Tuscany, Italy',
    'Wedding Photography',
    150,
    'https://images.unsplash.com/photo-1494790108755-2616c96c5e24?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 1),
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 1),
    5,
    'The family vacation photos from our Tokyo trip are absolutely stunning! CamIt connected us with a local photographer who knew all the best spots and timing. The cherry blossom shots are magazine-quality, and our kids loved the experience. Highly recommend for family trips!',
    'Tokyo, Japan',
    'Family Photography',
    85,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop&crop=center',
    true
);
```

## Step 4: Test the API

After setting up the table and inserting data, test the API:

```bash
curl -X GET "http://localhost:3000/api/reviews/trips?limit=6"
```

## Step 5: Check the frontend

Visit your book-trip page to see if the reviews are now displaying.

## Troubleshooting

If you still get errors:

1. **Check if the table exists:**
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'review_trip';
   ```

2. **Check if there are reviews:**
   ```sql
   SELECT COUNT(*) FROM review_trip;
   ```

3. **Check the API logs** in your Next.js development server for more detailed error messages.

4. **Verify your Supabase connection** by checking your environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ``` 