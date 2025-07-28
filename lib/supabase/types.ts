// Database types for our Supabase schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone_number: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          user_type: "client" | "photographer" | "editor"
          is_verified: boolean
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone_number?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          user_type: "client" | "photographer" | "editor"
          is_verified?: boolean
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone_number?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          user_type?: "client" | "photographer" | "editor"
          is_verified?: boolean
          is_active?: boolean
        }
      }
      cameraman_profiles: {
        Row: {
          id: string
          user_id: string
          bio: string
          equipment: string[]
          experience_years: number
          hourly_rate: number
          specialties: string[]
          languages: string[]
          availability: boolean
          location: string
          cameraman_type: "elite" | "realtime"
          is_available: boolean
          is_verified: boolean
          rating: number
          total_reviews: number
          portfolio_images: string[]
          awards: string
          celebrity_clients: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string
          equipment?: string[]
          experience_years?: number
          hourly_rate?: number
          specialties?: string[]
          languages?: string[]
          availability?: boolean
          location?: string
          cameraman_type: "elite" | "realtime"
          is_available?: boolean
          is_verified?: boolean
          rating?: number
          total_reviews?: number
          portfolio_images?: string[]
          awards?: string
          celebrity_clients?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string
          equipment?: string[]
          experience_years?: number
          hourly_rate?: number
          specialties?: string[]
          languages?: string[]
          availability?: boolean
          location?: string
          cameraman_type?: "elite" | "realtime"
          is_available?: boolean
          is_verified?: boolean
          rating?: number
          total_reviews?: number
          portfolio_images?: string[]
          awards?: string
          celebrity_clients?: string
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_images: {
        Row: {
          id: string
          cameraman_id: string
          image_url: string
          title: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cameraman_id: string
          image_url: string
          title?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cameraman_id?: string
          image_url?: string
          title?: string | null
          description?: string | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          cameraman_id: string
          booking_date: string
          booking_time: string
          duration_hours: number
          location: string
          address: string
          coordinates: number[]
          price: number
          status: "pending" | "confirmed" | "en-route" | "arrived" | "shooting" | "completed" | "cancelled"
          payment_status: "pending" | "paid" | "refunded"
          payment_method: string | null
          special_requirements: string | null
          created_at: string
          updated_at: string
          cancellation_reason: string | null
          cancelled_by: string | null
        }
        Insert: {
          id?: string
          client_id: string
          cameraman_id: string
          booking_date: string
          booking_time: string
          duration_hours: number
          location: string
          address: string
          coordinates: number[]
          price: number
          status?: "pending" | "confirmed" | "en-route" | "arrived" | "shooting" | "completed" | "cancelled"
          payment_status?: "pending" | "paid" | "refunded"
          payment_method?: string | null
          special_requirements?: string | null
          created_at?: string
          updated_at?: string
          cancellation_reason?: string | null
          cancelled_by?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          cameraman_id?: string
          booking_date?: string
          booking_time?: string
          duration_hours?: number
          location?: string
          address?: string
          coordinates?: number[]
          price?: number
          status?: "pending" | "confirmed" | "en-route" | "arrived" | "shooting" | "completed" | "cancelled"
          payment_status?: "pending" | "paid" | "refunded"
          payment_method?: string | null
          special_requirements?: string | null
          created_at?: string
          updated_at?: string
          cancellation_reason?: string | null
          cancelled_by?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          client_id: string
          cameraman_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          client_id: string
          cameraman_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          client_id?: string
          cameraman_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          booking_id: string
          sender_id: string
          receiver_id: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          sender_id: string
          receiver_id: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
      location_updates: {
        Row: {
          id: string
          cameraman_id: string
          booking_id: string | null
          coordinates: number[]
          created_at: string
        }
        Insert: {
          id?: string
          cameraman_id: string
          booking_id?: string | null
          coordinates: number[]
          created_at?: string
        }
        Update: {
          id?: string
          cameraman_id?: string
          booking_id?: string | null
          coordinates?: number[]
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          currency: string
          payment_method: string
          status: "pending" | "completed" | "failed" | "refunded"
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          currency: string
          payment_method: string
          status?: "pending" | "completed" | "failed" | "refunded"
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          currency?: string
          payment_method?: string
          status?: "pending" | "completed" | "failed" | "refunded"
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          expires_at?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          cameraman_id: string
          title: string
          description: string | null
          event_date: string
          location: string | null
          price: number | null
          status: "upcoming" | "completed" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: string
          cameraman_id: string
          title: string
          description?: string | null
          event_date: string
          location?: string | null
          price?: number | null
          status: "upcoming" | "completed" | "cancelled"
          created_at?: string
        }
        Update: {
          id?: string
          cameraman_id?: string
          title?: string
          description?: string | null
          event_date?: string
          location?: string | null
          price?: number | null
          status?: "upcoming" | "completed" | "cancelled"
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Insertable<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updatable<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]

export interface User {
  id: string
  email: string
  full_name: string
  phone_number?: string
  avatar_url?: string
  user_type: "client" | "photographer" | "editor"
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface CameramanProfile {
  id: string
  user_id: string
  bio?: string
  experience_years?: number
  hourly_rate?: number
  location?: string
  specialties?: string[]
  equipment?: string[]
  portfolio_images?: string[]
  availability?: boolean
  rating?: number
  total_reviews?: number
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  expires_at: string
  created_at: string
}

export interface Event {
  id: string
  cameraman_id: string
  title: string
  description?: string
  event_date: string
  location?: string
  price?: number
  status: "upcoming" | "completed" | "cancelled"
  created_at: string
}
