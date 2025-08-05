import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    const supabase = await createServiceClient()

    console.log("Creating booking with data:", {
      client_id: bookingData.client_id,
      photographer_id: bookingData.photographer_id,
      title: bookingData.title,
      status: bookingData.status
    })

    // Validate required fields
    if (!bookingData.client_id || !bookingData.photographer_id || !bookingData.event_date) {
      console.error("Missing required fields:", {
        has_client_id: !!bookingData.client_id,
        has_photographer_id: !!bookingData.photographer_id,
        has_event_date: !!bookingData.event_date
      })
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      )
    }

    // Get photographer details
    const { data: photographer, error: photographerError } = await supabase
      .from("users")
      .select("full_name, email, phone_number")
      .eq("id", bookingData.photographer_id)
      .single()

    if (photographerError) {
      console.error("Photographer fetch error:", photographerError)
      return NextResponse.json(
        {
          success: false,
          error: "Photographer not found",
          details: `Photographer with ID ${bookingData.photographer_id} not found in database`,
        },
        { status: 404 }
      )
    }

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("users")
      .select("full_name, email, phone_number")
      .eq("id", bookingData.client_id)
      .single()

    if (clientError) {
      console.error("Client fetch error:", clientError)
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      )
    }

    // Create booking with all details
    const { data: newBooking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        client_id: bookingData.client_id,
        photographer_id: bookingData.photographer_id,
        client_name: client.full_name,
        client_email: client.email,
        client_phone: client.phone_number,
        photographer_name: photographer.full_name,
        photographer_email: photographer.email,
        photographer_phone: photographer.phone_number,
        event_date: bookingData.event_date,
        event_date_from: bookingData.event_date_from,
        event_date_to: bookingData.event_date_to,
        event_type: bookingData.event_type,
        duration_hours: bookingData.duration_hours,
        location_address: bookingData.location_address,
        estimated_guests: bookingData.estimated_guests,
        special_requirements: bookingData.special_requirements,
        budget_min: bookingData.budget_min,
        budget_max: bookingData.budget_max,
        contact_preference: bookingData.contact_preference,
        venue_details: bookingData.venue_details,
        accommodation_type: bookingData.accommodation_type,
        accommodation_details: bookingData.accommodation_details,
        celebrity_name: bookingData.celebrity_name,
        shoot_purpose: bookingData.shoot_purpose,
        preferred_style: bookingData.preferred_style,
        equipment_needed: bookingData.equipment_needed,
        makeup_artist: bookingData.makeup_artist,
        stylist: bookingData.stylist,
        security_needed: bookingData.security_needed,
        privacy_level: bookingData.privacy_level,
        media_coverage: bookingData.media_coverage,
        exclusive_rights: bookingData.exclusive_rights,
        title: bookingData.title,
        description: bookingData.description,
        status: "pending",
        booking_type: "photography",
        payment_status: "pending",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating booking:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create booking",
          details: insertError.message,
        },
        { status: 500 }
      )
    }

    console.log("Booking created successfully:", {
      booking_id: newBooking.id,
      client_id: newBooking.client_id,
      photographer_id: newBooking.photographer_id,
      status: newBooking.status
    })

      return NextResponse.json({
      success: true,
      message: "Booking request submitted successfully",
      booking: newBooking,
    })
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const photographerId = searchParams.get('photographer_id')
    const status = searchParams.get('status')
    const test = searchParams.get('test')

    // Test endpoint to create a sample booking
    if (test === 'create') {
      const supabase = await createServiceClient()
      
      const testBooking = {
        client_id: "25308c26-013f-4665-a5cf-d6c1ff345c2b", // Use the actual client ID from logs
        photographer_id: "fb3cf51f-967a-4f1c-8456-46ca57727151", // Your user ID as photographer
        // Note: This photographer_id should match an existing cameraman in the cameramen table
        client_name: "Test Client",
        client_email: "test@example.com",
        client_phone: "1234567890",
        photographer_name: "Test Photographer",
        photographer_email: "photographer@example.com",
        photographer_phone: "0987654321",
        event_date: "2025-01-15",
        event_date_from: "2025-01-15",
        event_date_to: "2025-01-15",
        event_type: "test_event",
        duration_hours: 4, // Increased duration for better testing
        location_address: "Test Location",
        estimated_guests: 5,
        special_requirements: "Test requirements",
        budget_min: 100,
        budget_max: 200,
        contact_preference: "email",
        venue_details: "Test venue",
        title: "Test Booking for Payment",
        description: "Test booking description for payment testing",
        status: "accepted", // Set to accepted so payment can be made
        booking_type: "photography",
        payment_status: "pending",
      }

      const { data: newBooking, error: insertError } = await supabase
        .from("bookings")
        .insert(testBooking)
        .select()
        .single()

      if (insertError) {
        console.error("Error creating test booking:", insertError)
        return NextResponse.json({ error: "Failed to create test booking" }, { status: 500 })
      }

      console.log("Test booking created:", newBooking)
      return NextResponse.json({ success: true, booking: newBooking })
    }

    const supabase = await createServiceClient()

    let query = supabase.from("bookings").select("*")

    if (clientId) {
      query = query.eq("client_id", clientId)
    }

    if (photographerId) {
      // Use the photographer_id field from the bookings table
      query = query.eq("photographer_id", photographerId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: bookings, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    console.log("Fetched bookings:", { clientId, photographerId, status, count: bookings?.length })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error in bookings GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
