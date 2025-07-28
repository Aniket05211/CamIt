import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const CAMERAMEN_FILE = path.join(DATA_DIR, "cameramen.json")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]))
}

if (!fs.existsSync(CAMERAMEN_FILE)) {
  fs.writeFileSync(CAMERAMEN_FILE, JSON.stringify([]))
}

export interface User {
  id: string
  email: string
  full_name: string
  phone_number?: string
  user_type: string
  avatar_url?: string
  created_at: string
}

export interface CameramanProfile {
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
  coordinates: number[]
  current_location: number[]
  is_available: boolean
  is_verified: boolean
  rating: number
  total_reviews: number
  awards?: string
  celebrity_clients?: string
  cameraman_type: string
  created_at: string
  portfolio?: string[]
  upcoming_events?: Array<{
    id: number
    title: string
    date: string
    location: string
    type: string
  }>
  recent_reviews?: Array<{
    id: number
    name: string
    rating: number
    comment: string
    date: string
    avatar: string
  }>
  earnings?: {
    total: number
    thisMonth: number
    lastMonth: number
  }
  stats?: {
    totalBookings: number
    completedEvents: number
    cancelledEvents: number
    averageRating: number
  }
}

export function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading users file:", error)
    return []
  }
}

export function writeUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error("Error writing users file:", error)
    throw error
  }
}

export function readCameramen(): CameramanProfile[] {
  try {
    const data = fs.readFileSync(CAMERAMEN_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading cameramen file:", error)
    return []
  }
}

export function writeCameramen(cameramen: CameramanProfile[]): void {
  try {
    fs.writeFileSync(CAMERAMEN_FILE, JSON.stringify(cameramen, null, 2))
  } catch (error) {
    console.error("Error writing cameramen file:", error)
    throw error
  }
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function findUserByEmail(email: string): User | null {
  const users = readUsers()
  return users.find((user) => user.email === email) || null
}

export function createUser(userData: Omit<User, "id" | "created_at">): User {
  const users = readUsers()
  const newUser: User = {
    ...userData,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  users.push(newUser)
  writeUsers(users)
  return newUser
}

export function createCameramanProfile(profileData: Omit<CameramanProfile, "id" | "created_at">): CameramanProfile {
  const cameramen = readCameramen()
  const newProfile: CameramanProfile = {
    ...profileData,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  cameramen.push(newProfile)
  writeCameramen(cameramen)
  return newProfile
}

// Shared storage that persists across all API routes
class DataStorage {
  private static instance: DataStorage
  public users: any[] = []
  public cameramen: any[] = []

  private constructor() {}

  public static getInstance(): DataStorage {
    if (!DataStorage.instance) {
      DataStorage.instance = new DataStorage()
    }
    return DataStorage.instance
  }

  public addUser(user: any) {
    this.users.push(user)
    console.log("User added to storage. Total users:", this.users.length)
  }

  public addCameraman(cameraman: any) {
    this.cameramen.push(cameraman)
    console.log("Cameraman added to storage. Total cameramen:", this.cameramen.length)
  }

  public findUser(id: string) {
    return this.users.find((u) => u.id === id)
  }

  public findCameraman(userId: string) {
    return this.cameramen.find((c) => c.user_id === userId)
  }

  public getAllUsers() {
    return this.users
  }

  public getAllCameramen() {
    return this.cameramen
  }
}

export const storage = DataStorage.getInstance()
