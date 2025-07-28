import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

function safeArray(val: any) {
  return Array.isArray(val) ? val : [];
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Await cookies() for the async API
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Look up the session in user_sessions table (plural)
  const { data: sessionData, error: sessionError } = await supabase
    .from("user_sessions")
    .select("user_id")
    .eq("session_token", token)
    .single()

  if (sessionError || !sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 3. Get the user by user_id from users table (plural)
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", sessionData.user_id)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 })
  }

  // 4. Parse the body
  const data = await req.json()

  // 5. Update user type in users table
  const { data: updatedUser, error: updateError } = await supabase
    .from("users")
    .update({ user_type: data.user_type })
    .eq("id", user.id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: "Failed to update user type" }, { status: 500 })
  }

  // 6. Insert into the correct profile table
  if (data.user_type === "elite" || data.user_type === "realtime") {
    const photographerProfile = {
      user_id: user.id,
      photographer_type: data.type,
      bio: data.bio ?? null,
      experience_years: data.experience_years ?? null,
      hourly_rate: data.hourly_rate ?? null,
      daily_rate: data.daily_rate ?? null,
      specializations: safeArray(data.specializations),
      equipment: safeArray(data.equipment),
      portfolio_urls: safeArray(data.portfolio_urls),
      availability_status: data.availability_status ?? "available",
      rating: data.rating ?? 0.0,
      total_reviews: data.total_reviews ?? 0,
      location_city: data.location_city ?? null,
      location_state: data.location_state ?? null,
      location_country: data.location_country ?? null,
      travel_radius: data.travel_radius ?? null,
      languages: safeArray(data.languages),
      certifications: safeArray(data.certifications),
      availability: safeArray(data.availability),
      awards: data.awards ?? null,
      celebrity_clients: data.celebrity_clients ?? null,
      portfolio: safeArray(data.portfolio),
      is_available: data.is_available ?? true,
      is_verified: data.is_verified ?? false,
      location: data.location ?? null,
      specialties: safeArray(data.specialties),
    }
    console.log("Inserting into photographer_profiles:", photographerProfile)
    const { error: profileError } = await supabase
      .from("photographer_profiles")
      .insert([photographerProfile])
    if (profileError) {
      console.error("Photographer profile insert error:", profileError)
      return NextResponse.json({ error: "Failed to create photographer profile", details: profileError }, { status: 500 })
    }
  } else if (data.user_type === "editor") {
    // TODO: Update this object to match your editor_profiles schema!
    const editorProfile = {
      user_id: user.id,
      // ...add only fields that exist in your editor_profiles table...
    }
    console.log("Inserting into editor_profiles:", editorProfile)
    const { error: profileError } = await supabase
      .from("editor_profiles")
      .insert([editorProfile])
    if (profileError) {
      console.error("Editor profile insert error:", profileError)
      return NextResponse.json({ error: "Failed to create editor profile", details: profileError }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, user: { ...user, user_type: data.user_type } })
}
