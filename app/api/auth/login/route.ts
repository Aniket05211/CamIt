import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createServiceClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Find user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
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

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    })

    const { password_hash, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword, success: true, message: "Login successful!" })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
