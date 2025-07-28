import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    console.log("Creating data directory:", DATA_DIR)
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readJsonFile(filename: string, defaultValue: any) {
  try {
    ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)

    if (!fs.existsSync(filePath)) {
      console.log("File doesn't exist, creating:", filename)
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2))
      return defaultValue
    }

    const data = fs.readFileSync(filePath, "utf8")
    const parsed = JSON.parse(data)
    console.log(`Read ${filename}: ${parsed.length} records`)
    return parsed
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return defaultValue
  }
}

function writeJsonFile(filename: string, data: any) {
  try {
    ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)
    console.log("Writing to file:", filePath)

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`Successfully wrote ${filename}`)

    // Verify the write
    const verification = fs.readFileSync(filePath, "utf8")
    const parsed = JSON.parse(verification)
    console.log(`Verification: ${filename} now has ${parsed.length} records`)
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("=== Creating Test Registration ===")

    // Generate unique ID
    const userId = Date.now().toString()
    console.log("Generated test user ID:", userId)

    // Read existing data
    const users = readJsonFile("users.json", [])
    const cameramen = readJsonFile("cameramen.json", [])

    console.log("Current users count:", users.length)
    console.log("Current cameramen count:", cameramen.length)

    // Create test user record
    const testUser = {
      id: userId,
      email: "test@example.com",
      full_name: "Test Cameraman",
      phone_number: "+1234567890",
      user_type: "cameraman",
      created_at: new Date().toISOString(),
    }

    // Create test cameraman profile
    const testCameramanProfile = {
      id: `cam_${userId}`,
      user_id: userId,
      bio: "Professional test cameraman with years of experience",
      equipment: "Canon EOS R5, Sony FX3, Various lenses",
      experience_years: 5,
      hourly_rate: 150,
      specialties: ["Wedding", "Corporate", "Event"],
      languages: ["English", "Spanish"],
      availability: ["Weekends", "Evenings"],
      location: "New York, NY",
      is_available: true,
      is_verified: false,
      rating: 4.8,
      total_reviews: 25,
      awards: "Best Wedding Photographer 2023",
      celebrity_clients: "Various local celebrities",
      cameraman_type: "elite",
      portfolio: [
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500",
      ],
      upcoming_events: [
        {
          id: "event_1",
          title: "Wedding Photography",
          date: "2024-02-15",
          location: "Central Park",
          type: "Wedding",
        },
      ],
      recent_reviews: [
        {
          id: "review_1",
          name: "John Smith",
          rating: 5,
          comment: "Amazing work! Highly recommended.",
          date: "2024-01-15",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        },
      ],
      earnings: {
        total: 15000,
        thisMonth: 2500,
        lastMonth: 2000,
      },
      stats: {
        totalBookings: 45,
        completedEvents: 42,
        cancelledEvents: 3,
        averageRating: 4.8,
      },
      created_at: new Date().toISOString(),
    }

    console.log("Test user record:", testUser)
    console.log("Test cameraman profile:", testCameramanProfile)

    // Add to arrays
    users.push(testUser)
    cameramen.push(testCameramanProfile)

    console.log("Updated users count:", users.length)
    console.log("Updated cameramen count:", cameramen.length)

    // Save to files
    writeJsonFile("users.json", users)
    writeJsonFile("cameramen.json", cameramen)

    console.log("Test registration completed successfully")

    return NextResponse.json({
      success: true,
      message: "Test registration created successfully",
      testUserId: userId,
      user: testUser,
      profile: testCameramanProfile,
      instructions: `
        Test user created with ID: ${userId}
        
        To test the dashboard:
        1. Store this user ID in localStorage: localStorage.setItem('camit_user', '{"id":"${userId}"}')
        2. Visit /cameraman-dashboard
        
        Or use this JavaScript in browser console:
        localStorage.setItem('camit_user', '{"id":"${userId}"}');
        window.location.href = '/cameraman-dashboard';
      `,
    })
  } catch (error) {
    console.error("Test registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
