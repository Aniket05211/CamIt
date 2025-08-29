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
  RefreshCw,
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

// Before-After Slider Component with synchronized image resolution
const BeforeAfterSlider = ({ before, after, description }) => {
  const [position, setPosition] = useState(50)
  
  console.log('BeforeAfterSlider props:', { before, after, description, position })

  return (
    <div 
      className="relative h-[300px] w-full overflow-hidden rounded-lg cursor-pointer"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setPosition(percentage)
      }}
    >
      {/* After Image (Background) - shows right portion */}
      <div className="absolute inset-0">
        <Image
          src={after || "/placeholder.svg"}
          alt="After editing"
          fill
          className="object-cover"
          style={{
            objectPosition: `${100 - position}% 50%`
          }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=500"
          }}
        />
      </div>
      
      {/* Before Image (Overlay) - shows left portion */}
      <div className="absolute inset-0" style={{ width: `${position}%`, overflow: "hidden" }}>
        <Image
          src={before || "/placeholder.svg"}
          alt="Before editing"
          fill
          className="object-cover"
          style={{
            objectPosition: `${position}% 50%`
          }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=500"
          }}
        />
      </div>
      
      {/* Slider Handle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-full w-1 bg-white shadow-lg" style={{ left: `${position}%` }} />
        <div
          className="absolute h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer pointer-events-auto z-20"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const container = e.currentTarget.closest('.relative')
            const rect = container?.getBoundingClientRect()
            
            const handleMouseMove = (e) => {
              e.preventDefault()
              if (rect) {
                const x = e.clientX - rect.left
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
                setPosition(percentage)
              }
            }
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ChevronRight className="h-4 w-4 -rotate-90" />
          <ChevronRight className="h-4 w-4 rotate-90" />
        </div>
      </div>
      
      {/* Slider Control */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Slider
          value={[position]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setPosition(value[0])}
          className="z-10"
        />
        <p className="text-xs text-center mt-1 text-white bg-black/50 rounded px-2 py-1">
          Click or drag to compare before/after
        </p>
      </div>
      
      {/* Labels */}
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Before</div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">After</div>
      
      {/* Description */}
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
  const [userData, setUserData] = useState(null)
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
  const [awards, setAwards] = useState([])
  const [editorBookings, setEditorBookings] = useState([])
  const [editorReviews, setEditorReviews] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isCompressingBefore, setIsCompressingBefore] = useState(false)
  const [isCompressingAfter, setIsCompressingAfter] = useState(false)

  // Image compression function (similar to cameraman dashboard)
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new window.Image()
      
      img.onload = () => {
        // Calculate new dimensions (max 1920x1080 for consistent resolution)
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
          0.8 // 80% quality for optimal compression
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Profile photo specific compression function
  const compressProfilePhoto = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new window.Image()
      
      img.onload = () => {
        // For profile photos, we want to maintain aspect ratio but ensure good quality
        // Target size: 400x400 for optimal display in cards and avatars
        const targetSize = 400
        let { width, height } = img
        
        // Calculate dimensions maintaining aspect ratio
        if (width > height) {
          height = (height * targetSize) / width
          width = targetSize
        } else {
          width = (width * targetSize) / height
          height = targetSize
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress with higher quality for profile photos
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
          0.9 // 90% quality for profile photos to maintain clarity
        )
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Upload progress simulation (similar to cameraman dashboard)
  const uploadToCloud = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          // For demo, return a data URL
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        }
        setUploadProgress(progress)
      }, 100)
    })
  }

  // Compress image from URL
  const compressImageFromUrl = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous' // Handle CORS issues
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // Calculate new dimensions (max 1920x1080 for consistent resolution)
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
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          'image/jpeg',
          0.8 // 80% quality for optimal compression
        )
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image from URL'))
      }
      
      img.src = imageUrl
    })
  }

  // Profile photo specific URL compression function
  const compressProfilePhotoFromUrl = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous' // Handle CORS issues
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // For profile photos, target size: 400x400 for optimal display
        const targetSize = 400
        let { width, height } = img
        
        // Calculate dimensions maintaining aspect ratio
        if (width > height) {
          height = (height * targetSize) / width
          width = targetSize
        } else {
          width = (width * targetSize) / height
          height = targetSize
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress with higher quality for profile photos
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            } else {
              reject(new Error('Failed to compress profile photo'))
            }
          },
          'image/jpeg',
          0.9 // 90% quality for profile photos to maintain clarity
        )
      }
      
      img.onerror = () => reject(new Error('Failed to load profile photo'))
      img.src = imageUrl
    })
  }

  useEffect(() => {
    const fetchEditorProfile = async () => {
      try {
        const storedUser = localStorage.getItem("camit_user")
        const userDataFromStorage = storedUser ? JSON.parse(storedUser) : null

        if (!userDataFromStorage?.id) {
          console.error("No user data found")
          setData(mockEditorData)
          return
        }

        setUserData(userDataFromStorage)

        const response = await fetch(`/api/editors/profile/${userDataFromStorage.id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.editor_profile) {
            // Fetch before/after images from editor_images table
            let beforeAfterSamples = result.editor_profile.before_after_samples || []
            
            try {
              const imagesResponse = await fetch(`/api/editors/images?editor_id=${result.editor_profile.id}&image_type=before_after`)
              if (imagesResponse.ok) {
                const imagesData = await imagesResponse.json()
                const beforeAfterImages = imagesData.images || []
                
                // Group images by description to pair before/after images
                const imageGroups: { [key: string]: { before: string; after: string; description: string } } = {}
                beforeAfterImages.forEach(img => {
                  const key = img.description || 'Sample'
                  if (!imageGroups[key]) {
                    imageGroups[key] = { before: '', after: '', description: img.description || 'Before and after editing sample' }
                  }
                  if (img.title.includes('Before') || img.title.toLowerCase().includes('before')) {
                    imageGroups[key].before = img.image_url
                  } else if (img.title.includes('After') || img.title.toLowerCase().includes('after')) {
                    imageGroups[key].after = img.image_url
                  }
                })
                
                // Convert grouped images to sample format
                const beforeAfterSamplesFromImages = []
                Object.entries(imageGroups).forEach(([key, group], idx) => {
                  if (group.before && group.after) {
                    beforeAfterSamplesFromImages.push({
                      id: idx + 1,
                      before: group.before,
                      after: group.after,
                      type: "photo",
                      description: group.description
                    })
                  }
                })
                
                // Use samples from editor_images if available, otherwise use samples from editor_profiles
                if (beforeAfterSamplesFromImages.length > 0) {
                  beforeAfterSamples = beforeAfterSamplesFromImages
                } else {
                  beforeAfterSamples = beforeAfterSamples.map((sample, idx) => ({
                    id: `profile-${idx + 1}`,
                    before: sample.before || "",
                    after: sample.after || "",
                    type: "photo",
                    description: sample.description || "Before and after editing sample"
                  }))
                }
              }
            } catch (error) {
              console.error("Error fetching before/after images:", error)
            }
            
            // Transform API data to match component expectations
            const transformedData = {
              id: result.user?.id || userDataFromStorage.id, // Add the user ID
              editor_profile_id: result.editor_profile?.id, // Add the editor profile ID
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
              beforeAfterSamples: beforeAfterSamples.length > 0 ? beforeAfterSamples : mockEditorData.beforeAfterSamples,
              upcomingProjects: mockEditorData.upcomingProjects, // Keep mock data for now
              recentReviews: result.editor_profile.recent_reviews || mockEditorData.recentReviews,
              earnings: result.editor_profile.earnings || mockEditorData.earnings,
              stats: result.editor_profile.stats || mockEditorData.stats,
              isAvailable: result.editor_profile.availability_status === "available",
              instagram_handle: result.editor_profile.instagram_handle || "",
                      twitter_handle: result.editor_profile.twitter_handle || "",
        youtube_handle: result.editor_profile.youtube_handle || "",
        facebook_handle: result.editor_profile.facebook_handle || "",
        awards: result.editor_profile.awards || [],
        profileImage: result.editor_profile.profile_urls || ""
            }
            setData(transformedData)
            setAwards(result.editor_profile.awards || [])
          } else if (result.error === "Editor profile not found") {
            // Create a default profile for new editors
            console.log("No editor profile found, creating default profile")
            
            try {
              const createResponse = await fetch(`/api/editors/profile/${userDataFromStorage.id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  project_rate: 75,
                  hourly_rate: 20,
                  experience_years: 1,
                  turnaround_time: 24,
                  bio: "Professional editor with experience in photo and video editing.",
                  specializations: ["Photo Editing", "Color Grading"],
                  software_skills: ["Adobe Photoshop", "Adobe Lightroom"],
                  languages: ["English"],
                  availability_status: "available",
                  portfolio_urls: [],
                  location: "",
                  before_after_samples: [],
                  recent_reviews: [],
                  earnings: { total: 0, thisMonth: 0, lastMonth: 0 },
                  stats: { totalProjects: 0, completedProjects: 0, cancelledProjects: 0, averageRating: 0 },
                  full_service_rate: "75-150",
                  phone_number: userDataFromStorage.phone_number || ""
                })
              })
              
              if (createResponse.ok) {
                const createResult = await createResponse.json()
                if (createResult.success) {
                  // Fetch the newly created profile
                  const profileResponse = await fetch(`/api/editors/profile/${userDataFromStorage.id}`)
                  if (profileResponse.ok) {
                    const profileResult = await profileResponse.json()
                    if (profileResult.success && profileResult.editor_profile) {
                      // Transform the real data
                      const transformedData = {
                        id: profileResult.user?.id || userDataFromStorage.id, // Add the user ID
                        type: profileResult.editor_profile.specializations?.includes("Video Editing") ? "both" : "photo",
                        name: profileResult.user?.full_name || "Editor",
                        email: profileResult.user?.email || "",
                        phone: profileResult.user?.phone_number || "",
                        location: profileResult.editor_profile.location || "",
                        experience: profileResult.editor_profile.experience_years?.toString() || "0",
                        rate: profileResult.editor_profile.project_rate?.toString() || "0",
                        specialties: profileResult.editor_profile.specializations || [],
                        software: profileResult.editor_profile.software_skills || [],
                        bio: profileResult.editor_profile.bio || "",
                        languages: profileResult.editor_profile.languages || [],
                        turnaround: profileResult.editor_profile.turnaround_time?.toString() || "24",
                        sampleRate: profileResult.editor_profile.hourly_rate?.toString() || "0",
                        fullServiceRate: profileResult.editor_profile.full_service_rate || "75-200",
                        rating: profileResult.editor_profile.rating || 0,
                        reviews: profileResult.editor_profile.total_reviews || 0,
                        portfolio: profileResult.editor_profile.portfolio_urls || [],
                        beforeAfterSamples: profileResult.editor_profile.before_after_samples || [],
                        upcomingProjects: [],
                        recentReviews: profileResult.editor_profile.recent_reviews || [],
                        earnings: profileResult.editor_profile.earnings || { total: 0, thisMonth: 0, lastMonth: 0 },
                        stats: profileResult.editor_profile.stats || { totalProjects: 0, completedProjects: 0, cancelledProjects: 0, averageRating: 0 },
                        isAvailable: profileResult.editor_profile.availability_status === "available",
                        instagram_handle: profileResult.editor_profile.instagram_handle || "",
                        twitter_handle: profileResult.editor_profile.twitter_handle || "",
                        youtube_handle: profileResult.editor_profile.youtube_handle || "",
                        facebook_handle: profileResult.editor_profile.facebook_handle || "",
                        awards: profileResult.editor_profile.awards || [],
                        profileImage: profileResult.editor_profile.profile_urls || ""
                      }
                      setData(transformedData)
                      setAwards(profileResult.editor_profile.awards || [])
                      
                      // Show success notification
                      toast({
                        title: "Profile Created",
                        description: "Your editor profile has been created successfully! You can now edit your details.",
                      })
                      return
                    }
                  }
                }
              }
            } catch (createError) {
              console.error("Error creating editor profile:", createError)
            }
            
            // Fallback to mock data if profile creation fails
            const defaultData = {
              ...mockEditorData,
              name: userDataFromStorage.full_name || "Editor",
              email: userDataFromStorage.email || "",
              phone: userDataFromStorage.phone_number || "",
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

  useEffect(() => {
    if (data?.id) {
      fetchEditorBookings()
      fetchEditorReviews()
    }
  }, [data?.id])

  if (!data || !userData) {
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
        phone_number: editData.phone,
        awards: awards
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

  const handleNewSampleChange = async (field, value) => {
    if (field === 'before' || field === 'after') {
      if (value instanceof File) {
        // Validate file size (max 10MB)
        if (value.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image smaller than 10MB.",
            variant: "destructive",
          })
          return
        }

        console.log(`Compressing ${field} image:`, value.name, 'Size:', value.size)
        if (field === 'before') {
          setIsCompressingBefore(true)
        } else {
          setIsCompressingAfter(true)
        }
        setUploadProgress(0)
        
        try {
          // Show compression progress
          toast({
            title: "Processing image...",
            description: "Compressing and optimizing your image for faster upload.",
          })

          // Compress the image
          const compressedFile = await compressImage(value)
          console.log(`Compressed ${field} image:`, compressedFile.name, 'Size:', compressedFile.size, 'Compression ratio:', ((value.size - compressedFile.size) / value.size * 100).toFixed(1) + '%')
          
          // Upload with progress
          const imageUrl = await uploadToCloud(compressedFile)
          
          setNewSample((prev) => ({
            ...prev,
            [field]: imageUrl,
          }))

          toast({
            title: "Image processed!",
            description: `Compressed ${field} image successfully.`,
          })
        } catch (error) {
          console.error('Error compressing image:', error)
          toast({
            title: "Compression failed",
            description: "Failed to compress image. Please try again.",
            variant: "destructive",
          })
          // Fallback to original file if compression fails
          setNewSample((prev) => ({
            ...prev,
            [field]: value,
          }))
        } finally {
          if (field === 'before') {
            setIsCompressingBefore(false)
          } else {
            setIsCompressingAfter(false)
          }
          setUploadProgress(0)
        }
      } else if (typeof value === 'string' && value.trim()) {
        // URL input - compress the image from URL
        console.log(`Compressing ${field} image from URL:`, value)
        if (field === 'before') {
          setIsCompressingBefore(true)
        } else {
          setIsCompressingAfter(true)
        }
        setUploadProgress(0)
        
        try {
          // Show compression progress
          toast({
            title: "Processing image...",
            description: "Compressing and optimizing your image from URL.",
          })

          // Compress the image from URL
          const compressedImageUrl = await compressImageFromUrl(value)
          console.log(`Compressed ${field} image from URL successfully`)
          
          setNewSample((prev) => ({
            ...prev,
            [field]: compressedImageUrl,
          }))

          toast({
            title: "Image processed!",
            description: `Compressed ${field} image from URL successfully.`,
          })
        } catch (error) {
          console.error('Error compressing image from URL:', error)
          toast({
            title: "Compression failed",
            description: "Failed to compress image from URL. Please check the URL or try again.",
            variant: "destructive",
          })
          // Fallback to original URL if compression fails
          setNewSample((prev) => ({
            ...prev,
            [field]: value,
          }))
        } finally {
          if (field === 'before') {
            setIsCompressingBefore(false)
          } else {
            setIsCompressingAfter(false)
          }
          setUploadProgress(0)
        }
      } else {
        // Other value or empty string
        setNewSample((prev) => ({
          ...prev,
          [field]: value,
        }))
      }
    } else {
      // Other fields
      setNewSample((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
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
        // URL input or already processed data URL
        beforeImageUrl = newSample.before
      } else {
        // This shouldn't happen now since we process files in handleNewSampleChange
        console.error('Unexpected file object in handleAddSample')
        return
      }
      
      if (typeof newSample.after === 'string') {
        // URL input or already processed data URL
        afterImageUrl = newSample.after
      } else {
        // This shouldn't happen now since we process files in handleNewSampleChange
        console.error('Unexpected file object in handleAddSample')
        return
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

  const handleAddAward = () => {
    setAwards((prev) => [...prev, { title: "", year: "", organization: "" }])
  }

  const handleRemoveAward = (index) => {
    setAwards((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAwardChange = (index, field, value) => {
    setAwards((prev) => prev.map((award, i) =>
      i === index ? { ...award, [field]: value } : award
    ))
  }

  const handleProfilePhotoUrlChange = async (url) => {
    if (!url.trim()) return

    try {
      if (!userData?.id) {
        toast({
          title: "Error",
          description: "User data not found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      // Show compression progress
      setIsCompressing(true)
      setUploadProgress(0)

      // Compress the image from URL using profile-specific compression
      const compressedImageUrl = await compressProfilePhotoFromUrl(url.trim())
      
      // Simulate upload progress
      await uploadToCloud()

      // Update editor profile with the compressed profile image URL
      const profileUpdateResponse = await fetch(`/api/editors/profile/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_urls: compressedImageUrl,
        }),
      })

      if (profileUpdateResponse.ok) {
        // Update edit data
        setEditData((prev) => ({
          ...prev,
          profileImage: compressedImageUrl,
        }))

        toast({
          title: "Profile Photo Updated",
          description: "Your profile photo has been successfully updated.",
        })
      } else {
        console.error("Failed to update editor profile with profile image")
        toast({
          title: "Update Failed",
          description: "Failed to update profile photo. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile photo URL:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCompressing(false)
      setUploadProgress(0)
    }
  }

  const handleProfilePhotoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      if (!userData?.id) {
        toast({
          title: "Error",
          description: "User data not found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      // Show compression progress
      setIsCompressing(true)
      setUploadProgress(0)

      // Compress the image file using profile-specific compression
      const compressedFile = await compressProfilePhoto(file)
      console.log("Profile photo compressed successfully")

      // Simulate upload progress
      await uploadToCloud()

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", compressedFile)
      formData.append("user_id", userData.id)

      const response = await fetch("/api/editors/images", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update editor profile with the profile image URL
        const profileUpdateResponse = await fetch(`/api/editors/profile/${userData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_urls: result.image_url,
          }),
        })

        if (profileUpdateResponse.ok) {
          // Update edit data
          setEditData((prev) => ({
            ...prev,
            profileImage: result.image_url,
          }))

          toast({
            title: "Profile Photo Updated",
            description: "Your profile photo has been successfully updated.",
          })
        } else {
          console.error("Failed to update editor profile with profile image")
          toast({
            title: "Upload Failed",
            description: "Failed to update profile photo. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        throw new Error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCompressing(false)
      setUploadProgress(0)
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
    setUploadProgress(0)

    try {
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

      // Process and compress each file
      const processedUrls = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `File ${file.name} is larger than 10MB. Please select a smaller image.`,
            variant: "destructive",
          })
          continue
        }

        try {
          // Show compression progress
          toast({
            title: "Processing image...",
            description: `Compressing ${file.name} for faster upload.`,
          })

          // Compress the image
          const compressedFile = await compressImage(file)
          console.log(`Compressed portfolio image:`, compressedFile.name, 'Size:', compressedFile.size, 'Compression ratio:', ((file.size - compressedFile.size) / file.size * 100).toFixed(1) + '%')
          
          // Upload with progress
          const imageUrl = await uploadToCloud(compressedFile)
          processedUrls.push(imageUrl)

          // Save to database
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
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error)
          toast({
            title: "Processing failed",
            description: `Failed to process ${file.name}. Please try again.`,
            variant: "destructive",
          })
        }
      }

      setData((prev) => ({
        ...prev,
        portfolio: [...prev.portfolio, ...processedUrls],
      }))

      setIsUploading(false)
      setUploadProgress(0)

      toast({
        title: "Upload Complete",
        description: `Successfully added ${processedUrls.length} image(s) to your portfolio.`,
      })
    } catch (error) {
      console.error("Error uploading portfolio:", error)
      setIsUploading(false)
      setUploadProgress(0)
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddPortfolioUrl = async () => {
    if (!portfolioUrl.trim()) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
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

      // Show compression progress
      toast({
        title: "Processing image...",
        description: "Compressing and optimizing your image from URL.",
      })

      // Compress the image from URL
      const compressedImageUrl = await compressImageFromUrl(portfolioUrl.trim())
      console.log('Compressed portfolio image from URL successfully')

      // Save compressed image to database
      const imageResponse = await fetch('/api/editors/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          editor_id: editorId,
          image_url: compressedImageUrl,
          title: 'Portfolio Image',
          description: 'Added from URL (compressed)',
          category: 'Portfolio',
          image_type: 'portfolio',
          is_public: true
        }),
      })

      if (imageResponse.ok) {
        setData((prev) => ({
          ...prev,
          portfolio: [...prev.portfolio, compressedImageUrl],
        }))

        setPortfolioUrl("")
        toast({
          title: "Image Added",
          description: "Compressed image has been added to your portfolio.",
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
        title: "Compression failed",
        description: "Failed to compress image from URL. Please check the URL or try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
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

  // Editor booking functions
  const fetchEditorBookings = async () => {
    try {
      console.log("fetchEditorBookings called with data.id:", data?.id)
      if (!data?.id) {
        console.log("No data.id found, returning early")
        return
      }
      
      const response = await fetch(`/api/bookings/editors?user_id=${data.id}`)
      console.log("Editor bookings response status:", response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log("Editor bookings result:", result)
        setEditorBookings(result.bookings || [])
      } else {
        const errorText = await response.text()
        console.error("Editor bookings API error:", errorText)
      }
    } catch (error) {
      console.error("Error fetching editor bookings:", error)
    }
  }

  // Fetch editor reviews
  const fetchEditorReviews = async () => {
    try {
      console.log("fetchEditorReviews called with data.id:", data?.id)
      if (!data?.id) {
        console.log("No data.id found, returning early")
        return
      }
      
      const response = await fetch(`/api/editor-reviews?editor_id=${data.id}`)
      console.log("Editor reviews response status:", response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log("Editor reviews result:", result)
        setEditorReviews(result.reviews || [])
      } else {
        const errorText = await response.text()
        console.error("Editor reviews API error:", errorText)
      }
    } catch (error) {
      console.error("Error fetching editor reviews:", error)
    }
  }

  // Calculate real statistics from editor bookings and reviews
  const calculateRealStats = () => {
    const totalProjects = editorBookings.length
    const completedProjects = editorBookings.filter(booking => booking.status === 'completed').length
    const cancelledProjects = editorBookings.filter(booking => booking.status === 'cancelled').length
    const inProgressProjects = editorBookings.filter(booking => booking.status === 'in_progress').length
    
    // Calculate average rating from reviews
    const totalRating = editorReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = editorReviews.length > 0 ? totalRating / editorReviews.length : 0
    
    // Calculate total earnings from completed projects
    const totalEarnings = editorBookings
      .filter(booking => booking.status === 'completed' && booking.final_price)
      .reduce((sum, booking) => sum + (booking.final_price || 0), 0)
    
    // Calculate this month's earnings
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    const thisMonthEarnings = editorBookings
      .filter(booking => {
        if (booking.status !== 'completed' || !booking.completed_at) return false
        const completedDate = new Date(booking.completed_at)
        return completedDate.getMonth() === thisMonth && completedDate.getFullYear() === thisYear
      })
      .reduce((sum, booking) => sum + (booking.final_price || 0), 0)
    
    // Calculate last month's earnings
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear
    const lastMonthEarnings = editorBookings
      .filter(booking => {
        if (booking.status !== 'completed' || !booking.completed_at) return false
        const completedDate = new Date(booking.completed_at)
        return completedDate.getMonth() === lastMonth && completedDate.getFullYear() === lastMonthYear
      })
      .reduce((sum, booking) => sum + (booking.final_price || 0), 0)
    
    return {
      totalProjects,
      completedProjects,
      cancelledProjects,
      inProgressProjects,
      averageRating,
      totalEarnings,
      thisMonthEarnings,
      lastMonthEarnings,
      totalReviews: editorReviews.length
    }
  }

  const getBookingStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAcceptBooking = async (bookingId) => {
    try {
      // Prompt for estimated price
      const estimatedPrice = prompt("Please enter the estimated price for this project:")
      if (!estimatedPrice || isNaN(parseFloat(estimatedPrice))) {
        toast({
          title: "Error",
          description: "Please enter a valid price.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/bookings/editors/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
          estimated_price: parseFloat(estimatedPrice)
        }),
      })

      if (response.ok) {
        await fetchEditorBookings()
        toast({
          title: "Booking Accepted",
          description: `Booking accepted with estimated price: $${estimatedPrice}. Client will be notified to make payment.`,
        })
      }
    } catch (error) {
      console.error("Error accepting booking:", error)
      toast({
        title: "Error",
        description: "Failed to accept booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectBooking = async (bookingId) => {
    const reason = prompt("Please provide a reason for rejection:")
    if (!reason) return

    try {
      const response = await fetch(`/api/bookings/editors/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          rejection_reason: reason
        }),
      })

      if (response.ok) {
        await fetchEditorBookings()
        toast({
          title: "Booking Rejected",
          description: "The booking has been rejected.",
        })
      }
    } catch (error) {
      console.error("Error rejecting booking:", error)
      toast({
        title: "Error",
        description: "Failed to reject booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStartProject = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/editors/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "in_progress",
          started_at: new Date().toISOString()
        }),
      })

      if (response.ok) {
        await fetchEditorBookings()
        toast({
          title: "Project Started",
          description: "The project has been marked as in progress.",
        })
      }
    } catch (error) {
      console.error("Error starting project:", error)
      toast({
        title: "Error",
        description: "Failed to start project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteProject = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/editors/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          completed_at: new Date().toISOString()
        }),
      })

      if (response.ok) {
        await fetchEditorBookings()
        toast({
          title: "Project Completed",
          description: "The project has been marked as completed.",
        })
      }
    } catch (error) {
      console.error("Error completing project:", error)
      toast({
        title: "Error",
        description: "Failed to complete project. Please try again.",
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
                  src={data.profileImage || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070"}
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
                      ${data.fullServiceRate}
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
              <div className="text-2xl font-bold">${calculateRealStats().totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +${(calculateRealStats().thisMonthEarnings - calculateRealStats().lastMonthEarnings).toLocaleString()} from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateRealStats().totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {calculateRealStats().completedProjects} completed, {calculateRealStats().cancelledProjects} cancelled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateRealStats().averageRating.toFixed(1)}</div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(calculateRealStats().averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
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
                  {(() => {
                    const inProgressBookings = editorBookings.filter(booking => booking.status === 'in_progress')
                    return inProgressBookings.length > 0 ? (
                      <div className="space-y-4">
                        {inProgressBookings.map((booking) => (
                          <div key={booking.id} className="flex justify-between items-center border-b pb-3">
                            <div>
                              <h4 className="font-semibold">{booking.project_title}</h4>
                              <p className="text-sm text-gray-500">Client: {booking.client?.full_name || "Client"}</p>
                              <p className="text-sm text-gray-500">Due: {new Date(booking.deadline_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              In Progress
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6">No upcoming projects</p>
                    )
                  })()}
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
                  {(() => {
                    return editorReviews.length > 0 ? (
                      <div className="space-y-4">
                        {editorReviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="border-b pb-3">
                            <div className="flex items-center mb-2">
                              <Avatar className="w-8 h-8 mr-2">
                                <AvatarImage src={review.reviewer?.profile_image_url || "/placeholder-user.jpg"} alt={review.reviewer?.full_name || "Reviewer"} />
                                <AvatarFallback>{(review.reviewer?.full_name || "R").charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-sm">{review.reviewer?.full_name || "Anonymous"}</h4>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-gray-500 ml-1">
                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{review.review_text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-6">No reviews yet</p>
                    )
                  })()}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={fetchEditorReviews}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Reviews
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
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-800">
                            {uploadProgress < 100 ? "Processing images..." : "Upload complete!"}
                          </span>
                          <span className="text-sm text-blue-600">{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-center mt-1 text-blue-600">
                          {portfolioUrl.trim() ? "Compressing image from URL..." : "Compressing and uploading images..."}
                        </p>
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
                            {typeof newSample.before === 'string' ? 'Image uploaded successfully' : newSample.before.name}
                          </p>
                        )}
                        {isCompressingBefore && (
                          <div className="mt-2 p-2 bg-blue-50 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-blue-800">
                                {beforeUrl.trim() && beforeUrl.startsWith('http') 
                                  ? "Processing before image from URL..." 
                                  : "Processing before image..."}
                              </span>
                              <span className="text-xs text-blue-600">{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
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
                            {typeof newSample.after === 'string' ? 'Image uploaded successfully' : newSample.after.name}
                          </p>
                        )}
                        {isCompressingAfter && (
                          <div className="mt-2 p-2 bg-blue-50 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-blue-800">
                                {afterUrl.trim() && afterUrl.startsWith('http') 
                                  ? "Processing after image from URL..." 
                                  : "Processing after image..."}
                              </span>
                              <span className="text-xs text-blue-600">{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
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
                <CardTitle className="text-xl">Booking Requests</CardTitle>
                <CardDescription>Manage incoming editing requests from clients.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Pending Requests</h3>
                    <Button variant="outline" size="sm" onClick={fetchEditorBookings}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                  </div>

                  {editorBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Edit2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests</h3>
                      <p className="text-gray-500">You don't have any pending booking requests at the moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editorBookings.map((booking) => (
                        <Card key={booking.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{booking.project_title}</h3>
                                <p className="text-sm text-gray-600">{booking.client?.full_name || "Client"}</p>
                              </div>
                              <Badge className={getBookingStatusColor(booking.status)}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div>
                                <span className="text-sm font-medium text-gray-500">Service Type</span>
                                <p className="text-sm">{booking.service_type} editing</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Files</span>
                                <p className="text-sm">{booking.number_of_files} files</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Deadline</span>
                                <p className="text-sm">
                                  {new Date(booking.deadline_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                  {booking.deadline_time && ` at ${booking.deadline_time}`}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Budget</span>
                                <p className="text-sm">
                                  {booking.budget_min && booking.budget_max 
                                    ? `$${booking.budget_min} - $${booking.budget_max}`
                                    : "Not specified"
                                  }
                                </p>
                              </div>
                            </div>

                            {booking.project_description && (
                              <div className="mb-4">
                                <span className="text-sm font-medium text-gray-500">Description</span>
                                <p className="text-sm text-gray-700 mt-1">{booking.project_description}</p>
                              </div>
                            )}

                            {booking.special_requirements && (
                              <div className="mb-4">
                                <span className="text-sm font-medium text-gray-500">Special Requirements</span>
                                <p className="text-sm text-gray-700 mt-1">{booking.special_requirements}</p>
                              </div>
                            )}

                            {booking.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={() => handleAcceptBooking(booking.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Accept
                                </Button>
                                <Button 
                                  onClick={() => handleRejectBooking(booking.id)}
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}

                            {booking.status === "accepted" && (
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-medium text-green-900 mb-2">Booking Accepted</h4>
                                <p className="text-sm text-green-700">
                                  You accepted this booking on {new Date(booking.accepted_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Payment Status: 
                                  <span className={`ml-1 font-medium ${
                                    booking.payment_status === "paid" 
                                      ? "text-green-600" 
                                      : "text-orange-600"
                                  }`}>
                                    {booking.payment_status === "paid" ? "Paid" : "Pending"}
                                  </span>
                                </p>
                                {booking.payment_status === "paid" ? (
                                  <div className="mt-3">
                                    <Button 
                                      onClick={() => handleStartProject(booking.id)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      Start Project
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="mt-3">
                                    <p className="text-sm text-orange-600">
                                      Waiting for client payment to start the project
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {booking.status === "rejected" && (
                              <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-medium text-red-900 mb-2">Booking Rejected</h4>
                                <p className="text-sm text-red-700">
                                  You rejected this booking on {new Date(booking.rejected_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                {booking.rejection_reason && (
                                  <p className="text-sm text-red-600 mt-2">
                                    <strong>Reason:</strong> {booking.rejection_reason}
                                  </p>
                                )}
                              </div>
                            )}

                            {booking.status === "in_progress" && (
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Project In Progress</h4>
                                <p className="text-sm text-blue-700">
                                  Started on {new Date(booking.started_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                <div className="mt-3">
                                  <Button 
                                    onClick={() => handleCompleteProject(booking.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Mark Complete
                                  </Button>
                                </div>
                              </div>
                            )}

                            {booking.status === "completed" && (
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-medium text-green-900 mb-2">Project Completed</h4>
                                <p className="text-sm text-green-700">
                                  Completed on {new Date(booking.completed_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
                    <h3 className="font-medium">Profile Photo</h3>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={editData.profileImage || data?.profileImage || "/placeholder-user.jpg"} />
                        <AvatarFallback>{editData.name?.charAt(0) || "E"}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Label htmlFor="profile-photo">Upload Profile Photo</Label>
                        <Input
                          id="profile-photo"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          className="max-w-xs"
                        />
                        <p className="text-sm text-gray-500">Recommended size: 400x400 pixels</p>
                        <div className="space-y-2">
                          <Label htmlFor="profile-photo-url">Or enter image URL</Label>
                          <Input
                            id="profile-photo-url"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            onChange={(e) => handleProfilePhotoUrlChange(e.target.value)}
                            className="max-w-xs"
                          />
                        </div>
                        
                        {/* Profile Photo Compression Progress */}
                        {isCompressing && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Compressing profile photo...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Awards & Recognition</h3>
                    <div className="space-y-3">
                      {awards.map((award, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={award.title || ""}
                            onChange={(e) => handleAwardChange(index, "title", e.target.value)}
                            placeholder="Award title"
                            className="flex-1"
                          />
                          <Input
                            value={award.year || ""}
                            onChange={(e) => handleAwardChange(index, "year", e.target.value)}
                            placeholder="Year"
                            className="w-20"
                          />
                          <Input
                            value={award.organization || ""}
                            onChange={(e) => handleAwardChange(index, "organization", e.target.value)}
                            placeholder="Organization"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAward(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddAward}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Award
                      </Button>
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
