import { supabase } from "./supabase/client"

export async function seedDatabase() {
  try {
    console.log("Seeding database...")

    // Check if users already exist
    const { data: existingUsers } = await supabase.from("users").select("id").limit(1)

    if (existingUsers && existingUsers.length > 0) {
      console.log("Database already seeded")
      return
    }

    // Create users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .insert([
        {
          id: "user-client-1",
          email: "client@example.com",
          full_name: "Ananya Desai",
          phone_number: "+91 98765 43210",
          avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          user_type: "client",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "user-cameraman-1",
          email: "cameraman1@example.com",
          full_name: "Rahul Sharma",
          phone_number: "+91 98765 12345",
          avatar_url: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
          user_type: "cameraman",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "user-cameraman-2",
          email: "cameraman2@example.com",
          full_name: "Priya Patel",
          phone_number: "+91 98765 67890",
          avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          user_type: "cameraman",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (usersError) {
      console.error("Error seeding users:", usersError)
      return
    }

    console.log("Users seeded:", users.length)

    // Create cameraman profiles
    const { data: cameramanProfiles, error: cameramanError } = await supabase
      .from("cameraman_profiles")
      .insert([
        {
          id: "cameraman-1",
          user_id: "user-cameraman-1",
          bio: "Professional photographer with 8 years of experience specializing in wedding and portrait photography.",
          equipment: "Canon EOS R5, 24-70mm f/2.8",
          experience_years: 8,
          hourly_rate: 150,
          specialties: ["Wedding", "Portrait", "Events"],
          languages: ["English", "Hindi"],
          availability: ["Weekends", "Evenings"],
          location: "Delhi, India",
          coordinates: [77.209, 28.6139],
          current_location: [77.209, 28.6139],
          is_available: true,
          is_verified: true,
          rating: 4.8,
          total_reviews: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          awards: "Best Wedding Photographer 2022",
          celebrity_clients: "Bollywood celebrities",
          cameraman_type: "elite",
        },
        {
          id: "cameraman-2",
          user_id: "user-cameraman-2",
          bio: "Fashion and commercial photographer with 6 years of experience.",
          equipment: "Sony A7 IV, Multiple Prime Lenses",
          experience_years: 6,
          hourly_rate: 200,
          specialties: ["Fashion", "Commercial", "Product"],
          languages: ["English", "Hindi", "Gujarati"],
          availability: ["Weekdays", "Weekends"],
          location: "Mumbai, India",
          coordinates: [72.8777, 19.076],
          current_location: [72.8777, 19.076],
          is_available: true,
          is_verified: true,
          rating: 4.9,
          total_reviews: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          awards: "Fashion Photography Award 2021",
          celebrity_clients: "Top models and designers",
          cameraman_type: "elite",
        },
      ])
      .select()

    if (cameramanError) {
      console.error("Error seeding cameraman profiles:", cameramanError)
      return
    }

    console.log("Cameraman profiles seeded:", cameramanProfiles.length)

    // Create portfolio images
    const { data: portfolioImages, error: portfolioError } = await supabase
      .from("portfolio_images")
      .insert([
        {
          cameraman_id: "cameraman-1",
          image_url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2000&auto=format&fit=crop",
          title: "Wedding Photography",
          created_at: new Date().toISOString(),
        },
        {
          cameraman_id: "cameraman-1",
          image_url: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?q=80&w=2000&auto=format&fit=crop",
          title: "Portrait Session",
          created_at: new Date().toISOString(),
        },
        {
          cameraman_id: "cameraman-1",
          image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop",
          title: "Corporate Event",
          created_at: new Date().toISOString(),
        },
        {
          cameraman_id: "cameraman-2",
          image_url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop",
          title: "Fashion Photography",
          created_at: new Date().toISOString(),
        },
        {
          cameraman_id: "cameraman-2",
          image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop",
          title: "Product Photography",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (portfolioError) {
      console.error("Error seeding portfolio images:", portfolioError)
      return
    }

    console.log("Portfolio images seeded:", portfolioImages.length)

    // Create bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .insert([
        {
          id: "booking-1",
          client_id: "user-client-1",
          cameraman_id: "cameraman-1",
          booking_date: "2023-06-15",
          booking_time: "14:00:00",
          duration_hours: 3,
          location: "Delhi, India",
          address: "123 Main St, Delhi",
          coordinates: [77.209, 28.6139],
          price: 450,
          status: "completed",
          payment_status: "paid",
          payment_method: "credit_card",
          special_requirements: "Outdoor photoshoot",
          created_at: "2023-05-01T10:00:00Z",
          updated_at: "2023-06-16T18:00:00Z",
        },
        {
          id: "booking-2",
          client_id: "user-client-1",
          cameraman_id: "cameraman-2",
          booking_date: "2023-07-20",
          booking_time: "10:00:00",
          duration_hours: 2,
          location: "Mumbai, India",
          address: "456 Park Ave, Mumbai",
          coordinates: [72.8777, 19.076],
          price: 400,
          status: "confirmed",
          payment_status: "pending",
          payment_method: null,
          special_requirements: "Indoor studio session",
          created_at: "2023-06-10T15:30:00Z",
          updated_at: "2023-06-11T09:00:00Z",
        },
      ])
      .select()

    if (bookingsError) {
      console.error("Error seeding bookings:", bookingsError)
      return
    }

    console.log("Bookings seeded:", bookings.length)

    // Create reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .insert([
        {
          booking_id: "booking-1",
          client_id: "user-client-1",
          cameraman_id: "cameraman-1",
          rating: 5,
          comment: "Rahul was amazing! He captured our wedding beautifully and was very professional.",
          created_at: "2023-06-16T10:30:00Z",
        },
        {
          booking_id: "booking-2",
          client_id: "user-client-1",
          cameraman_id: "cameraman-2",
          rating: 4,
          comment: "Great photographer, would recommend for any event.",
          created_at: "2023-07-21T14:15:00Z",
        },
      ])
      .select()

    if (reviewsError) {
      console.error("Error seeding reviews:", reviewsError)
      return
    }

    console.log("Reviews seeded:", reviews.length)

    // Create messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .insert([
        {
          booking_id: "booking-1",
          sender_id: "user-client-1",
          receiver_id: "user-cameraman-1",
          message: "Hi, I'm looking forward to our session!",
          is_read: true,
          created_at: "2023-06-10T10:00:00Z",
        },
        {
          booking_id: "booking-1",
          sender_id: "user-cameraman-1",
          receiver_id: "user-client-1",
          message: "Me too! I'll bring all the equipment we discussed.",
          is_read: true,
          created_at: "2023-06-10T10:15:00Z",
        },
      ])
      .select()

    if (messagesError) {
      console.error("Error seeding messages:", messagesError)
      return
    }

    console.log("Messages seeded:", messages.length)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
