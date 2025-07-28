"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle2, Calendar, MapPin, Clock, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function BookingConfirmationPage() {
  const router = useRouter()
  const [bookingDetails, setBookingDetails] = useState({
    id: "BK" + Math.floor(Math.random() * 10000000),
    date: "April 15, 2025",
    time: "2:00 PM",
    location: "123 Event Street, New York, NY",
    plan: "Professional",
    amount: "$706.82",
    photographers: 2,
  })

  // In a real app, you would fetch the booking details from an API
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // This would be replaced with actual data fetching
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">Your photography session has been successfully booked.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Reference ID: {bookingDetails.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {bookingDetails.date} at {bookingDetails.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="font-medium">{bookingDetails.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Plan</p>
                    <p className="font-medium">
                      {bookingDetails.plan} ({bookingDetails.photographers} photographers)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-5 w-5 flex items-center justify-center text-primary mr-3 mt-0.5">
                    <span className="text-lg font-semibold">$</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="font-medium">{bookingDetails.amount}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-primary/5 rounded-lg p-4">
              <h3 className="font-medium mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2 mt-0.5">
                    1
                  </span>
                  <span>You'll receive a confirmation email with all the details.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2 mt-0.5">
                    2
                  </span>
                  <span>Your photographer will contact you 24 hours before the event to confirm details.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs mr-2 mt-0.5">
                    3
                  </span>
                  <span>Your photos will be delivered within 7 days after the event.</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-3 justify-center w-full">
              <Button className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button variant="outline" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share Details
              </Button>
            </div>
            <Button variant="link" onClick={() => router.push("/")} className="text-sm">
              Return to Homepage
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center">
          <h2 className="text-lg font-medium mb-4">Thank you for choosing CamIt!</h2>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-F78V0XlIaaPc5tlK9BBmw0o57K7dwN.png"
            alt="CamIt Logo"
            width={60}
            height={60}
            className="mx-auto dark:invert"
          />
          <p className="mt-4 text-sm text-gray-500">
            If you have any questions, please contact our support team at{" "}
            <a href="mailto:support@camit.com" className="text-primary hover:underline">
              support@camit.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
