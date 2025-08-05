"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Edit2,
  Plus,
  Clock,
  Upload,
  Trash2,
  Eye,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

// Sample editor data
const mockEditorData = {
  type: "both",
  name: "Alex Morgan",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  experience: "6-10",
  specialties: ["Portrait Retouching", "Wedding Editing", "Color Grading", "Video Editing"],
  software: ["Adobe Photoshop", "Adobe Lightroom", "Adobe Premiere Pro", "DaVinci Resolve"],
  bio: "Professional photo and video editor with over 8 years of experience specializing in portrait retouching, wedding editing, and cinematic color grading. I've worked with major brands and photographers to deliver stunning visuals that exceed expectations.",
  languages: ["English", "Spanish"],
  turnaround: "24-48 hours",
  sampleRate: "20",
  fullServiceRate: "75-200",
  rating: 4.8,
  reviews: 93,
  portfolio: [
    "https://images.unsplash.com/photo-1610901157620-340856d0a50f?q=80&w=2070",
    "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=2070",
    "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106",
    "https://images.unsplash.com/photo-1605379399843-5870eea9b74e?q=80&w=2106",
    "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106",
    "https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?q=80&w=2272",
  ],
  beforeAfterSamples: [
    {
      id: 1,
      before: "https://images.unsplash.com/photo-1600275669439-14e40452d20b?q=80&w=2187",
      after: "https://images.unsplash.com/photo-1623091410901-00e2d268ee37?q=80&w=2070",
      description: "Wedding photo color enhancement and skin retouching",
      type: "photo",
    },
    {
      id: 2,
      before: "https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?q=80&w=2272",
      after: "https://images.unsplash.com/photo-1618721405821-80ebc4b63d26?q=80&w=2070",
      description: "Portrait enhancement with background blur adjustment",
      type: "photo",
    },
    {
      id: 3,
      before: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2068",
      after: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=2068",
      description: "Product photo with background removal and shadow enhancement",
      type: "photo",
    },
  ],
  upcomingProjects: [
    {
      id: 1,
      title: "Wedding Photo Collection",
      deadline: "2023-08-15",
      client: "Sarah & Michael",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Product Catalog Retouching",
      deadline: "2023-09-01",
      client: "TechGadgets Inc.",
      status: "Pending",
    },
    { id: 3, title: "Family Portrait Session", deadline: "2023-09-10", client: "Smith Family", status: "Scheduled" },
  ],
  recentReviews: [
    {
      id: 1,
      name: "Sarah Wilson",
      rating: 5,
      comment:
        "Alex did an amazing job with our wedding photos! The colors are vibrant and the retouching is so natural.",
      date: "2023-07-15",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787",
    },
    {
      id: 2,
      name: "Michael Brown",
      rating: 5,
      comment: "Incredible attention to detail and very easy to work with. The video editing was top-notch!",
      date: "2023-07-01",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1287",
    },
  ],
  earnings: {
    total: 45000,
    thisMonth: 3800,
    lastMonth: 3200,
  },
  stats: {
    totalProjects: 87,
    completedProjects: 82,
    cancelledProjects: 5,
    averageRating: 4.8,
  },
  isAvailable: true,
}

const editorSpecialties = [
  "Portrait Retouching",
  "Wedding Editing",
  "Color Grading",
  "Video Editing",
  "Product Editing",
  "Real Estate Editing",
]

const editorSoftware = [
  "Adobe Photoshop",
  "Adobe Lightroom",
  "Adobe Premiere Pro",
  "DaVinci Resolve",
  "Capture One",
  "Final Cut Pro",
]

const languages = ["English", "Spanish", "French", "German", "Italian", "Chinese"]

// Before-After Slider Component
const BeforeAfterSlider = ({ before, after, description }) => {
  const [position, setPosition] = useState(50)

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <Image
          src={after || "/placeholder.svg"}
          alt="After editing"
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=500"
          }}
        />
      </div>
      <div className="absolute inset-0" style={{ width: `${position}%`, overflow: "hidden" }}>
        <Image
          src={before || "/placeholder.svg"}
          alt="Before editing"
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=500"
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute h-full w-1 bg-white" style={{ left: `${position}%` }} />
        <div
          className="absolute h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <ChevronRight className="h-4 w-4 -rotate-90" />
          <ChevronRight className="h-4 w-4 rotate-90" />
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Slider
          value={[position]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setPosition(value[0])}
          className="z-10"
        />
      </div>
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Before</div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">After</div>
      {description && (
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full mx-auto inline-block">
            {description}
          </div>
        </div>
      )}
    </div>
  )
}

