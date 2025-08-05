// Test script to check review_trip table and API
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testReviewTrip() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if review_trip table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'review_trip');
    
    console.log('Tables query result:', { tables, error: tableError });
    
    // Test 2: Try to select from review_trip
    const { data: reviews, error: reviewError } = await supabase
      .from('review_trip')
      .select('*')
      .limit(5);
    
    console.log('Reviews query result:', { 
      count: reviews?.length || 0, 
      error: reviewError,
      sample: reviews?.[0]
    });
    
    // Test 3: Check users table
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, full_name, user_type')
      .limit(5);
    
    console.log('Users query result:', { 
      count: users?.length || 0, 
      error: userError,
      sample: users?.[0]
    });
    
    // Test 4: Check booking_trip table
    const { data: bookings, error: bookingError } = await supabase
      .from('booking_trip')
      .select('id, destination')
      .limit(5);
    
    console.log('Bookings query result:', { 
      count: bookings?.length || 0, 
      error: bookingError,
      sample: bookings?.[0]
    });
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testReviewTrip(); 