"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import dynamic from "next/dynamic"
import { MapPin, Phone, MessageSquare, Clock, Calendar, Camera, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth/auth-context"

// Import the map component with SSR disabled
const BookingMap = dynamic(() => import("./booking-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

interface Booking {
  id: string
  client: {
    id: string
    name: string
    avatar: string | null
    phone: string | null
  }
  cameraman: {
    id: string
    user_id: string
    name: string
    avatar: string | null
    phone: string | null
    equipment: string
    coordinates: [number, number]
  }
  date: string
  time: string
  duration: number
  location: string
  address: string
  coordinates: [number, number]
  price: number
  status: "pending" | "confirmed" | "en-route" | "arrived" | "shooting" | "completed" | "cancelled"
  payment_status: "pending" | "paid" | "refunded"
  payment_method: string | null
  special_requirements: string | null
  created_at: string
  updated_at: string
  cancellation_reason: string | null
  cancelled_by: string | null
  messages: {
    id: string
    sender: {
      id: string
      name: string
      avatar: string | null
    }
    receiver: {
      id: string
      name: string
      avatar: string | null
    }
    message: string
    is_read: boolean
    created_at: string
  }[]
}

export default function BookingConfirmationPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [locationError, setLocationError] = useState<string | null>(null)

  // Interval for updating booking status and location
  const statusUpdateInterval = useRef<NodeJS.Timeout | null>(null)
  const locationUpdateInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting user location:", error.message)
          setLocationError("Unable to get your precise location. Using a default location.")
          // Default to Delhi coordinates
          setUserLocation([28.6139, 77.209])
        },
        { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true },
      )
    } else {
      setLocationError("Your browser doesn't support geolocation. Using a default location.")
      setUserLocation([28.6139, 77.209])
    }

    // Fetch booking details
    fetchBookingDetails()

    return () => {
      // Clean up intervals on unmount
      if (statusUpdateInterval.current) {
        clearInterval(statusUpdateInterval.current)
      }
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current)
      }
    }
  }, [params.id])

  const fetchBookingDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/bookings/${params.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch booking details")
      }

      const data = await response.json()
      setBooking(data)

      // Calculate initial distance and time
      if (userLocation && data.cameraman.coordinates) {
        calculateDistanceAndTime(data.cameraman.coordinates, userLocation)
      }

      // Start polling for updates if booking is active
      if (["confirmed", "en-route", "arrived", "shooting"].includes(data.status)) {
        startPolling(data.id)
      }
    } catch (error) {
      console.error("Error fetching booking details:", error)
      toast({
        title: "Error",
        description: "Failed to fetch booking details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startPolling = (bookingId: string) => {
    // Poll for booking status updates every 10 seconds
    statusUpdateInterval.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch booking updates")
        }

        const data = await response.json()

        // Check if status has changed
        if (booking && data.status !== booking.status) {
          toast({
            title: "Booking Status Updated",
            description: `Status changed from ${booking.status} to ${data.status}`,
          })
        }

        setBooking(data)

        // Calculate distance and time
        if (userLocation && data.cameraman.coordinates) {
          calculateDistanceAndTime(data.cameraman.coordinates, userLocation)
        }

        // Stop polling if booking is completed or cancelled
        if (["completed", "cancelled"].includes(data.status)) {
          if (statusUpdateInterval.current) {
            clearInterval(statusUpdateInterval.current)
          }
          if (locationUpdateInterval.current) {
            clearInterval(locationUpdateInterval.current)
          }
        }
      } catch (error) {
        console.error("Error polling booking updates:", error)
      }
    }, 10000)

    // For real-time applications, this would be replaced with WebSockets or Server-Sent Events
    // This is a simplified polling approach for demonstration
  }

  const calculateDistanceAndTime = (cameramanCoords: [number, number], userCoords: [number, number]) => {
    const R = 6371 // Earth's radius in km
    const dLat = (cameramanCoords[0] - userCoords[0]) * (Math.PI / 180)
    const dLon = (cameramanCoords[1] - userCoords[1]) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userCoords[0] * (Math.PI / 180)) *
        Math.cos(cameramanCoords[0] * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const calculatedDistance = R * c
    setDistance(calculatedDistance)

    // Estimate time based on average speed of 30 km/h
    const estimatedTimeInMinutes = (calculatedDistance / 30) * 60
    setEstimatedTime(estimatedTimeInMinutes)
  }

  const handleCancel = async () => {
    if (!booking || !user) return

    if (cancelReason.trim().length < 10) {
      toast({
        title: "Error",
        description: "Please provide a more detailed reason for cancellation.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          cancellation_reason: cancelReason,
          cancelled_by: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel booking")
      }

      // Update local state
      setBooking((prev) =>
        prev ? { ...prev, status: "cancelled", cancellation_reason: cancelReason, cancelled_by: user.id } : null,
      )
      setShowCancelDialog(false)

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      })

      // Redirect to home after a delay
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async () => {
    if (!booking || !user) return

    if (message.trim().length < 5) {
      toast({
        title: "Error",
        description: "Please enter a valid message.",
        variant: "destructive",
      })
      return
    }

    try {
      // Determine sender and receiver
      const isClient = user.id === booking.client.id
      const senderId = user.id
      const receiverId = isClient ? booking.cameraman.user_id : booking.client.id

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: booking.id,
          sender_id: senderId,
          receiver_id: receiverId,
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const newMessage = await response.json()

      // Update local state with the new message
      setBooking((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: newMessage.id,
              sender: {
                id: senderId,
                name: isClient ? booking.client.name : booking.cameraman.name,
                avatar: isClient ? booking.client.avatar : booking.cameraman.avatar,
              },
              receiver: {
                id: receiverId,
                name: isClient ? booking.cameraman.name : booking.client.name,
                avatar: isClient ? booking.cameraman.avatar : booking.client.avatar,
              },
              message: newMessage.message,
              is_read: newMessage.is_read,
              created_at: newMessage.created_at,
            },
          ],
        }
      })

      setShowContactDialog(false)
      setMessage("")

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCall = () => {
    if (!booking) return

    // In a real app, this would initiate a call
    // For now, we'll just show a toast
    toast({
      title: "Calling cameraman",
      description: `Calling ${booking.cameraman.name} at ${booking.cameraman.phone || "unknown number"}`,
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "en-route":
        return "bg-yellow-100 text-yellow-800"
      case "arrived":
        return "bg-green-100 text-green-800"
      case "shooting":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Booking Pending"
      case "confirmed":
        return "Booking Confirmed"
      case "en-route":
        return "Cameraman En Route"
      case "arrived":
        return "Cameraman Arrived"
      case "shooting":
        return "Photoshoot in Progress"
      case "completed":
        return "Photoshoot Completed"
      case "cancelled":
        return "Booking Cancelled"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!booking || !userLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Booking</h1>
          <p className="text-gray-600 mb-4">Unable to load booking details. Please try again.</p>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Status Banner */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 ${booking.status === "cancelled" ? "bg-red-500" : "bg-blue-600"} text-white`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Badge className={`${getStatusBadgeColor(booking.status)} mr-2`}>{getStatusText(booking.status)}</Badge>
            <span className="text-sm md:text-base">
              {booking.status === "cancelled" ? "This booking has been cancelled" : `Booking ID: ${booking.id}`}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700 p-1 h-auto"
            onClick={() => router.push("/")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Booking Details</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date & Time</p>
                      <p className="font-medium">
                        {booking.date} at {booking.time} ({booking.duration} hours)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="font-medium">{booking.location}</p>
                      <p className="text-sm text-gray-500">{booking.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Camera className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Equipment</p>
                      <p className="font-medium">{booking.cameraman.equipment}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start">
                    <div className="h-5 w-5 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                      <span className="text-lg font-semibold">₹</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Amount</p>
                      <p className="font-medium">${booking.price}</p>
                      <p className="text-sm text-gray-500">
                        Paid via {booking.payment_method || "Unknown"} ({booking.payment_status})
                      </p>
                    </div>
                  </div>

                  {booking.special_requirements && (
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Special Requirements</p>
                        <p className="font-medium">{booking.special_requirements}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cameraman Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Your Cameraman</h2>

                <div className="flex items-center mb-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={booking.cameraman.avatar || "/placeholder.svg"}
                      alt={booking.cameraman.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{booking.cameraman.name}</h3>
                    <p className="text-sm text-gray-500">{booking.cameraman.phone || "No phone number available"}</p>
                  </div>
                </div>

                {booking.status !== "cancelled" && (
                  <div className="space-y-3">
                    <Button className="w-full flex items-center justify-center" onClick={handleCall}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Cameraman
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center"
                      onClick={() => setShowContactDialog(true)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message Cameraman
                    </Button>

                    {["pending", "confirmed", "en-route"].includes(booking.status) && (
                      <Button variant="destructive" className="w-full" onClick={() => setShowCancelDialog(true)}>
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map and Status */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Live Tracking</h2>
                  <Badge className={getStatusBadgeColor(booking.status)}>{getStatusText(booking.status)}</Badge>
                </div>

                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <div className="flex items-center mb-4">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    {booking.status === "en-route" ? (
                      <span>
                        Estimated arrival in {estimatedTime ? Math.ceil(estimatedTime) : "--"} minutes (
                        {distance ? distance.toFixed(2) : "--"} km away)
                      </span>
                    ) : booking.status === "arrived" ? (
                      <span className="text-green-600 font-medium">Cameraman has arrived at your location</span>
                    ) : booking.status === "shooting" ? (
                      <span className="text-purple-600 font-medium">Photoshoot in progress</span>
                    ) : (
                      <span>Waiting for cameraman to start journey</span>
                    )}
                  </div>
                )}

                {/* Map Container */}
                <div className="h-[400px] rounded-lg overflow-hidden">
                  {booking.status === "cancelled" ? (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <p className="text-gray-500">This booking has been cancelled</p>
                      </div>
                    </div>
                  ) : (
                    <BookingMap
                      userLocation={userLocation}
                      cameramanLocation={booking.cameraman.coordinates}
                      status={booking.status}
                    />
                  )}
                </div>

                {locationError && (
                  <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-700">
                    <p>{locationError}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Booking Timeline</h2>

                <div className="space-y-6">
                  <TimelineItem
                    title="Booking Confirmed"
                    time={new Date(booking.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    description="Your booking has been confirmed and payment processed."
                    active={true}
                    completed={true}
                  />

                  <TimelineItem
                    title="Cameraman En Route"
                    time={booking.status === "pending" || booking.status === "confirmed" ? "--:--" : "12:45 PM"}
                    description="Your cameraman is on the way to your location."
                    active={["en-route", "arrived", "shooting", "completed"].includes(booking.status)}
                    completed={["en-route", "arrived", "shooting", "completed"].includes(booking.status)}
                  />

                  <TimelineItem
                    title="Cameraman Arrived"
                    time={["pending", "confirmed", "en-route"].includes(booking.status) ? "--:--" : "1:15 PM"}
                    description="Your cameraman has arrived at the location."
                    active={["arrived", "shooting", "completed"].includes(booking.status)}
                    completed={["arrived", "shooting", "completed"].includes(booking.status)}
                  />

                  <TimelineItem
                    title="Photoshoot in Progress"
                    time={
                      ["pending", "confirmed", "en-route", "arrived"].includes(booking.status) ? "--:--" : "1:30 PM"
                    }
                    description="Your photography session has begun."
                    active={["shooting", "completed"].includes(booking.status)}
                    completed={["shooting", "completed"].includes(booking.status)}
                  />

                  <TimelineItem
                    title="Photoshoot Completed"
                    time={booking.status === "completed" ? "3:30 PM" : "--:--"}
                    description="Your photography session is complete. Photos will be delivered within 48 hours."
                    active={booking.status === "completed"}
                    completed={booking.status === "completed"}
                    last={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? Cancellation fees may apply.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Please tell us why you're cancelling:
            </label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Cameraman</DialogTitle>
            <DialogDescription>Send a message to {booking.cameraman.name}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[150px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Timeline Item Component
function TimelineItem({
  title,
  time,
  description,
  active,
  completed,
  last = false,
}: {
  title: string
  time: string
  description: string
  active: boolean
  completed: boolean
  last?: boolean
}) {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div
          className={`rounded-full h-8 w-8 flex items-center justify-center ${
            completed ? "bg-green-500" : active ? "bg-blue-500" : "bg-gray-200"
          } ${completed || active ? "text-white" : "text-gray-500"}`}
        >
          {completed ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-xs font-medium">{active ? "●" : ""}</span>
          )}
        </div>
        {!last && <div className={`h-full w-0.5 ${active || completed ? "bg-blue-500" : "bg-gray-200"}`} />}
      </div>
      <div className="pb-6">
        <div className="flex items-center">
          <p className={`font-medium ${active || completed ? "text-gray-900" : "text-gray-500"}`}>{title}</p>
          <span className={`ml-2 text-sm ${active || completed ? "text-blue-600" : "text-gray-400"}`}>{time}</span>
        </div>
        <p className={`text-sm ${active || completed ? "text-gray-600" : "text-gray-400"}`}>{description}</p>
      </div>
    </div>
  )
}
