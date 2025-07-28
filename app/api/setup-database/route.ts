import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    console.log("=== Setting up database tables ===")
    const supabase = await createServiceClient()

    // Create users table
    const { error: usersError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(255),
          phone_number VARCHAR(20),
          user_type VARCHAR(50) DEFAULT 'client',
          location VARCHAR(255),
          profile_image_url TEXT,
          is_verified BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (usersError) {
      console.error("Users table error:", usersError)
    } else {
      console.log("✓ Users table created/verified")
    }

    // Create cameraman_profiles table
    const { error: profilesError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS cameraman_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          bio TEXT,
          experience_years INTEGER DEFAULT 0,
          hourly_rate DECIMAL(10,2) DEFAULT 0,
          location VARCHAR(255),
          specialties TEXT[] DEFAULT '{}',
          equipment TEXT[] DEFAULT '{}',
          portfolio_images TEXT[] DEFAULT '{}',
          availability BOOLEAN DEFAULT true,
          rating DECIMAL(3,2) DEFAULT 0,
          total_reviews INTEGER DEFAULT 0,
          languages TEXT[] DEFAULT '{}',
          awards TEXT,
          celebrity_clients TEXT,
          cameraman_type VARCHAR(50) DEFAULT 'elite',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (profilesError) {
      console.error("Profiles table error:", profilesError)
    } else {
      console.log("✓ Cameraman profiles table created/verified")
    }

    // Create events table
    const { error: eventsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          cameraman_id UUID REFERENCES users(id) ON DELETE CASCADE,
          client_id UUID REFERENCES users(id) ON DELETE CASCADE,
          event_name VARCHAR(255) NOT NULL,
          event_date DATE NOT NULL,
          event_time TIME,
          location VARCHAR(255),
          event_type VARCHAR(100),
          status VARCHAR(50) DEFAULT 'upcoming',
          price DECIMAL(10,2),
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (eventsError) {
      console.error("Events table error:", eventsError)
    } else {
      console.log("✓ Events table created/verified")
    }

    // Create reviews table
    const { error: reviewsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          cameraman_id UUID REFERENCES users(id) ON DELETE CASCADE,
          client_id UUID REFERENCES users(id) ON DELETE CASCADE,
          event_id UUID REFERENCES events(id) ON DELETE CASCADE,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          reviewer_name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (reviewsError) {
      console.error("Reviews table error:", reviewsError)
    } else {
      console.log("✓ Reviews table created/verified")
    }

    // Insert test user and profile
    console.log("=== Creating test user ===")

    const testUserId = "550e8400-e29b-41d4-a716-446655440000"

    // Insert test user
    const { error: insertUserError } = await supabase.from("users").upsert({
      id: testUserId,
      email: "test@cameraman.com",
      password_hash: "$2a$10$dummy.hash.for.testing",
      full_name: "John Smith",
      phone_number: "+1-555-0123",
      user_type: "photographer",
      location: "New York, NY",
      is_verified: true,
    })

    if (insertUserError) {
      console.error("Error inserting test user:", insertUserError)
    } else {
      console.log("✓ Test user created")
    }

    // Insert test profile
    const { error: insertProfileError } = await supabase.from("cameraman_profiles").upsert({
      user_id: testUserId,
      bio: "Professional photographer with 8+ years of experience specializing in weddings, portraits, and corporate events. I capture moments that tell your unique story.",
      experience_years: 8,
      hourly_rate: 200,
      location: "New York, NY",
      specialties: ["Wedding", "Portrait", "Corporate", "Event"],
      equipment: ["Canon EOS R5", "Sony A7R IV", "Professional Lighting Kit", "Drone Photography"],
      portfolio_images: [
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2787&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2969&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2970&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2787&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2787&auto=format&fit=crop",
      ],
      availability: true,
      rating: 4.9,
      total_reviews: 47,
      languages: ["English", "Spanish", "French"],
      awards: "Best Wedding Photographer 2023, NYC Photography Awards Winner",
      celebrity_clients: "Various local celebrities, influencers, and corporate executives",
      cameraman_type: "elite",
    })

    if (insertProfileError) {
      console.error("Error inserting test profile:", insertProfileError)
    } else {
      console.log("✓ Test profile created")
    }

    // Insert test events
    const testEvents = [
      {
        cameraman_id: testUserId,
        event_name: "Sarah & Mike Wedding",
        event_date: "2024-02-15",
        location: "Central Park, NYC",
        event_type: "Wedding",
        status: "upcoming",
        price: 2500,
      },
      {
        cameraman_id: testUserId,
        event_name: "Corporate Headshots",
        event_date: "2024-02-20",
        location: "Manhattan Office",
        event_type: "Corporate",
        status: "upcoming",
        price: 800,
      },
      {
        cameraman_id: testUserId,
        event_name: "Birthday Party",
        event_date: "2024-02-25",
        location: "Brooklyn",
        event_type: "Event",
        status: "upcoming",
        price: 600,
      },
    ]

    for (const event of testEvents) {
      const { error: eventError } = await supabase.from("events").upsert(event)

      if (eventError) {
        console.error("Error inserting event:", eventError)
      }
    }
    console.log("✓ Test events created")

    // Insert test reviews
    const testReviews = [
      {
        cameraman_id: testUserId,
        rating: 5,
        comment:
          "Absolutely amazing work! John captured our wedding perfectly. Every shot was beautiful and the editing was flawless.",
        reviewer_name: "Emily Johnson",
      },
      {
        cameraman_id: testUserId,
        rating: 5,
        comment:
          "Professional, punctual, and incredibly talented. The corporate headshots came out better than expected!",
        reviewer_name: "David Chen",
      },
      {
        cameraman_id: testUserId,
        rating: 4,
        comment: "Great photographer with excellent equipment. Very satisfied with the event coverage.",
        reviewer_name: "Maria Rodriguez",
      },
    ]

    for (const review of testReviews) {
      const { error: reviewError } = await supabase.from("reviews").upsert(review)

      if (reviewError) {
        console.error("Error inserting review:", reviewError)
      }
    }
    console.log("✓ Test reviews created")

    console.log("=== Database setup complete ===")
    console.log(`Test user ID: ${testUserId}`)
    console.log("You can now test the dashboard with this user ID")

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
      testUserId: testUserId,
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
