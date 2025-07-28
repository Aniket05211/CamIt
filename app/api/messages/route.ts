import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["booking_id", "sender_id", "receiver_id", "message"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        booking_id: body.booking_id,
        sender_id: body.sender_id,
        receiver_id: body.receiver_id,
        message: body.message,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating message:", error)
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error in messages API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
