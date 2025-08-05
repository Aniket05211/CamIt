import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    const supabase = await createServiceClient()

    console.log("Creating payment with data:", {
      booking_id: paymentData.booking_id,
      amount: paymentData.amount,
      payment_method: paymentData.payment_method,
      payment_status: paymentData.payment_status,
      booking_type: paymentData.booking_type
    })

    // Validate required fields
    if (!paymentData.booking_id || !paymentData.amount || !paymentData.payment_method) {
      console.error("Missing required fields:", {
        has_booking_id: !!paymentData.booking_id,
        has_amount: !!paymentData.amount,
        has_payment_method: !!paymentData.payment_method
      })
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      )
    }

    // Auto-detect booking type by checking all tables
    console.log("Auto-detecting booking type for ID:", paymentData.booking_id)
    
    let booking = null
    let tableName = null
    let bookingType = null
    
    // Check booking_event table first
    const { data: eventBooking, error: eventError } = await supabase
      .from("booking_event")
      .select("*")
      .eq("id", paymentData.booking_id)
      .single()
    
    if (eventBooking && !eventError) {
      booking = eventBooking
      tableName = "booking_event"
      bookingType = "event"
      console.log("Found booking in booking_event table")
    } else {
      // Check booking_trip table
      const { data: tripBooking, error: tripError } = await supabase
        .from("booking_trip")
        .select("*")
        .eq("id", paymentData.booking_id)
        .single()
      
      if (tripBooking && !tripError) {
        booking = tripBooking
        tableName = "booking_trip"
        bookingType = "trip"
        console.log("Found booking in booking_trip table")
      } else {
        // Check original bookings table
        const { data: originalBooking, error: originalError } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", paymentData.booking_id)
          .single()
        
        if (originalBooking && !originalError) {
          booking = originalBooking
          tableName = "bookings"
          bookingType = "original"
          console.log("Found booking in bookings table")
        } else {
          console.error("Booking not found in any table")
          console.error("Booking ID:", paymentData.booking_id)
          return NextResponse.json(
            {
              success: false,
              error: "Booking not found",
            },
            { status: 404 }
          )
        }
      }
    }

    console.log("Final booking type detected:", bookingType)
    console.log("Table being used:", tableName)
    console.log("Booking data before payment:", {
      id: booking.id,
      status: booking.status,
      payment_status: booking.payment_status,
      client_id: booking.client_id,
      photographer_id: booking.photographer_id
    })

    // For event and trip bookings, we need to handle the foreign key constraint differently
    // Since the payments table only references the bookings table, we'll create a different approach
    
    let newPayment
    let insertError
    
         // Create payment record for all booking types
     const { data: payment, error: error } = await supabase
       .from("payments")
       .insert({
         booking_id: paymentData.booking_id,
         client_id: booking.client_id,
         photographer_id: booking.photographer_id,
         amount: paymentData.amount,
         currency: paymentData.currency || "USD",
         payment_method: paymentData.payment_method,
         payment_status: paymentData.payment_status || "completed",
         transaction_id: paymentData.transaction_id,
         payment_date: new Date().toISOString(),
         card_last4: paymentData.card_last4,
         card_brand: paymentData.card_brand,
         billing_address: paymentData.billing_address,
         payment_notes: paymentData.payment_notes,
         booking_type: bookingType,
         booking_table: tableName,
         original_booking_id: bookingType === "original" ? null : paymentData.booking_id,
         metadata: {
           ...paymentData.metadata,
           booking_type: bookingType,
           table_name: tableName
         }
       })
       .select()
       .single()
     
     newPayment = payment
     insertError = error
     
     // Always update the booking table with payment status and completed status
     console.log("Attempting to update booking table:", tableName)
     console.log("Booking ID to update:", paymentData.booking_id)
     
     // Prepare update data - only include fields that exist in the table
     const updateData: any = {
       status: "completed", // Set status to completed
       payment_status: "success", // Set payment status to success
       final_price: paymentData.amount,
       updated_at: new Date().toISOString()
     }
     
     // Add payment-related fields if they exist in the table
     if (tableName === "booking_event" || tableName === "booking_trip") {
       updateData.payment_date = new Date().toISOString()
       updateData.payment_method = paymentData.payment_method
       updateData.transaction_id = paymentData.transaction_id
       updateData.card_last4 = paymentData.card_last4
       updateData.card_brand = paymentData.card_brand
       updateData.billing_address = paymentData.billing_address
     }
     
     console.log("Update data:", updateData)
     
     const { data: updatedBooking, error: updateError } = await supabase
       .from(tableName)
       .update(updateData)
       .eq("id", paymentData.booking_id)
       .select()
       .single()
     
     if (updateError) {
       console.error("Error updating booking payment status:", updateError)
       console.error("Table being updated:", tableName)
       console.error("Booking ID:", paymentData.booking_id)
       console.error("Error details:", updateError.message)
       console.error("Error code:", updateError.code)
       
       // Try a simpler update with just the essential fields
       console.log("Trying simpler update with essential fields only...")
       const { data: simpleUpdate, error: simpleError } = await supabase
         .from(tableName)
         .update({
           status: "completed",
           payment_status: "success",
           final_price: paymentData.amount,
           updated_at: new Date().toISOString()
         })
         .eq("id", paymentData.booking_id)
         .select()
         .single()
       
       if (simpleError) {
         console.error("Simple update also failed:", simpleError)
         console.error("Simple update error details:", simpleError.message)
         console.error("Simple update error code:", simpleError.code)
       } else {
         console.log("Simple update successful:", simpleUpdate)
       }
     } else {
       console.log("Booking status updated successfully:")
       console.log("- Status: completed")
       console.log("- Payment Status: success")
       console.log("- Table:", tableName)
       console.log("- Booking ID:", paymentData.booking_id)
       console.log("Updated booking data:", updatedBooking)
     }

    if (insertError) {
      console.error("Error creating payment:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create payment",
          details: insertError.message,
        },
        { status: 500 }
      )
    }

         // Payment and booking update completed successfully

    console.log("Payment created successfully:", {
      payment_id: newPayment.id,
      booking_id: newPayment.booking_id,
      amount: newPayment.amount,
      status: newPayment.payment_status
    })

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      payment: newPayment,
    })
  } catch (error) {
    console.error("Create payment error:", error)
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
    const bookingId = searchParams.get('booking_id')
    const clientId = searchParams.get('client_id')
    const photographerId = searchParams.get('photographer_id')

    const supabase = await createServiceClient()

    let query = supabase.from("payments").select("*")

    if (bookingId) {
      query = query.eq("booking_id", bookingId)
    }

    if (clientId) {
      query = query.eq("client_id", clientId)
    }

    if (photographerId) {
      query = query.eq("photographer_id", photographerId)
    }

    const { data: payments, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching payments:", error)
      return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
    }

    console.log("Fetched payments:", { bookingId, clientId, photographerId, count: payments?.length })
    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error in payments GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 