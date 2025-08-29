"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  CreditCard,
  Calendar,
  MapPin,
  User,
  DollarSign,
  CheckCircle,
  Loader2,
} from "lucide-react"

interface BookingOriginal {
  id: string
  title: string
  client_name: string
  photographer_name: string
  photographer_id: string
  event_date: string
  duration_hours: number
  location_address: string
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed"
  payment_status: "pending" | "success" | "failed" | "refunded"
  budget_min?: number
  budget_max?: number
  special_requirements?: string
  created_at: string
  accepted_at?: string
  rejected_at?: string
  rejection_reason?: string
  has_review?: boolean
  hourly_rate?: number
  daily_rate?: number
}

interface BookingEvent {
  id: string
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

interface BookingTrip {
  id: string
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

interface EditorBooking {
  id: string
  client_id: string
  editor_id: string
  service_type: string
  project_title: string
  project_description?: string
  number_of_files: number
  deadline_date: string
  deadline_time?: string
  urgency_level: string
  budget_min?: number
  budget_max?: number
  special_requirements?: string
  file_upload_urls?: string[]
  status: string
  payment_status: string
  estimated_price?: number
  final_price?: number
  accepted_at?: string
  rejected_at?: string
  rejection_reason?: string
  started_at?: string
  completed_at?: string
  editor_notes?: string
  client_notes?: string
  created_at: string
  updated_at: string
  client?: {
    id: string
    full_name: string
    email: string
  }
  editor?: {
    id: string
    full_name: string
    email: string
  }
}

type Booking = BookingOriginal | BookingEvent | BookingTrip | EditorBooking

interface PaymentForm {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  billingAddress: string
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("booking_id")
  const bookingType = searchParams.get("type")
  
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  })

  useEffect(() => {
    console.log("=== PAYMENT PAGE LOAD DEBUG ===")
    console.log("Booking ID:", bookingId)
    console.log("Booking Type:", bookingType)
    console.log("URL Search Params:", searchParams.toString())
    console.log("Type from URL:", searchParams.get("type"))
    console.log("=== END PAYMENT PAGE LOAD DEBUG ===")
    
    if (bookingId && bookingType) {
      fetchBookingDetails()
    } else if (bookingId && !bookingType) {
      console.error("No booking type provided in URL, redirecting to bookings page")
      toast({
        title: "Error",
        description: "Invalid payment URL. Please try again from the bookings page.",
        variant: "destructive",
      })
      router.push("/bookings")
    }
  }, [bookingId, bookingType, searchParams, router])

