import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
        },
        { status: 500 },
      )
    }

    // Test connection with a simple query
    const testUrl = `${supabaseUrl}/rest/v1/users?select=count&limit=1`

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        {
          error: "Database connection failed",
          status: response.status,
          statusText: response.statusText,
          details: errorText,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      url: supabaseUrl.substring(0, 30) + "...",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Connection test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
