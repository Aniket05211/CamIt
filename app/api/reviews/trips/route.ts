import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"
    const verified = searchParams.get("verified") || "false" // Changed default to false

    let query = supabase
      .from("review_trip")
      .select(`
        *,
        booking_trip:booking_trip_id(
          destination,
          start_date,
          end_date,
          full_name,
          email
        ),
        client:client_id(
          id,
          email,
          full_name
        )
      `)
      .order("created_at", { ascending: false })

    // Only filter by verification if explicitly requested
    if (verified === "true") {
      query = query.eq("is_verified", true)
    }
    // Otherwise, return all reviews regardless of verification status

    if (limit !== "all") {
      query = query.limit(parseInt(limit))
    }

    const { data: reviews, error } = await query

    console.log("API Debug - Reviews query result:", { 
      reviewsCount: reviews?.length || 0, 
      error: error,
      sampleReview: reviews?.[0]
    })

    if (error) {
      console.error("Error fetching trip reviews:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch reviews", details: error.message },
        { status: 500 }
      )
    }

    // Transform the data to match the frontend expectations
    const transformedReviews = reviews?.map((review) => {
      // Extract user name from users table
      const userName = review.client?.full_name || 
                     review.booking_trip?.full_name || 
                     "Anonymous"
      
      return {
        id: review.id,
        name: userName,
        rating: review.rating,
        review: review.review_text,
        location: review.location || review.booking_trip?.destination || "Unknown Location",
        highlight: review.highlight || "Amazing Experience",
        photos: review.photos_count || 0,
        date: new Date(review.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        avatar: review.client?.avatar_url || review.avatar_url || null,
        locationImage: review.location_image_url || null,
        reviewImages: review.review_images || [],
        isVerified: review.is_verified,
        bookingTripId: review.booking_trip_id,
        clientId: review.client_id,
      }
    }) || []

    return NextResponse.json({
      success: true,
      reviews: transformedReviews,
    })
  } catch (error) {
    console.error("Error in GET /api/reviews/trips:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      booking_trip_id,
      client_id,
      rating,
      review_text,
      location,
      highlight,
      photos_count = 0,
      review_images = [],
      avatar_url,
      location_image_url,
    } = body

    // Validate required fields
    if (!booking_trip_id || !client_id || !rating || !review_text) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Check if review already exists for this booking
    const { data: existingReview, error: checkError } = await supabase
      .from("review_trip")
      .select("id")
      .eq("booking_trip_id", booking_trip_id)
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
        { status: 409 }
      )
    }

    // Calculate actual photos count from review_images array
    const actualPhotosCount = review_images && Array.isArray(review_images) ? review_images.length : 0
    
    // Prepare image metadata
    const imageMetadata = {
      has_avatar: !!avatar_url,
      has_images: actualPhotosCount > 0,
      updated_at: new Date().toISOString(),
      image_count: actualPhotosCount,
      has_location_image: !!location_image_url
    }

    // Validate and process review_images
    let processedReviewImages = []
    if (review_images && Array.isArray(review_images)) {
      processedReviewImages = review_images.filter(img => {
        // Only accept valid base64 image data
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          return true
        }
        return false
      })
    }

    console.log("Processing review data:", {
      booking_trip_id,
      client_id,
      rating,
      review_text,
      location,
      highlight,
      photos_count: actualPhotosCount,
      review_images_count: processedReviewImages.length,
      avatar_url: !!avatar_url,
      location_image_url: !!location_image_url,
      image_metadata: imageMetadata,
      is_verified: false
    })

    // Convert empty strings to null for URL fields to satisfy check constraints
    const insertData = {
      booking_trip_id,
      client_id,
      rating,
      review_text,
      location,
      highlight,
      photos_count: processedReviewImages.length,
      review_images: processedReviewImages,
      avatar_url: avatar_url || null,
      location_image_url: location_image_url || null,
      image_metadata: imageMetadata,
      is_verified: false, // Reviews start as unverified
    }

    console.log("Final insert data:", insertData)

    const { data: review, error } = await supabase
      .from("review_trip")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("Error creating trip review:", error)
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // Provide more specific error messages
      let errorMessage = "Failed to create review"
      if (error.code === '42501') {
        errorMessage = "Permission denied. Please check your authentication."
      } else if (error.code === '23505') {
        errorMessage = "A review already exists for this booking."
      } else if (error.code === '23502') {
        errorMessage = "Missing required fields."
      } else if (error.code === '23514') {
        errorMessage = "Invalid data format. Please check your input."
      } else if (error.code === '23503') {
        errorMessage = "User not found. Please check your account."
      } else if (error.code === '22P02') {
        errorMessage = "Invalid UUID format for booking_trip_id or client_id."
      } else if (error.code === '22001') {
        errorMessage = "Data too long for column. Check image data size."
      } else if (error.code === '23513') {
        errorMessage = "Check constraint violation. Please check your input data."
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage, details: error.message },
        { status: 500 }
      )
    }

    console.log("Successfully created review:", {
      id: review.id,
      photos_count: review.photos_count,
      review_images_count: review.review_images?.length || 0,
      image_metadata: review.image_metadata
    })

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        booking_trip_id: review.booking_trip_id,
        client_id: review.client_id,
        rating: review.rating,
        review_text: review.review_text,
        location: review.location,
        highlight: review.highlight,
        photos_count: review.photos_count,
        review_images: review.review_images,
        image_metadata: review.image_metadata,
        is_verified: review.is_verified,
        created_at: review.created_at,
      },
    })
  } catch (error) {
    console.error("Error in POST /api/reviews/trips:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 