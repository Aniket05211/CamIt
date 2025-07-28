import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export interface StoredUser {
  id: string
  email: string
  full_name: string
  phone_number?: string
  user_type: string
  created_at: string
}

export interface StoredCameramanProfile {
  id: string
  user_id: string
  bio: string
  equipment: string
  experience_years: number
  hourly_rate?: number
  specialties: string[]
  languages: string[]
  availability: string[]
  location: string
  is_available: boolean
  is_verified: boolean
  rating: number
  total_reviews: number
  awards?: string
  celebrity_clients?: string
  cameraman_type: string
  portfolio: string[]
  upcoming_events: Array<{
    id: string
    title: string
    date: string
    location: string
    type: string
  }>
  recent_reviews: Array<{
    id: string
    name: string
    rating: number
    comment: string
    date: string
    avatar: string
  }>
  earnings: {
    total: number
    thisMonth: number
    lastMonth: number
  }
  stats: {
    totalBookings: number
    completedEvents: number
    cancelledEvents: number
    averageRating: number
  }
  created_at: string
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename)
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2))
      return defaultValue
    }
    const data = fs.readFileSync(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return defaultValue
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  try {
    const filePath = path.join(DATA_DIR, filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`Successfully wrote ${filename}`)
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

export function getUsers(): StoredUser[] {
  return readJsonFile<StoredUser[]>("users.json", [])
}

export function saveUsers(users: StoredUser[]): void {
  writeJsonFile("users.json", users)
}

export function getCameramen(): StoredCameramanProfile[] {
  return readJsonFile<StoredCameramanProfile[]>("cameramen.json", [])
}

export function saveCameramen(cameramen: StoredCameramanProfile[]): void {
  writeJsonFile("cameramen.json", cameramen)
}

export function updateUserProfile(userId: string, updates: Partial<StoredUser>): boolean {
  try {
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      console.error("User not found:", userId)
      return false
    }

    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates }
    saveUsers(users)

    console.log("User profile updated:", userId, updates)
    return true
  } catch (error) {
    console.error("Error updating user profile:", error)
    return false
  }
}

export function updateCameramanProfile(userId: string, updates: Partial<StoredCameramanProfile>): boolean {
  try {
    const cameramen = getCameramen()
    const profileIndex = cameramen.findIndex((c) => c.user_id === userId)

    if (profileIndex === -1) {
      console.error("Cameraman profile not found for user:", userId)
      return false
    }

    // Update cameraman profile data
    cameramen[profileIndex] = { ...cameramen[profileIndex], ...updates }
    saveCameramen(cameramen)

    console.log("Cameraman profile updated:", userId, updates)
    return true
  } catch (error) {
    console.error("Error updating cameraman profile:", error)
    return false
  }
}

export function addEventToCameraman(
  userId: string,
  eventData: {
    title: string
    date: string
    location: string
    type: string
  },
): boolean {
  try {
    const cameramen = getCameramen()
    const profileIndex = cameramen.findIndex((c) => c.user_id === userId)

    if (profileIndex === -1) {
      return false
    }

    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
    }

    if (!cameramen[profileIndex].upcoming_events) {
      cameramen[profileIndex].upcoming_events = []
    }

    cameramen[profileIndex].upcoming_events.push(newEvent)
    saveCameramen(cameramen)

    console.log("Event added:", newEvent)
    return true
  } catch (error) {
    console.error("Error adding event:", error)
    return false
  }
}

export function addPhotoToCameraman(userId: string, photoUrl: string): boolean {
  try {
    const cameramen = getCameramen()
    const profileIndex = cameramen.findIndex((c) => c.user_id === userId)

    if (profileIndex === -1) {
      return false
    }

    if (!cameramen[profileIndex].portfolio) {
      cameramen[profileIndex].portfolio = []
    }

    cameramen[profileIndex].portfolio.push(photoUrl)
    saveCameramen(cameramen)

    console.log("Photo added:", photoUrl)
    return true
  } catch (error) {
    console.error("Error adding photo:", error)
    return false
  }
}
