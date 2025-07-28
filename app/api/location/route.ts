import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.cameraman_id || !body.coordinates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create location update
    const { data: locationUpdate, error } = await supabase
      .from("location_updates")
      .insert({
        cameraman_id: body.cameraman_id,
        booking_id: body.booking_id || null,
        coordinates: body.coordinates,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating location update:", error)
      return NextResponse.json({ error: "Failed to create location update" }, { status: 500 })
    }

    // Also update the cameraman's current location
    await supabase
      .from("cameraman_profiles")
      .update({
        current_location: body.coordinates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.cameraman_id)

    return NextResponse.json(locationUpdate)
  } catch (error) {
    console.error("Error in location API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
