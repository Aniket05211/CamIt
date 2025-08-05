"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Camera, Video, Music, Users, Calendar, Clock, MapPin, ChevronRight, ArrowRight, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const eventTypes = [
  {
    id: "wedding",
    name: "Wedding",
    icon: <Users className="w-6 h-6" />,
    description: "Full coverage of your special day",
    popular: true,
  },
  {
    id: "corporate",
    name: "Corporate Event",
    icon: <Building2 className="w-6 h-6" />,
    description: "Professional coverage for business events",
  },
  {
    id: "party",
    name: "Party/Celebration",
    icon: <Music className="w-6 h-6" />,
    description: "Capture the fun and excitement",
  },
  {
    id: "portrait",
    name: "Portrait Session",
    icon: <Camera className="w-6 h-6" />,
    description: "Professional portrait photography",
  },
]

const services = [
  {
    id: "photo",
    name: "Photography",
    icon: <Camera className="w-6 h-6" />,
    description: "Professional photo coverage",
  },
  {
    id: "video",
    name: "Videography",
    icon: <Video className="w-6 h-6" />,
    description: "High-quality video coverage",
  },
  {
    id: "both",
    name: "Photo + Video",
    icon: <Camera className="w-6 h-6" />,
    description: "Complete coverage package",
    popular: true,
  },
]

export default function BookEvent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    eventType: "",
    serviceType: "",
    date: "",
    time: "",
    location: "",
    guests: "",
    requirements: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Get user from localStorage
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) {
        alert("Please log in to book an event")
        router.push("/login")
        return
      }

      const userData = JSON.parse(storedUser)

      // Submit booking to database
      const response = await fetch("/api/bookings/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: userData.id,
          event_type: formData.eventType,
          service_type: formData.serviceType,
          event_date: formData.date,
          event_time: formData.time,
          location: formData.location,
          number_of_guests: parseInt(formData.guests) || null,
          special_requirements: formData.requirements || null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert("Event booking submitted successfully! We'll contact you soon.")
        router.push("/bookings")
      } else {
        alert("Failed to submit booking. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      alert("An error occurred. Please try again.")
    }
  }

  const canProceedToNextStep = formData.eventType !== "" && formData.serviceType !== ""

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-F78V0XlIaaPc5tlK9BBmw0o57K7dwN.png"
              alt="CamIt Logo"
              width={100}
              height={100}
              className="dark:invert"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Event</h1>
          <p className="text-xl text-gray-600">Capture It - Every moment tells a story</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= i
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i}
                </div>
                {i < 3 && (
                  <div
                    className={`h-1 w-24 sm:w-32 md:w-48 ${
                      step > i ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Event Type</span>
            <span className="text-sm text-gray-600">Event Details</span>
            <span className="text-sm text-gray-600">Review & Book</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Select Event Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData((prev) => ({ ...prev, eventType: type.id }))}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                        formData.eventType === type.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-500"
                      }`}
                    >
                      {type.popular && (
                        <span className="absolute top-0 right-4 transform -translate-y-1/2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-0.5 text-sm font-semibold text-white">
                          Popular
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="p-2 rounded-lg bg-purple-100 text-purple-600 w-fit">{type.icon}</div>
                          <h3 className="text-lg font-semibold mt-4">{type.name}</h3>
                          <p className="text-gray-600 mt-1">{type.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Select Service Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setFormData((prev) => ({ ...prev, serviceType: service.id }))}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                        formData.serviceType === service.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-500"
                      }`}
                    >
                      {service.popular && (
                        <span className="absolute top-0 right-4 transform -translate-y-1/2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-0.5 text-sm font-semibold text-white">
                          Popular
                        </span>
                      )}
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-600 w-fit">{service.icon}</div>
                      <h3 className="text-lg font-semibold mt-4">{service.name}</h3>
                      <p className="text-gray-600 mt-1">{service.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedToNextStep}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Event Details</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter event location"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests (approximate)
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter number of guests"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Any special requirements or notes for your event"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
                  >
                    Next Step
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Review & Book</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Event Details</h3>
                    <dl className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Event Type:</dt>
                        <dd className="font-medium text-gray-900">{formData.eventType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Service Type:</dt>
                        <dd className="font-medium text-gray-900">{formData.serviceType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Date:</dt>
                        <dd className="font-medium text-gray-900">{formData.date}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Time:</dt>
                        <dd className="font-medium text-gray-900">{formData.time}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Location & Guests</h3>
                    <dl className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Location:</dt>
                        <dd className="font-medium text-gray-900">{formData.location}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Guests:</dt>
                        <dd className="font-medium text-gray-900">{formData.guests}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {formData.requirements && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Special Requirements</h3>
                    <p className="mt-2 text-gray-600">{formData.requirements}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center"
                  >
                    Continue to Pricing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
