"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Camera,
  Star,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Edit2,
  Plus,
  Upload,
  X,
  Image as ImageIcon,
  User,
  Clock,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CameramanData {
  id: string
  name: string
  email: string
  phone: string
  type: "elite" | "realtime"
  bio: string
  profile_image_url?: string // Added profile image URL
  specialties: string[]
  equipment: string[]
  experience_years: number
  hourly_rate: number
  daily_rate?: number
  location: string
  location_city?: string
  location_state?: string
  location_country?: string
  languages: string[]
  certifications?: string[]
  travel_radius?: number
  rating: number
  total_reviews: number
  awards?: string
  celebrity_clients?: string
  portfolio_images?: string[]
  portfolio_urls?: string[]
  instagram_handle?: string
  twitter_handle?: string
  facebook_handle?: string
  availability?: string[]
  isAvailable?: boolean // Frontend state for toggle
  is_available?: boolean // Backend data field
  recent_reviews?: Array<{
    id: string
    reviewer: {
    id: string
      full_name: string
      profile_image_url: string
    }
    rating: number
    comment: string
    created_at: string
    booking_title: string
    event_date: string
  }>
  stats?: {
    totalBookings: number
    completedEvents: number
    cancelledEvents: number
    averageRating: number
    successfulPayments: number
  }
  earnings?: {
    total: number
    thisMonth: number
    lastMonth: number
  }
  upcoming_events?: Array<{
    id: string
    title: string
    date: string
    location: string
    type: string
    client_name: string
    client_email: string
    client_phone: string
    duration_hours: number
    final_price: number
    payment_status: string
    description: string
    special_requirements: string
    event_type: string
    shoot_purpose: string
    preferred_style: string
    equipment_needed: string
    estimated_guests: number
    venue_details: string
    celebrity_name: string
    privacy_level: string
    makeup_artist: boolean
    stylist: boolean
    security_needed: boolean
    media_coverage: boolean
    exclusive_rights: boolean
    contact_preference: string
  }>
}

