import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const paymentData = await request.json()
    
    const {
      booking_id,
      amount,
      payment_method = "stripe",
      transaction_id,
      card_last4,
      card_brand,
      billing_address,
      payment_notes
    } = paymentData

    console.log("Editor payment request received:", paymentData)
    
    if (!booking_id || !amount) {
      console.log("Missing required fields:", { booking_id, amount })
      return NextResponse.json(
        { error: "Booking ID and amount are required" },
        { status: 400 }
      )
    }

    // First, get the booking details
    const { data: booking, error: bookingError } = await supabase
      .from("editor_bookings")
      .select(`
        *,
        client:users!editor_bookings_client_id_fkey(
          id,
          full_name,
          email
        ),
        editor:users!editor_bookings_user_id_fkey(
          id,
          full_name,
          email
        )
      `)
      .eq("id", booking_id)
      .single()

    if (bookingError || !booking) {
      console.error("Error fetching booking:", bookingError)
      console.error("Booking ID searched:", booking_id)
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }
    
    console.log("Booking found:", booking)

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        booking_id: booking_id,
        client_id: booking.client_id,
        photographer_id: null, // Set to null for editor bookings
        editor_id: booking.user_id, // Store editor user ID in editor_id column
        amount: amount,
        currency: "USD",
        payment_method: payment_method,
        payment_status: "completed",
        transaction_id: transaction_id,
        payment_date: new Date().toISOString(),
        card_last4: card_last4,
        card_brand: card_brand,
        billing_address: billing_address,
        payment_notes: payment_notes,
        booking_type: "editor",
        booking_table: "editor_bookings",
        metadata: {
          booking_type: "editor",
          table_name: "editor_bookings"
        }
      })
      .select()
      .single()

    if (paymentError) {
      console.error("Error creating payment:", paymentError)
      console.error("Payment data that failed:", {
        booking_id,
        client_id: booking.client_id,
        photographer_id: null,
        editor_id: booking.user_id,
        amount,
        booking_type: "editor"
      })
      return NextResponse.json(
        { error: "Failed to create payment record", details: paymentError.message },
        { status: 500 }
      )
    }

    // Update the editor booking with payment status (keep status as accepted)
    const { data: updatedBooking, error: updateError } = await supabase
      .from("editor_bookings")
      .update({
        payment_status: "paid",
        final_price: amount,
        updated_at: new Date().toISOString()
      })
      .eq("id", booking_id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating booking:", updateError)
      return NextResponse.json(
        { error: "Failed to update booking status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      payment: payment,
      booking: updatedBooking,
      message: "Payment processed successfully"
    })

  } catch (error) {
    console.error("Error in editor payment API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const booking_id = searchParams.get("booking_id")

    if (!booking_id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      )
    }

    // Get payment for the booking
    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("booking_id", booking_id)
      .eq("booking_type", "editor")
      .single()

    if (error) {
      console.error("Error fetching payment:", error)
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      payment: payment
    })

  } catch (error) {
    console.error("Error in GET editor payment API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
