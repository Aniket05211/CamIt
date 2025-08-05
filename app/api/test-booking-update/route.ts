import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { bookingId, bookingType } = await request.json()
    const supabase = await createServiceClient()
    
    console.log("=== TESTING BOOKING UPDATE ===")
    console.log("Booking ID:", bookingId)
    console.log("Booking Type:", bookingType)
    
    let tableName = null
    if (bookingType === "event") {
      tableName = "booking_event"
    } else if (bookingType === "trip") {
      tableName = "booking_trip"
    } else {
      tableName = "bookings"
    }
    
    console.log("Table to update:", tableName)
    
    // First, let's check the current state
    const { data: currentBooking, error: fetchError } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", bookingId)
      .single()
    
    if (fetchError) {
      console.error("Error fetching current booking:", fetchError)
      return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
    }
    
    console.log("Current booking state:", {
      id: currentBooking.id,
      status: currentBooking.status,
      payment_status: currentBooking.payment_status,
      final_price: currentBooking.final_price
    })
    
    // Test update with essential fields only
    const { data: updatedBooking, error: updateError } = await supabase
      .from(tableName)
      .update({
        status: "completed",
        payment_status: "success",
        final_price: 200,
        updated_at: new Date().toISOString()
      })
      .eq("id", bookingId)
      .select()
      .single()
    
    if (updateError) {
      console.error("Error updating booking:", updateError)
      return NextResponse.json({ 
        error: "Failed to update booking",
        details: updateError.message,
        code: updateError.code
      }, { status: 500 })
    }
    
    console.log("Updated booking state:", {
      id: updatedBooking.id,
      status: updatedBooking.status,
      payment_status: updatedBooking.payment_status,
      final_price: updatedBooking.final_price
    })
    
    return NextResponse.json({
      success: true,
      message: "Test update successful",
      table: tableName,
      before: {
        status: currentBooking.status,
        payment_status: currentBooking.payment_status,
        final_price: currentBooking.final_price
      },
      after: {
        status: updatedBooking.status,
        payment_status: updatedBooking.payment_status,
        final_price: updatedBooking.final_price
      }
    })
    
  } catch (error) {
    console.error("Test booking update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 