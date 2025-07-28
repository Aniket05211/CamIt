import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET() {
  try {
    console.log("Testing Supabase connection...")
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Supabase Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Test basic connection
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({
        success: false,
        error: "Supabase connection failed",
        details: error.message,
        code: error.code,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      data,
    })
  } catch (error) {
    console.error("Supabase test error:", error)
    return NextResponse.json({
      success: false,
      error: "Supabase test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
