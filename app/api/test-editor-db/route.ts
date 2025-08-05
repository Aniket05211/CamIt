import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from("editor_profiles")
      .select("count")
      .limit(1)
    
    if (testError) {
      console.error("Database connection error:", testError)
      return NextResponse.json({
        success: false,
        error: "Database connection failed",
        details: testError
      }, { status: 500 })
    }
    
    // Get all editor profiles
    const { data: editors, error } = await supabase
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
    
    if (error) {
      console.error("Error fetching editor profiles:", error)
      return NextResponse.json({
        success: false,
        error: "Failed to fetch editor profiles",
        details: error
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      count: editors?.length || 0,
      editors: editors || [],
      message: `Found ${editors?.length || 0} editor profiles`
    })
  } catch (error) {
    console.error("Error in test-editor-db:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: error
    }, { status: 500 })
  }
} 