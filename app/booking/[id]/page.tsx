"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import dynamic from "next/dynamic"
import { MapPin, Camera, Clock, DollarSign, AlertCircle, Star } from "lucide-react"

const Map = dynamic(() => import("../../components/Map"), { ssr: false })

interface Cameraman {
  id: number
  name: string
  equipment: string
  coordinates: [number, number]
  image: string
  rating: number
  price: string
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [cameraman, setCameraman] = useState<Cameraman | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingDuration, setBookingDuration] = useState(1)
  const [specialRequirements, setSpecialRequirements] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch cameraman data (mocked for now)
    const mockCameraman: Cameraman = {
      id: Number(params.id),
      name: "John Doe",
      equipment: "Sony A7III, 24-70mm f/2.8 GM",
      coordinates: [77.209, 28.6139],
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.8,
      price: "$150/hour",
    }
    setCameraman(mockCameraman)

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: [number, number] = [position.coords.longitude, position.coords.latitude]
          setUserLocation(userCoords)
          calculateDistanceAndTime(mockCameraman.coordinates, userCoords)
        },
        (error) => {
          console.error("Error getting user location:", error.message)
          setLocationError("Unable to get your precise location. Using a default location for estimation.")
          const defaultCoords: [number, number] = [77.209, 28.6139] // Default to Delhi coordinates
          setUserLocation(defaultCoords)
          calculateDistanceAndTime(mockCameraman.coordinates, defaultCoords)
        },
        { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true },
      )
    } else {
      setLocationError("Your browser doesn't support geolocation. Using a default location for estimation.")
      setUserLocation([77.209, 28.6139]) // Default to Delhi coordinates
    }
  }, [params.id])

  const calculateDistanceAndTime = (cameramanCoords: [number, number], userCoords: [number, number]) => {
    const R = 6371 // Earth's radius in km
    const dLat = (cameramanCoords[1] - userCoords[1]) * (Math.PI / 180)
    const dLon = (cameramanCoords[0] - userCoords[0]) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userCoords[1] * (Math.PI / 180)) *
        Math.cos(cameramanCoords[1] * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const calculatedDistance = R * c
    setDistance(calculatedDistance)
    const estimatedTimeInHours = calculatedDistance / 30 // Assuming average speed of 30 km/h
    setEstimatedTime(estimatedTimeInHours)
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the booking data to your backend
    console.log("Booking submitted:", { bookingDate, bookingTime, bookingDuration, specialRequirements })

    // Redirect to the booking confirmation page
    router.push(`/booking-confirmation/${cameraman.id}`)
  }

  if (!cameraman || !userLocation) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Book Your Photography Session</h1>
          <p className="text-xl">Capture your moments with {cameraman.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Cameraman Info */}
            <div className="md:w-1/2 p-8">
              <div className="flex items-center mb-6">
                <Image
                  src={cameraman.image || "/placeholder.svg"}
                  alt={cameraman.name}
                  width={80}
                  height={80}
                  className="rounded-full mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{cameraman.name}</h2>
                  <div className="flex items-center mt-1">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">{cameraman.rating} (245 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Camera className="h-5 w-5 mr-2" />
                  <span>{cameraman.equipment}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Approximately {distance?.toFixed(2)} km away</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Estimated arrival time: {(estimatedTime! * 60).toFixed(0)} minutes</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span>{cameraman.price}</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:w-1/2 bg-gray-50 p-8">
              <button
                onClick={handleBooking}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div className="h-96 relative">
            <Map
              center={userLocation}
              zoom={12}
              markers={[{ id: cameraman.id, coordinates: cameraman.coordinates, name: cameraman.name }]}
              userLocation={userLocation}
              showPath={true}
            />
          </div>
        </div>

        {locationError && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{locationError}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
