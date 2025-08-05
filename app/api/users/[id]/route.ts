import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()
    const body = await request.json()

    console.log("Updating user with ID:", id)
    console.log("Request body:", body)

    // Validate the request body
    const { profile_image_url, bio, full_name, phone_number } = body

    // Only allow updating specific fields
    const updateData: any = {}
    if (profile_image_url !== undefined && profile_image_url !== null && profile_image_url !== "") {
      updateData.profile_image_url = profile_image_url
      console.log("Setting profile_image_url to:", profile_image_url)
    }
    if (bio !== undefined && bio !== null && bio !== "") {
      updateData.bio = bio
      console.log("Setting bio to:", bio)
    }
    if (full_name !== undefined && full_name !== null && full_name !== "") {
      updateData.full_name = full_name
    }
    if (phone_number !== undefined && phone_number !== null && phone_number !== "") {
      updateData.phone_number = phone_number
    }

    console.log("Final update data:", updateData)

    // Update the user
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating user:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update user profile", details: error },
        { status: 500 }
      )
    }

    console.log("Successfully updated user:", updatedUser)

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error("Error in user update API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching user:", error)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error("Error in user fetch API:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
} 