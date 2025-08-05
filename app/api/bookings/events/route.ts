import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const body = await request.json()

    console.log("Creating event booking:", body)

    const {
      client_id,
      event_type,
      service_type,
      event_date,
      event_time,
      location,
      number_of_guests,
      special_requirements,
    } = body

    // Validate required fields
    if (!client_id || !event_type || !service_type || !event_date || !event_time || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create the event booking
    const { data: booking, error } = await supabase
      .from("booking_event")
      .insert({
        client_id,
        event_type,
        service_type,
        event_date,
        event_time,
        location,
        number_of_guests: number_of_guests || null,
        special_requirements: special_requirements || null,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating event booking:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create event booking" },
        { status: 500 }
      )
    }

    console.log("Successfully created event booking:", booking)

    return NextResponse.json({
      success: true,
      booking
    })
  } catch (error) {
    console.error("Error in event booking API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("=== EVENT BOOKINGS API CALLED ===")
    console.log("Request URL:", request.url)
    
    const supabase = await createServiceClient()
    console.log("Supabase client created")
    
    const { searchParams } = new URL(request.url)
    const client_id = searchParams.get("client_id")
    const test = searchParams.get("test")
    console.log("Client ID from params:", client_id)
    console.log("Test parameter:", test)

    if (!client_id) {
      console.error("No client_id provided")
      return NextResponse.json(
        { success: false, error: "Client ID is required" },
        { status: 400 }
      )
    }

    // Test endpoint to create a sample event booking
    if (test === 'create') {
      console.log("Creating test event booking...")
      
      const testEventBooking = {
        client_id: client_id,
        event_type: "Wedding",
        service_type: "Both",
        event_date: "2025-08-08",
        event_time: "10:00:00",
        location: "Mumbai",
        number_of_guests: 300,
        special_requirements: "Cinematic Videography",
        status: "confirmed",
        payment_status: "pending",
      }

      const { data: newBooking, error: insertError } = await supabase
        .from("booking_event")
        .insert(testEventBooking)
        .select()
        .single()

      if (insertError) {
        console.error("Error creating test event booking:", insertError)
        return NextResponse.json({ error: "Failed to create test event booking" }, { status: 500 })
      }

      console.log("Test event booking created:", newBooking)
      return NextResponse.json({ success: true, booking: newBooking })
    }

    console.log("=== FETCHING EVENT BOOKINGS FROM DATABASE ===")
    // Get event bookings for a specific client
    const { data: bookings, error } = await supabase
      .from("booking_event")
      .select("*")
      .eq("client_id", client_id)
      .order("created_at", { ascending: false })

    console.log("Database query completed")
    console.log("Bookings found:", bookings?.length || 0)
    console.log("Database error:", error)

    if (error) {
      console.error("Error fetching event bookings:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch event bookings" },
        { status: 500 }
      )
    }

    console.log("=== EVENT BOOKINGS API SUCCESS ===")
    console.log("Returning bookings:", bookings)
    
    return NextResponse.json({
      success: true,
      bookings: bookings || []
    })
  } catch (error) {
    console.error("=== ERROR IN EVENT BOOKINGS API ===")
    console.error("Error type:", typeof error)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    console.error("Full error object:", error)
    
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 