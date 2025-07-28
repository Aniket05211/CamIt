"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  CreditCard,
  Building2,
  Smartphone,
  Check,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Types
interface PlanDetails {
  id: string
  name: string
  price: number
  features: string[]
  description: string
}

interface EventDetails {
  location: string
  date: string
  time: string
  duration: number
  type: string
}

interface PaymentFormData {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  address: string
  city: string
  zipCode: string
  country: string
}

// Mock data - in a real app, this would come from an API or database
const plans: Record<string, PlanDetails> = {
  basic: {
    id: "basic",
    name: "Basic",
    price: 299,
    description: "Perfect for small events and personal photoshoots",
    features: ["1 Photographer", "4 Hours Coverage", "100 Edited Photos", "Online Gallery"],
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 599,
    description: "Ideal for medium-sized events and business needs",
    features: ["2 Photographers", "8 Hours Coverage", "300 Edited Photos", "Printed Album", "Express Delivery"],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 999,
    description: "Complete solution for large events and premium requirements",
    features: [
      "3 Photographers",
      "12 Hours Coverage",
      "500 Edited Photos",
      "Premium Printed Album",
      "Full Coverage",
      "Video Highlights",
    ],
  },
}

// Payment methods
const paymentMethods = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="w-6 h-6" />,
    description: "Pay securely with your card",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <Building2 className="w-6 h-6" />,
    description: "Fast and secure payment",
  },
  {
    id: "upi",
    name: "UPI",
    icon: <Smartphone className="w-6 h-6" />,
    description: "Google Pay, PhonePe, Paytm",
  },
]

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get plan from URL query parameter
  const planId = searchParams.get("plan") || "basic"

  // State
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null)
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  })

  // Fetch plan details and event details
  useEffect(() => {
    // Set plan details from our plans object
    if (plans[planId]) {
      setSelectedPlan(plans[planId])
    } else {
      // Fallback to basic plan if invalid plan ID
      setSelectedPlan(plans.basic)
      toast({
        title: "Plan not found",
        description: "The selected plan was not found. Showing basic plan instead.",
        variant: "destructive",
      })
    }

    // In a real app, we would fetch event details from an API or local storage
    // For this example, we'll use mock data
    setEventDetails({
      location: "123 Event Street, New York, NY",
      date: "2025-04-15",
      time: "14:00",
      duration: 4,
      type: "Wedding",
    })
  }, [planId, toast])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validate based on payment method
    if (paymentMethod === "card") {
      if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required"
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) errors.cardNumber = "Invalid card number"

      if (!formData.cardName.trim()) errors.cardName = "Name on card is required"

      if (!formData.expiryDate.trim()) errors.expiryDate = "Expiry date is required"
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) errors.expiryDate = "Invalid format (MM/YY)"

      if (!formData.cvv.trim()) errors.cvv = "CVV is required"
      else if (!/^\d{3,4}$/.test(formData.cvv)) errors.cvv = "Invalid CVV"
    }

    // Always validate address
    if (!formData.address.trim()) errors.address = "Address is required"
    if (!formData.city.trim()) errors.city = "City is required"
    if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required"
    if (!formData.country.trim()) errors.country = "Country is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be a call to a payment API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful payment
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed!",
      })

      // Redirect to confirmation page
      router.push("/booking-confirmation")
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate totals
  const calculateTotals = () => {
    if (!selectedPlan) return { subtotal: 0, tax: 0, total: 0 }

    const subtotal = selectedPlan.price
    const tax = subtotal * 0.18 // 18% tax
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // If data is still loading
  if (!selectedPlan || !eventDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const { subtotal, tax, total } = calculateTotals()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Complete Your Booking</h1>
            </div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-F78V0XlIaaPc5tlK9BBmw0o57K7dwN.png"
              alt="CamIt Logo"
              width={40}
              height={40}
              className="dark:invert"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Review your event information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{eventDetails.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">{new Date(eventDetails.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Time:</span>
                      <span className="ml-2">{eventDetails.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">{eventDetails.duration} hours</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {eventDetails.type}
                </Badge>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              className={formErrors.cardNumber ? "border-destructive" : ""}
                            />
                            {formErrors.cardNumber && (
                              <p className="text-sm text-destructive">{formErrors.cardNumber}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input
                              id="cardName"
                              name="cardName"
                              placeholder="John Doe"
                              value={formData.cardName}
                              onChange={handleInputChange}
                              className={formErrors.cardName ? "border-destructive" : ""}
                            />
                            {formErrors.cardName && <p className="text-sm text-destructive">{formErrors.cardName}</p>}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                name="expiryDate"
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                className={formErrors.expiryDate ? "border-destructive" : ""}
                              />
                              {formErrors.expiryDate && (
                                <p className="text-sm text-destructive">{formErrors.expiryDate}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                className={formErrors.cvv ? "border-destructive" : ""}
                              />
                              {formErrors.cvv && <p className="text-sm text-destructive">{formErrors.cvv}</p>}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="address">Billing Address</Label>
                          <Input
                            id="address"
                            name="address"
                            placeholder="123 Main St"
                            value={formData.address}
                            onChange={handleInputChange}
                            className={formErrors.address ? "border-destructive" : ""}
                          />
                          {formErrors.address && <p className="text-sm text-destructive">{formErrors.address}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              placeholder="New York"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={formErrors.city ? "border-destructive" : ""}
                            />
                            {formErrors.city && <p className="text-sm text-destructive">{formErrors.city}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              placeholder="10001"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className={formErrors.zipCode ? "border-destructive" : ""}
                            />
                            {formErrors.zipCode && <p className="text-sm text-destructive">{formErrors.zipCode}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            placeholder="United States"
                            value={formData.country}
                            onChange={handleInputChange}
                            className={formErrors.country ? "border-destructive" : ""}
                          />
                          {formErrors.country && <p className="text-sm text-destructive">{formErrors.country}</p>}
                        </div>
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Secure Payment</AlertTitle>
                        <AlertDescription>
                          Your payment information is encrypted and secure. We never store your full card details.
                        </AlertDescription>
                      </Alert>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay ${formatCurrency(total)}`
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="paypal">
                    <div className="text-center py-8">
                      <Button
                        onClick={() => {
                          toast({
                            title: "Redirecting to PayPal",
                            description: "You will be redirected to PayPal to complete your payment.",
                          })
                        }}
                        className="bg-[#0070ba] hover:bg-[#005ea6]"
                      >
                        Continue with PayPal
                      </Button>
                      <p className="text-sm text-muted-foreground mt-4">
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="upi">
                    <div className="grid grid-cols-2 gap-4">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                        <Button
                          key={app}
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: `Opening ${app}`,
                              description: `Redirecting to ${app} for payment.`,
                            })
                          }}
                          className="h-20 flex flex-col items-center justify-center"
                        >
                          <Smartphone className="h-6 w-6 mb-2" />
                          {app}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Select your preferred UPI app to complete the payment.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your selected plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/5 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{selectedPlan.name} Plan</h3>
                      <Badge>{formatCurrency(selectedPlan.price)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{selectedPlan.description}</p>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (18%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <p className="text-xs text-center text-muted-foreground">
                    By completing this purchase, you agree to our{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </CardFooter>
              </Card>

              <div className="mt-6 flex items-center justify-center">
                <Button variant="outline" size="sm" onClick={() => router.push("/help")} className="text-xs">
                  Need help? Contact support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
