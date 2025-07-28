import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
} catch (error) {
  console.error("Error creating data directory:", error)
}

export interface SimpleUser {
  id: string
  email: string
  full_name: string
  phone_number?: string
  user_type: string
  avatar_url?: string
  created_at: string
}

export interface SimpleCameramanProfile {
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
  created_at: string
}

function getFilePath(filename: string): string {
  return path.join(DATA_DIR, filename)
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  try {
    const filePath = getFilePath(filename)
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
    const filePath = getFilePath(filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

export function getAllUsers(): SimpleUser[] {
  return readJsonFile<SimpleUser[]>("users.json", [])
}

export function saveUsers(users: SimpleUser[]): void {
  writeJsonFile("users.json", users)
}

export function getAllCameramen(): SimpleCameramanProfile[] {
  return readJsonFile<SimpleCameramanProfile[]>("cameramen.json", [])
}

export function saveCameramen(cameramen: SimpleCameramanProfile[]): void {
  writeJsonFile("cameramen.json", cameramen)
}

export function generateSimpleId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function findUserByEmail(email: string): SimpleUser | null {
  const users = getAllUsers()
  return users.find((user) => user.email === email) || null
}

export function createSimpleUser(userData: Omit<SimpleUser, "id" | "created_at">): SimpleUser {
  const users = getAllUsers()
  const newUser: SimpleUser = {
    ...userData,
    id: generateSimpleId(),
    created_at: new Date().toISOString(),
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function createSimpleCameramanProfile(
  profileData: Omit<SimpleCameramanProfile, "id" | "created_at">,
): SimpleCameramanProfile {
  const cameramen = getAllCameramen()
  const newProfile: SimpleCameramanProfile = {
    ...profileData,
    id: generateSimpleId(),
    created_at: new Date().toISOString(),
  }
  cameramen.push(newProfile)
  saveCameramen(cameramen)
  return newProfile
}
