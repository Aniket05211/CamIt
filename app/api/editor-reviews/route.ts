import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const editorId = searchParams.get("editor_id")
    const reviewerId = searchParams.get("reviewer_id")

    const supabase = await createServiceClient()

    let query = supabase
      .from("editor_reviews")
      .select(`
        *,
        reviewer:users!editor_reviews_reviewer_id_fkey(
          id,
          full_name,
          profile_image_url
        )
      `)

    // If editor_id is provided, get reviews for that editor
    if (editorId) {
      query = query.eq("editor_id", editorId)
    }

    // If reviewer_id is provided, get reviews by that reviewer
    if (reviewerId) {
      query = query.eq("reviewer_id", reviewerId)
    }

    // If neither is provided, return error
    if (!editorId && !reviewerId) {
      return NextResponse.json({ error: "Either editor_id or reviewer_id is required" }, { status: 400 })
    }

    const { data: reviews, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching editor reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json({ reviews: reviews || [] })
  } catch (error) {
    console.error("Error in GET /api/editor-reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("=== EDITOR REVIEW API DEBUG ===")
    console.log("Received body:", body)
    
    const { editor_id, rating, review_text, project_type, turnaround_time_rating, communication_rating, quality_rating, reviewer_id, booking_id } = body

    console.log("Extracted values:")
    console.log("editor_id:", editor_id)
    console.log("rating:", rating)
    console.log("reviewer_id:", reviewer_id)
    console.log("booking_id:", booking_id)

    // Use reviewer_id from request body instead of session
    if (!reviewer_id) {
      console.log("ERROR: reviewer_id is missing")
      return NextResponse.json({ error: "Reviewer ID is required" }, { status: 400 })
    }

    if (!editor_id || !rating) {
      console.log("ERROR: editor_id or rating is missing")
      console.log("editor_id:", editor_id)
      console.log("rating:", rating)
      return NextResponse.json({ error: "Editor ID and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Check if user has already reviewed this specific booking
    const { data: existingReview } = await supabase
      .from("editor_reviews")
      .select("id")
      .eq("editor_id", editor_id)
      .eq("reviewer_id", reviewer_id)
      .eq("booking_id", booking_id)
      .single()

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this booking" }, { status: 400 })
    }

    // Create the review
    const { data: review, error } = await supabase
      .from("editor_reviews")
      .insert({
        editor_id,
        reviewer_id: reviewer_id,
        booking_id: booking_id,
        rating,
        review_text,
        project_type,
        turnaround_time_rating,
        communication_rating,
        quality_rating,
      })
      .select(`
        *,
        reviewer:users!editor_reviews_reviewer_id_fkey(
          id,
          full_name,
          profile_image_url
        )
      `)
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    // Update editor profile stats
    const { data: editorReviews } = await supabase
      .from("editor_reviews")
      .select("rating")
      .eq("editor_id", editor_id)

    if (editorReviews && editorReviews.length > 0) {
      const totalRating = editorReviews.reduce((sum, r) => sum + r.rating, 0)
      const averageRating = totalRating / editorReviews.length

      await supabase
        .from("editor_profiles")
        .update({
          rating: averageRating,
          total_reviews: editorReviews.length,
          stats: {
            averageRating: averageRating,
            totalProjects: editorReviews.length,
            cancelledProjects: 0,
            completedProjects: editorReviews.length
          }
        })
        .eq("editor_id", editor_id)
    }

    return NextResponse.json({ 
      success: true, 
      review,
      message: "Review submitted successfully" 
    })
  } catch (error) {
    console.error("Error in POST /api/editor-reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
