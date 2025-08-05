-- Insert sample reviews into review_trip table
-- Run this in your Supabase SQL editor

-- First, let's check what users and booking_trip data we have
SELECT 'Users count:' as info, COUNT(*) as count FROM users WHERE user_type = 'client'
UNION ALL
SELECT 'Booking trips count:' as info, COUNT(*) as count FROM booking_trip;

-- Insert sample reviews
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
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 2),
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 2),
    5,
    'The Northern Lights photography tour exceeded all expectations! CamIt''s team was incredibly professional and knowledgeable. They knew exactly when and where to capture the aurora, and the results are breathtaking. Worth every penny for this once-in-a-lifetime experience.',
    'Iceland',
    'Adventure Photography',
    120,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531168556467-80aace4d0144?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 3),
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 3),
    5,
    'Our anniversary trip to Bali was made even more special by CamIt''s photography service. The photographer was creative, professional, and made us feel comfortable throughout the shoot. The sunset beach photos are absolutely gorgeous, and we''ll treasure them forever.',
    'Bali, Indonesia',
    'Couple Photography',
    95,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 4),
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 4),
    4,
    'Great experience overall! The photographer was knowledgeable about local customs and got some amazing shots in the markets and desert. Communication was excellent, and the final photos captured the essence of Morocco beautifully. Minor delay in delivery but quality made up for it.',
    'Morocco',
    'Cultural Photography',
    110,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop&crop=center',
    true
),
(
    (SELECT id FROM booking_trip LIMIT 1 OFFSET 5),
    (SELECT id FROM users WHERE user_type = 'client' LIMIT 1 OFFSET 5),
    5,
    'CamIt turned our girls'' trip into a professional photoshoot experience! The photographer was fun, creative, and knew all the Instagram-worthy spots. We felt like models for a day, and the photos are absolutely stunning. Already planning our next trip with them!',
    'Santorini, Greece',
    'Lifestyle Photography',
    200,
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&h=200&fit=crop&crop=center',
    true
);

-- Verify the reviews were inserted
SELECT 
    rt.id,
    rt.rating,
    rt.review_text,
    rt.location,
    rt.highlight,
    rt.is_verified,
    u.full_name as client_name
FROM review_trip rt
LEFT JOIN users u ON rt.client_id = u.id
ORDER BY rt.created_at DESC; 