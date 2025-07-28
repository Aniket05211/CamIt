import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, phone_number, user_type } = await request.json();

    // Validate required fields
    if (!email || !password || !full_name || !user_type) {
      return NextResponse.json(
        { error: "Missing required fields", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient(); // ✅ FIXED: Added await here

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing user:", checkError);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists", code: "USER_EXISTS" },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Insert new user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password_hash,
        full_name,
        phone_number: phone_number || null,
        user_type,
        is_verified: false,
      })
      .select()
      .maybeSingle();

    if (userError) {
      console.error("User creation error:", userError);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    // Optional: Create photographer profile
    if (user_type === "photographer") {
      const { error: profileError } = await supabase.from("cameraman_profiles").insert({
        user_id: user.id,
        bio: "",
        experience_years: 0,
        hourly_rate: 0,
        location: "",
        specialties: [],
        equipment: [],
        portfolio_images: [],
        availability: true,
        rating: 0,
        total_reviews: 0,
      });

      if (profileError) {
        console.error("Photographer profile creation error:", profileError);
      }
    }

    // Remove hashed password from response
    const { password_hash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
