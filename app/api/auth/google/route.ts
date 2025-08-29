import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { access_token, user_info, isSignup = false } = await request.json()

    if (!access_token || !user_info) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", user_info.email)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing user:", checkError)
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }

    let user = existingUser

    // If user doesn't exist, create new user
    if (!existingUser) {
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          email: user_info.email,
          full_name: user_info.name,
          user_type: "client", // Default to client
          is_verified: true, // Google users are pre-verified
          password_hash: `google_${user_info.sub}`, // Store Google ID in password_hash
          profile_image_url: user_info.picture, // Use existing profile_image_url column
        })
        .select()
        .maybeSingle()

      if (userError) {
        console.error("User creation error:", userError)
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }

      user = newUser
    } else {
      // Check if this is already a Google user
      if (existingUser.password_hash?.startsWith('google_')) {
        // User already exists with Google auth
        if (isSignup) {
          // If this is a signup attempt, return error
          return NextResponse.json({
            success: false,
            error: "Account already exists with Google. Please log in instead.",
            code: "USER_EXISTS"
          }, { status: 400 })
        } else {
          // If this is a login attempt, use the existing user
          user = existingUser
        }
      } else {
        // Update existing email user with Google info (account linking)
        const { error: updateError } = await supabase
          .from("users")
          .update({
            password_hash: `google_${user_info.sub}`, // Store Google ID in password_hash
            profile_image_url: user_info.picture, // Use existing profile_image_url column
            is_verified: true,
          })
          .eq("id", existingUser.id)

        if (updateError) {
          console.error("Error updating user with Google info:", updateError)
        }
        
        // Get the updated user
        const { data: updatedUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", existingUser.id)
          .single()
          
        if (!fetchError) {
          user = updatedUser
        }
      }
    }

    // Generate session token and expiration
    const sessionToken = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Insert into user_sessions
    const { data: session, error: sessionError } = await supabase
      .from("user_sessions")
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        last_accessed: new Date().toISOString(),
      })
      .select()
      .maybeSingle()

    if (sessionError) {
      console.error("Session creation error:", sessionError)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }



    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Google authentication successful",
      user: userWithoutPassword,
      sessionToken: sessionToken,
    })
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
