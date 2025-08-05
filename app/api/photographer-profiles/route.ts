import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const {
      user_id,
      experience_years,
      hourly_rate,
      daily_rate,
      bio,
      specializations,
      equipment,
      location,
      location_city,
      location_state,
      location_country,
      languages,
      availability,
      awards,
      celebrity_clients,
      photographer_type,
      is_available,
      rating,
      total_reviews,
    } = await request.json()

    if (!user_id || !photographer_type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    // Check if profile already exists for this user
    const { data: existingProfile, error: checkError } = await supabase
      .from("photographer_profiles")
      .select("id")
      .eq("user_id", user_id)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing profile:", checkError)
      return NextResponse.json(
        { success: false, error: "Failed to check existing profile" },
        { status: 500 }
      )
    }

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: "Profile already exists for this user" },
        { status: 400 }
      )
    }

    // Create new photographer profile
    const { data: profile, error: insertError } = await supabase
      .from("photographer_profiles")
      .insert({
        user_id,
        experience_years: experience_years || 0,
        hourly_rate: hourly_rate || 0,
        daily_rate: daily_rate || 0,
        bio: bio || "",
        specializations: specializations || [],
        equipment: equipment || [],
        location: location || "",
        location_city: location_city || "",
        location_state: location_state || "",
        location_country: location_country || "",
        languages: languages || [],
        availability: availability || [],
        awards: awards || "",
        celebrity_clients: celebrity_clients || "",
        photographer_type,
        is_available: is_available !== undefined ? is_available : true,
        rating: rating || 0,
        total_reviews: total_reviews || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating photographer profile:", insertError)
      return NextResponse.json(
        { success: false, error: "Failed to create photographer profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error("Photographer profile creation error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")
    const photographer_type = searchParams.get("photographer_type")

    const supabase = await createServiceClient()

    let query = supabase.from("photographer_profiles").select("*")

    if (user_id) {
      query = query.eq("user_id", user_id)
    }

    if (photographer_type) {
      query = query.eq("photographer_type", photographer_type)
    }

    const { data: profiles, error } = await query

    if (error) {
      console.error("Error fetching photographer profiles:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch photographer profiles" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: profiles,
    })
  } catch (error) {
    console.error("Photographer profile fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 