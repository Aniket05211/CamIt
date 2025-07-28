import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cameramanId = searchParams.get("cameramanId")

  if (!cameramanId) {
    return NextResponse.json({ error: "Cameraman ID is required" }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        client:client_id(id, full_name, avatar_url)
      `)
      .eq("cameraman_id", cameramanId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      // Return mock data for development
      return NextResponse.json([
        {
          id: "1",
          rating: 5,
          comment: "Amazing photographer! Very professional and captured beautiful moments.",
          created_at: "2023-05-15T10:30:00Z",
          client: {
            id: "c1",
            name: "Ananya Desai",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          },
        },
        {
          id: "2",
          rating: 4,
          comment: "Great experience, would recommend for any event.",
          created_at: "2023-04-20T14:15:00Z",
          client: {
            id: "c2",
            name: "Vikram Malhotra",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop",
          },
        },
      ])
    }

    const formattedReviews = data.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      client: {
        id: review.client.id,
        name: review.client.full_name,
        avatar:
          review.client.avatar_url ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
      },
    }))

    return NextResponse.json(formattedReviews)
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["booking_id", "client_id", "cameraman_id", "rating", "comment"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Check if booking exists and is completed
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("status")
      .eq("id", body.booking_id)
      .single()

    if (bookingError) {
      console.error("Error fetching booking:", bookingError)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.status !== "completed") {
      return NextResponse.json({ error: "Cannot review a booking that is not completed" }, { status: 400 })
    }

    // Check if review already exists for this booking
    const { data: existingReview, error: reviewError } = await supabase
      .from("reviews")
      .select("id")
      .eq("booking_id", body.booking_id)

    if (existingReview && existingReview.length > 0) {
      return NextResponse.json({ error: "Review already exists for this booking" }, { status: 400 })
    }

    // Create review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        booking_id: body.booking_id,
        client_id: body.client_id,
        cameraman_id: body.cameraman_id,
        rating: body.rating,
        comment: body.comment,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    // Update cameraman's average rating
    await updateCameramanRating(supabase, body.cameraman_id)

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to update cameraman's average rating
async function updateCameramanRating(supabase: any, cameramanId: string) {
  try {
    // Get all reviews for this cameraman
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("cameraman_id", cameramanId)

    if (reviewsError) {
      console.error("Error fetching reviews for rating update:", reviewsError)
      return
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    // Update cameraman profile
    await supabase
      .from("cameraman_profiles")
      .update({
        rating: averageRating,
        total_reviews: reviews.length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cameramanId)
  } catch (error) {
    console.error("Error updating cameraman rating:", error)
  }
}
