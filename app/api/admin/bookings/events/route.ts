import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    
    // Get all event bookings
    const { data: bookings, error } = await supabase
      .from("booking_event")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching event bookings:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch event bookings" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || []
    })
  } catch (error) {
    console.error("Error in event bookings API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 