import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { editor_id, image_url, title, description, category, image_type, is_public } = body

    if (!editor_id || !image_url) {
      return NextResponse.json(
        { success: false, error: "Editor ID and image URL are required" },
        { status: 400 }
      )
    }

    // Insert image into editor_images table
    const { data: newImage, error } = await supabase
      .from("editor_images")
      .insert({
        editor_id,
        image_url,
        title: title || "Untitled",
        description: description || "",
        category: category || "General",
        image_type: image_type || "portfolio",
        is_public: is_public !== false
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting editor image:", error)
      return NextResponse.json(
        { success: false, error: "Failed to add image" },
        { status: 500 }
      )
    }

    // Also update the portfolio_urls array in editor_profiles for backward compatibility
    const { data: currentProfile, error: fetchError } = await supabase
      .from("editor_profiles")
      .select("portfolio_urls")
      .eq("id", editor_id)
      .single()

    if (!fetchError && currentProfile && image_type === "portfolio") {
      const currentPortfolio = currentProfile.portfolio_urls || []
      const updatedPortfolio = [...currentPortfolio, image_url]

      await supabase
        .from("editor_profiles")
        .update({
          portfolio_urls: updatedPortfolio,
          updated_at: new Date().toISOString()
        })
        .eq("id", editor_id)
    }

    return NextResponse.json({
      success: true,
      message: "Image added successfully",
      image: newImage
    })
  } catch (error) {
    console.error("Add editor image error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const editor_id = searchParams.get("editor_id")
    const image_type = searchParams.get("image_type")

    if (!editor_id) {
      return NextResponse.json(
        { success: false, error: "Editor ID is required" },
        { status: 400 }
      )
    }

    let query = supabase
      .from("editor_images")
      .select("*")
      .eq("editor_id", editor_id)

    if (image_type) {
      query = query.eq("image_type", image_type)
    }

    const { data: images, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching editor images:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch images" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      images: images || []
    })
  } catch (error) {
    console.error("Fetch editor images error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 