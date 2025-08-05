import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { photoUrl, title, description, category, isPublic } = await request.json()
    const supabase = await createServiceClient()

    console.log("Adding photo for cameraman:", id, { photoUrl, title, description, category, isPublic })

    // First, get the photographer profile ID
    const { data: profile, error: profileError } = await supabase
      .from("photographer_profiles")
      .select("id")
      .eq("user_id", id)
      .single()

    if (profileError) {
      console.error("Error fetching photographer profile:", profileError)
      return NextResponse.json(
        {
          success: false,
          error: "Photographer profile not found",
          details: profileError.message,
        },
        { status: 404 },
      )
    }

    // Insert into portfolio_images table using the profile ID
    const { data: newPhoto, error: insertError } = await supabase
      .from("portfolio_images")
      .insert({
        photographer_id: profile.id, // Use the profile ID, not the user ID
        image_url: photoUrl,
        title: title || "Untitled",
        description: description || "",
        category: category || "General",
        is_public: isPublic !== false, // Default to true
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting photo:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to add photo",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    // Also update the portfolio_images array in photographer_profiles for backward compatibility
    const { data: currentProfile, error: fetchError } = await supabase
      .from("photographer_profiles")
      .select("portfolio_images")
      .eq("user_id", id)
      .single()

    if (!fetchError && currentProfile) {
      const currentPortfolio = currentProfile.portfolio_images || []
      const updatedPortfolio = [...currentPortfolio, photoUrl]

      await supabase
        .from("photographer_profiles")
        .update({
          portfolio_images: updatedPortfolio,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", id)
    }

    return NextResponse.json({
      success: true,
      message: "Photo added successfully",
      photo: newPhoto,
    })
  } catch (error) {
    console.error("Add photo error:", error)
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
