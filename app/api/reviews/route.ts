import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { booking_id, reviewer_id, reviewee_id, rating, comment } = await request.json()

    if (!booking_id || !reviewer_id || !reviewee_id || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    // Check if review already exists for this booking
    const { data: existingReview, error: checkError } = await supabase
      .from("reviews")
      .select("*")
      .eq("booking_id", booking_id)
      .eq("reviewer_id", reviewer_id)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing review:", checkError)
      return NextResponse.json(
        { success: false, error: "Failed to check existing review" },
        { status: 500 }
      )
    }

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "Review already exists for this booking" },
        { status: 400 }
      )
    }

    // Insert the review
    const { data: review, error: insertError } = await supabase
      .from("reviews")
      .insert({
        booking_id,
        reviewer_id,
        reviewee_id,
        rating,
        comment,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting review:", insertError)
      return NextResponse.json(
        { success: false, error: "Failed to submit review" },
        { status: 500 }
      )
    }

    // Update the booking to mark that a review has been submitted
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ has_review: true })
      .eq("id", booking_id)

    if (updateError) {
      console.error("Error updating booking review status:", updateError)
      // Don't fail the request if this update fails
    }

    return NextResponse.json({
      success: true,
      data: review,
    })
  } catch (error) {
    console.error("Review submission error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewee_id = searchParams.get("reviewee_id")
    const booking_id = searchParams.get("booking_id")

    if (!reviewee_id && !booking_id) {
      return NextResponse.json(
        { success: false, error: "Missing reviewee_id or booking_id parameter" },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    let query = supabase
      .from("reviews")
      .select(`
        *,
        reviewer:reviewer_id(id, full_name, profile_image_url),
        booking:booking_id(id, title, event_date)
      `)
      .order("created_at", { ascending: false })

    if (reviewee_id) {
      query = query.eq("reviewee_id", reviewee_id)
    }

    if (booking_id) {
      query = query.eq("booking_id", booking_id)
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch reviews" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: reviews,
    })
  } catch (error) {
    console.error("Review fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
