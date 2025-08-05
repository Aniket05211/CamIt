import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()

    console.log("Fetching cameraman data for ID:", id)

    // Get user data
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

    if (userError) {
      console.error("User fetch error:", userError)
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
          details: userError.message,
        },
        { status: 404 },
      )
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      )
    }

    console.log("Found user:", user.email)

    // Get cameraman profile
    let profile = null
    if (user.user_type === "elite") {
      const { data: profileData, error: profileError } = await supabase
        .from("photographer_profiles")
        .select("*")
        .eq("user_id", id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile fetch error:", profileError)
      }

      if (profileData) {
        profile = profileData
        console.log("Found profile for user")
      } else {
        console.log("No profile found, creating default profile")
        // Create default profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("photographer_profiles")
          .insert({
            user_id: id,
            bio: "Professional photographer with years of experience",
            experience_years: 5,
            hourly_rate: 150,
            location: user.location || "New York, NY",
            specialties: ["Wedding", "Portrait", "Event"],
            equipment: ["Canon EOS R5", "Sony A7R IV", "Professional Lighting"],
            portfolio_images: [
              "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2787&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2969&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2970&auto=format&fit=crop",
            ],
            availability: true,
            rating: 4.8,
            total_reviews: 24,
            languages: ["English", "Spanish"],
            awards: "Best Wedding Photographer 2023",
            celebrity_clients: "Various local celebrities and influencers",
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
        } else {
          profile = newProfile
          console.log("Created new profile")
        }
      }
    }

    // Get all bookings for the photographer (for stats)
    const { data: allBookings, error: allBookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("photographer_id", id)
      .order("created_at", { ascending: false })

    console.log("All bookings for photographer:", {
      totalBookings: allBookings?.length || 0,
      error: allBookingsError
    })

    // Get completed bookings with successful payments for photographer (upcoming events)
    const { data: acceptedBookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("photographer_id", id)
      .eq("status", "completed")
      .eq("payment_status", "success") // Only bookings with successful payments
      .gte("event_date", new Date().toISOString().split('T')[0]) // Only future events
      .order("event_date", { ascending: true })

    if (bookingsError) {
      console.error("Accepted bookings fetch error:", bookingsError)
    }

    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select(`
        *,
        reviewer:reviewer_id(id, full_name, profile_image_url),
        booking:booking_id(id, title, event_date)
      `)
      .eq("reviewee_id", id)
      .order("created_at", { ascending: false })
      .limit(5)

    if (reviewsError) {
      console.error("Reviews fetch error:", reviewsError)
    }



    // Get portfolio images
    const { data: portfolioImages, error: portfolioError } = await supabase
      .from("portfolio_images")
      .select("*")
      .eq("photographer_id", profile?.id) // Use the profile ID, not the user ID
      .order("created_at", { ascending: false })

    if (portfolioError) {
      console.error("Portfolio images fetch error:", portfolioError)
    }

    // Calculate average rating from reviews
    const averageRating = reviews && reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : profile?.rating || 4.5

    console.log("User data from database:", user)
    console.log("Profile data from database:", profile)
    
    // Transform data for dashboard
    const dashboardData = {
      name: user.full_name || user.email?.split("@")[0] || "Unknown",
      email: user.email || "",
      phone: user.phone_number || "",
      profile_image_url: user.profile_image_url || "", // Add profile image URL from users table
      location: profile?.location || user.location || "Not specified",
      experience_years: profile?.experience_years || 0,
      hourly_rate: profile?.hourly_rate || 0,
      specialties: profile?.specialties || [],
      equipment: Array.isArray(profile?.equipment) ? profile.equipment.join(", ") : profile?.equipment || "",
      bio: profile?.bio || user.bio || "", // Use bio from profile or users table
      languages: profile?.languages || [],
      availability: profile?.availability || [],
      awards: profile?.awards || "",
      celebrity_clients: profile?.celebrity_clients || "",
      portfolio: profile?.portfolio_images || [],
      portfolio_images: portfolioImages?.map(img => img.image_url) || [],
      instagram_handle: profile?.instagram_handle || "",
      twitter_handle: profile?.twitter_handle || "",
      facebook_handle: profile?.facebook_handle || "",
      upcoming_events: (acceptedBookings || []).map((booking) => ({
        id: booking.id,
        title: booking.title || "Event",
        date: booking.event_date,
        location: booking.location_address || "TBD",
        type: booking.event_type || "Event",
        client_name: booking.client_name || "Client",
        client_email: booking.client_email || "",
        client_phone: booking.client_phone || "",
        duration_hours: booking.duration_hours || 0,
        final_price: booking.final_price || 0,
        payment_status: booking.payment_status || "pending",
        description: booking.description || "",
        special_requirements: booking.special_requirements || "",
        event_type: booking.event_type || "",
        shoot_purpose: booking.shoot_purpose || "",
        preferred_style: booking.preferred_style || "",
        equipment_needed: booking.equipment_needed || "",
        estimated_guests: booking.estimated_guests || 0,
        venue_details: booking.venue_details || "",
        celebrity_name: booking.celebrity_name || "",
        privacy_level: booking.privacy_level || "",
        makeup_artist: booking.makeup_artist || false,
        stylist: booking.stylist || false,
        security_needed: booking.security_needed || false,
        media_coverage: booking.media_coverage || false,
        exclusive_rights: booking.exclusive_rights || false,
        contact_preference: booking.contact_preference || "email",
      })),
      recent_reviews: (reviews || []).map((review) => ({
        id: review.id,
        reviewer: {
          id: review.reviewer?.id || "",
          full_name: review.reviewer?.full_name || "Anonymous",
          profile_image_url: review.reviewer?.profile_image_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3`,
        },
        rating: review.rating || 5,
        comment: review.comment || "Great service!",
        created_at: review.created_at ? new Date(review.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        booking_title: review.booking?.title || "Event",
        event_date: review.booking?.event_date || "",
      })),
      earnings: {
        total: 15000,
        thisMonth: 3500,
        lastMonth: 2800,
      },
      stats: {
        totalBookings: allBookings?.length || 0,
        completedEvents: allBookings?.filter((booking) => booking.status === "completed")?.length || 0,
        cancelledEvents: allBookings?.filter((booking) => booking.status === "cancelled")?.length || 0,
        averageRating: averageRating,
        successfulPayments: allBookings?.filter((booking) => booking.payment_status === "success")?.length || 0,
      },
      rating: averageRating,
      cameraman_type: profile?.cameraman_type || "elite",
      is_available: profile?.is_available || false,
    }

    console.log("Dashboard data being returned:", dashboardData)
    console.log("Returning dashboard data")

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    console.error("Get cameraman error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params // <-- Await here
    const updates = await request.json()
    const supabase = await createServiceClient()

    console.log("Updating cameraman profile:", updates)

    // Update user data if provided
    if (updates.full_name || updates.phone_number) {
      const userUpdates: any = {}
      if (updates.full_name) userUpdates.full_name = updates.full_name
      if (updates.phone_number) userUpdates.phone_number = updates.phone_number

      const { error: userError } = await supabase
        .from("users")
        .update({
          ...userUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (userError) {
        console.error("User update error:", userError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update user",
            details: userError.message,
          },
          { status: 500 },
        )
      }
    }

    // Update profile data
    const profileUpdates: any = {}
    if (updates.bio) profileUpdates.bio = updates.bio
    if (updates.equipment) profileUpdates.equipment = updates.equipment.split(", ")
    if (updates.hourly_rate) profileUpdates.hourly_rate = Number.parseFloat(updates.hourly_rate)
    if (updates.location) profileUpdates.location = updates.location
    if (updates.celebrity_clients) profileUpdates.celebrity_clients = updates.celebrity_clients
    if (updates.awards) profileUpdates.awards = updates.awards
    if (updates.experience_years) profileUpdates.experience_years = updates.experience_years
    if (updates.languages) profileUpdates.languages = updates.languages
    if (updates.instagram_handle) profileUpdates.instagram_handle = updates.instagram_handle
    if (updates.twitter_handle) profileUpdates.twitter_handle = updates.twitter_handle
    if (updates.facebook_handle) profileUpdates.facebook_handle = updates.facebook_handle

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from("photographer_profiles")
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", id)

      if (profileError) {
        console.error("Profile update error:", profileError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update profile",
            details: profileError.message,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
    })
  } catch (error) {
    console.error("Update cameraman error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const updates = await request.json()
    const supabase = await createServiceClient()

    console.log("Updating availability for cameraman:", id, updates)

    // Update availability in photographer profile
    const profileUpdates: any = {}
    if (updates.is_available !== undefined) {
      profileUpdates.is_available = updates.is_available
      // Remove availability_status update to avoid constraint violations
      // profileUpdates.availability_status = updates.is_available ? "available" : "not_available"
    }

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from("photographer_profiles")
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", id)

      if (profileError) {
        console.error("Profile update error:", profileError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update availability",
            details: profileError.message,
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
    })
  } catch (error) {
    console.error("Update availability error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
