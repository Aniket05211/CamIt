import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { photoUrl } = await request.json()
    const supabase = await createServiceClient()

    console.log("Adding photo for cameraman:", id, photoUrl)

    // Get current portfolio
    const { data: profile, error: fetchError } = await supabase
      .from("photographer_profiles")
      .select("portfolio_images")
      .eq("user_id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching profile:", fetchError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch profile",
          details: fetchError.message,
        },
        { status: 500 },
      )
    }

    // Add new photo to portfolio
    const currentPortfolio = profile?.portfolio_images || []
    const updatedPortfolio = [...currentPortfolio, photoUrl]

    const { error: updateError } = await supabase
      .from("cameraman_profiles")
      .update({
        portfolio_images: updatedPortfolio,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", id)

    if (updateError) {
      console.error("Error updating portfolio:", updateError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to add photo",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Photo added successfully",
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
