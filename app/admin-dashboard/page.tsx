"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Camera,
  Video,
  Globe,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  BarChart3,
  TrendingUp,
  User,
  Phone,
  Mail,
  FileText,
  Building,
  Party,
  Heart,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BookingEvent {
  id: string
  client_id: string
  event_type: string
  service_type: string
  event_date: string
  event_time: string
  location: string
  number_of_guests: number
  special_requirements: string
  status: string
  photographer_id?: string
  estimated_price?: number
  final_price?: number
  payment_status: string
  created_at: string
  updated_at: string
  notes?: string
  client?: {
    full_name: string
    email: string
    phone_number: string
  }
  photographer?: {
    full_name: string
    email: string
  }
}

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
  photographer?: {
    full_name: string
    email: string
  }
}

interface DashboardStats {
  totalEventBookings: number
  totalTripBookings: number
  pendingEventBookings: number
  pendingTripBookings: number
  confirmedEventBookings: number
  confirmedTripBookings: number
  completedEventBookings: number
  completedTripBookings: number
  totalRevenue: number
  thisMonthRevenue: number
}

export default function AdminDashboard() {
  const [eventBookings, setEventBookings] = useState<BookingEvent[]>([])
  const [tripBookings, setTripBookings] = useState<BookingTrip[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalEventBookings: 0,
    totalTripBookings: 0,
    pendingEventBookings: 0,
    pendingTripBookings: 0,
    confirmedEventBookings: 0,
    confirmedTripBookings: 0,
    completedEventBookings: 0,
    completedTripBookings: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
  })
  
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<BookingEvent | BookingTrip | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("events")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchPayments = async () => {
    try {
      console.log("Fetching payments...")
      const response = await fetch("/api/payments")
      console.log("Payments response status:", response.status)
      
      if (response.ok) {
        const paymentsData = await response.json()
        setPayments(paymentsData || [])
        console.log("Fetched payments:", paymentsData)
      } else {
        const errorText = await response.text()
        console.error("Payments API error:", errorText)
        console.error("Failed to fetch payments")
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    }
  }

  const fetchBookings = async () => {
    try {
      setLoading(true)
      
      console.log("Fetching event bookings...")
      // Fetch event bookings
      const eventResponse = await fetch("/api/admin/bookings/events")
      console.log("Event response status:", eventResponse.status)
      
      let eventData
      if (!eventResponse.ok) {
        const errorText = await eventResponse.text()
        console.error("Event API error:", errorText)
        throw new Error(`Event API failed: ${eventResponse.status} - ${errorText}`)
      } else {
        eventData = await eventResponse.json()
        console.log("Event data:", eventData)
      }
      
      console.log("Fetching trip bookings...")
      // Fetch trip bookings
      const tripResponse = await fetch("/api/admin/bookings/trips")
      console.log("Trip response status:", tripResponse.status)
      
      let tripData
      if (!tripResponse.ok) {
        const errorText = await tripResponse.text()
        console.error("Trip API error:", errorText)
        throw new Error(`Trip API failed: ${tripResponse.status} - ${errorText}`)
      } else {
        tripData = await tripResponse.json()
        console.log("Trip data:", tripData)
      }
      console.log("Trip data:", tripData)
      
      // Fetch payments
      await fetchPayments()
      
      if (eventData.success) {
        setEventBookings(eventData.bookings || [])
      } else {
        console.error("Event data not successful:", eventData)
      }
      
      if (tripData.success) {
        setTripBookings(tripData.bookings || [])
      } else {
        console.error("Trip data not successful:", tripData)
      }
      
      // Calculate stats
      calculateStats(eventData.bookings || [], tripData.bookings || [])
      
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch bookings data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (events: BookingEvent[], trips: BookingTrip[]) => {
    // Calculate revenue from completed bookings with successful payments
    const eventRevenue = events
      .filter(b => b.status === "completed" && b.payment_status === "success")
      .reduce((sum, b) => sum + (b.final_price || 0), 0)
    
    const tripRevenue = trips
      .filter(b => b.status === "completed" && b.payment_status === "success")
      .reduce((sum, b) => sum + (b.final_price || 0), 0)
    
    // Also calculate revenue from payments table for verification
    const paymentsRevenue = payments
      .filter(p => p.payment_status === "completed" || p.payment_status === "success")
      .reduce((sum, p) => sum + (p.amount || 0), 0)
    
    // Calculate this month's revenue
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const thisMonthEventRevenue = events
      .filter(b => {
        const bookingDate = new Date(b.updated_at)
        return b.status === "completed" && 
               b.payment_status === "success" &&
               bookingDate.getMonth() === currentMonth &&
               bookingDate.getFullYear() === currentYear
      })
      .reduce((sum, b) => sum + (b.final_price || 0), 0)
    
    const thisMonthTripRevenue = trips
      .filter(b => {
        const bookingDate = new Date(b.updated_at)
        return b.status === "completed" && 
               b.payment_status === "success" &&
               bookingDate.getMonth() === currentMonth &&
               bookingDate.getFullYear() === currentYear
      })
      .reduce((sum, b) => sum + (b.final_price || 0), 0)
    
    const thisMonthPaymentsRevenue = payments
      .filter(p => {
        const paymentDate = new Date(p.payment_date)
        return (p.payment_status === "completed" || p.payment_status === "success") &&
               paymentDate.getMonth() === currentMonth &&
               paymentDate.getFullYear() === currentYear
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0)
    
    const newStats: DashboardStats = {
      totalEventBookings: events.length,
      totalTripBookings: trips.length,
      pendingEventBookings: events.filter(b => b.status === "pending").length,
      pendingTripBookings: trips.filter(b => b.status === "pending").length,
      confirmedEventBookings: events.filter(b => b.status === "confirmed").length,
      confirmedTripBookings: trips.filter(b => b.status === "confirmed").length,
      completedEventBookings: events.filter(b => b.status === "completed").length,
      completedTripBookings: trips.filter(b => b.status === "completed").length,
      totalRevenue: eventRevenue + tripRevenue,
      thisMonthRevenue: thisMonthEventRevenue + thisMonthTripRevenue,
    }
    
    console.log("Revenue calculation:", {
      eventRevenue,
      tripRevenue,
      paymentsRevenue,
      thisMonthEventRevenue,
      thisMonthTripRevenue,
      thisMonthPaymentsRevenue,
      totalRevenue: eventRevenue + tripRevenue,
      thisMonthRevenue: thisMonthEventRevenue + thisMonthTripRevenue,
      totalPayments: payments.length,
      successfulPayments: payments.filter(p => p.payment_status === "completed" || p.payment_status === "success").length
    })
    
    setStats(newStats)
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string, type: "event" | "trip", amount?: number) => {
    try {
      const updateData: any = { status: newStatus }
      
      // If changing to confirmed, require final_price
      if (newStatus === "confirmed") {
        if (!amount) {
          toast({
            title: "Error",
            description: "Please enter a final price when confirming a booking.",
            variant: "destructive",
          })
          return
        }
        updateData.final_price = amount
      }

      // Handle payment status based on booking status
      if (newStatus === "completed") {
        updateData.payment_status = "success"
      } else if (newStatus === "cancelled") {
        updateData.payment_status = "failed"
      }

      console.log(`Updating ${type} booking ${bookingId} with data:`, updateData)

      const response = await fetch(`/api/admin/bookings/${type}s/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      console.log(`Response status: ${response.status}`)

      if (response.ok) {
        const responseData = await response.json()
        console.log("Update response:", responseData)
        
        let successMessage = ""
        if (newStatus === "confirmed") {
          successMessage = `Booking confirmed with final price $${amount}. Client can now proceed to payment.`
        } else if (newStatus === "completed") {
          successMessage = `Booking marked as completed. Payment status updated to success.`
        } else if (newStatus === "cancelled") {
          successMessage = `Booking cancelled. Payment status updated to failed.`
        } else {
          successMessage = `Booking status updated to ${newStatus}`
        }
        
        toast({
          title: "Success",
          description: successMessage,
        })
        fetchBookings() // Refresh data
      } else {
        let errorMessage = `Failed to update status. Status: ${response.status}`
        const errorText = await response.text()
        console.error("Failed to parse error response:", errorText)
        
        try {
          const errorData = JSON.parse(errorText)
          console.error("API Error:", errorData)
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          errorMessage = `Server error: ${errorText}`
        }
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Status update error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booking status.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getEventTypeIcon = (eventType: string) => {
    const icons = {
      wedding: Heart,
      corporate: Building,
      party: Party,
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

  const filteredEventBookings = eventBookings.filter(booking => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    const matchesSearch = searchTerm === "" || 
      booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.event_type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const filteredTripBookings = tripBookings.filter(booking => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    const matchesSearch = searchTerm === "" || 
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all bookings and monitor system activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchBookings()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Event Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEventBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingEventBookings} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trip Bookings</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTripBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingTripBookings} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month: ${stats.thisMonthRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedEventBookings + stats.completedTripBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Events: {stats.completedEventBookings} | Trips: {stats.completedTripBookings}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Bookings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Event Bookings ({eventBookings.length})</TabsTrigger>
          <TabsTrigger value="trips">Trip Bookings ({tripBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4">
            {filteredEventBookings.map((booking) => (
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
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(booking.status)}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <div className="grid gap-4">
            {filteredTripBookings.map((booking) => (
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
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(booking.status)}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View detailed information about this booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              {/* Booking details will be rendered here */}
              <pre className="text-sm bg-gray-100 p-4 rounded">
                {JSON.stringify(selectedBooking, null, 2)}
              </pre>
            </div>
          )}
        </DialogContent>
      </Dialog>

             {/* Edit Booking Dialog */}
       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle>Edit Booking</DialogTitle>
             <DialogDescription>
               Update booking status and details
             </DialogDescription>
           </DialogHeader>
           {selectedBooking && (
             <div className="space-y-4">
               <div>
                 <label className="text-sm font-medium">Status</label>
                 <Select 
                   defaultValue={selectedBooking.status}
                   onValueChange={(value) => {
                     if (selectedBooking) {
                       const type = 'id' in selectedBooking && 'event_type' in selectedBooking ? 'event' : 'trip'
                       
                       if (value === "confirmed") {
                         // Show amount input for confirmed status
                         const amount = prompt("Enter the final amount for this booking:")
                         if (amount && !isNaN(Number(amount))) {
                           handleStatusUpdate(selectedBooking.id, value, type, Number(amount))
                         } else if (amount !== null) {
                           toast({
                             title: "Error",
                             description: "Please enter a valid amount.",
                             variant: "destructive",
                           })
                         }
                       } else {
                         handleStatusUpdate(selectedBooking.id, value, type)
                       }
                       setIsEditDialogOpen(false)
                     }
                   }}
                 >
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="pending">Pending</SelectItem>
                     <SelectItem value="confirmed">Confirmed</SelectItem>
                     <SelectItem value="completed">Completed</SelectItem>
                     <SelectItem value="cancelled">Cancelled</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
           )}
         </DialogContent>
       </Dialog>
    </div>
  )
} 