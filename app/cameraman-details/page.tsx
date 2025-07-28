"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import Link from "next/link"

interface CameramanProfile {
  name: string
  email: string
  phone: string
  equipment: string
  experience: string
  shareLocation: boolean
  bio?: string
  specialties?: string[]
  portfolio?: string[]
  availability?: boolean
  rate?: string
  languages?: string[]
  certificates?: string[]
  photoSamples?: string[]
}

export default function CameramanDetails() {
  const [profile, setProfile] = useState<CameramanProfile | null>(null)

  useEffect(() => {
    const storedProfile = localStorage.getItem("cameraman")
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
  }, [])

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">No Cameraman Profile Found</h1>
          <p className="mb-4">Please register as a cameraman first.</p>
          <Link href="/cameraman-registration" className="text-blue-500 hover:underline">
            Go to Registration
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Cameraman Details</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <div className="text-sm font-medium text-gray-500">Name</div>
              <div className="mt-1 text-sm text-gray-900">{profile.name}</div>
            </div>
            <div className="sm:col-span-1">
              <div className="text-sm font-medium text-gray-500">Experience</div>
              <div className="mt-1 text-sm text-gray-900">{profile.experience} years</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-gray-500">Equipment</div>
              <div className="mt-1 text-sm text-gray-900">{profile.equipment}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-gray-500">Bio</div>
              <div className="mt-1 text-sm text-gray-900">{profile.bio || "No bio provided"}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-gray-500">Specialties</div>
              <div className="mt-1 text-sm text-gray-900">
                {profile.specialties?.join(", ") || "No specialties listed"}
              </div>
            </div>
            <div className="sm:col-span-1">
              <div className="text-sm font-medium text-gray-500">Rate</div>
              <div className="mt-1 text-sm text-gray-900">{profile.rate || "Not specified"}</div>
            </div>
            <div className="sm:col-span-1">
              <div className="text-sm font-medium text-gray-500">Languages</div>
              <div className="mt-1 text-sm text-gray-900">{profile.languages?.join(", ") || "Not specified"}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-gray-500">Certificates</div>
              <div className="mt-1 text-sm text-gray-900">
                {profile.certificates?.join(", ") || "No certificates listed"}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-gray-500">Photo Samples</div>
              <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.photoSamples?.map((url, index) => (
                  <img
                    key={index}
                    src={url || "/placeholder.svg"}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">
                {profile.availability ? "Available for booking" : "Currently unavailable"}
              </span>
            </div>
            <Link
              href="/book-cameraman"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                !profile.availability && "opacity-50 cursor-not-allowed"
              }`}
              onClick={(e) => !profile.availability && e.preventDefault()}
            >
              Book This Cameraman
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
