import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createServerClient()

  try {
    // Fetch photographers who are elite and available
    const { data: photographers, error } = await supabase
      .from("photographer_profiles")
      .select(`
        *,
        users!inner(id, full_name, email, phone_number, profile_image_url, bio)
      `)
      .eq("photographer_type", "elite")
      .eq("is_available", true)
      .order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching photographers:", error)
      return NextResponse.json({ error: "Failed to fetch photographers" }, { status: 500 })
    }

    // If no photographers found, return test data
    if (!photographers || photographers.length === 0) {
      console.log("No photographers found in database, returning test data")
      const testPhotographers = [
        {
          id: "test-photographer-1",
          name: "Test Photographer 1",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
          specialization: "Professional Photography",
          awards: ["Best Photographer 2023"],
          celebrities: ["Test Celebrity 1", "Test Celebrity 2"],
          portfolio: [
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          ],
          social: {
            instagram: "@testphotographer1",
            twitter: "@testphotographer1",
            facebook: "testphotographer1",
          },
          bio: "Professional photographer with years of experience.",
          experience: "5+ years",
          rate: "$50/hour",
          equipment: "Professional equipment",
          location: "New York",
          availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          languages: ["English"],
        }
      ]
      return NextResponse.json(testPhotographers)
    }

    // Transform the data to match the frontend expectations
    const transformedPhotographers = await Promise.all(photographers.map(async (photographer, index) => {
      // Fetch portfolio images for this photographer using the profile ID
      const { data: portfolioImages, error: portfolioError } = await supabase
        .from("portfolio_images")
        .select("*")
        .eq("photographer_id", photographer.id) // Use the profile ID, not the user_id
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      if (portfolioError) {
        console.error("Error fetching portfolio images:", portfolioError)
      }

      // Fetch reviews for this photographer
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          *,
          reviewer:reviewer_id(id, full_name, profile_image_url),
          booking:booking_id(id, title, event_date)
        `)
        .eq("reviewee_id", photographer.users.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError)
      }

      // Calculate average rating
      const averageRating = reviews && reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : photographer.rating || 4.5

      // Process portfolio images
      let portfolioImagesUrls = []
      if (portfolioImages && portfolioImages.length > 0) {
        portfolioImagesUrls = portfolioImages.map(img => img.image_url)
      } else {
        // Fallback to portfolio_images array from photographer_profiles
        if (photographer.portfolio_images && Array.isArray(photographer.portfolio_images)) {
          portfolioImagesUrls = photographer.portfolio_images
            .filter(photo => typeof photo === 'string')
        }
      }

      // Fallback to default images if no portfolio
      if (portfolioImagesUrls.length === 0) {
        portfolioImagesUrls = [
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          "https://images.unsplash.com/photo-1521577352947-9bb58764b69a",
          "https://images.unsplash.com/photo-1488161628813-04466f872be2",
          "https://images.unsplash.com/photo-1492288991661-058aa541ff43",
          "https://images.unsplash.com/photo-1502324166188-b4fe5151460b",
        ]
      }

      const transformedPhotographer = {
        id: photographer.users.id, // Use the actual user ID from database
        name: photographer.users.full_name || "Unknown Photographer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", // Default image since avatar_url might not exist
        profile_image_url: photographer.users.profile_image_url || "", // Add profile image URL from users table
        specialization: photographer.specializations?.join(", ") || photographer.specialties?.join(", ") || "Professional Photography",
        awards: photographer.awards ? [photographer.awards] : [],
        celebrities: photographer.celebrity_clients ? photographer.celebrity_clients.split(",").map(c => c.trim()) : [],
        portfolio: portfolioImagesUrls,
        social: {
          instagram: photographer.instagram_handle ? `@${photographer.instagram_handle}` : "",
          twitter: photographer.twitter_handle ? `@${photographer.twitter_handle}` : "",
          facebook: photographer.facebook_handle || "",
        },
        bio: photographer.bio || photographer.users.bio || "Professional photographer with years of experience in capturing life's precious moments.",
        experience: `${photographer.experience_years || 0}+ years`,
        rate: `$${photographer.hourly_rate || 0}/hour`,
        equipment: Array.isArray(photographer.equipment) ? photographer.equipment.join(", ") : photographer.equipment || "Professional equipment",
        location: photographer.location || photographer.location_city || "Not specified",
        availability: photographer.availability || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        languages: photographer.languages || ["English"],
        rating: averageRating,
        total_reviews: reviews?.length || 0,
        reviews: reviews?.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at ? new Date(review.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
          reviewer: {
            id: review.reviewer?.id || "",
            full_name: review.reviewer?.full_name || "Anonymous",
            profile_image_url: review.reviewer?.profile_image_url || "",
          },
          booking_title: review.booking?.title || "Event",
          event_date: review.booking?.event_date || "",
        })) || [],
      }

      console.log(`Transformed photographer ${index + 1}:`, {
        original_id: photographer.id,
        user_id: photographer.users.id,
        transformed_id: transformedPhotographer.id,
        name: transformedPhotographer.name
      })

      return transformedPhotographer
    }))

    return NextResponse.json(transformedPhotographers)
  } catch (error) {
    console.error("Error in photographers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 