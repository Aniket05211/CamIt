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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CameramanData {
  type: "elite" | "realtime"
  name: string
  email: string
  phone: string
  location: string
  experience: string
  rate: string
  specialties: string[]
  equipment: string
  bio: string
  languages: string[]
  availability: string[]
  awards?: string
  celebrityClients?: string
  portfolio: string[]
  upcomingEvents: {
    id: string
    title: string
    date: string
    location: string
    type: string
  }[]
  recentReviews: {
    id: string
    name: string
    rating: number
    comment: string
    date: string
    avatar: string
  }[]
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
  isAvailable?: boolean
  currentLocation?: { lat: number; lng: number }
}

export default function CameramanDashboard() {
  const [data, setData] = useState<CameramanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPortfolioIndex, setCurrentPortfolioIndex] = useState(0)
  const [isAvailable, setIsAvailable] = useState(false)

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    phone_number: "",
    bio: "",
    equipment: "",
    hourly_rate: "",
    location: "",
    experience_years: "",
    specializations: "",
    languages: "",
    awards: "",
    celebrity_clients: "",
  })
  const [newEventData, setNewEventData] = useState({
    title: "",
    date: "",
    location: "",
    type: "",
  })

  const fetchCameramanData = async () => {
    try {
      setLoading(true)
      const testUserId = "550e8400-e29b-41d4-a716-446655440000"
      let userId = testUserId
      const storedUser = localStorage.getItem("camit_user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.id) {
            userId = userData.id
          }
        } catch (e) {}
      } else {
        localStorage.setItem(
          "camit_user",
          JSON.stringify({
            id: testUserId,
            email: "test@cameraman.com",
            name: "John Smith",
          }),
        )
      }
      const response = await fetch(`/api/cameramen/${userId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const dashboardData: CameramanData = {
            type: result.data.cameraman_type === "realtime" ? "realtime" : "elite",
            name: result.data.name || "Unknown",
            email: result.data.email || "",
            phone: result.data.phone || "",
            location: result.data.location || "",
            experience: result.data.experience_years ? `${result.data.experience_years}` : "0",
            rate: result.data.hourly_rate ? result.data.hourly_rate.toString() : "0",
            specialties: result.data.specialties || [],
            equipment: result.data.equipment || "",
            bio: result.data.bio || "",
            languages: result.data.languages || [],
            availability: result.data.availability || [],
            awards: result.data.awards || "",
            celebrityClients: result.data.celebrity_clients || "",
            portfolio: result.data.portfolio || [],
            upcomingEvents: result.data.upcoming_events || [],
            recentReviews: result.data.recent_reviews || [],
            earnings: result.data.earnings || {
              total: 0,
              thisMonth: 0,
              lastMonth: 0,
            },
            stats: result.data.stats || {
              totalBookings: 0,
              completedEvents: 0,
              cancelledEvents: 0,
              averageRating: result.data.rating || 0,
            },
          }
          setData(dashboardData)
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

  useEffect(() => {
    fetchCameramanData()
  }, [])

  // Handler functions
  const handleSaveProfile = async () => {
    try {
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) return
      const userData = JSON.parse(storedUser)

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
      }

      const response = await fetch(`/api/cameramen/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        })
        setIsEditProfileOpen(false)
        await fetchCameramanData()
      } else {
        throw new Error(result.error || "Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddEvent = async () => {
    try {
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) return
      const userData = JSON.parse(storedUser)
      const response = await fetch(`/api/cameramen/${userData.id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEventData),
      })
      const result = await response.json()
      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: "Event added successfully!",
        })
        setIsAddEventOpen(false)
        setNewEventData({ title: "", date: "", location: "", type: "" })
        await fetchCameramanData()
      } else {
        throw new Error(result.error || "Failed to add event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddPhoto = async () => {
    try {
      const photoUrl = (document.getElementById("photoUrl") as HTMLInputElement)?.value
      if (!photoUrl) {
        toast({
          title: "Error",
          description: "Please enter a photo URL.",
          variant: "destructive",
        })
        return
      }
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) return
      const userData = JSON.parse(storedUser)
      const response = await fetch(`/api/cameramen/${userData.id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl }),
      })
      const result = await response.json()
      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: "Photo added successfully!",
        })
        setIsAddPhotoOpen(false)
        const input = document.getElementById("photoUrl") as HTMLInputElement
        if (input) input.value = ""
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
    }
  }

  const nextPortfolioImage = () => {
    if (data && data.portfolio.length > 0) {
      setCurrentPortfolioIndex((prev) => (prev + 1) % data.portfolio.length)
    }
  }

  const prevPortfolioImage = () => {
    if (data && data.portfolio.length > 0) {
      setCurrentPortfolioIndex((prev) => (prev - 1 + data.portfolio.length) % data.portfolio.length)
    }
  }

  const handleAvailabilityToggle = (checked: boolean) => {
    setIsAvailable(checked)
    if (checked) {
      toast({
        title: "You are now available",
        description: "Your location is being shared with nearby users.",
      })
    } else {
      toast({
        title: "You are now unavailable",
        description: "Your location is no longer being shared.",
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
                  src="https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop"
                  alt={data.name}
                />
                <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold">{data.name}</h2>
                  <p className="text-gray-500">{data.type === "elite" ? "Elite Cameraman" : "Real-Time Cameraman"}</p>
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
                  {data.type === "elite" && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      <span>${data.rate}/hour</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-Time Availability Toggle (for real-time cameramen only) */}
        {data.type === "realtime" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Real-Time Availability</h3>
                  <p className="text-gray-600">Toggle your availability to receive immediate booking requests</p>
                </div>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={handleAvailabilityToggle}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </CardContent>
          </Card>
        )}

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
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {data.stats.completedEvents} completed, {data.stats.cancelledEvents} cancelled
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
              <CardTitle className="text-sm font-medium">Experience</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.experience} years</div>
              <Progress value={Number(data.experience) * 10} max={100} className="mt-2" />
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
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            {data.upcomingEvents.length > 0 ? (
              data.upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-gray-500">{event.date}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <Badge>{event.type}</Badge>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  <p>No upcoming events. Add your first event!</p>
                </CardContent>
              </Card>
            )}
            <Button className="w-full" onClick={() => setIsAddEventOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add New Event
            </Button>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <h3 className="text-xl font-semibold">Portfolio</h3>
            {data.portfolio.length > 0 ? (
              <>
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentPortfolioIndex}
                        src={data.portfolio[currentPortfolioIndex] || "/placeholder.svg"}
                        alt={`Portfolio ${currentPortfolioIndex + 1}`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>
                  </div>
                  {data.portfolio.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent"
                        onClick={prevPortfolioImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent"
                        onClick={nextPortfolioImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {data.portfolio.map((image, index) => (
                    <Image
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Portfolio ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setCurrentPortfolioIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  <p>No portfolio photos yet. Add your first photo!</p>
                </CardContent>
              </Card>
            )}
            <Button className="w-full" onClick={() => setIsAddPhotoOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add New Photo
            </Button>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h3 className="text-xl font-semibold">Recent Reviews</h3>
            {data.recentReviews.length > 0 ? (
              data.recentReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
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
                      {data.availability.length > 0 ? (
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
                    <p>{data.celebrityClients || "No celebrity clients specified"}</p>
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
                equipment: data.equipment || "",
                hourly_rate: data.rate || "",
                location: data.location || "",
                experience_years: data.experience || "",
                specializations: data.specialties ? data.specialties.join(",") : "",
                languages: data.languages ? data.languages.join(",") : "",
                awards: data.awards || "",
                celebrity_clients: data.celebrityClients || "",
              })
              setIsEditProfileOpen(true)
            }}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </div>

        {/* Edit Profile Modal */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  value={editFormData.phone_number}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">Bio</Label>
                <Textarea
                  id="bio"
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="equipment" className="text-right">Equipment</Label>
                <Textarea
                  id="equipment"
                  value={editFormData.equipment}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, equipment: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rate" className="text-right">Hourly Rate</Label>
                <Input
                  id="rate"
                  type="number"
                  value={editFormData.hourly_rate}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, hourly_rate: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input
                  id="location"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="experience_years" className="text-right">Experience (years)</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={editFormData.experience_years}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, experience_years: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specializations" className="text-right">Specializations</Label>
                <Input
                  id="specializations"
                  placeholder="Comma separated (e.g. Wedding,Portrait)"
                  value={editFormData.specializations}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, specializations: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="languages" className="text-right">Languages</Label>
                <Input
                  id="languages"
                  placeholder="Comma separated (e.g. English,Hindi)"
                  value={editFormData.languages}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, languages: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="awards" className="text-right">Awards</Label>
                <Input
                  id="awards"
                  value={editFormData.awards}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, awards: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="celebrity_clients" className="text-right">Celebrity Clients</Label>
                <Input
                  id="celebrity_clients"
                  value={editFormData.celebrity_clients}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, celebrity_clients: e.target.value }))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveProfile}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Event Modal */}
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eventTitle" className="text-right">Title</Label>
                <Input
                  id="eventTitle"
                  value={newEventData.title}
                  onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eventDate" className="text-right">Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={newEventData.date}
                  onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eventLocation" className="text-right">Location</Label>
                <Input
                  id="eventLocation"
                  value={newEventData.location}
                  onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eventType" className="text-right">Type</Label>
                <select
                  id="eventType"
                  value={newEventData.type}
                  onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Select type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Event">Event</option>
                  <option value="Portrait">Portrait</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Photo Modal */}
        <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Photo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photoUrl" className="text-right">Photo URL</Label>
                <Input id="photoUrl" placeholder="https://example.com/photo.jpg" className="col-span-3" />
              </div>
              <p className="text-sm text-gray-500">
                For now, please provide a direct URL to your photo. File upload will be available soon.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPhoto}>Add Photo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
