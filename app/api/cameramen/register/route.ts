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
    console.log("Reading file:", filePath)

    if (!fs.existsSync(filePath)) {
      console.log("File doesn't exist, creating with default value:", filename)
      writeJsonFile(filename, defaultValue)
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
    console.log("Data to write:", JSON.stringify(data, null, 2))

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

export async function POST(request: Request) {
  try {
    console.log("=== Cameraman Registration API Called ===")
    const formData = await request.json()
    console.log("Registration data received:", formData)

    // Generate unique ID
    const userId = Date.now().toString()
    console.log("Generated user ID:", userId)

    // Read existing data
    const users = readJsonFile("users.json", [])
    const cameramen = readJsonFile("cameramen.json", [])

    console.log("Current users count:", users.length)
    console.log("Current cameramen count:", cameramen.length)

    // Create user record
    const newUser = {
      id: userId,
      email: formData.email,
      full_name: formData.fullName,
      phone_number: formData.phoneNumber,
      user_type: "cameraman",
      created_at: new Date().toISOString(),
    }

    // Create cameraman profile
    const newCameramanProfile = {
      id: `cam_${userId}`,
      user_id: userId,
      bio: formData.bio || "",
      equipment: formData.equipment || "",
      experience_years: Number.parseInt(formData.experienceYears) || 0,
      hourly_rate: Number.parseFloat(formData.hourlyRate) || 0,
      specialties: formData.specialties || [],
      languages: formData.languages || [],
      availability: formData.availability || [],
      location: formData.location || "",
      is_available: true,
      is_verified: false,
      rating: 5.0,
      total_reviews: 0,
      awards: formData.awards || "",
      celebrity_clients: formData.celebrityClients || "",
      cameraman_type: formData.cameramanType || "elite",
      portfolio: [],
      upcoming_events: [],
      recent_reviews: [],
      earnings: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
      },
      stats: {
        totalBookings: 0,
        completedEvents: 0,
        cancelledEvents: 0,
        averageRating: 5.0,
      },
      created_at: new Date().toISOString(),
    }

    console.log("New user record:", newUser)
    console.log("New cameraman profile:", newCameramanProfile)

    // Add to arrays
    users.push(newUser)
    cameramen.push(newCameramanProfile)

    console.log("Updated users count:", users.length)
    console.log("Updated cameramen count:", cameramen.length)

    // Save to files
    writeJsonFile("users.json", users)
    writeJsonFile("cameramen.json", cameramen)

    console.log("Registration completed successfully")

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      data: {
        userId: userId,
        user: newUser,
        profile: newCameramanProfile,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