export default function CameramanDashboard() {
  const [data, setData] = useState<CameramanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)
  const [isAvailable, setIsAvailable] = useState(false)

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false)
  const [newPhotoData, setNewPhotoData] = useState({
    photoUrl: "",
    title: "",
    description: "",
    category: "",
    isPublic: true,
  })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    phone_number: "",
    bio: "",
    profile_image_url: "", // Add profile image URL field
    equipment: "",
    hourly_rate: "",
    location: "",
    experience_years: "",
    specializations: "",
    languages: "",
    awards: "",
    celebrity_clients: "",
    instagram_handle: "",
    twitter_handle: "",
    facebook_handle: "",
  })

  const [pendingBookings, setPendingBookings] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  const fetchCameramanData = async () => {
    try {
      setLoading(true)
      
      // Get current user from localStorage
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) {
        throw new Error("No user found. Please log in.")
      }
      
          const userData = JSON.parse(storedUser)
      if (!userData.id) {
        throw new Error("Invalid user data. Please log in again.")
      }
      
      const userId = userData.id
      const response = await fetch(`/api/cameramen/${userId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          console.log("Raw API response data:", result.data)
          
          const dashboardData: CameramanData = {
            id: result.data.id || "",
            name: result.data.name || "Unknown",
            email: result.data.email || "",
            phone: result.data.phone || "",
            type: result.data.cameraman_type === "realtime" ? "realtime" : "elite",
            bio: result.data.bio || "",
            profile_image_url: result.data.profile_image_url || "", // Add profile image URL
            specialties: result.data.specialties || [],
            equipment: result.data.equipment || "",
            experience_years: result.data.experience_years || 0,
            hourly_rate: result.data.hourly_rate || 0,
            daily_rate: result.data.daily_rate || undefined,
            location: result.data.location || "",
            location_city: result.data.location_city || undefined,
            location_state: result.data.location_state || undefined,
            location_country: result.data.location_country || undefined,
            languages: result.data.languages || [],
            certifications: result.data.certifications || undefined,
            travel_radius: result.data.travel_radius || undefined,
            rating: result.data.rating || 0,
            total_reviews: result.data.total_reviews || 0,
            awards: result.data.awards || "",
            celebrity_clients: result.data.celebrity_clients || "",
            portfolio_images: result.data.portfolio_images || undefined,
            portfolio_urls: result.data.portfolio_urls || undefined,
            instagram_handle: result.data.instagram_handle || undefined,
            twitter_handle: result.data.twitter_handle || undefined,
            facebook_handle: result.data.facebook_handle || undefined,
            availability: result.data.availability || undefined,
            isAvailable: result.data.is_available || false,
            is_available: result.data.is_available || false,
            recent_reviews: result.data.recent_reviews || [],
            stats: result.data.stats || {
              totalBookings: 0,
              completedEvents: 0,
              cancelledEvents: 0,
              averageRating: result.data.rating || 0,
            },
            earnings: result.data.earnings || {
              total: 0,
              thisMonth: 0,
              lastMonth: 0,
            },
            upcoming_events: result.data.upcoming_events || [],
          }
          
          console.log("Processed dashboard data:", dashboardData)
          setData(dashboardData)
          // Initialize availability state from fetched data
          setIsAvailable(dashboardData.is_available || false)
        } else {
          throw new Error("Invalid API response format")
        }
      } else {
        const errorData = await response.json()
        throw new Error(`API request failed with status: ${response.status} - ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingBookings = async () => {
    try {
      setLoadingBookings(true)
      
      // Get current user ID from localStorage
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) {
        return
      }
      
      const userData = storedUser ? JSON.parse(storedUser) : null
      const currentUserId = userData?.id
      
      if (!currentUserId) {
        return
      }
      
      const response = await fetch(`/api/bookings?photographer_id=${currentUserId}&status=pending`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending bookings')
      }
      
      const bookings = await response.json()
      setPendingBookings(bookings || [])
    } catch (error) {
      console.error("Error fetching pending bookings:", error)
      toast({
        title: "Error",
        description: "Failed to load pending bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleBookingAction = async (bookingId: string, action: "accept" | "reject", rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action === "accept" ? "accepted" : "rejected",
          rejection_reason: rejectionReason,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} booking`)
      }

      const result = await response.json()
      
      // Refresh pending bookings
      await fetchPendingBookings()
      // Show success message
      toast({
        title: `Booking ${action}ed`,
        description: `The booking has been ${action}ed successfully.`,
      })
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} booking. Please try again.`,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCameramanData()
  }, [])

  useEffect(() => {
    if (data && data.id) {
      fetchPendingBookings()
    }
  }, [data?.id])

  // Also fetch pending bookings when component mounts
  useEffect(() => {
    fetchPendingBookings()
  }, [])

  // Handler functions
  const handleSaveProfile = async () => {
    try {
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) {
        toast({
          title: "Error",
          description: "No user found. Please log in.",
          variant: "destructive",
        })
        return
      }
      const userData = JSON.parse(storedUser)
      if (!userData.id) {
        toast({
          title: "Error",
          description: "Invalid user data. Please log in again.",
          variant: "destructive",
        })
        return
      }

      console.log("Saving profile with data:", editFormData)
      console.log("Profile image URL being saved:", editFormData.profile_image_url)

      // Prepare payload for Supabase
      const payload = {
        full_name: editFormData.full_name,
        phone_number: editFormData.phone_number,
        bio: editFormData.bio,
        equipment: editFormData.equipment,
        hourly_rate: editFormData.hourly_rate,
        location: editFormData.location,
        experience_years: Number(editFormData.experience_years),
        specializations: editFormData.specializations
          ? editFormData.specializations.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        languages: editFormData.languages
          ? editFormData.languages.split(",").map((l) => l.trim()).filter(Boolean)
          : [],
        awards: editFormData.awards,
        celebrity_clients: editFormData.celebrity_clients,
        instagram_handle: editFormData.instagram_handle,
        twitter_handle: editFormData.twitter_handle,
        facebook_handle: editFormData.facebook_handle,
      }

      // Update user profile (including profile_image_url and bio)
      const userUpdatePayload = {
        full_name: editFormData.full_name,
        phone_number: editFormData.phone_number,
        bio: editFormData.bio,
        profile_image_url: editFormData.profile_image_url,
      }

      console.log("Updating photographer profile with:", payload)
      console.log("Updating user profile with:", userUpdatePayload)
      console.log("Profile image URL in userUpdatePayload:", userUpdatePayload.profile_image_url)
      console.log("Bio in userUpdatePayload:", userUpdatePayload.bio)

      // Update photographer profile
      const response = await fetch(`/api/cameramen/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      // Update user profile
      console.log("Making API call to update user profile...")
      const userResponse = await fetch(`/api/users/${userData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userUpdatePayload),
      })

      const result = await response.json()
      const userResult = await userResponse.json()
      
      console.log("Photographer profile update result:", result)
      console.log("User profile update result:", userResult)
      console.log("User response status:", userResponse.status)
      console.log("User response ok:", userResponse.ok)
      
      if (response.ok && result.success && userResponse.ok && userResult.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        })
        setIsEditProfileOpen(false)
        await fetchCameramanData()
      } else {
        console.error("API call failed:")
        console.error("Photographer response:", response.status, result)
        console.error("User response:", userResponse.status, userResult)
        throw new Error(result.error || userResult.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }



  const handleAddPhoto = async () => {
    try {
      if (!newPhotoData.photoUrl && !selectedFile) {
        toast({
          title: "Error",
          description: "Please enter a photo URL or upload a file.",
          variant: "destructive",
        })
        return
      }

      setUploading(true)
      setUploadProgress(0)
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) {
        toast({
          title: "Error",
          description: "No user found. Please log in.",
          variant: "destructive",
        })
        return
      }
      const userData = JSON.parse(storedUser)
      if (!userData.id) {
        toast({
          title: "Error",
          description: "Invalid user data. Please log in again.",
          variant: "destructive",
        })
        return
      }

      let photoUrl = newPhotoData.photoUrl
      
      // If file is selected, compress and upload it
      if (selectedFile) {
        try {
          // Show compression progress
          toast({
            title: "Processing image...",
            description: "Compressing and optimizing your image for faster upload.",
          })

          // Compress the image
          const compressedFile = await compressImage(selectedFile)
          
          // Upload to cloud with progress
          photoUrl = await uploadToCloud(compressedFile)
          
          toast({
            title: "Upload complete!",
            description: "Image processed and uploaded successfully.",
          })
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "Failed to process image. Please try again.",
            variant: "destructive",
          })
          setUploading(false)
          return
        }
      }

      const photoData = {
        photoUrl: photoUrl || "",
        title: newPhotoData.title || "Untitled",
        description: newPhotoData.description || "",
        category: newPhotoData.category || "General",
        isPublic: newPhotoData.isPublic,
      }

      const response = await fetch(`/api/cameramen/${userData.id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photoData),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: "Photo added successfully to your portfolio!",
        })
        setIsAddPhotoOpen(false)
        setNewPhotoData({
          photoUrl: "",
          title: "",
          description: "",
          category: "",
          isPublic: true,
        })
        setSelectedFile(null)
        setUploadProgress(0)
        await fetchCameramanData()
      } else {
        throw new Error(result.error || "Failed to add photo")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        })
        return
      }
      
      setSelectedFile(file)
      setNewPhotoData(prev => ({ ...prev, photoUrl: "" })) // Clear URL when file is selected
    } else {
      toast({
        title: "Error",
        description: "Please select an image file.",
        variant: "destructive",
      })
    }
  }

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new window.Image()
      
      img.onload = () => {
        // Calculate new dimensions (max 1920x1080)
        const maxWidth = 1920
        const maxHeight = 1080
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadToCloud = async (file: File): Promise<string> => {
    // Simulate cloud upload with progress
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          // For demo, return a placeholder URL
          // In production, this would upload to Supabase Storage or similar
          resolve(URL.createObjectURL(file))
        }
        setUploadProgress(progress)
      }, 100)
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const nextPortfolioImage = () => {
     if (data && data.portfolio_images && data.portfolio_images.length > 0) {
       setCurrentPortfolioIndex((prev) => (prev + 1) % (data.portfolio_images?.length || 1))
    }
  }

  const prevPortfolioImage = () => {
     if (data && data.portfolio_images && data.portfolio_images.length > 0) {
       setCurrentPortfolioIndex((prev) => (prev - 1 + (data.portfolio_images?.length || 1)) % (data.portfolio_images?.length || 1))
     }
   }

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) {
        toast({
          title: "Error",
          description: "No user found. Please log in.",
          variant: "destructive",
        })
        return
      }
      const userData = JSON.parse(storedUser)
      if (!userData.id) {
        toast({
          title: "Error",
          description: "Invalid user data. Please log in again.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/cameramen/${userData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: checked }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
    setIsAvailable(checked)
      toast({
          title: checked ? "You are now available" : "You are now unavailable",
          description: checked 
            ? "Your location is being shared with nearby users." 
            : "Your location is no longer being shared.",
        })
        // Refresh dashboard data
        await fetchCameramanData()
    } else {
        throw new Error(result.error || "Failed to update availability")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Failed to Load Dashboard</h1>
          <p className="mt-2">It looks like your profile setup is incomplete. Please complete your registration.</p>
          <Button onClick={() => (window.location.href = "/connect-with-us")} className="mt-4">
            Complete Registration
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Cameraman Dashboard</h1>

        {/* Profile Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={data.profile_image_url || "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop"}
                  alt={data.name}
                />
                <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold">{data.name}</h2>
                  <p className="text-gray-500">{data.type === "elite" ? "Elite Cameraman" : "Real-Time Cameraman"}</p>
                  </div>
                  
                  {/* Social Media Icons - Top Right Corner */}
                  {(data.instagram_handle || data.twitter_handle || data.facebook_handle) && (
                    <div className="flex items-center space-x-1">
                      <div className="w-px h-6 bg-gray-300 mr-2"></div>
                      {data.instagram_handle && (
                        <a
                          href={`https://instagram.com/${data.instagram_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors group"
                          title={`@${data.instagram_handle}`}
                        >
                          <svg className="w-5 h-5 text-pink-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                      {data.twitter_handle && (
                        <a
                          href={`https://twitter.com/${data.twitter_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors group"
                          title={`@${data.twitter_handle}`}
                        >
                          <svg className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </a>
                      )}
                      {data.facebook_handle && (
                        <a
                          href={`https://facebook.com/${data.facebook_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors group"
                          title="Facebook"
                        >
                          <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                  

                </div>
                <p className="text-gray-700">{data.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {data.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{data.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{data.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{data.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{data.type === "elite" ? `$${data.hourly_rate}/hour` : "Real-time pricing"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Availability:</span>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={handleAvailabilityToggle}
                  className="data-[state=checked]:bg-green-500"
                />
                    </div>
                  </div>
                </div>
                
                {/* Social Media Links */}
                {(data.instagram_handle || data.twitter_handle || data.facebook_handle) && (
                  <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                    <span className="text-sm font-medium text-gray-700">Connect:</span>
                    <div className="flex items-center space-x-3">
                      {data.instagram_handle && (
                        <a
                          href={`https://instagram.com/${data.instagram_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          <span className="text-sm">@{data.instagram_handle}</span>
                        </a>
                      )}
                      {data.twitter_handle && (
                        <a
                          href={`https://twitter.com/${data.twitter_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          <span className="text-sm">@{data.twitter_handle}</span>
                        </a>
                      )}
                      {data.facebook_handle && (
                        <a
                          href={`https://facebook.com/${data.facebook_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span className="text-sm">Facebook</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
              </div>
            </CardContent>
          </Card>



        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.earnings?.total.toLocaleString() || "0"}</div>
              <p className="text-xs text-muted-foreground">
                 +${((data.earnings?.thisMonth || 0) - (data.earnings?.lastMonth || 0)).toLocaleString()} from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats?.totalBookings || "0"}</div>
              <p className="text-xs text-muted-foreground">
                {data.stats?.successfulPayments || "0"} paid, {data.stats?.completedEvents || "0"} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.rating.toFixed(1)}</div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(data.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Experience</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.experience_years} years</div>
              <Progress value={Number(data.experience_years) * 10} max={100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="details">Professional Details</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {/* Pending Bookings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Pending Booking Requests</h3>

              {loadingBookings ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : pendingBookings.length > 0 ? (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-grow space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 text-lg">{booking.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {booking.event_type || "Event"}
                            </Badge>
                          </div>
                          
                          {/* Client Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                              <p className="text-sm font-medium text-gray-700">
                                <User className="inline w-4 h-4 mr-1" />
                                Client: {booking.client_name}
                              </p>
                              {booking.client_email && (
                                <p className="text-sm text-gray-600">
                                  <Mail className="inline w-4 h-4 mr-1" />
                                  {booking.client_email}
                                </p>
                              )}
                              {booking.client_phone && (
                                <p className="text-sm text-gray-600">
                                  <Phone className="inline w-4 h-4 mr-1" />
                                  {booking.client_phone}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <Calendar className="inline w-4 h-4 mr-1" />
                                {new Date(booking.event_date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                <Clock className="inline w-4 h-4 mr-1" />
                                {booking.duration_hours} hours
                              </p>
                              <p className="text-sm text-gray-600">
                                <MapPin className="inline w-4 h-4 mr-1" />
                                {booking.location_address || "TBD"}
                              </p>
                            </div>
                          </div>

                          {/* Event Details */}
                          {booking.description && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                              <p className="text-sm text-gray-600">{booking.description}</p>
                            </div>
                          )}

                          {/* Special Requirements */}
                          {booking.special_requirements && (
                            <div className="bg-blue-50 p-3 rounded-md">
                              <p className="text-sm font-medium text-blue-700 mb-1">Special Requirements:</p>
                              <p className="text-sm text-blue-600">{booking.special_requirements}</p>
                            </div>
                          )}

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {booking.shoot_purpose && (
                              <p className="text-gray-600">
                                <strong>Purpose:</strong> {booking.shoot_purpose}
                              </p>
                            )}
                            {booking.preferred_style && (
                              <p className="text-gray-600">
                                <strong>Style:</strong> {booking.preferred_style}
                              </p>
                            )}
                            {booking.equipment_needed && (
                              <p className="text-gray-600">
                                <strong>Equipment:</strong> {booking.equipment_needed}
                              </p>
                            )}
                            {booking.estimated_guests > 0 && (
                              <p className="text-gray-600">
                                <strong>Guests:</strong> {booking.estimated_guests}
                              </p>
                            )}
                            {booking.celebrity_name && (
                              <p className="text-gray-600">
                                <strong>Celebrity:</strong> {booking.celebrity_name}
                              </p>
                            )}
                            {booking.venue_details && (
                              <p className="text-gray-600">
                                <strong>Venue:</strong> {booking.venue_details}
                            </p>
                          )}
                          </div>

                          {/* Service Requirements */}
                          <div className="flex flex-wrap gap-2">
                            {booking.makeup_artist && (
                              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                                Makeup Artist
                              </Badge>
                            )}
                            {booking.stylist && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                Stylist
                              </Badge>
                            )}
                            {booking.security_needed && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                Security
                              </Badge>
                            )}
                            {booking.media_coverage && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Media Coverage
                              </Badge>
                            )}
                            {booking.exclusive_rights && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                Exclusive Rights
                              </Badge>
                            )}
                            {booking.privacy_level && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                {booking.privacy_level} Privacy
                              </Badge>
                            )}
                          </div>
                    </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBookingAction(booking.id, "accept")}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt("Please provide a reason for rejection (optional):")
                              handleBookingAction(booking.id, "reject", reason || undefined)
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No pending booking requests</p>
              )}
            </div>

            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            {data.upcoming_events && data.upcoming_events.length > 0 ? (
              <div className="space-y-4">
                {data.upcoming_events.map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 text-lg">{event.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {event.event_type || "Event"}
                              </Badge>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Payment Success
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Confirmed
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Client Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                <User className="inline w-4 h-4 mr-1" />
                                Client: {event.client_name}
                              </p>
                              {event.client_email && (
                                <p className="text-sm text-gray-600">
                                  <Mail className="inline w-4 h-4 mr-1" />
                                  {event.client_email}
                                </p>
                              )}
                              {event.client_phone && (
                                <p className="text-sm text-gray-600">
                                  <Phone className="inline w-4 h-4 mr-1" />
                                  {event.client_phone}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <Calendar className="inline w-4 h-4 mr-1" />
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                <Clock className="inline w-4 h-4 mr-1" />
                                {event.duration_hours} hours
                              </p>
                              <p className="text-sm text-gray-600">
                                <MapPin className="inline w-4 h-4 mr-1" />
                                {event.location}
                              </p>
                            </div>
                          </div>

                          {/* Event Details */}
                          {event.description && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                          )}

                          {/* Special Requirements */}
                          {event.special_requirements && (
                            <div className="bg-blue-50 p-3 rounded-md">
                              <p className="text-sm font-medium text-blue-700 mb-1">Special Requirements:</p>
                              <p className="text-sm text-blue-600">{event.special_requirements}</p>
                            </div>
                          )}

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {event.shoot_purpose && (
                              <p className="text-gray-600">
                                <strong>Purpose:</strong> {event.shoot_purpose}
                              </p>
                            )}
                            {event.preferred_style && (
                              <p className="text-gray-600">
                                <strong>Style:</strong> {event.preferred_style}
                              </p>
                            )}
                            {event.equipment_needed && (
                              <p className="text-gray-600">
                                <strong>Equipment:</strong> {event.equipment_needed}
                              </p>
                            )}
                            {event.estimated_guests > 0 && (
                              <p className="text-gray-600">
                                <strong>Guests:</strong> {event.estimated_guests}
                              </p>
                            )}
                            {event.celebrity_name && (
                              <p className="text-gray-600">
                                <strong>Celebrity:</strong> {event.celebrity_name}
                              </p>
                            )}
                            {event.venue_details && (
                              <p className="text-gray-600">
                                <strong>Venue:</strong> {event.venue_details}
                              </p>
                            )}
                          </div>

                          {/* Service Requirements */}
                          <div className="flex flex-wrap gap-2">
                            {event.makeup_artist && (
                              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                                Makeup Artist
                              </Badge>
                            )}
                            {event.stylist && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                Stylist
                              </Badge>
                            )}
                            {event.security_needed && (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                Security
                              </Badge>
                            )}
                            {event.media_coverage && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Media Coverage
                              </Badge>
                            )}
                            {event.exclusive_rights && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                Exclusive Rights
                              </Badge>
                            )}
                            {event.privacy_level && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                {event.privacy_level} Privacy
                              </Badge>
                            )}
                          </div>

                          {/* Payment Information */}
                          <div className="bg-green-50 p-3 rounded-md">
                            <p className="text-sm font-medium text-green-700 mb-1">Payment Details:</p>
                            <p className="text-sm font-medium text-green-600">
                              <DollarSign className="inline w-4 h-4 mr-1" />
                              ${event.final_price} - Payment Successful
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p>No upcoming events at the moment. Bookings with successful payments will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <h3 className="text-xl font-semibold">Portfolio</h3>
            {data.portfolio_images && data.portfolio_images.length > 0 ? (
              <>
                <div className="relative">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentPortfolioIndex}
                        src={data.portfolio_images[currentPortfolioIndex] || "/placeholder.svg"}
                        alt={`Portfolio ${currentPortfolioIndex + 1}`}
                        className="h-full w-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>
                  </div>
                  {data.portfolio_images && data.portfolio_images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevPortfolioImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextPortfolioImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {data.portfolio_images?.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setCurrentPortfolioIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="h-full w-full object-cover"
                    />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button onClick={() => setIsAddPhotoOpen(true)} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Photo
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-semibold mb-2">No photos yet</h4>
                  <p className="text-gray-500 mb-4">
                    Start building your portfolio by adding your best work.
                  </p>
                  <Button onClick={() => setIsAddPhotoOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Photo
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h3 className="text-xl font-semibold">Recent Reviews</h3>
                         {data.recent_reviews && data.recent_reviews.length > 0 ? (
               data.recent_reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Avatar className="w-10 h-10 mr-3">
                         <AvatarImage src={review.reviewer?.profile_image_url || "/placeholder.svg"} alt={review.reviewer?.full_name || "Anonymous"} />
                         <AvatarFallback>{(review.reviewer?.full_name || "A").charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                         <h4 className="font-semibold">{review.reviewer?.full_name || "Anonymous"}</h4>
                         <p className="text-sm text-gray-500">{review.created_at}</p>
                         {review.booking_title && (
                           <p className="text-sm text-blue-600 font-medium">
                             {review.booking_title}
                             {review.event_date && (
                               <span className="text-gray-500 ml-2">
                                 • {new Date(review.event_date).toLocaleDateString()}
                               </span>
                             )}
                           </p>
                         )}
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating} out of 5
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  <p>No reviews yet. Complete your first booking to receive reviews!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <h3 className="text-xl font-semibold">Professional Details</h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="font-semibold">Equipment</h4>
                  <p>{data.equipment || "No equipment information provided"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.languages.length > 0 ? (
                      data.languages.map((language) => (
                        <Badge key={language} variant="outline">
                          {language}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No languages specified</p>
                    )}
                  </div>
                </div>
                {data.type === "elite" && (
                  <div>
                    <h4 className="font-semibold">Availability</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.availability && data.availability.length > 0 ? (
                        data.availability.map((time) => (
                          <Badge key={time} variant="outline">
                            {time}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No availability specified</p>
                      )}
                    </div>
                  </div>
                )}
                {data.type === "elite" && (
                  <div>
                    <h4 className="font-semibold">Awards & Recognition</h4>
                    <p>{data.awards || "No awards specified"}</p>
                  </div>
                )}
                {data.type === "elite" && (
                  <div>
                    <h4 className="font-semibold">Celebrity Clients</h4>
                    <p>{data.celebrity_clients || "No celebrity clients specified"}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">Availability Status</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isAvailable 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {isAvailable 
                      ? "You are currently accepting new bookings" 
                      : "You are not accepting new bookings at the moment"
                    }
                  </p>
                </div>
                {data.type === "realtime" && (
                  <div>
                    <h4 className="font-semibold">Availability Status</h4>
                    <p className="text-gray-700">
                      {isAvailable ? "Currently available for bookings" : "Currently unavailable for bookings"}
                    </p>
                    <Switch
                      checked={isAvailable}
                      onCheckedChange={handleAvailabilityToggle}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button
            onClick={() => {
              setEditFormData({
                full_name: data.name || "",
                phone_number: data.phone || "",
                bio: data.bio || "",
                profile_image_url: data.profile_image_url || "", // Add profile image URL
                                  equipment: Array.isArray(data.equipment) ? data.equipment.join(",") : (data.equipment || ""),
                hourly_rate: data.hourly_rate.toString() || "",
                location: data.location || "",
                experience_years: data.experience_years.toString() || "",
                specializations: data.specialties ? data.specialties.join(",") : "",
                languages: data.languages ? data.languages.join(",") : "",
                awards: data.awards || "",
                celebrity_clients: data.celebrity_clients || "",
                instagram_handle: data.instagram_handle || "",
                twitter_handle: data.twitter_handle || "",
                facebook_handle: data.facebook_handle || "",
              })
              setIsEditProfileOpen(true)
            }}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </div>

        {/* Edit Profile Modal */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
              <DialogDescription>
                Update your professional information and social media links
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="mt-1"
                />
              </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  value={editFormData.phone_number}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                />
              </div>
                  
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="location"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="City, State, Country"
                      className="mt-1"
                />
              </div>
                  
                  <div>
                    <Label htmlFor="rate" className="text-sm font-medium">Hourly Rate ($)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={editFormData.hourly_rate}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, hourly_rate: e.target.value }))}
                      placeholder="50"
                      className="mt-1"
                />
              </div>
                  
                  <div>
                    <Label htmlFor="experience_years" className="text-sm font-medium">Experience (Years)</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={editFormData.experience_years}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, experience_years: e.target.value }))}
                      placeholder="5"
                      className="mt-1"
                />
              </div>
                </div>
              </div>
              
              {/* Profile Image Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Profile Image</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={data.profile_image_url || "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop"}
                        alt={data.name}
                      />
                      <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor="profile_image_url" className="text-sm font-medium">Profile Image URL</Label>
                        <Input
                          id="profile_image_url"
                          value={editFormData.profile_image_url || ""}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, profile_image_url: e.target.value }))}
                          placeholder="https://example.com/your-profile-image.jpg"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter a direct link to your profile image</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Or Upload Image</Label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                try {
                                  const compressedFile = await compressImage(file)
                                  const imageUrl = await uploadToCloud(compressedFile)
                                  setEditFormData((prev) => ({ ...prev, profile_image_url: imageUrl }))
                                  toast({
                                    title: "Success",
                                    description: "Image uploaded successfully!",
                                  })
                                } catch (error) {
                                  console.error("Error uploading image:", error)
                                  toast({
                                    title: "Error",
                                    description: "Failed to upload image. Please try again.",
                                    variant: "destructive",
                                  })
                                }
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">Upload a profile image (JPG, PNG, max 5MB)</p>
                        </div>
                      </div>
                    </div>
              </div>
                </div>
              </div>
              
              {/* Professional Details */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editFormData.bio}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell clients about your photography style and experience..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specializations" className="text-sm font-medium">Specializations</Label>
                <Input
                  id="specializations"
                      placeholder="Wedding, Portrait, Event, Commercial"
                  value={editFormData.specializations}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, specializations: e.target.value }))}
                      className="mt-1"
                />
                    <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              </div>
                  
                  <div>
                    <Label htmlFor="languages" className="text-sm font-medium">Languages</Label>
                <Input
                  id="languages"
                      placeholder="English, Hindi, Spanish"
                  value={editFormData.languages}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, languages: e.target.value }))}
                      className="mt-1"
                />
                    <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              </div>
                  
                  <div>
                    <Label htmlFor="equipment" className="text-sm font-medium">Equipment</Label>
                    <Textarea
                      id="equipment"
                      value={editFormData.equipment}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, equipment: e.target.value }))}
                      placeholder="List your cameras, lenses, and equipment..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media Section */}
            <div className="border-t pt-6">
              <div className="border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media Links</h3>
                <p className="text-sm text-gray-600">Add your social media profiles to connect with clients</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="instagram_handle" className="text-sm font-medium">Instagram</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                    <Input
                      id="instagram_handle"
                      value={editFormData.instagram_handle}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, instagram_handle: e.target.value }))}
                      placeholder="yourusername"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="twitter_handle" className="text-sm font-medium">Twitter/X</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                    <Input
                      id="twitter_handle"
                      value={editFormData.twitter_handle}
                      onChange={(e) => setEditFormData((prev) => ({ ...prev, twitter_handle: e.target.value }))}
                      placeholder="yourusername"
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="facebook_handle" className="text-sm font-medium">Facebook</Label>
                  <Input
                    id="facebook_handle"
                    value={editFormData.facebook_handle}
                    onChange={(e) => setEditFormData((prev) => ({ ...prev, facebook_handle: e.target.value }))}
                    placeholder="facebook.com/yourprofile"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            {/* Achievements Section */}
            <div className="border-t pt-6">
              <div className="border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements & Recognition</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="awards" className="text-sm font-medium">Awards & Recognition</Label>
                <Input
                  id="awards"
                  value={editFormData.awards}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, awards: e.target.value }))}
                    placeholder="Photographer of the Year 2023, Best Wedding Photography"
                    className="mt-1"
                />
              </div>
                
                <div>
                  <Label htmlFor="celebrity_clients" className="text-sm font-medium">Notable Clients</Label>
                <Input
                  id="celebrity_clients"
                  value={editFormData.celebrity_clients}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, celebrity_clients: e.target.value }))}
                    placeholder="Celebrities, brands, or notable clients"
                    className="mt-1"
                />
              </div>
            </div>
            </div>
            
            <DialogFooter className="pt-6">
              <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>



        {/* Add Photo Modal */}
        <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Photo to Portfolio</DialogTitle>
              <DialogDescription>
                Add photos to showcase your work. These will be visible on your profile and the photoshoot page.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* File Upload Section */}
              <div className="space-y-2">
                <Label>Upload Photo</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <ImageIcon className="h-8 w-8 text-green-500" />
                        <span className="font-medium text-green-600">{selectedFile.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
              </div>
              <p className="text-sm text-gray-500">
                        File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Drag and drop an image here, or click to browse
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fileInput')?.click()}
                      >
                        Choose File
                      </Button>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photoUrl" className="text-right">Photo URL</Label>
                <Input 
                  id="photoUrl" 
                  placeholder="https://example.com/photo.jpg" 
                  className="col-span-3"
                  value={newPhotoData.photoUrl}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, photoUrl: e.target.value })}
                  disabled={!!selectedFile}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photoTitle" className="text-right">Title</Label>
                <Input 
                  id="photoTitle" 
                  placeholder="Wedding Ceremony" 
                  className="col-span-3"
                  value={newPhotoData.title}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photoDescription" className="text-right">Description</Label>
                <Textarea 
                  id="photoDescription" 
                  placeholder="Describe this photo..." 
                  className="col-span-3"
                  value={newPhotoData.description}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photoCategory" className="text-right">Category</Label>
                <select
                  id="photoCategory"
                  value={newPhotoData.category}
                  onChange={(e) => setNewPhotoData({ ...newPhotoData, category: e.target.value })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Select category</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Event">Event</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Street">Street</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photoPublic" className="text-right">Public</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="photoPublic"
                    checked={newPhotoData.isPublic}
                    onCheckedChange={(checked) => setNewPhotoData({ ...newPhotoData, isPublic: checked })}
                  />
                  <Label htmlFor="photoPublic" className="text-sm">
                    Make this photo visible on your public profile
                  </Label>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for great portfolio photos:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use high-resolution images (minimum 1920x1080)</li>
                  <li>• Ensure good lighting and composition</li>
                  <li>• Include a variety of styles and subjects</li>
                  <li>• Add descriptive titles and captions</li>
                  <li>• Organize photos by category for better presentation</li>
                </ul>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">
                      {uploadProgress < 100 ? "Processing image..." : "Upload complete!"}
                    </span>
                    <span className="text-sm text-green-600">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPhotoOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPhoto} disabled={uploading}>
                {uploading ? "Adding..." : "Add Photo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
