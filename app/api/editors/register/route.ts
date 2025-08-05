import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const data = await request.json()

    console.log("Editor registration data:", data)

    // Validate required fields
    if (!data.email || !data.name || !data.phone || !data.type) {
      return NextResponse.json({ 
        error: "Missing required fields: email, name, phone, type" 
      }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id, email, user_type")
      .eq("email", data.email)
      .single()

    if (existingUser) {
      if (existingUser.user_type === "editor") {
        return NextResponse.json({ 
          error: "An editor account already exists with this email" 
        }, { status: 409 })
      } else {
        // Update existing user to editor type
        const { error: updateError } = await supabase
          .from("users")
          .update({ 
            user_type: "editor",
            full_name: data.name,
            phone_number: data.phone
          })
          .eq("id", existingUser.id)

        if (updateError) {
          console.error("User update error:", updateError)
          return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
        }

        // Create or update editor profile
        const { data: editorProfile, error: profileError } = await supabase
          .from("editor_profiles")
          .upsert({
            user_id: existingUser.id,
            project_rate: data.projectRate || null,
            hourly_rate: data.hourlyRate || null,
            experience_years: data.experienceYears || null,
            turnaround_time: data.turnaroundTime || null,
            bio: data.bio || "",
            specializations: data.specialties || [],
            software_skills: data.software || [],
            languages: data.languages || [],
            availability_status: "available",
            rating: 0,
            total_reviews: 0
          })
          .select()
          .single()

        if (profileError) {
          console.error("Editor profile creation error:", profileError)
          return NextResponse.json({ error: "Failed to create editor profile" }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true, 
          data: { 
            user: { id: existingUser.id, email: data.email, user_type: "editor" },
            editor_profile: editorProfile 
          } 
        })
      }
    }

    // Create new user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        email: data.email,
        full_name: data.name,
        phone_number: data.phone,
        user_type: "editor",
        avatar_url: data.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
      })
      .select()
      .single()

    if (userError) {
      console.error("User creation error:", userError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create editor profile
    const { data: editorProfile, error: profileError } = await supabase
      .from("editor_profiles")
      .insert({
        user_id: userData.id,
        project_rate: data.projectRate || null,
        hourly_rate: data.hourlyRate || null,
        experience_years: data.experienceYears || null,
        turnaround_time: data.turnaroundTime || null,
        bio: data.bio || "",
        specializations: data.specialties || [],
        software_skills: data.software || [],
        languages: data.languages || [],
        availability_status: "available",
        rating: 0,
        total_reviews: 0
      })
      .select()
      .single()

    if (profileError) {
      console.error("Editor profile creation error:", profileError)
      // Clean up user if profile creation fails
      await supabase.from("users").delete().eq("id", userData.id)
      return NextResponse.json({ error: "Failed to create editor profile" }, { status: 500 })
    }

    console.log("Editor registration successful:", {
      user_id: userData.id,
      editor_profile_id: editorProfile.id
    })

    return NextResponse.json({ 
      success: true, 
      data: { 
        user: userData,
        editor_profile: editorProfile 
      } 
    })
  } catch (error) {
    console.error("Editor registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
