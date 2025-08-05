import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"
    const available = searchParams.get("available") || "true"

    let query = supabase
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
      .order("rating", { ascending: false })

    // Filter by availability if requested
    if (available === "true") {
      query = query.eq("availability_status", "available")
    } else if (available === "false") {
      query = query.eq("availability_status", "busy")
    }

    if (limit !== "all") {
      query = query.limit(parseInt(limit))
    }

    const { data: editors, error } = await query

    if (error) {
      console.error("Error fetching editors:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch editors" },
        { status: 500 }
      )
    }

    // If no editors found, return empty array instead of error
    if (!editors || editors.length === 0) {
      return NextResponse.json({
        success: true,
        editors: [],
        message: "No editors found"
      })
    }

    // Transform the data to match frontend expectations
    const transformedEditors = editors?.map((editor) => ({
      id: editor.user?.id,
      name: editor.user?.full_name || "Editor",
      email: editor.user?.email || "",
      phone: editor.user?.phone_number || "",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080",
      type: editor.specializations?.includes("Video Editing") ? "both" : "photo",
      location: editor.location || "",
      experience: editor.experience_years?.toString() || "0",
      rate: editor.project_rate?.toString() || "0",
      hourlyRate: editor.hourly_rate?.toString() || "0",
      specialties: editor.specializations || [],
      software: editor.software_skills || [],
      bio: editor.bio || "",
      languages: editor.languages || [],
      turnaround: editor.turnaround_time?.toString() || "24",
      rating: editor.rating || 0,
      reviews: editor.total_reviews || 0,
      portfolio: editor.portfolio_urls || [],
      availability: editor.availability_status || "available",
      isAvailable: editor.availability_status === "available",
      instagram_handle: editor.instagram_handle || "",
      twitter_handle: editor.twitter_handle || "",
      youtube_handle: editor.youtube_handle || "",
      facebook_handle: editor.facebook_handle || ""
    })) || []

    return NextResponse.json({
      success: true,
      editors: transformedEditors,
    })
  } catch (error) {
    console.error("Error in GET /api/editors:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 