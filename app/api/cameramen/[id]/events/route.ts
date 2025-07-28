import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const eventData = await request.json()
    const supabase = await createServiceClient()

    console.log("Adding event for cameraman:", id, eventData)

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        cameraman_id: id,
        event_name: eventData.title,
        event_date: eventData.date,
        location: eventData.location,
        event_type: eventData.type,
        status: "upcoming",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding event:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to add event",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: event,
    })
  } catch (error) {
    console.error("Add event error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
