"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Camera, Star, MapPin, Calendar, Clock, Globe, Mail } from "lucide-react"
import LoadingSpinner from "@/components/LoadingSpinner"

interface Cameraman {
  id: number
  name: string
  equipment: string
  rating: number
  distance: number
  coordinates: [number, number]
  image: string
  coverImage: string
  bio: string
  specialties: string[]
  experience: string
  price: string
  availability: string[]
  languages: string[]
  email: string
  phone: string
  portfolio: string[]
  reviews: {
    id: number
    name: string
    rating: number
    comment: string
    date: string
    avatar: string
  }[]
}

export default function CameramanProfile() {
  const params = useParams()
  const router = useRouter()
  const [cameraman, setCameraman] = useState<Cameraman | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      const mockCameraman: Cameraman = {
        id: Number(params.id),
        name: "Alex Johnson",
        equipment: "Sony A7 III, 24-70mm f/2.8 GM, 70-200mm f/2.8 GM",
        rating: 4.9,
        distance: 2.5,
        coordinates: [77.209, 28.6139],
        image: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2967&auto=format&fit=crop",
        bio: "Professional photographer with over 8 years of experience specializing in weddings, events, and portrait photography. Passionate about capturing genuine moments and creating lasting memories.",
        specialties: ["Wedding", "Portrait", "Event", "Commercial"],
        experience: "8 years",
        price: "$200/hour",
        availability: ["Weekends", "Evenings"],
        languages: ["English", "Spanish"],
        email: "alex@example.com",
        phone: "+1 (555) 123-4567",
        portfolio: [
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2969&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2970&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2970&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2969&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2970&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2970&auto=format&fit=crop",
        ],
        reviews: [
          {
            id: 1,
            name: "Sarah Wilson",
            rating: 5,
            comment: "Alex was amazing! Captured our wedding beautifully and was so professional throughout.",
            date: "2023-12-15",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          },
          {
            id: 2,
            name: "Michael Brown",
            rating: 5,
            comment: "Incredible attention to detail and very easy to work with. Highly recommended!",
            date: "2023-12-01",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1287&auto=format&fit=crop",
          },
        ],
      }
      setCameraman(mockCameraman)
      setLoading(false)
    }, 1500)
  }, [params.id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!cameraman) {
    return <div>Cameraman not found</div>
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-[300px] lg:h-[400px]">
        <Image src={cameraman.coverImage || "/placeholder.svg"} alt="Cover" layout="fill" objectFit="cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <Image
                  src={cameraman.image || "/placeholder.svg"}
                  alt={cameraman.name}
                  width={200}
                  height={200}
                  className="rounded-xl"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{cameraman.name}</h1>
                  <div className="flex items-center">
                    <div className="flex items-center">{renderStars(cameraman.rating)}</div>
                    <span className="ml-2 text-xl font-semibold">{cameraman.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Camera className="w-5 h-5 mr-2" />
                    <span>{cameraman.equipment}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{cameraman.distance} km away</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{cameraman.experience} experience</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{cameraman.availability.join(", ")}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-5 h-5 mr-2" />
                    <span>{cameraman.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-2" />
                    <span>{cameraman.email}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{cameraman.bio}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {cameraman.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/booking/${cameraman.id}`)}
                  className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cameraman.portfolio.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Portfolio ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="space-y-6">
              {cameraman.reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                  <Image
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{review.name}</h3>
                      <div className="flex items-center">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Portfolio"
              layout="responsive"
              width={1200}
              height={800}
              className="rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
