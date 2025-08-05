import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()
    const body = await request.json()

    console.log("Updating event booking with ID:", id)
    console.log("Request body:", body)

    const { status, notes, photographer_id, estimated_price, final_price } = body

    // Only allow updating specific fields
    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (photographer_id !== undefined) updateData.photographer_id = photographer_id
    if (estimated_price !== undefined) updateData.estimated_price = estimated_price
    if (final_price !== undefined) updateData.final_price = final_price

    console.log("Update data:", updateData)

    // Update the booking
    const { data: updatedBooking, error } = await supabase
      .from("booking_event")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating event booking:", error)
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to update event booking",
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log("Successfully updated event booking:", updatedBooking)

    return NextResponse.json({
      success: true,
      booking: updatedBooking
    })
  } catch (error) {
    console.error("Error in event booking update API:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 