export default function EditorDashboard() {
  const [data, setData] = useState(null)
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [activeTab, setActiveTab] = useState("overview")
  const [isUploading, setIsUploading] = useState(false)
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [beforeUrl, setBeforeUrl] = useState("")
  const [afterUrl, setAfterUrl] = useState("")
  const [newSample, setNewSample] = useState({
    before: null,
    after: null,
    description: "",
    type: "photo",
  })

  useEffect(() => {
    const fetchEditorProfile = async () => {
      try {
        const storedUser = localStorage.getItem("camit_user")
        const userData = storedUser ? JSON.parse(storedUser) : null

        if (!userData?.id) {
          console.error("No user data found")
          setData(mockEditorData)
          return
        }

        const response = await fetch(`/api/editors/profile/${userData.id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.editor_profile) {
            // Transform API data to match component expectations
            const transformedData = {
              type: result.editor_profile.specializations?.includes("Video Editing") ? "both" : "photo",
              name: result.user?.full_name || "Editor",
              email: result.user?.email || "",
              phone: result.user?.phone_number || "",
              location: result.editor_profile.location || "",
              experience: result.editor_profile.experience_years?.toString() || "0",
              rate: result.editor_profile.project_rate?.toString() || "0",
              specialties: result.editor_profile.specializations || [],
              software: result.editor_profile.software_skills || [],
              bio: result.editor_profile.bio || "",
              languages: result.editor_profile.languages || [],
              turnaround: result.editor_profile.turnaround_time?.toString() || "24",
              sampleRate: result.editor_profile.hourly_rate?.toString() || "0",
              fullServiceRate: result.editor_profile.full_service_rate || "75-200",
              rating: result.editor_profile.rating || 0,
              reviews: result.editor_profile.total_reviews || 0,
              portfolio: result.editor_profile.portfolio_urls || [],
              beforeAfterSamples: result.editor_profile.before_after_samples || mockEditorData.beforeAfterSamples,
              upcomingProjects: mockEditorData.upcomingProjects, // Keep mock data for now
              recentReviews: result.editor_profile.recent_reviews || mockEditorData.recentReviews,
              earnings: result.editor_profile.earnings || mockEditorData.earnings,
              stats: result.editor_profile.stats || mockEditorData.stats,
              isAvailable: result.editor_profile.availability_status === "available",
              instagram_handle: result.editor_profile.instagram_handle || "",
              twitter_handle: result.editor_profile.twitter_handle || "",
              youtube_handle: result.editor_profile.youtube_handle || "",
              facebook_handle: result.editor_profile.facebook_handle || ""
            }
            setData(transformedData)
          } else if (result.error === "Editor profile not found") {
            // Create a default profile for new editors
            console.log("No editor profile found, creating default profile")
            const defaultData = {
              ...mockEditorData,
              name: userData.full_name || "Editor",
              email: userData.email || "",
              phone: userData.phone_number || "",
              beforeAfterSamples: mockEditorData.beforeAfterSamples,
              upcomingProjects: mockEditorData.upcomingProjects,
              recentReviews: mockEditorData.recentReviews,
              earnings: mockEditorData.earnings,
              stats: mockEditorData.stats,
              isAvailable: true
            }
            setData(defaultData)
          } else {
            setData(mockEditorData)
          }
        } else {
          setData(mockEditorData)
        }
      } catch (error) {
        console.error("Error fetching editor profile:", error)
        setData(mockEditorData)
      }
    }

    fetchEditorProfile()
  }, [])

  useEffect(() => {
    if (data) {
      setEditData({ ...data })
    }
  }, [data])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const handleSaveProfile = async () => {
    try {
      const storedUser = localStorage.getItem("camit_user")
      const userData = storedUser ? JSON.parse(storedUser) : null

      if (!userData?.id) {
        toast({
          title: "Error",
          description: "User data not found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      // Transform data to match API expectations
      const updateData = {
        project_rate: parseFloat(editData.rate) || 0,
        hourly_rate: parseFloat(editData.sampleRate) || 0,
        experience_years: parseInt(editData.experience) || 0,
        turnaround_time: parseInt(editData.turnaround) || 24,
        bio: editData.bio,
        specializations: editData.specialties,
        software_skills: editData.software,
        languages: editData.languages,
        availability_status: editData.isAvailable ? "available" : "busy",
        portfolio_urls: editData.portfolio,
        location: editData.location,
        before_after_samples: editData.beforeAfterSamples,
        recent_reviews: editData.recentReviews,
        earnings: editData.earnings,
        stats: editData.stats,
        full_service_rate: editData.fullServiceRate,
        instagram_handle: editData.instagram_handle,
        twitter_handle: editData.twitter_handle,
        youtube_handle: editData.youtube_handle,
        facebook_handle: editData.facebook_handle,
        phone_number: editData.phone
      }

      const response = await fetch(`/api/editors/profile/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setData({ ...editData })
          setIsEditing(false)
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
          })
        } else {
          throw new Error(result.error || "Failed to update profile")
        }
      } else if (response.status === 404) {
        // Profile doesn't exist, create it
        console.log("Profile not found, creating new profile")
        const createResponse = await fetch(`/api/editors/profile/${userData.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        })
        
        if (createResponse.ok) {
          const createResult = await createResponse.json()
          if (createResult.success) {
            setData({ ...editData })
            setIsEditing(false)
            toast({
              title: "Profile Created",
              description: "Your profile has been successfully created.",
            })
          } else {
            throw new Error(createResult.error || "Failed to create profile")
          }
        } else {
          throw new Error("Failed to create profile")
        }
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayInputChange = (field, value, isChecked, isMultiple = true) => {
    setEditData((prev) => {
      if (isMultiple) {
        if (isChecked) {
          return {
            ...prev,
            [field]: [...prev[field], value],
          }
        } else {
          return {
            ...prev,
            [field]: prev[field].filter((item) => item !== value),
          }
        }
      } else {
        return {
          ...prev,
          [field]: value,
        }
      }
    })
  }

  const handleNewSampleChange = (field, value) => {
    setNewSample((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddSample = async () => {
    if (!newSample.before || !newSample.after || !newSample.description) {
      toast({
        title: "Missing Information",
        description: "Please provide both before and after images and a description.",
        variant: "destructive",
      })
      return
    }

    try {
      const storedUser = localStorage.getItem("camit_user")
      const userData = storedUser ? JSON.parse(storedUser) : null

      if (!userData?.id) {
        toast({
          title: "Error",
          description: "User not found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      // Get editor profile ID first
      const profileResponse = await fetch(`/api/editors/profile/${userData.id}`)
      const profileData = await profileResponse.json()
      
      if (!profileData.success || !profileData.editor_profile) {
        toast({
          title: "Error",
          description: "Editor profile not found. Please save your profile first.",
          variant: "destructive",
        })
        return
      }

      const editorId = profileData.editor_profile.id

      const newId = Math.max(0, ...data.beforeAfterSamples.map((s) => s.id)) + 1

      // Handle both file uploads and URL inputs
      let beforeImageUrl, afterImageUrl
      
      if (typeof newSample.before === 'string') {
        // URL input
        beforeImageUrl = newSample.before
      } else {
        // File upload
        beforeImageUrl = URL.createObjectURL(newSample.before)
      }
      
      if (typeof newSample.after === 'string') {
        // URL input
        afterImageUrl = newSample.after
      } else {
        // File upload
        afterImageUrl = URL.createObjectURL(newSample.after)
      }

      const newSampleWithUrls = {
        ...newSample,
        id: newId,
        before: beforeImageUrl,
        after: afterImageUrl,
      }

      // Save before image to database
      const beforeResponse = await fetch('/api/editors/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          editor_id: editorId,
          image_url: beforeImageUrl,
          title: 'Before Image',
          description: newSample.description,
          category: 'Before/After',
          image_type: 'before_after',
          is_public: true
        }),
      })

      // Save after image to database
      const afterResponse = await fetch('/api/editors/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          editor_id: editorId,
          image_url: afterImageUrl,
          title: 'After Image',
          description: newSample.description,
          category: 'Before/After',
          image_type: 'before_after',
          is_public: true
        }),
      })

      setData((prev) => ({
        ...prev,
        beforeAfterSamples: [...prev.beforeAfterSamples, newSampleWithUrls],
      }))

      setNewSample({
        before: null,
        after: null,
        description: "",
        type: "photo",
      })

      toast({
        title: "Sample Added",
        description: "Your before/after sample has been added to your portfolio.",
      })
    } catch (error) {
      console.error("Error adding sample:", error)
      toast({
        title: "Error",
        description: "Failed to add sample. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSample = (id) => {
    setData((prev) => ({
      ...prev,
      beforeAfterSamples: prev.beforeAfterSamples.filter((sample) => sample.id !== id),
    }))

    // Update localStorage
    const updatedData = {
      ...data,
      beforeAfterSamples: data.beforeAfterSamples.filter((sample) => sample.id !== id),
    }
    localStorage.setItem("editor_data", JSON.stringify(updatedData))

    toast({
      title: "Sample Deleted",
      description: "The before/after sample has been removed from your portfolio.",
    })
  }

  const handleUploadPortfolio = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)

    try {
      const storedUser = localStorage.getItem("camit_user")
      const userData = storedUser ? JSON.parse(storedUser) : null

      if (!userData?.id) {
        toast({
          title: "Error",
          description: "User not found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      // Get editor profile ID first
      const profileResponse = await fetch(`/api/editors/profile/${userData.id}`)
      const profileData = await profileResponse.json()
      
      if (!profileData.success || !profileData.editor_profile) {
        toast({
          title: "Error",
          description: "Editor profile not found. Please save your profile first.",
          variant: "destructive",
        })
        return
      }

      const editorId = profileData.editor_profile.id

      // In a real app, you would upload the files to a server
      // For this demo, we'll create object URLs
      const newUrls = files.map((file) => URL.createObjectURL(file))

      // Save each image to the database
      for (const imageUrl of newUrls) {
        const imageResponse = await fetch('/api/editors/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            editor_id: editorId,
            image_url: imageUrl,
            title: 'Portfolio Image',
            description: 'Added from dashboard',
            category: 'Portfolio',
            image_type: 'portfolio',
            is_public: true
          }),
        })

        if (!imageResponse.ok) {
          console.error('Failed to save image to database')
        }
      }

      setData((prev) => ({
        ...prev,
        portfolio: [...prev.portfolio, ...newUrls],
      }))

      setIsUploading(false)

      toast({
        title: "Upload Complete",
        description: `Successfully added ${files.length} image(s) to your portfolio.`,
      })
    } catch (error) {
      console.error("Error uploading portfolio:", error)
      setIsUploading(false)
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddPortfolioUrl = async () => {
    if (!portfolioUrl.trim()) return

    try {
      const storedUser = localStorage.getItem("camit_user")
      const userData = storedUser ? JSON.parse(storedUser) : null

      if (!userData?.id) {
        toast({
          title: "Error",
          description: "User not found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      // Get editor profile ID first
      const profileResponse = await fetch(`/api/editors/profile/${userData.id}`)
      const profileData = await profileResponse.json()
      
      if (!profileData.success || !profileData.editor_profile) {
        toast({
          title: "Error",
          description: "Editor profile not found. Please save your profile first.",
          variant: "destructive",
        })
        return
      }

      const editorId = profileData.editor_profile.id

      // Save image to database
      const imageResponse = await fetch('/api/editors/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          editor_id: editorId,
          image_url: portfolioUrl.trim(),
          title: 'Portfolio Image',
          description: 'Added from URL',
          category: 'Portfolio',
          image_type: 'portfolio',
          is_public: true
        }),
      })

      if (imageResponse.ok) {
        setData((prev) => ({
          ...prev,
          portfolio: [...prev.portfolio, portfolioUrl.trim()],
        }))

        setPortfolioUrl("")
        toast({
          title: "Image Added",
          description: "Image has been added to your portfolio.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add image. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding portfolio URL:", error)
      toast({
        title: "Error",
        description: "Failed to add image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePortfolioImage = (index) => {
    setData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index),
    }))

    // Update localStorage
    const updatedData = {
      ...data,
      portfolio: data.portfolio.filter((_, i) => i !== index),
    }
    localStorage.setItem("editor_data", JSON.stringify(updatedData))

    toast({
      title: "Image Deleted",
      description: "The image has been removed from your portfolio.",
    })
  }

  const nextPortfolioImage = () => {
    setCurrentPortfolioIndex((prev) => (prev + 1) % data.portfolio.length)
  }

  const prevPortfolioImage = () => {
    setCurrentPortfolioIndex((prev) => (prev - 1 + data.portfolio.length) % data.portfolio.length)
  }

  const toggleAvailability = async () => {
    try {
      const storedUser = localStorage.getItem("camit_user")
      const userData = storedUser ? JSON.parse(storedUser) : null

      if (!userData?.id) {
        toast({
          title: "Error",
          description: "User not found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      const newAvailability = !data.isAvailable
      
      // Update the profile in the database
      const response = await fetch(`/api/editors/profile/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability_status: newAvailability ? "available" : "busy"
        }),
      })

      if (response.ok) {
        setData((prev) => ({
          ...prev,
          isAvailable: newAvailability,
        }))

        toast({
          title: newAvailability ? "You're Now Available" : "You're Now Unavailable",
          description: newAvailability
            ? "Clients can now see your profile and request your services."
            : "Your profile is now hidden from new client requests.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update availability. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating availability:", error)
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Editor Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Availability:</span>
              <Switch
                checked={data.isAvailable}
                onCheckedChange={toggleAvailability}
                className="data-[state=checked]:bg-green-500"
              />
              <span className={`text-sm ${data.isAvailable ? "text-green-600" : "text-gray-500"}`}>
                {data.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070"
                  alt={data.name}
                />
                <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold">{data.name}</h2>
                  <p className="text-gray-500">
                    {data.type === "both"
                      ? "Photo & Video Editor"
                      : data.type === "photo"
                        ? "Photo Editor"
                        : "Video Editor"}
                  </p>
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
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      ${data.sampleRate} - ${data.fullServiceRate.split("-")[1]}
                    </span>
                  </div>
                </div>
                
                {/* Social Media Links */}
                {(data.instagram_handle || data.twitter_handle || data.youtube_handle || data.facebook_handle) && (
                  <div className="flex gap-3 pt-2">
                    {data.instagram_handle && (
                      <a
                        href={`https://instagram.com/${data.instagram_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        {data.instagram_handle}
                      </a>
                    )}
                    {data.twitter_handle && (
                      <a
                        href={`https://twitter.com/${data.twitter_handle.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        {data.twitter_handle}
                      </a>
                    )}
                    {data.youtube_handle && (
                      <a
                        href={`https://youtube.com/${data.youtube_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        {data.youtube_handle}
                      </a>
                    )}
                    {data.facebook_handle && (
                      <a
                        href={`https://facebook.com/${data.facebook_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        {data.facebook_handle}
                      </a>
                    )}
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
              <div className="text-2xl font-bold">${data.earnings.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +${(data.earnings.thisMonth - data.earnings.lastMonth).toLocaleString()} from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {data.stats.completedProjects} completed, {data.stats.cancelledProjects} cancelled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.averageRating.toFixed(1)}</div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(data.stats.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turnaround Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.turnaround}</div>
              <p className="text-xs text-muted-foreground">Average delivery time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="samples">Before & After</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Upcoming Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.upcomingProjects.length > 0 ? (
                    <div className="space-y-4">
                      {data.upcomingProjects.map((project) => (
                        <div key={project.id} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-gray-500">Client: {project.client}</p>
                            <p className="text-sm text-gray-500">Due: {project.deadline}</p>
                          </div>
                          <Badge
                            className={
                              project.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : project.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">No upcoming projects</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    View All Projects
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recentReviews.length > 0 ? (
                    <div className="space-y-4">
                      {data.recentReviews.map((review) => (
                        <div key={review.id} className="border-b pb-3">
                          <div className="flex items-center mb-2">
                            <Avatar className="w-8 h-8 mr-2">
                              <AvatarImage src={review.avatar} alt={review.name} />
                              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-sm">{review.name}</h4>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">No reviews yet</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    View All Reviews
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Featured Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPortfolioIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                      >
                        <Image
                          src={data.portfolio[currentPortfolioIndex] || "/placeholder.svg"}
                          alt={`Portfolio ${currentPortfolioIndex + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=600&width=800"
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevPortfolioImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextPortfolioImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentPortfolioIndex + 1} / {data.portfolio.length}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setActiveTab("portfolio")}>
                  Manage Portfolio
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Portfolio</CardTitle>
                <CardDescription>
                  Manage the images that appear in your public portfolio. These images will be visible to potential
                  clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 space-y-4">
                  {/* URL Input for Portfolio Images */}
                  <div>
                    <Label htmlFor="portfolio-url">Add Image by URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="portfolio-url"
                        placeholder="Enter image URL"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddPortfolioUrl}
                        disabled={!portfolioUrl.trim()}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label>Upload Images</Label>
                    <label
                      htmlFor="portfolio-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                      </div>
                      <input
                        id="portfolio-upload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleUploadPortfolio}
                        disabled={isUploading}
                      />
                    </label>
                    {isUploading && (
                      <div className="mt-2">
                        <Progress value={45} className="h-2" />
                        <p className="text-xs text-center mt-1 text-gray-500">Uploading...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.portfolio.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Portfolio ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=300&width=300"
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-white text-gray-700 hover:bg-gray-200"
                          onClick={() => setCurrentPortfolioIndex(index)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-white text-red-600 hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleDeletePortfolioImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="samples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Before & After Samples</CardTitle>
                <CardDescription>
                  Showcase your editing skills with before and after comparisons. These samples help clients understand
                  your style and capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Add New Before & After Sample</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="before-image" className="block mb-2">
                        Before Image
                      </Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Before image URL"
                            value={beforeUrl}
                            onChange={(e) => setBeforeUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => handleNewSampleChange("before", beforeUrl)}
                            disabled={!beforeUrl.trim()}
                            size="sm"
                          >
                            Add
                          </Button>
                        </div>
                        <label
                          htmlFor="before-image"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center p-3">
                            <Upload className="w-6 h-6 mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">Upload "Before" image</p>
                          </div>
                          <input
                            id="before-image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleNewSampleChange("before", e.target.files?.[0] || null)}
                          />
                        </label>
                        {newSample.before && (
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {typeof newSample.before === 'string' ? newSample.before : newSample.before.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="after-image" className="block mb-2">
                        After Image
                      </Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="After image URL"
                            value={afterUrl}
                            onChange={(e) => setAfterUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => handleNewSampleChange("after", afterUrl)}
                            disabled={!afterUrl.trim()}
                            size="sm"
                          >
                            Add
                          </Button>
                        </div>
                        <label
                          htmlFor="after-image"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center justify-center p-3">
                            <Upload className="w-6 h-6 mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">Upload "After" image</p>
                          </div>
                          <input
                            id="after-image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleNewSampleChange("after", e.target.files?.[0] || null)}
                          />
                        </label>
                        {newSample.after && (
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {typeof newSample.after === 'string' ? newSample.after : newSample.after.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sample-description">Description</Label>
                      <Input
                        id="sample-description"
                        value={newSample.description}
                        onChange={(e) => handleNewSampleChange("description", e.target.value)}
                        placeholder="Describe the edits you made"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sample-type">Sample Type</Label>
                      <Select value={newSample.type} onValueChange={(value) => handleNewSampleChange("type", value)}>
                        <SelectTrigger id="sample-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photo">Photo</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleAddSample} className="w-full">
                      Add Sample
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {data.beforeAfterSamples.map((sample) => (
                    <div key={sample.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">{sample.description}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteSample(sample.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      <BeforeAfterSlider before={sample.before} after={sample.after} description={sample.description} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Project Management</CardTitle>
                <CardDescription>Track and manage your current and upcoming editing projects.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Current Projects</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Project
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Deadline
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.upcomingProjects.map((project) => (
                          <tr key={project.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{project.client}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{project.deadline}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                className={
                                  project.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : project.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                }
                              >
                                {project.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Edit Profile</CardTitle>
                <CardDescription>Update your personal information, skills, and preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input
                          id="edit-name"
                          value={editData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input
                          id="edit-phone"
                          value={editData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-location">Location</Label>
                        <Input
                          id="edit-location"
                          value={editData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Professional Details</h3>
                    <div>
                      <Label htmlFor="edit-bio">Bio</Label>
                      <Textarea
                        id="edit-bio"
                        value={editData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-experience">Experience</Label>
                        <Select
                          value={editData.experience}
                          onValueChange={(value) => handleInputChange("experience", value)}
                        >
                          <SelectTrigger id="edit-experience">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-2">0-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-turnaround">Turnaround Time</Label>
                        <Select
                          value={editData.turnaround}
                          onValueChange={(value) => handleInputChange("turnaround", value)}
                        >
                          <SelectTrigger id="edit-turnaround">
                            <SelectValue placeholder="Select turnaround time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="24 hours">24 hours</SelectItem>
                            <SelectItem value="24-48 hours">24-48 hours</SelectItem>
                            <SelectItem value="2-3 days">2-3 days</SelectItem>
                            <SelectItem value="3-5 days">3-5 days</SelectItem>
                            <SelectItem value="5-7 days">5-7 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-sample-rate">Sample Rate ($)</Label>
                        <Input
                          id="edit-sample-rate"
                          type="number"
                          value={editData.sampleRate}
                          onChange={(e) => handleInputChange("sampleRate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-full-rate">Full Service Rate Range ($)</Label>
                        <Input
                          id="edit-full-rate"
                          value={editData.fullServiceRate}
                          onChange={(e) => handleInputChange("fullServiceRate", e.target.value)}
                          placeholder="e.g. 75-150"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Specialties & Skills</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {editorSpecialties.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={`specialty-${specialty}`}
                            checked={editData.specialties?.includes(specialty)}
                            onCheckedChange={(checked) => handleArrayInputChange("specialties", specialty, checked)}
                          />
                          <Label htmlFor={`specialty-${specialty}`}>{specialty}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Software Skills</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {editorSoftware.map((software) => (
                        <div key={software} className="flex items-center space-x-2">
                          <Checkbox
                            id={`software-${software}`}
                            checked={editData.software?.includes(software)}
                            onCheckedChange={(checked) => handleArrayInputChange("software", software, checked)}
                          />
                          <Label htmlFor={`software-${software}`}>{software}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Languages</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {languages.map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={`language-${language}`}
                            checked={editData.languages?.includes(language)}
                            onCheckedChange={(checked) => handleArrayInputChange("languages", language, checked)}
                          />
                          <Label htmlFor={`language-${language}`}>{language}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-instagram">Instagram Handle</Label>
                        <Input
                          id="edit-instagram"
                          value={editData.instagram_handle || ""}
                          onChange={(e) => handleInputChange("instagram_handle", e.target.value)}
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-twitter">Twitter Handle</Label>
                        <Input
                          id="edit-twitter"
                          value={editData.twitter_handle || ""}
                          onChange={(e) => handleInputChange("twitter_handle", e.target.value)}
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-youtube">YouTube Channel</Label>
                        <Input
                          id="edit-youtube"
                          value={editData.youtube_handle || ""}
                          onChange={(e) => handleInputChange("youtube_handle", e.target.value)}
                          placeholder="Channel name or URL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-facebook">Facebook Page</Label>
                        <Input
                          id="edit-facebook"
                          value={editData.facebook_handle || ""}
                          onChange={(e) => handleInputChange("facebook_handle", e.target.value)}
                          placeholder="Page name or URL"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <div className="flex justify-end gap-4 w-full">
                  <Button variant="outline" onClick={() => setEditData({ ...data })}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
