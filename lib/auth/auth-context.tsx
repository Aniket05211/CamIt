"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  email: string
  full_name: string
  phone_number?: string
  user_type: string
  avatar_url?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any; user: User | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem("camit_user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } catch (error) {
          localStorage.removeItem("camit_user")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.error) {
        return { error: data.error }
      }

      if (data.user) {
        setUser(data.user)
        localStorage.setItem("camit_user", JSON.stringify(data.user))
      }

      return { error: null }
    } catch (error) {
      return { error: "Network error occurred" }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          full_name: userData.full_name,
          phone_number: userData.phone_number,
          user_type: userData.user_type,
        }),
      })

      const data = await response.json()

      if (data.error) {
        return { error: data.error, user: null }
      }

      return { error: null, user: data.user }
    } catch (error) {
      return { error: "Network error occurred", user: null }
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    }

    setUser(null)
    localStorage.removeItem("camit_user")
  }

  const resetPassword = async (email: string) => {
    // For now, just return success - you can implement email sending later
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
