import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    // Create users
    const users = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        email: "client1@example.com",
        full_name: "John Client",
        phone_number: "+1234567890",
        avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop",
        user_type: "client",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        email: "client2@example.com",
        full_name: "Sarah Client",
        phone_number: "+1234567891",
        avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        user_type: "client",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000003",
        email: "cameraman1@example.com",
        full_name: "Rahul Sharma",
        phone_number: "+1234567892",
        avatar_url: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
        user_type: "cameraman",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000004",
        email: "cameraman2@example.com",
        full_name: "Priya Patel",
        phone_number: "+1234567893",
        avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        user_type: "cameraman",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000005",
        email: "cameraman3@example.com",
        full_name: "Amit Kumar",
        phone_number: "+1234567894",
        avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop",
        user_type: "cameraman",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const { error: usersError } = await supabase.from("users").upsert(users)
    if (usersError) {
      console.error("Error inserting users:", usersError)
      return NextResponse.json({ error: "Failed to insert users" }, { status: 500 })
    }

    // Create cameraman profiles
    const cameramanProfiles = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        user_id: "00000000-0000-0000-0000-000000000003", // Rahul Sharma
        bio: "Professional photographer with over 8 years of experience specializing in weddings, events, and portrait photography.",
        equipment: "Canon EOS R5, 24-70mm f/2.8 GM",
        experience_years: 8,
        hourly_rate: 150,
        specialties: ["Wedding", "Portrait", "Events"],
        languages: ["English", "Hindi"],
        availability: ["Weekends", "Evenings"],
        location: "New Delhi, India",
        coordinates: [28.6139, 77.209],
        current_location: [28.6139, 77.209],
        is_available: true,
        is_verified: true,
        rating: 4.8,
        total_reviews: 24,
        awards: "Best Wedding Photographer 2022",
        celebrity_clients: "Local celebrities",
        cameraman_type: "elite",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        user_id: "00000000-0000-0000-0000-000000000004", // Priya Patel
        bio: "Fashion and commercial photographer with a keen eye for detail and composition.",
        equipment: "Sony A7 IV, Multiple Prime Lenses",
        experience_years: 6,
        hourly_rate: 200,
        specialties: ["Fashion", "Commercial", "Product"],
        languages: ["English", "Hindi", "Gujarati"],
        availability: ["Weekdays", "Weekends"],
        location: "Mumbai, India",
        coordinates: [19.076, 72.8777],
        current_location: [19.076, 72.8777],
        is_available: true,
        is_verified: true,
        rating: 4.9,
        total_reviews: 18,
        awards: null,
        celebrity_clients: null,
        cameraman_type: "elite",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000003",
        user_id: "00000000-0000-0000-0000-000000000005", // Amit Kumar
        bio: "Landscape and architectural photographer with a passion for capturing the beauty of spaces.",
        equipment: "Nikon Z7 II, 14-24mm f/2.8",
        experience_years: 10,
        hourly_rate: 180,
        specialties: ["Landscape", "Architecture", "Real Estate"],
        languages: ["English", "Hindi", "Punjabi"],
        availability: ["Weekdays", "Weekends"],
        location: "Bangalore, India",
        coordinates: [12.9716, 77.5946],
        current_location: [12.9716, 77.5946],
        is_available: false,
        is_verified: true,
        rating: 4.7,
        total_reviews: 15,
        awards: null,
        celebrity_clients: null,
        cameraman_type: "realtime",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const { error: profilesError } = await supabase.from("cameraman_profiles").upsert(cameramanProfiles)
    if (profilesError) {
      console.error("Error inserting cameraman profiles:", profilesError)
      return NextResponse.json({ error: "Failed to insert cameraman profiles" }, { status: 500 })
    }

    // Create portfolio images
    const portfolioImages = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        cameraman_id: "00000000-0000-0000-0000-000000000001", // Rahul Sharma
        image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2969&auto=format&fit=crop",
        title: "Wedding Ceremony",
        description: "Beautiful wedding ceremony at sunset",
        created_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        cameraman_id: "00000000-0000-0000-0000-000000000001", // Rahul Sharma
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2970&auto=format&fit=crop",
        title: "Family Portrait",
        description: "Family portrait session in the park",
        created_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000003",
        cameraman_id: "00000000-0000-0000-0000-000000000002", // Priya Patel
        image_url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2970&auto=format&fit=crop",
        title: "Fashion Shoot",
        description: "High-end fashion photography",
        created_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000004",
        cameraman_id: "00000000-0000-0000-0000-000000000002", // Priya Patel
        image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2124&auto=format&fit=crop",
        title: "Product Photography",
        description: "Luxury watch product shoot",
        created_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000005",
        cameraman_id: "00000000-0000-0000-0000-000000000003", // Amit Kumar
        image_url: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2833&auto=format&fit=crop",
        title: "Architectural Photography",
        description: "Modern building exterior",
        created_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000006",
        cameraman_id: "00000000-0000-0000-0000-000000000003", // Amit Kumar
        image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop",
        title: "Landscape Photography",
        description: "Mountain range at sunset",
        created_at: new Date().toISOString(),
      },
    ]

    const { error: portfolioError } = await supabase.from("portfolio_images").upsert(portfolioImages)
    if (portfolioError) {
      console.error("Error inserting portfolio images:", portfolioError)
      return NextResponse.json({ error: "Failed to insert portfolio images" }, { status: 500 })
    }

    // Create bookings
    const bookings = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        client_id: "00000000-0000-0000-0000-000000000001", // John Client
        cameraman_id: "00000000-0000-0000-0000-000000000001", // Rahul Sharma
        booking_date: "2025-05-20",
        booking_time: "14:00:00",
        duration_hours: 2,
        location: "Connaught Place",
        address: "Block K, Connaught Place, New Delhi, 110001",
        coordinates: [28.6329, 77.2195],
        price: 300,
        status: "confirmed",
        payment_status: "paid",
        payment_method: "Credit Card",
        special_requirements: "Outdoor shoot with natural lighting",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        client_id: "00000000-0000-0000-0000-000000000002", // Sarah Client
        cameraman_id: "00000000-0000-0000-0000-000000000002", // Priya Patel
        booking_date: "2025-05-25",
        booking_time: "10:00:00",
        duration_hours: 3,
        location: "Marine Drive",
        address: "Marine Drive, Mumbai, 400020",
        coordinates: [18.9442, 72.8228],
        price: 600,
        status: "pending",
        payment_status: "pending",
        payment_method: null,
        special_requirements: "Fashion shoot for a magazine",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "00000000-0000-0000-0000-000000000003",
        client_id: "00000000-0000-0000-0000-000000000001", // John Client
        cameraman_id: "00000000-0000-0000-0000-000000000003", // Amit Kumar
        booking_date: "2025-04-15",
        booking_time: "09:00:00",
        duration_hours: 4,
        location: "Cubbon Park",
        address: "Cubbon Park, Bangalore, 560001",
        coordinates: [12.9763, 77.5929],
        price: 720,
        status: "completed",
        payment_status: "paid",
        payment_method: "PayPal",
        special_requirements: "Real estate photography for a new property listing",
        created_at: "2025-04-10T10:00:00Z",
        updated_at: "2025-04-15T14:00:00Z",
      },
    ]

    const { error: bookingsError } = await supabase.from("bookings").upsert(bookings)
    if (bookingsError) {
      console.error("Error inserting bookings:", bookingsError)
      return NextResponse.json({ error: "Failed to insert bookings" }, { status: 500 })
    }

    // Create reviews
    const reviews = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        booking_id: "00000000-0000-0000-0000-000000000003", // Completed booking
        reviewer_id: "00000000-0000-0000-0000-000000000001", // John Client
        reviewee_id: "00000000-0000-0000-0000-000000000005", // Amit Kumar
        rating: 5,
        comment: "Excellent work! The photos of the property turned out amazing. Very professional and punctual.",
        created_at: "2025-04-16T09:00:00Z",
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        booking_id: "00000000-0000-0000-0000-000000000003", // Using same booking for demo
        reviewer_id: "00000000-0000-0000-0000-000000000002", // Sarah Client (demo purposes)
        reviewee_id: "00000000-0000-0000-0000-000000000005", // Amit Kumar
        rating: 4,
        comment: "Great architectural photography skills. Would recommend for real estate photography.",
        created_at: "2025-04-17T14:00:00Z",
      },
      {
        id: "00000000-0000-0000-0000-000000000003",
        booking_id: "00000000-0000-0000-0000-000000000001", // First booking
        reviewer_id: "00000000-0000-0000-0000-000000000001", // John Client
        reviewee_id: "00000000-0000-0000-0000-000000000003", // Rahul Sharma
        rating: 5,
        comment: "Amazing wedding photographer! Captured every moment beautifully. Highly recommended!",
        created_at: "2025-05-21T10:00:00Z",
      },
      {
        id: "00000000-0000-0000-0000-000000000004",
        booking_id: "00000000-0000-0000-0000-000000000002", // Second booking
        reviewer_id: "00000000-0000-0000-0000-000000000002", // Sarah Client
        reviewee_id: "00000000-0000-0000-0000-000000000004", // Priya Patel
        rating: 5,
        comment: "Outstanding fashion photography! The magazine shoot turned out perfect.",
        created_at: "2025-05-26T15:00:00Z",
      },
    ]

    const { error: reviewsError } = await supabase.from("reviews").upsert(reviews)
    if (reviewsError) {
      console.error("Error inserting reviews:", reviewsError)
      return NextResponse.json({ error: "Failed to insert reviews" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