  const fetchBookingDetails = async () => {
    try {
      console.log("=== FETCH BOOKING DETAILS STARTED ===")
      console.log("Booking ID:", bookingId)
      console.log("Booking Type:", bookingType)
      
      // Validate parameters
      if (!bookingId) {
        throw new Error("Booking ID is required")
      }
      if (!bookingType) {
        console.error("No booking type provided in URL, redirecting to bookings page")
        toast({
          title: "Error",
          description: "Invalid payment URL. Please try again from the bookings page.",
          variant: "destructive",
        })
        router.push("/bookings")
        return
      }
      
      // Handle different booking types
      let response
      let apiUrl
      
      if (bookingType === "original") {
        apiUrl = `/api/bookings/${bookingId}`
        console.log("Fetching from original bookings table")
      } else if (bookingType === "event") {
        apiUrl = `/api/bookings/events/${bookingId}`
        console.log("Fetching from booking_event table")
      } else if (bookingType === "trip") {
        apiUrl = `/api/bookings/trips/${bookingId}`
        console.log("Fetching from booking_trip table")
      } else if (bookingType === "editor") {
        apiUrl = `/api/bookings/editors/${bookingId}`
        console.log("Fetching from editor_bookings table")
      } else {
        throw new Error(`Invalid booking type: ${bookingType}`)
      }
      
      console.log("API URL called:", apiUrl)
      response = await fetch(apiUrl)
      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log("Received booking data:", responseData)
        
        // Handle the API response structure
        const bookingData = responseData.booking || responseData
        console.log("Final booking data for payment page:", bookingData)
        setBooking(bookingData)
      } else {
        console.error("Failed to fetch booking, status:", response.status)
        const errorText = await response.text()
        console.error("Error response:", errorText)
        
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        })
        router.push("/bookings")
      }
    } catch (error) {
      console.error("=== ERROR IN FETCH BOOKING DETAILS ===")
      console.error("Error type:", typeof error)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
      
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      })
      router.push("/bookings")
    } finally {
      setLoading(false)
      console.log("=== FETCH BOOKING DETAILS FINISHED ===")
    }
  }

  const handleInputChange = (field: keyof PaymentForm, value: string) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  // Calculate payment amount based on booking type
  const calculatePaymentAmount = (booking: Booking): number => {
    console.log("Calculating payment amount for booking:", {
      final_price: booking.final_price,
      estimated_price: booking.estimated_price,
      budget: 'budget' in booking ? booking.budget : undefined,
      hourly_rate: 'hourly_rate' in booking ? booking.hourly_rate : undefined,
      duration_hours: 'duration_hours' in booking ? booking.duration_hours : undefined
    })

    // If final_price is set, use that
    if (booking.final_price) {
      console.log("Using final_price:", booking.final_price)
      return booking.final_price
    }

    // For original bookings, calculate based on hourly rate and duration
    if ('title' in booking && booking.hourly_rate && booking.duration_hours) {
      const amount = booking.hourly_rate * booking.duration_hours
      console.log("Using hourly calculation for original booking:", amount)
      return amount
    }

    // For event bookings, use estimated_price or default
    if ('event_type' in booking) {
      const amount = booking.estimated_price || 500
      console.log("Using estimated_price for event:", amount)
      return amount
    }

    // For trip bookings, use estimated_price or budget
    if ('budget' in booking) {
      const amount = booking.estimated_price || booking.budget || 1000
      console.log("Using estimated_price/budget for trip:", amount)
      return amount
    }

    // For editor bookings, use final_price or estimated_price
    if ('project_title' in booking) {
      const amount = booking.final_price || booking.estimated_price || 150
      console.log("Using final_price/estimated_price for editor:", amount)
      return amount
    }
    
    console.log("No valid payment amount found, returning 500 as default")
    return 500
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!booking) return

    // Validate form
    if (!paymentForm.cardNumber || !paymentForm.cardHolder || !paymentForm.expiryDate || !paymentForm.cvv) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Debug: Log booking data
      console.log("Booking data for payment:", {
        id: booking.id,
        duration_hours: booking.duration_hours,
        hourly_rate: booking.hourly_rate,
        daily_rate: booking.daily_rate,
        final_price: booking.final_price,
        budget_max: booking.budget_max
      })

      // Validate booking data
      if (!booking.id) {
        throw new Error("Invalid booking ID")
      }

      // Calculate payment amount using the helper function
      const amount = calculatePaymentAmount(booking)

      console.log("Calculated payment amount:", {
        amount,
        hourly_rate: booking.hourly_rate,
        duration_hours: booking.duration_hours,
        calculation: booking.hourly_rate ? `${booking.hourly_rate} × ${booking.duration_hours} = ${amount}` : 'Using fallback amount'
      })

      if (!amount || amount <= 0) {
        throw new Error("Invalid payment amount")
      }

      // Create payment record
      const paymentData = {
        booking_id: booking.id,
        amount: amount,
        payment_method: "credit_card",
        payment_status: "completed",
        card_last4: paymentForm.cardNumber.slice(-4),
        card_brand: "visa", // This would be determined by card number in real implementation
        billing_address: {
          address: paymentForm.billingAddress
        },
        transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      // Use different payment API for editor bookings
      const paymentApiUrl = bookingType === "editor" ? "/api/editor-payments" : "/api/payments"

      console.log("=== PAYMENT DATA DEBUG ===")
      console.log("Booking Type from URL:", bookingType)
      console.log("Booking Type type:", typeof bookingType)
      console.log("Payment data being sent:", paymentData)
      console.log("=== END PAYMENT DATA DEBUG ===")

      const response = await fetch(paymentApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log("Payment API response:", responseData)
        
        if (responseData.success) {
          // Payment API already handles the booking status update
          console.log("Payment completed successfully, booking status updated by payments API")

          setPaymentComplete(true)
          toast({
            title: "Payment Successful!",
            description: "Your payment has been processed successfully.",
          })
        } else {
          throw new Error(responseData.error || "Payment failed")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Payment failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Booking not found</p>
          <Button onClick={() => router.push("/bookings")} className="mt-4">
            Back to Bookings
          </Button>
        </div>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Booking: {
                'event_type' in booking ? `${booking.event_type} Event` : 
                'project_title' in booking ? `${booking.project_title} (Editor)` :
                `${booking.destination} Trip`
              }</p>
              <p>Amount: ${calculatePaymentAmount(booking)}</p>
              <p>Status: Payment Successful</p>
            </div>
            <Button onClick={() => router.push("/bookings")} className="mt-6 w-full">
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">Complete Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment for your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Summary */}
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Booking Summary
              </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{booking.title}</h3>
                <p className="text-gray-600">{booking.photographer_name}</p>
              </div>
              
                  <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{new Date(booking.event_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{booking.location_address}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{booking.duration_hours} hours</span>
                </div>
                    </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${calculatePaymentAmount(booking)}
                  </span>
                    </div>
                {booking.hourly_rate && booking.duration_hours && (
                  <div className="text-sm text-gray-600 mt-1">
                    ${booking.hourly_rate}/hour × {booking.duration_hours} hours
                  </div>
                )}
                {!booking.hourly_rate && booking.duration_hours && (
                  <div className="text-sm text-gray-600 mt-1">
                    $50/hour (default) × {booking.duration_hours} hours
                  </div>
                )}
                <Badge variant="secondary" className="mt-2">
                  {booking.payment_status === "pending" ? "Payment Pending" : "Payment Required"}
                </Badge>
              </div>
              </CardContent>
            </Card>

          {/* Payment Form */}
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Details
              </CardTitle>
              </CardHeader>
              <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                    type="text"
                              placeholder="1234 5678 9012 3456"
                    value={paymentForm.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                          </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardHolder">Card Holder Name</Label>
                            <Input
                      id="cardHolder"
                      type="text"
                              placeholder="John Doe"
                      value={paymentForm.cardHolder}
                      onChange={(e) => handleInputChange("cardHolder", e.target.value)}
                      required
                    />
                          </div>
                  <div>
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                      type="text"
                                placeholder="MM/YY"
                      value={paymentForm.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                            </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                      type="text"
                                placeholder="123"
                      value={paymentForm.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                      maxLength={4}
                      required
                    />
                            </div>
                  <div>
                    <Label htmlFor="billingAddress">Billing Address</Label>
                          <Input
                      id="billingAddress"
                      type="text"
                      placeholder="123 Main St, City, State"
                      value={paymentForm.billingAddress}
                      onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                      required
                    />
                          </div>
                        </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Payment...
                          </>
                        ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Pay ${calculatePaymentAmount(booking)}
                    </>
                        )}
                      </Button>
                    </form>
              </CardContent>
            </Card>
          </div>
                  </motion.div>
    </div>
  )
}
