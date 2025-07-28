import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
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

    // Get events for photographer
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("cameraman_id", id)
      .order("event_date", { ascending: true })

    if (eventsError) {
      console.error("Events fetch error:", eventsError)
    }

    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .order("created_at", { ascending: false })
      .limit(5)

    if (reviewsError) {
      console.error("Reviews fetch error:", reviewsError)
    }

    // Transform data for dashboard
    const dashboardData = {
      name: user.full_name || user.email?.split("@")[0] || "Unknown",
      email: user.email || "",
      phone: user.phone_number || "",
      location: profile?.location || user.location || "Not specified",
      experience_years: profile?.experience_years || 0,
      hourly_rate: profile?.hourly_rate || 0,
      specialties: profile?.specialties || [],
      equipment: Array.isArray(profile?.equipment) ? profile.equipment.join(", ") : profile?.equipment || "",
      bio: profile?.bio || "",
      languages: profile?.languages || [],
      availability: profile?.availability || [],
      awards: profile?.awards || "",
      celebrity_clients: profile?.celebrity_clients || "",
      portfolio: profile?.portfolio_images || [],
      upcoming_events: (events || []).map((event) => ({
        id: event.id,
        title: event.event_name || event.title || "Event",
        date: event.event_date || event.date,
        location: event.location || "TBD",
        type: event.event_type || event.type || "Event",
      })),
      recent_reviews: (reviews || []).map((review) => ({
        id: review.id,
        name: review.reviewer_name || "Anonymous",
        rating: review.rating || 5,
        comment: review.comment || "Great service!",
        date: review.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3`,
      })),
      earnings: {
        total: 15000,
        thisMonth: 3500,
        lastMonth: 2800,
      },
      stats: {
        totalBookings: events?.length || 0,
        completedEvents: events?.filter((e) => e.status === "completed")?.length || 0,
        cancelledEvents: events?.filter((e) => e.status === "cancelled")?.length || 0,
        averageRating: profile?.rating || 4.5,
      },
      rating: profile?.rating || 4.5,
      cameraman_type: profile?.cameraman_type || "elite",
    }

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

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
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
