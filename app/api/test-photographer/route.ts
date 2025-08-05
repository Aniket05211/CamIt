import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const photographerId = searchParams.get('id') || "fb3cf51f-967a-4f1c-8456-46ca57727151"
    
    const supabase = await createServiceClient()

    console.log("Testing photographer data for ID:", photographerId)

    // Check if photographer exists in cameramen table
    const { data: cameraman, error: cameramanError } = await supabase
      .from("cameramen")
      .select("*")
      .eq("id", photographerId)
      .single()

    console.log("Cameraman data:", cameraman)
    console.log("Cameraman error:", cameramanError)

    // Check if photographer exists in users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", photographerId)
      .single()

    console.log("User data:", user)
    console.log("User error:", userError)

    return NextResponse.json({
      success: true,
      photographer_id: photographerId,
      cameraman: cameraman,
      cameraman_error: cameramanError,
      user: user,
      user_error: userError,
      has_hourly_rate: cameraman?.hourly_rate ? true : false,
      hourly_rate: cameraman?.hourly_rate,
      daily_rate: cameraman?.daily_rate
    })
  } catch (error) {
    console.error("Test photographer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 