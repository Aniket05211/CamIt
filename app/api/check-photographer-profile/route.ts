import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get("user_id")
  if (!user_id) return NextResponse.json({ exists: false })

  const { data, error } = await supabase
    .from("photographer_profiles")
    .select("id")
    .eq("user_id", user_id)
    .single()

  return NextResponse.json({ exists: !!data })
}