import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    console.log("=== /api/auth/me DEBUG ===")
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    console.log("Session token exists:", !!sessionToken)
    console.log("Session token:", sessionToken)

    if (!sessionToken) {
      console.log("No session token found")
      return NextResponse.json({ user: null })
    }

    const supabase = await createServiceClient()

    // Get session from user_sessions table
    const { data: session, error: sessionError } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .single()

    console.log("Session lookup result:", { session: !!session, error: sessionError })

    if (sessionError || !session) {
      console.log("Session not found or error:", sessionError)
      return NextResponse.json({ user: null })
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase.from("user_sessions").delete().eq("session_token", sessionToken)
      return NextResponse.json({ user: null })
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user_id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ user: null })
    }

    // Update last_accessed
    await supabase
      .from("user_sessions")
      .update({ last_accessed: new Date().toISOString() })
      .eq("session_token", sessionToken)

    const { password_hash, ...userWithoutPassword } = user
    console.log("User found:", userWithoutPassword.email)
    console.log("=== END /api/auth/me DEBUG ===")
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json({ user: null })
  }
}
