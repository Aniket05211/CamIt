import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const {
      client_id,
      user_id, // This should be the editor's user ID from users table
      service_type,
      project_title,
      project_description,
      number_of_files,
      deadline_date,
      deadline_time,
      urgency_level,
      budget_min,
      budget_max,
      special_requirements,
      file_upload_urls
    } = body

    console.log("Received booking data:", body)
    console.log("User ID received:", user_id)

    // Validate required fields
    console.log("Validating fields:", { client_id, user_id, service_type, project_title, deadline_date })
    if (!client_id || !user_id || !service_type || !project_title || !deadline_date) {
      return NextResponse.json(
        { error: "Missing required fields", details: { client_id, user_id, service_type, project_title, deadline_date } },
        { status: 400 }
      )
    }

    // Insert the booking - user_id is the editor's user ID from users table
    const { data, error } = await supabase
      .from("editor_bookings")
      .insert({
        client_id,
        user_id: user_id, // This is the editor's user ID from users table
        service_type,
        project_title,
        project_description,
        number_of_files,
        deadline_date,
        deadline_time,
        urgency_level,
        budget_min,
        budget_max,
        special_requirements,
        file_upload_urls
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating editor booking:", error)
      return NextResponse.json(
        { 
          error: "Failed to create booking",
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: data
    })

  } catch (error) {
    console.error("Error in editor booking API:", error)
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
    
    const client_id = searchParams.get("client_id")
    const user_id = searchParams.get("user_id") // This is the editor's user ID from users table
    const status = searchParams.get("status")

    let query = supabase
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

    if (client_id) {
      query = query.eq("client_id", client_id)
    }

    if (user_id) {
      query = query.eq("user_id", user_id) // This is the editor's user ID from users table
    }

    if (status) {
      query = query.eq("status", status)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching editor bookings:", error)
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      bookings: data
    })

  } catch (error) {
    console.error("Error in editor bookings GET API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
