// Simple in-memory database for development
export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string
  phone_number?: string
  user_type: "client" | "photographer" | "editor"
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  session_token: string
  expires_at: string
  created_at: string
}

class SimpleDatabase {
  private users: Map<string, User> = new Map()
  private sessions: Map<string, Session> = new Map()
  private photographers: Map<string, any> = new Map()
  private editors: Map<string, any> = new Map()

  // User operations
  async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const user: User = {
      id: userId,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.users.set(userId, user)
    console.log(`User created: ${userId}`)
    return user
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const [id, user] of this.users.entries()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user
      }
    }
    return null
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null

    const updatedUser: User = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString(),
    }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  // Session operations
  async createSession(user_id: string, session_token: string, expires_at: Date): Promise<Session> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: Session = {
      id: sessionId,
      user_id,
      session_token,
      expires_at: expires_at.toISOString(),
      created_at: new Date().toISOString(),
    }
    this.sessions.set(sessionId, session)
    console.log(`Session created: ${sessionId}`)
    return session
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    for (const [id, session] of this.sessions.entries()) {
      if (session.session_token === token) {
        // Check if session is expired
        if (new Date(session.expires_at) < new Date()) {
          this.sessions.delete(id)
          return null
        }
        return session
      }
    }
    return null
  }

  async deleteSession(token: string): Promise<boolean> {
    for (const [id, session] of this.sessions.entries()) {
      if (session.session_token === token) {
        this.sessions.delete(id)
        return true
      }
    }
    return false
  }

  async deleteExpiredSessions(): Promise<void> {
    const now = new Date()
    for (const [id, session] of this.sessions.entries()) {
      if (new Date(session.expires_at) < now) {
        this.sessions.delete(id)
      }
    }
  }

  // Photographer profile operations
  async createPhotographerProfile(profileData: any) {
    const profileId = `photographer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const profile = {
      id: profileId,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.photographers.set(profileId, profile)
    return profile
  }

  async getPhotographerProfile(userId: string) {
    for (const [id, profile] of this.photographers.entries()) {
      if (profile.user_id === userId) {
        return profile
      }
    }
    return null
  }

  async updatePhotographerProfile(userId: string, updates: any) {
    for (const [id, profile] of this.photographers.entries()) {
      if (profile.user_id === userId) {
        const updatedProfile = {
          ...profile,
          ...updates,
          updated_at: new Date().toISOString(),
        }
        this.photographers.set(id, updatedProfile)
        return updatedProfile
      }
    }
    return null
  }

  // Editor profile operations
  async createEditorProfile(profileData: any) {
    const profileId = `editor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const profile = {
      id: profileId,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.editors.set(profileId, profile)
    return profile
  }

  async getEditorProfile(userId: string) {
    for (const [id, profile] of this.editors.entries()) {
      if (profile.user_id === userId) {
        return profile
      }
    }
    return null
  }

  // Utility methods
  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  getAllPhotographers() {
    return Array.from(this.photographers.values())
  }

  getAllEditors() {
    return Array.from(this.editors.values())
  }

  getAllSessions(): Session[] {
    return Array.from(this.sessions.values())
  }

  // Clean up expired sessions
  async cleanupExpiredSessions() {
    const now = new Date()
    for (const [id, session] of this.sessions.entries()) {
      if (new Date(session.expires_at) < now) {
        this.sessions.delete(id)
      }
    }
  }
}

// Create and export singleton instance
export const storage = new SimpleDatabase()

// Initialize with some sample data
async function initializeSampleData() {
  try {
    // Check if sample data already exists
    const existingUser = await storage.getUserByEmail("john@example.com")
    if (existingUser) {
      console.log("Sample data already exists, skipping initialization")
      return
    }

    // Create sample user
    const sampleUser = await storage.createUser({
      email: "john@example.com",
      full_name: "John Photographer",
      phone_number: "+1 (555) 123-4567",
      user_type: "photographer",
      password_hash: "hashed_password_123",
      is_verified: true,
      is_active: true,
    })

    // Create sample photographer profile
    await storage.createPhotographerProfile({
      user_id: sampleUser.id,
      bio: "Professional photographer with 8+ years of experience capturing life's precious moments",
      equipment: "Canon EOS R5, Sony A7R IV, Professional lighting equipment, Various lenses",
      experience_years: 8,
      hourly_rate: 150,
      specialties: ["Wedding", "Portrait", "Event", "Commercial"],
      languages: ["English", "Spanish"],
      availability: ["Weekdays", "Weekends", "Evenings"],
      location: "New York, NY",
      photographer_type: "elite",
      is_available: true,
      is_verified: true,
      rating: 4.8,
      total_reviews: 127,
      portfolio: [
        "/placeholder.svg?height=400&width=600&text=Wedding+Photo+1",
        "/placeholder.svg?height=400&width=600&text=Portrait+Photo+1",
        "/placeholder.svg?height=400&width=600&text=Event+Photo+1",
        "/placeholder.svg?height=400&width=600&text=Commercial+Photo+1",
      ],
      upcoming_events: [
        {
          id: "event_1",
          title: "Sarah & Michael's Wedding",
          date: "2025-07-15",
          location: "Grand Ballroom, Plaza Hotel",
          type: "Wedding",
          time: "2:00 PM",
          duration: "8 hours",
          payment: "$2,500",
          status: "confirmed",
        },
        {
          id: "event_2",
          title: "Tech Company Headshots",
          date: "2025-07-22",
          location: "Corporate Office, Manhattan",
          type: "Corporate",
          time: "9:00 AM",
          duration: "6 hours",
          payment: "$1,800",
          status: "confirmed",
        },
      ],
      recent_reviews: [
        {
          id: "review_1",
          name: "Jennifer Martinez",
          rating: 5,
          comment: "Absolutely incredible work! The wedding photos exceeded all our expectations.",
          date: "2025-06-18",
          avatar: "/placeholder.svg?height=40&width=40&text=JM",
          event_type: "Wedding",
        },
        {
          id: "review_2",
          name: "Robert Chen",
          rating: 5,
          comment: "Outstanding photographer! The corporate headshots turned out amazing.",
          date: "2025-06-12",
          avatar: "/placeholder.svg?height=40&width=40&text=RC",
          event_type: "Corporate",
        },
      ],
      earnings: {
        total: 28750,
        thisMonth: 5500,
        lastMonth: 4200,
      },
      stats: {
        totalBookings: 52,
        completedEvents: 47,
        cancelledEvents: 3,
        averageRating: 4.8,
      },
    })

    console.log("Sample data initialized successfully")
  } catch (error) {
    console.error("Error initializing sample data:", error)
  }
}

// Initialize sample data on startup
initializeSampleData().catch(console.error)
