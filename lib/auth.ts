import bcrypt from "bcryptjs"
import { createServiceSupabaseClient } from "./supabase/server"

export interface SignupData {
  email: string
  password: string
  full_name: string
  phone_number?: string
  user_type: "client" | "photographer" | "editor"
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: any
  sessionToken?: string
  error?: string
  code?: string
}

export class AuthService {
  private supabase = createServiceSupabaseClient()

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  generateSessionToken(userId: string): string {
    return `session_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
  }

  async signup(data: SignupData): Promise<AuthResult> {
    try {
      console.log("AuthService.signup called with:", { ...data, password: "[HIDDEN]" })

      // Validate required fields
      if (!data.email || !data.password || !data.full_name) {
        return {
          success: false,
          error: "Email, password, and full name are required",
          code: "VALIDATION_ERROR",
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          error: "Please enter a valid email address",
          code: "VALIDATION_ERROR",
        }
      }

      // Validate password length
      if (data.password.length < 6) {
        return {
          success: false,
          error: "Password must be at least 6 characters long",
          code: "VALIDATION_ERROR",
        }
      }

      // Check if user already exists
      const { data: existingUser } = await this.supabase
        .from("users")
        .select("id")
        .eq("email", data.email.toLowerCase())
        .single()

      if (existingUser) {
        console.log("User already exists:", data.email)
        return {
          success: false,
          error: "An account with this email already exists. Please try logging in instead.",
          code: "USER_EXISTS",
        }
      }

      // Hash password
      const passwordHash = await this.hashPassword(data.password)

      // Create user in Supabase
      const { data: user, error: userError } = await this.supabase
        .from("users")
        .insert({
          email: data.email.toLowerCase().trim(),
          password_hash: passwordHash,
          full_name: data.full_name.trim(),
          phone_number: data.phone_number?.trim(),
          user_type: data.user_type || "client",
          is_verified: false,
          is_active: true,
        })
        .select()
        .single()

      if (userError) {
        console.error("Error creating user:", userError)
        return {
          success: false,
          error: "Failed to create user account",
          code: "DATABASE_ERROR",
        }
      }

      console.log("User created successfully:", user.id)

      // If user is a photographer, create cameraman profile
      if (data.user_type === "photographer") {
        const { error: profileError } = await this.supabase.from("cameraman_profiles").insert({
          user_id: user.id,
          bio: "Professional photographer ready to capture your special moments",
          equipment: "Professional camera equipment",
          experience_years: 1,
          hourly_rate: 100,
          specialties: ["Portrait", "Event"],
          languages: ["English"],
          availability: ["Weekends"],
          location: "New York, NY",
          cameraman_type: "elite",
          is_available: true,
          is_verified: false,
          rating: 5.0,
          total_reviews: 0,
          portfolio: [],
        })

        if (profileError) {
          console.error("Error creating cameraman profile:", profileError)
        }
      }

      // Generate session token
      const sessionToken = this.generateSessionToken(user.id)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      // Create session in Supabase
      const { error: sessionError } = await this.supabase.from("sessions").insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      })

      if (sessionError) {
        console.error("Error creating session:", sessionError)
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type,
          is_verified: user.is_verified,
        },
        sessionToken,
      }
    } catch (error) {
      console.error("Signup error:", error)
      return {
        success: false,
        error: "Registration failed. Please try again.",
        code: "INTERNAL_ERROR",
      }
    }
  }

  async login(data: LoginData): Promise<AuthResult> {
    try {
      console.log("AuthService.login called with:", { email: data.email, password: "[HIDDEN]" })

      // Validate required fields
      if (!data.email || !data.password) {
        return {
          success: false,
          error: "Email and password are required",
          code: "VALIDATION_ERROR",
        }
      }

      // Get user by email from Supabase
      const { data: user, error: userError } = await this.supabase
        .from("users")
        .select("*")
        .eq("email", data.email.toLowerCase())
        .single()

      if (userError || !user) {
        return {
          success: false,
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS",
        }
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(data.password, user.password_hash)
      if (!isValidPassword) {
        return {
          success: false,
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS",
        }
      }

      // Check if user is active
      if (!user.is_active) {
        return {
          success: false,
          error: "Account is deactivated",
          code: "ACCOUNT_DEACTIVATED",
        }
      }

      // Generate session token
      const sessionToken = this.generateSessionToken(user.id)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      // Create session in Supabase
      const { error: sessionError } = await this.supabase.from("sessions").insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      })

      if (sessionError) {
        console.error("Error creating session:", sessionError)
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type,
          is_verified: user.is_verified,
        },
        sessionToken,
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: "Login failed. Please try again.",
        code: "INTERNAL_ERROR",
      }
    }
  }

  async logout(sessionToken: string): Promise<{ success: boolean }> {
    try {
      const { error } = await this.supabase.from("sessions").delete().eq("session_token", sessionToken)

      if (error) {
        console.error("Error deleting session:", error)
        return { success: false }
      }

      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)
      return { success: false }
    }
  }

  async validateSession(sessionToken: string): Promise<any | null> {
    try {
      // Get session from Supabase
      const { data: session, error: sessionError } = await this.supabase
        .from("sessions")
        .select("*")
        .eq("session_token", sessionToken)
        .single()

      if (sessionError || !session) {
        return null
      }

      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        // Delete expired session
        await this.supabase.from("sessions").delete().eq("session_token", sessionToken)
        return null
      }

      // Get user data
      const { data: user, error: userError } = await this.supabase
        .from("users")
        .select("*")
        .eq("id", session.user_id)
        .single()

      if (userError || !user || !user.is_active) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        is_verified: user.is_verified,
      }
    } catch (error) {
      console.error("Session validation error:", error)
      return null
    }
  }
}

export const authService = new AuthService()
