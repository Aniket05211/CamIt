import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { storage } from "@/lib/database"

export async function GET() {
  try {
    console.log("=== Profile API Called ===")

    // Get current user from session
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 },
      )
    }

    console.log("Profile fetched for user:", user.id)

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("=== Profile Update API Called ===")

    // Get current user from session
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 },
      )
    }

    const updates = await request.json()
    console.log("Profile updates for user:", user.id, updates)

    // Update user
    const updatedUser = await storage.updateUser(user.id, updates)

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      )
    }

    // Remove password hash from response
    const { password_hash: _, ...userWithoutPassword } = updatedUser

    console.log("Profile updated successfully for user:", user.id)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
