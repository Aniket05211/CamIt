import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    
    // Get all trip bookings
    const { data: bookings, error } = await supabase
      .from("booking_trip")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching trip bookings:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch trip bookings" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || []
    })
  } catch (error) {
    console.error("Error in trip bookings API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 