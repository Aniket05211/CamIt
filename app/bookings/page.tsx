"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle, XCircle, AlertCircle, Star, Heart, Building, Camera, Video, Globe, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Original bookings interface (cameraman bookings)
interface Booking {
  id: string
  title: string
  client_name: string
  photographer_name: string
  photographer_id: string
  event_date: string
  duration_hours: number
  location_address: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  payment_status: "pending" | "success" | "failed" | "refunded"
  budget_min?: number
  budget_max?: number
  special_requirements?: string
  created_at: string
  accepted_at?: string
  rejected_at?: string
  rejection_reason?: string
  has_review?: boolean
}

// New event bookings interface
interface BookingEvent {
  id: string
  client_id: string
  event_type: string
  service_type: string
  event_date: string
  event_time: string
  location: string
  number_of_guests: number
  special_requirements?: string
  status: string
  photographer_id?: string
  estimated_price?: number
  final_price?: number
  payment_status: string
  created_at: string
  updated_at: string
  notes?: string
}

// New trip bookings interface
interface BookingTrip {
  id: string
  client_id: string
  full_name: string
  email: string
  phone: string
  destination: string
  start_date: string
  end_date: string
  group_size: number
  budget: number
  photography_style: string
  special_requests?: string
  hear_about_us?: string
  status: string
  photographer_id?: string
  estimated_price?: number
  final_price?: number
  payment_status: string
  created_at: string
  updated_at: string
  notes?: string
}

