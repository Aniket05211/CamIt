"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Camera, Star, Filter, ChevronDown, SearchIcon, Calendar, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Import h3-js correctly - using dynamic import to avoid SSR issues
import dynamic from "next/dynamic"

// Import Leaflet CSS
import "leaflet/dist/leaflet.css"

// Dynamically import the LeafletMap component with SSR disabled
const LeafletMap = dynamic(() => import("../components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg"></div>,
})

interface Cameraman {
  id: string
  user_id: string
  full_name: string
  avatar_url: string | null
  bio: string
  equipment: string
  experience_years: number
  hourly_rate: number
  specialties: string[]
  rating: number
  location: string
  distance: number | null
  is_available: boolean
  coordinates?: [number, number]
}

// H3 resolution by zoom level
const zoomToResolution = {
  0: 0,
  1: 0,
  2: 0,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 5,
  12: 5,
  13: 6,
  14: 7,
  15: 8,
  16: 9,
  17: 10,
  18: 11,
  19: 12,
  20: 13,
  21: 14,
  22: 15,
}

export default function SearchPage() {
  // Handle user state manually
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in from localStorage
    try {
      const storedUser = localStorage.getItem("camit_user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
    }
  }, [])

  // Initialize h3 with useEffect to avoid SSR issues
  const [h3, setH3] = useState<any>(null)

  useEffect(() => {
    // Import h3-js dynamically to avoid SSR issues
    import("h3-js")
      .then((h3Module) => {
        setH3(h3Module)
      })
      .catch(() => {
        // If h3-js fails to load, continue without it
        console.warn("h3-js failed to load, continuing without hexagon clustering")
      })
  }, [])

  const [userLocation, setUserLocation] = useState<[number, number]>([28.6139, 77.209])
  const [cameramen, setCameramen] = useState<Cameraman[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    specialty: "",
    priceRange: "",
    rating: 0,
    availability: "",
    distance: 10, // km
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [mapRef, setMapRef] = useState<any | null>(null)
  const [hexagons, setHexagons] = useState<any[]>([])
  const [selectedMarker, setSelectedMarker] = useState<Cameraman | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "map" | "split">("split")
  const [mapBounds, setMapBounds] = useState<any | null>(null)
  const [mapZoom, setMapZoom] = useState(12)

  // Refs for scrolling
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const featuredPhotographersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => {
          console.log("Unable to retrieve your location")
        },
      )
    }

    fetchCameramen()
  }, [])

  const fetchCameramen = async () => {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()

      if (userLocation) {
        params.append("lat", userLocation[0].toString())
        params.append("lng", userLocation[1].toString())
      }

      if (filters.specialty && filters.specialty !== "all") {
        params.append("specialty", filters.specialty)
      }

      if (filters.rating && filters.rating !== 0) {
        params.append("minRating", filters.rating.toString())
      }

      if (filters.distance) {
        params.append("maxDistance", filters.distance.toString())
      }

      if (filters.priceRange && filters.priceRange !== "any") {
        if (filters.priceRange === "budget") {
          params.append("priceMin", "0")
          params.append("priceMax", "100")
        } else if (filters.priceRange === "mid") {
          params.append("priceMin", "100")
          params.append("priceMax", "200")
        } else if (filters.priceRange === "premium") {
          params.append("priceMin", "200")
          params.append("priceMax", "1000")
        }
      }

      if (filters.availability && filters.availability !== "any") {
        params.append("availability", filters.availability)
      }

      // Fetch cameramen from API
      const response = await fetch(`/api/cameramen?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch cameramen")
      }

      const data = await response.json()
      setCameramen(data)
    } catch (error) {
      console.error("Error fetching cameramen:", error)
      toast({
        title: "Error",
        description: "Failed to fetch cameramen. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchCameramen()
    }
  }, [filters, userLocation])

  const filteredCameramen = cameramen.filter((cameraman) => {
    let matches = true

    if (searchQuery) {
      matches =
        matches &&
        (cameraman.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cameraman.specialties?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          false)
    }

    return matches
  })

  // Scroll to sections
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToFeaturedPhotographers = () => {
    featuredPhotographersRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Leaflet map initialization handler
  const handleMapInit = useCallback((map: any) => {
    setMapRef(map)

    // Update bounds and zoom when map changes
    map.on("moveend", () => {
      setMapBounds(map.getBounds())
    })

    map.on("zoomend", () => {
      setMapZoom(map.getZoom() || 12)
    })
  }, [])

  // Generate hexagons based on current map state
  useEffect(() => {
    // Skip if h3 is not loaded yet or if we don't have map bounds
    if (!h3 || !mapBounds || !mapRef) return

    try {
      const resolution = zoomToResolution[mapZoom] || 7

      // Create a grid of points within the bounds
      const hexSet = new Set()
      const hexagonsArray = []

      // Process each cameraman location
      cameramen.forEach((cameraman) => {
        try {
          if (!cameraman.coordinates) return

          // Note: H3 expects [lat, lng] while our coordinates are stored as [lng, lat]
          const hexId = h3.geoToH3(cameraman.coordinates[1], cameraman.coordinates[0], resolution)
          if (!hexSet.has(hexId)) {
            hexSet.add(hexId)
            const hexBoundary = h3.h3ToGeoBoundary(hexId)
            const count = cameramen.filter(
              (c) => c.coordinates && h3.geoToH3(c.coordinates[1], c.coordinates[0], resolution) === hexId,
            ).length

            hexagonsArray.push({
              id: hexId,
              boundary: hexBoundary,
              count: count,
              center: h3.h3ToGeo(hexId),
            })
          }
        } catch (error) {
          console.error("Error generating hexagon for cameraman:", error)
        }
      })

      setHexagons(hexagonsArray)
    } catch (error) {
      console.error("Error generating hexagons:", error)
    }
  }, [h3, mapBounds, mapZoom, cameramen, mapRef])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Find Your Perfect Photographer</h1>
          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, specialty, or location..."
                className="w-full pl-10 pr-4 py-6 rounded-lg text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Input
              type="date"
              className="py-6 px-4 rounded-lg text-gray-900"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Input
              type="time"
              className="py-6 px-4 rounded-lg text-gray-900"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-6 py-6 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
              variant="outline"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown
                className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <Button
              onClick={scrollToHowItWorks}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              How It Works
            </Button>
            <Button onClick={scrollToFeaturedPhotographers} className="bg-white text-blue-600 hover:bg-white/90">
              Find a Photographer
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <Select
                  value={filters.specialty}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, specialty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Portrait">Portrait</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Landscape">Landscape</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <Select
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Price</SelectItem>
                    <SelectItem value="budget">$50-100/hour</SelectItem>
                    <SelectItem value="mid">$100-200/hour</SelectItem>
                    <SelectItem value="premium">$200+/hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: Number(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.8">4.8+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <Select
                  value={filters.availability}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, availability: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    <SelectItem value="Weekdays">Weekdays</SelectItem>
                    <SelectItem value="Weekends">Weekends</SelectItem>
                    <SelectItem value="Evenings">Evenings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance: {filters.distance} km</label>
                <Slider
                  value={[filters.distance]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, distance: value[0] }))}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="split" onValueChange={(value) => setViewMode(value as "list" | "map" | "split")}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Available Photographers</h2>
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="split">Split View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4" />
                      <div className="h-4 bg-gray-200 animate-pulse mb-4 w-1/2" />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-6 bg-gray-200 animate-pulse w-16 rounded-full" />
                        ))}
                      </div>
                      <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCameramen.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No photographers found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCameramen.map((cameraman) => (
                  <PhotographerCard key={cameraman.id} cameraman={cameraman} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <div className="h-[calc(100vh-20rem)] rounded-xl overflow-hidden">
              {/* Leaflet Map */}
              <LeafletMap
                center={userLocation}
                zoom={12}
                markers={filteredCameramen.map((cameraman) => ({
                  id: cameraman.id,
                  coordinates: cameraman.coordinates
                    ? [cameraman.coordinates[1], cameraman.coordinates[0]]
                    : userLocation,
                  name: cameraman.full_name,
                  image: cameraman.avatar_url || "/placeholder.svg",
                  rating: cameraman.rating,
                  price: `$${cameraman.hourly_rate}/hour`,
                  distance: cameraman.distance || 0,
                  onClick: () => setSelectedMarker(cameraman),
                }))}
                userLocation={userLocation}
                hexagons={hexagons}
                onMapInit={handleMapInit}
                selectedMarker={selectedMarker}
                onMarkerClose={() => setSelectedMarker(null)}
              />
            </div>
          </TabsContent>

          <TabsContent value="split" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 order-2 lg:order-1">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="h-48 bg-gray-200 animate-pulse" />
                        <CardContent className="p-6">
                          <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4" />
                          <div className="h-4 bg-gray-200 animate-pulse mb-4 w-1/2" />
                          <div className="flex flex-wrap gap-2 mb-4">
                            {[...Array(3)].map((_, j) => (
                              <div key={j} className="h-6 bg-gray-200 animate-pulse w-16 rounded-full" />
                            ))}
                          </div>
                          <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredCameramen.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No photographers found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search criteria</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCameramen.map((cameraman) => (
                      <PhotographerCard key={cameraman.id} cameraman={cameraman} />
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="sticky top-24">
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="text-lg font-semibold mb-4">Photographer Locations</h3>
                    <div className="h-[calc(100vh-12rem)]">
                      {/* Leaflet Map */}
                      <LeafletMap
                        center={userLocation}
                        zoom={12}
                        markers={filteredCameramen.map((cameraman) => ({
                          id: cameraman.id,
                          coordinates: cameraman.coordinates
                            ? [cameraman.coordinates[1], cameraman.coordinates[0]]
                            : userLocation,
                          name: cameraman.full_name,
                          image: cameraman.avatar_url || "/placeholder.svg",
                          rating: cameraman.rating,
                          price: `$${cameraman.hourly_rate}/hour`,
                          distance: cameraman.distance || 0,
                          onClick: () => setSelectedMarker(cameraman),
                        }))}
                        userLocation={userLocation}
                        hexagons={hexagons}
                        onMapInit={handleMapInit}
                        selectedMarker={selectedMarker}
                        onMarkerClose={() => setSelectedMarker(null)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16" ref={howItWorksRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <SearchIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Search</h3>
              <p className="text-gray-600">Find the perfect photographer for your needs</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Book</h3>
              <p className="text-gray-600">Choose your date and time</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Shoot</h3>
              <p className="text-gray-600">Enjoy your photography session</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
                <Image className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Receive</h3>
              <p className="text-gray-600">Get your professionally edited photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Photographers Section */}
      <div className="bg-gray-100 py-16" ref={featuredPhotographersRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Photographers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-64 bg-gray-200 animate-pulse" />
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4" />
                      <div className="h-4 bg-gray-200 animate-pulse mb-4 w-1/2" />
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-4 bg-gray-200 animate-pulse w-16" />
                        <div className="h-4 bg-gray-200 animate-pulse w-16" />
                      </div>
                      <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
                    </CardContent>
                  </Card>
                ))
              : filteredCameramen.slice(0, 3).map((cameraman) => (
                  <Card key={cameraman.id} className="overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={cameraman.avatar_url || "/placeholder.svg"}
                        alt={cameraman.full_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{cameraman.full_name}</h3>
                      <p className="text-gray-600 mb-4">{cameraman.specialties?.join(", ") || "Photography"}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{cameraman.rating}</span>
                        </div>
                        <span className="text-blue-600 font-medium">${cameraman.hourly_rate}/hour</span>
                      </div>
                      <Button className="w-full mt-4" asChild>
                        <Link href={`/cameraman/${cameraman.id}`}>View Profile</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah J.",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                text: "I found an amazing wedding photographer through CamIt. The process was so smooth, and the photos turned out beautifully!",
              },
              {
                name: "Michael R.",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                text: "As a business owner, I regularly need product photography. CamIt has made it easy to find skilled photographers whenever I need them.",
              },
              {
                name: "Emily L.",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                text: "I booked a family portrait session through CamIt, and it was a fantastic experience from start to finish. Highly recommended!",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <h3 className="font-semibold">{testimonial.name}</h3>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Photographer Card Component
function PhotographerCard({ cameraman }: { cameraman: Cameraman }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={cameraman.avatar_url || "/placeholder.svg"}
          alt={cameraman.full_name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{cameraman.full_name}</h3>
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{cameraman.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{cameraman.experience_years} years experience</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {cameraman.specialties?.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary" className="bg-blue-50 text-blue-600">
              {specialty}
            </Badge>
          )) || (
            <Badge variant="secondary" className="bg-blue-50 text-blue-600">
              Photography
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />${cameraman.hourly_rate}/hour
          </span>
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {cameraman.distance ? `${cameraman.distance.toFixed(1)} km` : cameraman.location}
          </span>
        </div>
        <Button className="w-full" asChild>
          <Link href={`/cameraman/${cameraman.id}`}>View Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
