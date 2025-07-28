"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, DollarSign, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth/auth-context"

interface Booking {
  id: string
  client: {
    id: string
    name: string
    avatar: string | null
  }
  cameraman: {
    id: string
    name: string
    avatar: string | null
  }
  date: string
  time: string
  duration: number
  location: string
  address: string
  price: number
  status: string
  payment_status: string
  payment_method: string | null
  special_requirements: string | null
  created_at: string
}

export default function BookingsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    const fetchBookings = async () => {
      setIsLoadingBookings(true)
      try {
        const response = await fetch(`/api/bookings?userId=${user?.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch bookings")
        }

        const data = await response.json()
        setBookings(data)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch bookings",
          variant: "destructive",
        })
      } finally {
        setIsLoadingBookings(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user, isLoading, router])

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
        return "Pending"
      case "confirmed":
        return "Confirmed"
      case "en-route":
        return "En Route"
      case "arrived":
        return "Arrived"
      case "shooting":
        return "In Progress"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const upcomingBookings = bookings.filter((booking) =>
    ["pending", "confirmed", "en-route", "arrived", "shooting"].includes(booking.status),
  )

  const pastBookings = bookings.filter((booking) => ["completed", "cancelled"].includes(booking.status))

  if (isLoading || isLoadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>

        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No upcoming bookings</h2>
                <p className="text-gray-600 mb-6">You don't have any upcoming bookings at the moment.</p>
                <Button asChild>
                  <Link href="/search">Find a Cameraman</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} userType={user?.user_metadata?.user_type} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No past bookings</h2>
                <p className="text-gray-600 mb-6">You don't have any past bookings.</p>
                <Button asChild>
                  <Link href="/search">Find a Cameraman</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} userType={user?.user_metadata?.user_type} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function BookingCard({ booking, userType }: { booking: Booking; userType?: string }) {
  const isClient = userType === "client"
  const otherParty = isClient ? booking.cameraman : booking.client

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-12 bg-blue-600 flex items-center px-4">
        <Badge className={getStatusBadgeColor(booking.status)}>{getStatusText(booking.status)}</Badge>
        <span className="text-white text-sm ml-auto">{new Date(booking.created_at).toLocaleDateString()}</span>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
            <Image
              src={otherParty.avatar || "/placeholder.svg?height=48&width=48"}
              alt={otherParty.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{otherParty.name}</h3>
            <p className="text-sm text-gray-500">{isClient ? "Cameraman" : "Client"}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
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
            </div>
          </div>

          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Price</p>
              <p className="font-medium">${booking.price}</p>
            </div>
          </div>
        </div>

        <Button className="w-full" asChild>
          <Link href={`/booking-confirmation/${booking.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