export default function BookingsPage() {
  const [originalBookings, setOriginalBookings] = useState<Booking[]>([])
  const [eventBookings, setEventBookings] = useState<BookingEvent[]>([])
  const [tripBookings, setTripBookings] = useState<BookingTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("original")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isTripReviewDialogOpen, setIsTripReviewDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [selectedTripBooking, setSelectedTripBooking] = useState<BookingTrip | null>(null)
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ""
  })
  const [tripReviewData, setTripReviewData] = useState({
    rating: 5,
    review_text: "",
    location: "",
    highlight: "Amazing Experience",
    photos_count: 0,
    review_images: [],
    avatar_url: "",
    location_image_url: "",
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [submittingTripReview, setSubmittingTripReview] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const fetchBookings = async () => {
    try {
      console.log("=== FETCH BOOKINGS STARTED ===")
      setLoading(true)
      
      // Get current user ID
      const storedUser = localStorage.getItem("camit_user")
      console.log("Stored user data:", storedUser)
      
      const userData = storedUser ? JSON.parse(storedUser) : null
      console.log("Parsed user data:", userData)
      
      const currentUserId = userData?.id
      console.log("Current user ID:", currentUserId)

      if (!currentUserId) {
        console.error("No user ID found in localStorage")
        toast({
          title: "Error",
          description: "Please log in to view your bookings.",
          variant: "destructive",
        })
        return
      }

      console.log("=== FETCHING ORIGINAL BOOKINGS ===")
      // Fetch original bookings (cameraman bookings)
      const originalUrl = `/api/bookings?client_id=${currentUserId}`
      console.log("Original bookings URL:", originalUrl)
      
      const originalResponse = await fetch(originalUrl)
      console.log("Original bookings response status:", originalResponse.status)
      console.log("Original bookings response headers:", originalResponse.headers)
      
      if (originalResponse.ok) {
        const originalData = await originalResponse.json()
        console.log("Original bookings data:", originalData)
        setOriginalBookings(originalData || [])
      } else {
        console.error("Original bookings API error:", originalResponse.status)
        const errorText = await originalResponse.text()
        console.error("Original bookings error details:", errorText)
      }

      console.log("=== FETCHING EVENT BOOKINGS ===")
      // Fetch event bookings
      const eventUrl = `/api/bookings/events?client_id=${currentUserId}`
      console.log("Event bookings URL:", eventUrl)
      
      const eventResponse = await fetch(eventUrl)
      console.log("Event bookings response status:", eventResponse.status)
      console.log("Event bookings response headers:", eventResponse.headers)
      
      if (eventResponse.ok) {
        const eventData = await eventResponse.json()
        console.log("Event bookings data:", eventData)
        console.log("Event bookings count:", eventData.bookings?.length || 0)
        setEventBookings(eventData.bookings || [])
      } else {
        console.error("Event bookings API error:", eventResponse.status)
        const errorText = await eventResponse.text()
        console.error("Event bookings error details:", errorText)
      }

      console.log("=== FETCHING TRIP BOOKINGS ===")
      // Fetch trip bookings
      const tripUrl = `/api/bookings/trips?client_id=${currentUserId}`
      console.log("Trip bookings URL:", tripUrl)
      
      const tripResponse = await fetch(tripUrl)
      console.log("Trip bookings response status:", tripResponse.status)
      console.log("Trip bookings response headers:", tripResponse.headers)
      
      if (tripResponse.ok) {
        const tripData = await tripResponse.json()
        console.log("Trip bookings data:", tripData)
        setTripBookings(tripData.bookings || [])
      } else {
        console.error("Trip bookings API error:", tripResponse.status)
        const errorText = await tripResponse.text()
        console.error("Trip bookings error details:", errorText)
      }
      
      console.log("=== FETCH BOOKINGS COMPLETED ===")
    } catch (error) {
      console.error("=== ERROR IN FETCH BOOKINGS ===")
      console.error("Error type:", typeof error)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
      console.error("Full error object:", error)
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load your bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log("=== FETCH BOOKINGS FINISHED ===")
    }
  }

  const handleProceedToPayment = async (bookingId: string, type: "original" | "event" | "trip") => {
    try {
      console.log("=== HANDLE PROCEED TO PAYMENT STARTED ===")
      console.log("Parameters:", { bookingId, type })
      console.log("Function called from:", new Error().stack)
      
      // Validate parameters
      if (!bookingId) {
        throw new Error("Booking ID is required")
      }
      if (!type) {
        throw new Error("Booking type is required")
      }
      
      // Validate type parameter
      if (type !== "original" && type !== "event" && type !== "trip") {
        throw new Error(`Invalid booking type: ${type}`)
      }
      
      console.log("Type validation passed:", type)
      
      // Construct payment URL
      const paymentUrl = `/payment?booking_id=${bookingId}&type=${type}`
      console.log("Payment URL constructed:", paymentUrl)
      
      // Test if router is available
      console.log("Router available:", !!router)
      console.log("Router object:", router)
      
      // Try router navigation first
      if (router) {
        console.log("Attempting router.push navigation...")
        router.push(paymentUrl)
        console.log("Router.push called successfully")
      } else {
        console.log("Router not available, using window.location")
        window.location.href = paymentUrl
      }
      
      // Show success message
      console.log("Navigation initiated successfully")
      
    } catch (error) {
      console.error("=== ERROR IN HANDLE PROCEED TO PAYMENT ===")
      console.error("Error details:", error)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
      
      // Show error to user
      toast({
        title: "Navigation Error",
        description: `Failed to navigate to payment: ${error.message}`,
        variant: "destructive",
      })
      
      // Also try direct navigation as last resort
      try {
        console.log("Attempting direct window.location navigation as fallback...")
        const fallbackUrl = `/payment?booking_id=${bookingId}&type=${type}`
        window.location.href = fallbackUrl
      } catch (fallbackError) {
        console.error("Fallback navigation also failed:", fallbackError)
      }
    }
  }

  const handleOpenReviewDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setReviewData({ rating: 5, comment: "" })
    setIsReviewDialogOpen(true)
  }

  const handleOpenTripReviewDialog = (booking: BookingTrip) => {
    setSelectedTripBooking(booking)
    setTripReviewData({
      rating: 5,
      review_text: `My experience in ${booking.destination} was absolutely amazing! The photographer captured every moment perfectly.`,
      location: booking.destination,
      highlight: "Amazing Experience",
      photos_count: 0,
      review_images: [],
      avatar_url: "",
      location_image_url: "",
    })
    setIsTripReviewDialogOpen(true)
  }

  const handleSubmitReview = async () => {
    if (!selectedBooking) return

    try {
      setSubmittingReview(true)
      
      // Get current user ID
      const storedUser = localStorage.getItem("camit_user")
      const userData = storedUser ? JSON.parse(storedUser) : null
      const currentUserId = userData?.id

      if (!currentUserId) {
        throw new Error("User not found")
      }

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: selectedBooking.id,
          reviewer_id: currentUserId,
          reviewee_id: selectedBooking.photographer_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast({
        title: "Success",
        description: "Your review has been submitted successfully!",
      })

      setIsReviewDialogOpen(false)
      setSelectedBooking(null)
      setReviewData({ rating: 5, comment: "" })
      
      // Refresh bookings to update the review status
      fetchBookings()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true)
    try {
      const uploadedUrls = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "❌ File Too Large",
            description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
            variant: "destructive",
          })
          continue
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "❌ Invalid File Type",
            description: `${file.name} is not an image file.`,
            variant: "destructive",
          })
          continue
        }
        
        // Convert file to base64 for storage
        const reader = new FileReader()
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
        })
        
        reader.readAsDataURL(file)
        const base64Data = await base64Promise as string
        
        // Validate base64 data
        if (typeof base64Data === 'string' && base64Data.startsWith('data:image/')) {
          // Check if base64 data is too large (limit to 5MB)
          const base64Size = Math.ceil((base64Data.length * 3) / 4)
          if (base64Size > 5 * 1024 * 1024) {
            toast({
              title: "❌ File Too Large",
              description: `${file.name} is too large after processing. Please choose a smaller image.`,
              variant: "destructive",
            })
            continue
          }
          
          // Store the base64 data as the image URL
          uploadedUrls.push(base64Data)
        } else {
          console.error("Invalid base64 data generated for file:", file.name)
          toast({
            title: "❌ Upload Error",
            description: `Failed to process ${file.name}. Please try again.`,
            variant: "destructive",
          })
        }
      }
      
      if (uploadedUrls.length > 0) {
        setTripReviewData(prev => ({
          ...prev,
          review_images: [...prev.review_images, ...uploadedUrls]
        }))
        
        toast({
          title: "✅ Images Uploaded",
          description: `${uploadedUrls.length} image(s) uploaded successfully!`,
        })
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "❌ Upload Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setTripReviewData(prev => ({
      ...prev,
      review_images: prev.review_images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmitTripReview = async () => {
    if (!selectedTripBooking) {
      console.error("No selected trip booking")
      toast({
        title: "❌ Error",
        description: "No booking selected for review",
        variant: "destructive",
      })
      return
    }

    if (!tripReviewData.review_text.trim()) {
      console.error("No review text provided")
      toast({
        title: "❌ Error",
        description: "Please provide a review text",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmittingTripReview(true)
      console.log("Starting review submission...")
      
      // Get current user ID
      const storedUser = localStorage.getItem("camit_user")
      const userData = storedUser ? JSON.parse(storedUser) : null
      const currentUserId = userData?.id

      if (!currentUserId) {
        throw new Error("User not found")
      }

      const reviewData = {
        booking_trip_id: selectedTripBooking.id,
        client_id: currentUserId,
        rating: tripReviewData.rating,
        review_text: tripReviewData.review_text.trim(),
        location: tripReviewData.location,
        highlight: tripReviewData.highlight,
        photos_count: tripReviewData.review_images.length,
        review_images: tripReviewData.review_images.filter(img => 
          typeof img === 'string' && img.startsWith('data:image/')
        ),
        avatar_url: tripReviewData.avatar_url || null,
        location_image_url: tripReviewData.location_image_url || null,
      }

      console.log("Sending review data:", reviewData)

      const response = await fetch("/api/reviews/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      })

      console.log("Response status:", response.status)
      const result = await response.json()
      console.log("API response:", result)

      if (result.success) {
        toast({
          title: "✅ Review Submitted",
          description: "Thank you for sharing your trip experience!",
        })
        setIsTripReviewDialogOpen(false)
        setSelectedTripBooking(null)
        setTripReviewData({
          rating: 5,
          review_text: "",
          location: "",
          highlight: "Amazing Experience",
          photos_count: 0,
          review_images: [],
          avatar_url: "",
          location_image_url: "",
        })
        fetchBookings() // Refresh to update has_review status
      } else {
        console.error("API error:", result.error)
        toast({
          title: "❌ Error",
          description: result.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting trip review:", error)
      toast({
        title: "❌ Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingTripReview(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'confirmed':
        return "bg-green-100 text-green-800"
      case 'rejected':
      case 'cancelled':
        return "bg-red-100 text-red-800"
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      case 'completed':
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEventTypeIcon = (eventType: string) => {
    const icons = {
      wedding: Heart,
      corporate: Building,
      party: Heart, // Using Heart instead of Party
      portrait: Camera,
    }
    const Icon = icons[eventType as keyof typeof icons] || Camera
    return <Icon className="w-4 h-4" />
  }

  const getServiceTypeIcon = (serviceType: string) => {
    if (serviceType === "both") return <Camera className="w-4 h-4" />
    if (serviceType === "video") return <Video className="w-4 h-4" />
    return <Camera className="w-4 h-4" />
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">Track all your bookings across different services</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="original">Photographer Bookings ({originalBookings.length})</TabsTrigger>
          <TabsTrigger value="events">Event Bookings ({eventBookings.length})</TabsTrigger>
          <TabsTrigger value="trips">Trip Bookings ({tripBookings.length})</TabsTrigger>
        </TabsList>

        {/* Original Photographer Bookings - Using Original Design */}
        <TabsContent value="original" className="space-y-4">
          {originalBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-4">
              You haven't made any booking requests yet. Start by browsing photographers on our photoshoot page.
            </p>
            <Button onClick={() => window.location.href = "/photoshoot"}>
              Browse Photographers
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
              {originalBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{booking.title}</CardTitle>
                    <p className="text-gray-600 mt-1">with {booking.photographer_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(booking.event_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {booking.duration_hours} hours
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {booking.location_address}
                    </span>
                  </div>
                  
                  {(booking.budget_min || booking.budget_max) && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        ${booking.budget_min || 0} - ${booking.budget_max || 0}
                      </span>
                    </div>
                  )}
                </div>

                {booking.special_requirements && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Special Requirements</h4>
                    <p className="text-sm text-gray-600">{booking.special_requirements}</p>
                  </div>
                )}

                {booking.status === "rejected" && booking.rejection_reason && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
                    <p className="text-sm text-red-600">{booking.rejection_reason}</p>
                  </div>
                )}

                {booking.status === "accepted" && booking.payment_status === "pending" && (
                  <div className="border-t pt-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Booking Accepted!</h4>
                      <p className="text-sm text-green-700 mb-4">
                        Your booking has been accepted by {booking.photographer_name}. 
                        Please proceed to payment to confirm your booking.
                      </p>
                      <Button 
                            onClick={() => {
                              console.log("Proceed to Payment button clicked for original booking:", booking.id)
                              handleProceedToPayment(booking.id, "original")
                            }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  </div>
                )}

                    {(booking.status === "accepted" && booking.payment_status === "success") || booking.status === "completed" ? (
                  <div className="border-t pt-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">
                            {booking.status === "completed" ? "Booking Completed" : "Payment Successful"}
                          </h4>
                          <p className="text-sm text-blue-700 mb-4">
                            {booking.status === "completed" 
                              ? "Your booking has been completed successfully!"
                              : "Your payment has been processed successfully. Your booking is confirmed and ready!"
                            }
                          </p>
                          
                          {!booking.has_review ? (
                            <div className="bg-white p-4 rounded-lg border">
                              <h5 className="font-medium text-gray-900 mb-2">Rate Your Experience</h5>
                              <p className="text-sm text-gray-600 mb-3">
                                Share your experience with {booking.photographer_name} to help other clients.
                              </p>
                              <Button 
                                onClick={() => handleOpenReviewDialog(booking)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Write a Review
                              </Button>
                            </div>
                          ) : (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm text-green-700">
                                <Star className="inline h-4 w-4 mr-1" />
                                Thank you for your review!
                              </p>
                            </div>
                          )}
                    </div>
                  </div>
                    ) : null}

                {booking.status === "pending" && (
                  <div className="border-t pt-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Booking Pending</h4>
                      <p className="text-sm text-yellow-700">
                        Your booking request is being reviewed by {booking.photographer_name}. 
                        You'll receive an email once they make a decision.
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Requested on {new Date(booking.created_at).toLocaleDateString()}
                    {booking.accepted_at && (
                      <span className="ml-4">
                        Accepted on {new Date(booking.accepted_at).toLocaleDateString()}
                      </span>
                    )}
                    {booking.rejected_at && (
                      <span className="ml-4">
                        Rejected on {new Date(booking.rejected_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </TabsContent>

        {/* Event Bookings - Using Current Design */}
        <TabsContent value="events" className="space-y-4">
          {eventBookings.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Event Bookings</h3>
                <p className="text-gray-600">You haven't made any event bookings yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {eventBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getEventTypeIcon(booking.event_type)}
                          <h3 className="font-semibold capitalize">{booking.event_type}</h3>
                          <span className="text-gray-500">•</span>
                          {getServiceTypeIcon(booking.service_type)}
                          <span className="text-sm capitalize">{booking.service_type}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{new Date(booking.event_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{booking.event_time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="truncate">{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>{booking.number_of_guests} guests</span>
                          </div>
                        </div>
                        
                        {booking.special_requirements && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Requirements:</strong> {booking.special_requirements}
                          </div>
                        )}

                        {booking.final_price && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Final Price:</strong> ${booking.final_price}
                          </div>
                        )}
                      </div>
                      
                                              <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          
                          {(booking.status === "confirmed" || booking.status === "Confirmed" || booking.status === "completed" || booking.status === "Completed") && (booking.payment_status === "pending" || !booking.payment_status) && (
                            <div className="border-t pt-4">
                              <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-medium text-green-900 mb-2">Booking Confirmed!</h4>
                                <p className="text-sm text-green-700 mb-4">
                                  Your event booking has been confirmed. Please proceed to payment to complete your booking.
                                </p>
                                <Button 
                                  onClick={() => {
                                    console.log("=== EVENT BOOKING PAY NOW CLICKED ===")
                                    console.log("Booking ID:", booking.id)
                                    console.log("Booking Status:", booking.status)
                                    console.log("Payment Status:", booking.payment_status)
                                    console.log("Event Type:", booking.event_type)
                                    console.log("Service Type:", booking.service_type)
                                    console.log("Full booking object:", booking)
                                    console.log("Tab context: Event Bookings")
                                    handleProceedToPayment(booking.id, "event")
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Pay Now
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {(booking.status === "confirmed" || booking.status === "Confirmed" || booking.status === "completed" || booking.status === "Completed") && booking.payment_status === "success" && (
                            <div className="border-t pt-4">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Payment Completed!</h4>
                                <p className="text-sm text-blue-700 mb-4">
                                  Your payment has been processed successfully. Your booking is now complete.
                                </p>
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Paid
                                </Badge>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Trip Bookings - Using Current Design */}
        <TabsContent value="trips" className="space-y-4">
          {tripBookings.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trip Bookings</h3>
                <p className="text-gray-600">You haven't made any trip bookings yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tripBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4" />
                          <h3 className="font-semibold">{booking.destination}</h3>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm capitalize">{booking.photography_style}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{booking.full_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>
                              {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>{booking.group_size} people</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>${booking.budget.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {booking.special_requests && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Requests:</strong> {booking.special_requests}
                          </div>
                        )}

                        {booking.final_price && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Final Price:</strong> ${booking.final_price}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        
                        {(booking.status === "confirmed" || booking.status === "Confirmed" || booking.status === "completed" || booking.status === "Completed") && (booking.payment_status === "pending" || !booking.payment_status) && (
                          <div className="border-t pt-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-medium text-green-900 mb-2">Booking Confirmed!</h4>
                              <p className="text-sm text-green-700 mb-4">
                                Your trip booking has been confirmed. Please proceed to payment to complete your booking.
                              </p>
                              <Button 
                                onClick={() => {
                                  console.log("=== TRIP BOOKING PAY NOW CLICKED ===")
                                  console.log("Booking ID:", booking.id)
                                  console.log("Booking Status:", booking.status)
                                  console.log("Payment Status:", booking.payment_status)
                                  console.log("Destination:", booking.destination)
                                  console.log("Photography Style:", booking.photography_style)
                                  console.log("Full booking object:", booking)
                                  console.log("Tab context: Trip Bookings")
                                  handleProceedToPayment(booking.id, "trip")
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Pay Now
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {(booking.status === "confirmed" || booking.status === "Confirmed" || booking.status === "completed" || booking.status === "Completed") && booking.payment_status === "success" && (
                          <div className="border-t pt-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2">Payment Completed!</h4>
                              <p className="text-sm text-blue-700 mb-4">
                                Your payment has been processed successfully. Your booking is now complete.
                              </p>
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Paid
                              </Badge>
                            </div>
                          </div>
                        )}

                                                {/* Trip Review Section */}
                        {(booking.status === "completed" || booking.status === "Completed") && booking.payment_status === "success" && !booking.has_review && (
                          <div className="border-t pt-4">
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-medium text-purple-900 mb-2">Share Your Experience</h4>
                              <p className="text-sm text-purple-700 mb-4">
                                Help other travelers by sharing your experience from this trip. Your review will be featured on our website.
                              </p>
                              <Button 
                                onClick={() => handleOpenTripReviewDialog(booking)}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Write a Review
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Review Submitted Section */}
                        {(booking.status === "completed" || booking.status === "Completed") && booking.payment_status === "success" && booking.has_review && (
                          <div className="border-t pt-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-medium text-green-900 mb-2">Review Submitted</h4>
                              <p className="text-sm text-green-700 mb-4">
                                Thank you for sharing your experience! Your review helps other travelers make informed decisions.
                              </p>
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Review Submitted
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rating" className="text-sm font-medium">
                Rating
              </Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className={`p-1 ${
                      star <= reviewData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    <Star className="h-6 w-6" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {reviewData.rating} out of 5 stars
              </p>
            </div>

            <div>
              <Label htmlFor="comment" className="text-sm font-medium">
                Your Review
              </Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this photographer..."
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={submittingReview}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={submittingReview || !reviewData.comment.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trip Review Dialog */}
      <Dialog open={isTripReviewDialogOpen} onOpenChange={setIsTripReviewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Your Trip Experience</DialogTitle>
            <DialogDescription>
              Help other travelers by sharing your experience from this trip. Your review will be featured on our website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="trip-rating" className="text-sm font-medium">
                Overall Rating
              </Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTripReviewData({ ...tripReviewData, rating: star })}
                    className={`p-1 ${
                      star <= tripReviewData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    <Star className="h-6 w-6" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {tripReviewData.rating} out of 5 stars
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Bali, Indonesia"
                  value={tripReviewData.location}
                  onChange={(e) => setTripReviewData({ ...tripReviewData, location: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="highlight" className="text-sm font-medium">
                  Highlight
                </Label>
                <Input
                  id="highlight"
                  placeholder="e.g., Sunset Photography"
                  value={tripReviewData.highlight}
                  onChange={(e) => setTripReviewData({ ...tripReviewData, highlight: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="photos-count" className="text-sm font-medium">
                Number of Photos Received
              </Label>
              <Input
                id="photos-count"
                type="number"
                min="0"
                placeholder="e.g., 150"
                value={tripReviewData.photos_count}
                onChange={(e) => setTripReviewData({ ...tripReviewData, photos_count: parseInt(e.target.value) || 0 })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="images" className="text-sm font-medium">
                Add Images (Optional)
              </Label>
              <div className="mt-2 space-y-4">
                {/* Image Upload Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload */}
                  <div>
                    <Label htmlFor="image-upload" className="text-xs font-medium text-gray-600 mb-2 block">
                      Upload Files
                    </Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="w-6 h-6 mb-1 text-gray-500" />
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">Click to upload</span>
                          </p>
                          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                          disabled={uploadingImages}
                        />
                      </label>
                    </div>
                  </div>

                  {/* URL Input */}
                  <div>
                    <Label htmlFor="image-url" className="text-xs font-medium text-gray-600 mb-2 block">
                      Add Image URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="image-url"
                        placeholder="https://example.com/image.jpg"
                        className="text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const url = e.currentTarget.value.trim()
                            if (url && url.startsWith('http')) {
                              setTripReviewData(prev => ({
                                ...prev,
                                review_images: [...prev.review_images, url]
                              }))
                              e.currentTarget.value = ''
                              toast({
                                title: "✅ Image Added",
                                description: "Image URL added successfully!",
                              })
                            } else {
                              toast({
                                title: "❌ Invalid URL",
                                description: "Please enter a valid image URL starting with http",
                                variant: "destructive",
                              })
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          const url = input.value.trim()
                          if (url && url.startsWith('http')) {
                            setTripReviewData(prev => ({
                              ...prev,
                              review_images: [...prev.review_images, url]
                            }))
                            input.value = ''
                            toast({
                              title: "✅ Image Added",
                              description: "Image URL added successfully!",
                            })
                          } else {
                            toast({
                              title: "❌ Invalid URL",
                              description: "Please enter a valid image URL starting with http",
                              variant: "destructive",
                            })
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Display Uploaded Images */}
                {tripReviewData.review_images.length > 0 && (
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-2 block">
                      Uploaded Images ({tripReviewData.review_images.length})
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {tripReviewData.review_images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/200x150?text=Image+Error"
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadingImages && (
                  <div className="text-center text-sm text-gray-500">
                    Uploading images...
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="trip-review" className="text-sm font-medium">
                Your Review
              </Label>
              <Textarea
                id="trip-review"
                placeholder="Share your experience from this trip. What made it special? How was the photography service? Any memorable moments?"
                value={tripReviewData.review_text}
                onChange={(e) => setTripReviewData({ ...tripReviewData, review_text: e.target.value })}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTripReviewDialogOpen(false)}
              disabled={submittingTripReview}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Submit button clicked")
                console.log("Trip review data:", tripReviewData)
                console.log("Review text length:", tripReviewData.review_text.length)
                console.log("Review text trimmed:", tripReviewData.review_text.trim().length)
                console.log("Button disabled:", submittingTripReview || !tripReviewData.review_text.trim())
                handleSubmitTripReview()
              }}
              disabled={submittingTripReview || !tripReviewData.review_text.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submittingTripReview ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
