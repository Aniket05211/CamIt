import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // or ".env.local"

import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing from environment variables.");
}

// Create the Supabase client here
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function seedDatabase() {
  console.log('Seeding database...');

  // Delete from all related tables before deleting users
  await supabase.from('photographer_profiles').delete().neq('id', '');
  await supabase.from('editor_profiles').delete().neq('id', '');
  await supabase.from('user_sessions').delete().neq('id', '');
  await supabase.from('bookings').delete().neq('id', '');
  await supabase.from('reviews').delete().neq('id', '');
  await supabase.from('messages').delete().neq('id', '');
  await supabase.from('payments').delete().neq('id', '');
  await supabase.from('notifications').delete().neq('id', '');
  await supabase.from('users').delete().neq('id', '');

  // Create users
  const users = [
    {
      id: uuidv4(),
      email: 'client1@example.com',
      password_hash: 'dummy-hash-for-testing',
      full_name: 'John Client',
      phone_number: '+1234567890',
      user_type: 'client'
    },
    {
      id: uuidv4(),
      email: 'client2@example.com',
      password_hash: 'dummy-hash-for-testing',
      full_name: 'Sarah Client',
      phone_number: '+1234567891',
      user_type: 'client'
    },
    {
      id: uuidv4(),
      email: 'photographer1@example.com',
      password_hash: 'dummy-hash-for-testing',
      full_name: 'Rahul Sharma',
      phone_number: '+1234567892',
      user_type: 'photographer'
    },
    {
      id: uuidv4(),
      email: 'photographer2@example.com',
      password_hash: 'dummy-hash-for-testing',
      full_name: 'Priya Patel',
      phone_number: '+1234567893',
      user_type: 'photographer'
    },
    {
      id: uuidv4(),
      email: 'photographer3@example.com',
      password_hash: 'dummy-hash-for-testing',
      full_name: 'Amit Kumar',
      phone_number: '+1234567894',
      user_type: 'photographer'
    }
  ];

  // Insert users only if they don't already exist
  for (const user of users) {
    const { data: existing, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!existing) {
      const { error: insertError } = await supabase.from('users').insert(user);
      if (insertError) {
        console.error(`Error inserting user ${user.email}:`, insertError);
      }
    } else {
      console.log(`User with email ${user.email} already exists, skipping.`);
    }
  }

  console.log('Users created successfully');

  // Fetch user IDs from DB by email
  const photographer1 = await supabase.from('users').select('id').eq('email', 'photographer1@example.com').single();
  const photographer2 = await supabase.from('users').select('id').eq('email', 'photographer2@example.com').single();
  const photographer3 = await supabase.from('users').select('id').eq('email', 'photographer3@example.com').single();

  // Create photographer profiles
  const photographerProfiles = [
    {
      id: uuidv4(),
      user_id: photographer1.data?.id,
      bio: 'Professional photographer with over 8 years of experience specializing in weddings, events, and portrait photography.',
      equipment: ['Canon EOS R5', '24-70mm f/2.8 GM'],
      experience_years: 8,
      hourly_rate: 150,
      specialties: ['Wedding', 'Portrait', 'Events'],
      languages: ['English', 'Hindi'],
      availability: ['Weekends', 'Evenings'],
      location: 'New Delhi, India',
      photographer_type: 'elite',
      is_available: true,
      is_verified: true,
      rating: 4.8,
      total_reviews: 24,
      awards: 'Best Wedding Photographer 2022',
      celebrity_clients: 'Local celebrities',
      portfolio: [],
    },
    {
      id: uuidv4(),
      user_id: photographer2.data?.id,
      bio: 'Fashion and commercial photographer with a keen eye for detail and composition.',
      equipment: ['Sony A7 IV', 'Multiple Prime Lenses'],
      experience_years: 6,
      hourly_rate: 200,
      specialties: ['Fashion', 'Commercial', 'Product'],
      languages: ['English', 'Hindi', 'Gujarati'],
      availability: ['Weekdays', 'Weekends'],
      location: 'Mumbai, India',
      photographer_type: 'elite',
      is_available: true,
      is_verified: true,
      rating: 4.9,
      total_reviews: 18,
      awards: null,
      celebrity_clients: null,
      portfolio: [],
    },
    {
      id: uuidv4(),
      user_id: photographer3.data?.id,
      bio: 'Landscape and architectural photographer with a passion for capturing the beauty of spaces.',
      equipment: ['Nikon Z7 II', '14-24mm f/2.8'],
      experience_years: 10,
      hourly_rate: 180,
      specialties: ['Landscape', 'Architecture', 'Real Estate'],
      languages: ['English', 'Hindi', 'Punjabi'],
      availability: ['Weekdays', 'Weekends'],
      location: 'Bangalore, India',
      photographer_type: 'realtime',
      is_available: false,
      is_verified: true,
      rating: 4.7,
      total_reviews: 15,
      awards: null,
      celebrity_clients: null,
      portfolio: [],
    }
  ];

  // Insert photographer profiles only if they don't already exist for the user_id
  for (const profile of photographerProfiles) {
    const { data: existing, error: selectError } = await supabase
      .from('photographer_profiles')
      .select('id')
      .eq('user_id', profile.user_id)
      .single();

    if (!existing) {
      const { error: insertError } = await supabase.from('photographer_profiles').insert(profile);
      if (insertError) {
        console.error(`Error inserting photographer profile for user_id ${profile.user_id}:`, insertError);
      }
    } else {
      console.log(`Photographer profile for user_id ${profile.user_id} already exists, skipping.`);
    }
  }

  console.log('Photographer profiles created successfully');

  // Fetch photographer profile IDs from DB by user_id
  const photographerProfile1 = await supabase.from('photographer_profiles').select('id').eq('user_id', photographer1.data?.id).single();
  const photographerProfile2 = await supabase.from('photographer_profiles').select('id').eq('user_id', photographer2.data?.id).single();
  const photographerProfile3 = await supabase.from('photographer_profiles').select('id').eq('user_id', photographer3.data?.id).single();

  if (!photographerProfile1.data || !photographerProfile2.data || !photographerProfile3.data) {
    console.error('One or more photographer profiles not found in the database. Skipping portfolio image insertion.');
    return;
  }

  // Create portfolio images for each photographer
  const portfolioImages = [
    {
      photographer_id: photographerProfile1.data!.id,
      image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2969&auto=format&fit=crop',
      title: 'Wedding Ceremony',
      description: 'Beautiful wedding ceremony at sunset'
    },
    {
      photographer_id: photographerProfile1.data!.id,
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2970&auto=format&fit=crop',
      title: 'Family Portrait',
      description: 'Family portrait session in the park'
    },
    {
      photographer_id: photographerProfile1.data!.id,
      image_url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2970&auto=format&fit=crop',
      title: 'Corporate Event',
      description: 'Annual corporate event photography'
    },
    // Add more images for other photographers as needed
  ];

  const { error: imagesError } = await supabase.from('portfolio_images').insert(portfolioImages);
  if (imagesError) {
    console.error('Error inserting portfolio images:', imagesError);
    return;
  }

  console.log('Portfolio images created successfully');
} // Close the seedDatabase function

// Call the seed function
seedDatabase();