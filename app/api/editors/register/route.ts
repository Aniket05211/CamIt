import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const data = await request.json()

    // Create user first
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        email: data.email,
        full_name: data.name,
        phone_number: data.phone,
        user_type: "editor",
        avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
      })
      .select()
      .single()

    if (userError) {
      console.error("User creation error:", userError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // For now, just return success for editors
    // Editor profile table would need to be created similar to cameraman_profiles

    return NextResponse.json({ success: true, data: userData })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
