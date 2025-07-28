import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

export async function POST() {
  try {
    console.log("=== Debug Registration Test ===")

    // Ensure directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
      console.log("Created data directory")
    }

    const testUserId = "test_" + Date.now()
    console.log("Test user ID:", testUserId)

    // Create test data
    const testUser = {
      id: testUserId,
      email: "test@example.com",
      full_name: "Test User",
      phone_number: "1234567890",
      user_type: "cameraman",
      created_at: new Date().toISOString(),
    }

    const testProfile = {
      id: `cam_${testUserId}`,
      user_id: testUserId,
      bio: "Test bio",
      equipment: "Test equipment",
      experience_years: 5,
      hourly_rate: 100,
      specialties: ["Wedding", "Portrait"],
      languages: ["English"],
      availability: ["Weekends"],
      location: "Test City",
      is_available: true,
      is_verified: false,
      rating: 5.0,
      total_reviews: 0,
      awards: "",
      celebrity_clients: "",
      cameraman_type: "elite",
      portfolio: [],
      upcoming_events: [],
      recent_reviews: [],
      earnings: { total: 0, thisMonth: 0, lastMonth: 0 },
      stats: { totalBookings: 0, completedEvents: 0, cancelledEvents: 0, averageRating: 5.0 },
      created_at: new Date().toISOString(),
    }

    // Read existing data
    let users = []
    let cameramen = []

    const usersFile = path.join(DATA_DIR, "users.json")
    const cameramenFile = path.join(DATA_DIR, "cameramen.json")

    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, "utf8"))
    }

    if (fs.existsSync(cameramenFile)) {
      cameramen = JSON.parse(fs.readFileSync(cameramenFile, "utf8"))
    }

    console.log("Before: Users:", users.length, "Cameramen:", cameramen.length)

    // Add test data
    users.push(testUser)
    cameramen.push(testProfile)

    console.log("After: Users:", users.length, "Cameramen:", cameramen.length)

    // Write to files
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
    fs.writeFileSync(cameramenFile, JSON.stringify(cameramen, null, 2))

    console.log("Files written successfully")

    // Verify
    const verifyUsers = JSON.parse(fs.readFileSync(usersFile, "utf8"))
    const verifyCameramen = JSON.parse(fs.readFileSync(cameramenFile, "utf8"))

    console.log("Verification: Users:", verifyUsers.length, "Cameramen:", verifyCameramen.length)

    return NextResponse.json({
      success: true,
      message: "Test registration completed",
      data: {
        testUserId,
        usersCount: verifyUsers.length,
        cameramenCount: verifyCameramen.length,
        testUser,
        testProfile,
      },
    })
  } catch (error) {
    console.error("Debug registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Debug registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
