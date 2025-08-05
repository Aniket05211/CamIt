import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const body = await request.json()

    console.log("Creating trip booking:", body)

    const {
      client_id,
      full_name,
      email,
      phone,
      destination,
      start_date,
      end_date,
      group_size,
      budget,
      photography_style,
      special_requests,
      hear_about_us,
    } = body

    // Validate required fields with detailed error messages
    const missingFields = []
    if (!client_id) missingFields.push("client_id")
    if (!full_name) missingFields.push("full_name")
    if (!email) missingFields.push("email")
    if (!phone) missingFields.push("phone")
    if (!destination) missingFields.push("destination")
    if (!start_date) missingFields.push("start_date")
    if (!end_date) missingFields.push("end_date")
    if (!group_size) missingFields.push("group_size")
    if (!budget) missingFields.push("budget")
    if (!photography_style) missingFields.push("photography_style")
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields)
      console.error("Received data:", body)
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(", ")}`,
          missingFields 
        },
        { status: 400 }
      )
    }

    // Create the trip booking
    const { data: booking, error } = await supabase
      .from("booking_trip")
      .insert({
        client_id,
        full_name,
        email,
        phone,
        destination,
        start_date,
        end_date,
        group_size,
        budget,
        photography_style,
        special_requests: special_requests || null,
        hear_about_us: hear_about_us || null,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating trip booking:", error)
      console.error("Error details:", error.message)
      console.error("Error code:", error.code)
      
      // Handle specific database errors
      if (error.code === "23502") {
        return NextResponse.json(
          { 
            success: false, 
            error: "Database constraint violation: Missing required field",
            details: error.message 
          },
          { status: 400 }
        )
      }
      
      if (error.code === "23505") {
        return NextResponse.json(
          { 
            success: false, 
            error: "Duplicate entry: This booking already exists",
            details: error.message 
          },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to create trip booking",
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log("Successfully created trip booking:", booking)

    return NextResponse.json({
      success: true,
      booking
    })
  } catch (error) {
    console.error("Error in trip booking API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("=== TRIP BOOKINGS API CALLED ===")
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

    // Test endpoint to update trip booking status to confirmed
    if (test === 'confirm') {
      console.log("Updating trip booking status to confirmed...")
      
      const { data: updatedBooking, error: updateError } = await supabase
        .from("booking_trip")
        .update({ status: "confirmed", payment_status: "pending" })
        .eq("client_id", client_id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating trip booking:", updateError)
        return NextResponse.json({ error: "Failed to update trip booking" }, { status: 500 })
      }

      console.log("Trip booking updated:", updatedBooking)
      return NextResponse.json({ success: true, booking: updatedBooking })
    }

    console.log("=== FETCHING TRIP BOOKINGS FROM DATABASE ===")
    // Get trip bookings for a specific client
    const { data: bookings, error } = await supabase
      .from("booking_trip")
      .select("*")
      .eq("client_id", client_id)
      .order("created_at", { ascending: false })

    console.log("Database query completed")
    console.log("Bookings found:", bookings?.length || 0)
    console.log("Database error:", error)

    if (error) {
      console.error("Error fetching trip bookings:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch trip bookings" },
        { status: 500 }
      )
    }

    console.log("=== TRIP BOOKINGS API SUCCESS ===")
    console.log("Returning bookings:", bookings)
    
    return NextResponse.json({
      success: true,
      bookings: bookings || []
    })
  } catch (error) {
    console.error("=== ERROR IN TRIP BOOKINGS API ===")
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