import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const bookingId = params.id

    const {
      status,
      rejection_reason,
      estimated_price,
      final_price,
      editor_notes,
      client_notes,
      payment_status
    } = body

    // Prepare update data
    const updateData: any = {}
    
    if (status) {
      updateData.status = status
      if (status === 'accepted') {
        updateData.accepted_at = new Date().toISOString()
        // When accepted, set the final_price to estimated_price if provided
        if (estimated_price) {
          updateData.final_price = estimated_price
        }
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString()
        updateData.rejection_reason = rejection_reason
        // Change status to cancelled when rejected
        updateData.status = 'cancelled'
      } else if (status === 'in_progress') {
        updateData.started_at = new Date().toISOString()
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }
    }

    if (estimated_price !== undefined) updateData.estimated_price = estimated_price
    if (final_price !== undefined) updateData.final_price = final_price
    if (editor_notes !== undefined) updateData.editor_notes = editor_notes
    if (client_notes !== undefined) updateData.client_notes = client_notes
    if (payment_status !== undefined) updateData.payment_status = payment_status

    // Update the booking
    const { data, error } = await supabase
      .from("editor_bookings")
      .update(updateData)
      .eq("id", bookingId)
      .select(`
        *,
        client:users!editor_bookings_client_id_fkey(
          id,
          full_name,
          email,
          phone_number
        ),
        editor:users!editor_bookings_user_id_fkey(
          id,
          full_name,
          email
        )
      `)
      .single()

    if (error) {
      console.error("Error updating editor booking:", error)
      return NextResponse.json(
        { error: "Failed to update booking" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: data
    })

  } catch (error) {
    console.error("Error in editor booking update API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const bookingId = params.id

    const { data, error } = await supabase
      .from("editor_bookings")
      .select(`
        *,
        client:users!editor_bookings_client_id_fkey(
          id,
          full_name,
          email,
          phone_number
        ),
        editor:users!editor_bookings_user_id_fkey(
          id,
          full_name,
          email
        )
      `)
      .eq("id", bookingId)
      .single()

    if (error) {
      console.error("Error fetching editor booking:", error)
      return NextResponse.json(
        { error: "Failed to fetch booking" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: data
    })

  } catch (error) {
    console.error("Error in editor booking GET API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
