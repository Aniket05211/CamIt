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
  console.log("Received registration data:", JSON.stringify(data, null, 2))

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
  let insertedProfile = null; // Declare variable in proper scope
  
  if (data.user_type === "elite" || data.user_type === "realtime") {
    // Map the data from connect-with-us page to match photographer_profiles schema
    // Only include fields that are actually provided in the form
    const photographerProfile = {
      user_id: user.id,
      photographer_type: data.type || data.user_type, // Ensure we have a photographer type
      bio: data.bio || "",
      experience_years: data.experience_years || 0,
      hourly_rate: data.hourly_rate || 0,
      // Only include fields that exist in the database and are provided
      specializations: safeArray(data.specializations),
      equipment: safeArray(data.equipment),
      // Use Time_availibilty (note the typo in database column name) for time-based availability
      Time_availibilty: safeArray(data.availability),
      languages: safeArray(data.languages),
      awards: data.awards || "",
      celebrity_clients: data.celebrity_clients || "",
      location: data.location || "",
      // Set default values for required fields
      rating: 0,
      total_reviews: 0,
      is_available: true,
      is_verified: false,
      // Optional fields that might be provided
      ...(data.location_city && { location_city: data.location_city }),
      ...(data.location_state && { location_state: data.location_state }),
      ...(data.location_country && { location_country: data.location_country }),
      ...(data.daily_rate && { daily_rate: data.daily_rate }),
    }
    // Validate required fields
    if (!photographerProfile.user_id || !photographerProfile.photographer_type) {
      console.error("Missing required fields:", { user_id: photographerProfile.user_id, photographer_type: photographerProfile.photographer_type })
      return NextResponse.json({ 
        error: "Missing required fields for photographer profile",
        missingFields: {
          user_id: !photographerProfile.user_id,
          photographer_type: !photographerProfile.photographer_type
        }
      }, { status: 400 })
    }
    
    console.log("Inserting into photographer_profiles:", photographerProfile)
    const { data: profileData, error: profileError } = await supabase
      .from("photographer_profiles")
      .insert([photographerProfile])
      .select()
    
    if (profileError) {
      console.error("Photographer profile insert error:", profileError)
      console.error("Error details:", JSON.stringify(profileError, null, 2))
      return NextResponse.json({ 
        error: "Failed to create photographer profile", 
        details: profileError,
        attemptedData: photographerProfile 
      }, { status: 500 })
    }
    
    insertedProfile = profileData; // Assign to the outer scope variable
    console.log("Successfully inserted profile:", insertedProfile)
  } else if (data.user_type === "editor") {
    // Map the data from connect-with-us page to match editor_profiles schema
    const editorProfile = {
      user_id: user.id,
      project_rate: parseFloat(data.rate) || 0,
      hourly_rate: parseFloat(data.sampleRate) || 0,
      experience_years: parseInt(data.experience?.replace(/\D/g, '')) || 0,
      turnaround_time: parseInt(data.turnaround) || 24,
      bio: data.bio || "",
      specializations: safeArray(data.specialties),
      software_skills: safeArray(data.software),
      languages: safeArray(data.languages),
      availability_status: "available",
      rating: 0,
      total_reviews: 0,
      portfolio_urls: [], // Will be populated later
    }
    
    console.log("Inserting into editor_profiles:", editorProfile)
    const { data: profileData, error: profileError } = await supabase
      .from("editor_profiles")
      .insert([editorProfile])
      .select()
    
    if (profileError) {
      console.error("Editor profile insert error:", profileError)
      console.error("Error details:", JSON.stringify(profileError, null, 2))
      return NextResponse.json({ 
        error: "Failed to create editor profile", 
        details: profileError,
        attemptedData: editorProfile 
      }, { status: 500 })
    }
    
    insertedProfile = profileData;
    console.log("Successfully inserted editor profile:", insertedProfile)
  }

  return NextResponse.json({ 
    success: true, 
    user: { ...user, user_type: data.user_type },
    profile: insertedProfile ? insertedProfile[0] : null
  })
}
