import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServiceClient()
    const { id: bookingId } = await params

    console.log("=== FETCH TRIP BOOKING DETAILS ===")
    console.log("Booking ID:", bookingId)

    const { data: booking, error } = await supabase
      .from("booking_trip")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (error || !booking) {
      console.error("Error fetching trip booking:", error)
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    console.log("Trip booking found:", booking)
    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Error in trip booking GET API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServiceClient()
    const { id: bookingId } = await params
    const updateData = await request.json()

    console.log("=== UPDATE TRIP BOOKING ===")
    console.log("Booking ID:", bookingId)
    console.log("Update data:", updateData)

    const { data: updatedBooking, error } = await supabase
      .from("booking_trip")
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (error) {
      console.error("Error updating trip booking:", error)
      return NextResponse.json(
        { error: "Failed to update booking" },
        { status: 500 }
      )
    }

    console.log("Trip booking updated successfully:", updatedBooking)
    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    console.error("Error in trip booking PATCH API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 