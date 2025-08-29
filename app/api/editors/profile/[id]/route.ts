import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { id: userId } = await params

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    // Fetch editor profile with user data
    const { data: editorProfile, error } = await supabase
      .from("editor_profiles")
      .select(`
        *,
        user:user_id(
          id,
          full_name,
          email,
          phone_number
        )
      `)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching editor profile:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch editor profile" },
        { status: 500 }
      )
    }

    if (!editorProfile) {
      return NextResponse.json(
        { success: false, error: "Editor profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      editor_profile: editorProfile,
      user: editorProfile.user
    })
  } catch (error) {
    console.error("Error in GET /api/editors/profile/[id]:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { id: userId } = await params
    const body = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    // Create editor profile
    const { data: createdProfile, error } = await supabase
      .from("editor_profiles")
      .insert({
        user_id: userId,
        project_rate: body.project_rate || 0,
        hourly_rate: body.hourly_rate || 0,
        experience_years: body.experience_years || 0,
        turnaround_time: body.turnaround_time || 24,
        bio: body.bio || "",
        specializations: body.specializations || [],
        software_skills: body.software_skills || [],
        languages: body.languages || [],
        availability_status: body.availability_status || "available",
        portfolio_urls: body.portfolio_urls || [],
        location: body.location || "",
        before_after_samples: body.before_after_samples || [],
        recent_reviews: body.recent_reviews || [],
        earnings: body.earnings || { total: 0, thisMonth: 0, lastMonth: 0 },
        stats: body.stats || { totalProjects: 0, completedProjects: 0, cancelledProjects: 0, averageRating: 0 },
        full_service_rate: body.full_service_rate || "75-200",
        instagram_handle: body.instagram_handle || "",
        twitter_handle: body.twitter_handle || "",
        youtube_handle: body.youtube_handle || "",
        facebook_handle: body.facebook_handle || "",
        awards: body.awards || [],
        profile_urls: body.profile_urls || "",
        rating: 0,
        total_reviews: 0
      })
      .select()
      .single()

    // Also update user's phone number if provided
    if (body.phone_number) {
      await supabase
        .from("users")
        .update({
          phone_number: body.phone_number,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId)
    }

    if (error) {
      console.error("Error creating editor profile:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create editor profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      editor_profile: createdProfile
    })
  } catch (error) {
    console.error("Error in POST /api/editors/profile/[id]:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { id: userId } = await params
    const body = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    // Update editor profile
    const { data: updatedProfile, error } = await supabase
      .from("editor_profiles")
      .update({
        project_rate: body.project_rate,
        hourly_rate: body.hourly_rate,
        experience_years: body.experience_years,
        turnaround_time: body.turnaround_time,
        bio: body.bio,
        specializations: body.specializations,
        software_skills: body.software_skills,
        languages: body.languages,
        availability_status: body.availability_status,
        portfolio_urls: body.portfolio_urls,
        location: body.location,
        before_after_samples: body.before_after_samples,
        recent_reviews: body.recent_reviews,
        earnings: body.earnings,
        stats: body.stats,
        full_service_rate: body.full_service_rate,
        instagram_handle: body.instagram_handle,
        twitter_handle: body.twitter_handle,
        youtube_handle: body.youtube_handle,
        facebook_handle: body.facebook_handle,
        awards: body.awards,
        profile_urls: body.profile_urls,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select()
      .single()

    // Also update user's phone number if provided
    if (body.phone_number) {
      await supabase
        .from("users")
        .update({
          phone_number: body.phone_number,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId)
    }

    if (error) {
      console.error("Error updating editor profile:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update editor profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      editor_profile: updatedProfile
    })
  } catch (error) {
    console.error("Error in PUT /api/editors/profile/[id]:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 