"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  Star,
  Instagram,
  Twitter,
  Facebook,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Photographer {
  id: string
  name: string
  image: string
  profile_image_url?: string // Add profile image URL
  specialization: string
  awards: string[]
  celebrities: string[]
  portfolio: string[]
  social: {
    instagram: string
    twitter: string
    facebook: string
  }
  bio: string
  experience: string
  rate: string
  equipment: string
  location: string
  availability: string[]
  languages: string[]
  rating: number
  total_reviews: number
  reviews: Array<{
    id: string
    rating: number
    comment: string
    created_at: string
    reviewer: {
      id: string
      full_name: string
      profile_image_url: string
    }
    booking_title: string
    event_date: string
  }>
}

interface BookingFormData {
  event_date_from: string
  event_date_to: string
  event_type: string
  duration_hours: number
  location_address: string
  estimated_guests: number
  special_requirements: string
  budget_min: number
  budget_max: number
  contact_preference: string
  venue_details: string
  accommodation_type: string
  accommodation_details: string
  celebrity_name: string
  shoot_purpose: string
  preferred_style: string
  equipment_needed: string
  makeup_artist: boolean
  stylist: boolean
  security_needed: boolean
  privacy_level: string
  media_coverage: boolean
  exclusive_rights: boolean
}

interface BookingFormProps {
  photographer: Photographer
  onClose: () => void
}

const BookingForm: React.FC<BookingFormProps> = ({ photographer, onClose }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    event_date_from: "",
    event_date_to: "",
    event_type: "",
    duration_hours: 2,
    location_address: "",
    estimated_guests: 0,
    special_requirements: "",
    budget_min: 0,
    budget_max: 0,
    contact_preference: "email",
    venue_details: "",
    accommodation_type: "",
    accommodation_details: "",
    celebrity_name: "",
    shoot_purpose: "",
    preferred_style: "",
    equipment_needed: "",
    makeup_artist: false,
    stylist: false,
    security_needed: false,
    privacy_level: "",
    media_coverage: false,
    exclusive_rights: false,
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with data:", formData)
    setIsSubmitting(true)
    
    try {
      // Get current user ID (you'll need to implement user authentication)
      const storedUser = localStorage.getItem("camit_user")
      let userData = storedUser ? JSON.parse(storedUser) : null
      
      console.log("User data from localStorage:", userData)
      console.log("Photographer ID:", photographer.id)
      console.log("Photographer data:", photographer)
      console.log("Photographer ID type:", typeof photographer.id)
      console.log("Full photographer object:", JSON.stringify(photographer, null, 2))
      
      if (!userData?.id) {
        // For testing purposes, create a test user if none exists
        const testUser = { id: "test-user-123", email: "test@example.com", full_name: "Test User" }
        localStorage.setItem("camit_user", JSON.stringify(testUser))
        console.log("Created test user for booking")
        userData = testUser
      }

      const bookingData = {
        client_id: userData.id,
        photographer_id: photographer.id, // This is now the actual user ID from database
        event_date: formData.event_date_from, // Assuming event_date is from the new form
        event_date_from: formData.event_date_from,
        event_date_to: formData.event_date_to,
        event_type: formData.event_type,
        duration_hours: formData.duration_hours,
        location_address: formData.location_address,
        estimated_guests: formData.estimated_guests,
        special_requirements: formData.special_requirements,
        budget_min: formData.budget_min,
        budget_max: formData.budget_max,
        contact_preference: formData.contact_preference,
        venue_details: formData.venue_details,
        accommodation_type: formData.accommodation_type,
        accommodation_details: formData.accommodation_details,
        celebrity_name: formData.celebrity_name,
        shoot_purpose: formData.shoot_purpose,
        preferred_style: formData.preferred_style,
        equipment_needed: formData.equipment_needed,
        makeup_artist: formData.makeup_artist,
        stylist: formData.stylist,
        security_needed: formData.security_needed,
        privacy_level: formData.privacy_level,
        media_coverage: formData.media_coverage,
        exclusive_rights: formData.exclusive_rights,
        title: `${formData.event_type} - ${photographer.name}`,
        description: formData.special_requirements,
        status: "pending",
        booking_type: "photography",
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          onClose()
          setSubmitStatus("idle")
        }, 3000)
      } else {
        throw new Error("Failed to submit booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BookingFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (submitStatus === "success") {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Booking Request Submitted!</h3>
        <p className="text-green-800">
          Your booking request has been sent to {photographer.name}. 
          You'll receive an email once they review your request.
        </p>
      </div>
    )
  }

  if (submitStatus === "error") {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <div className="text-red-600 text-4xl mb-4">✗</div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Booking Failed</h3>
        <p className="text-red-800">
          There was an error submitting your booking. Please try again.
        </p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date From *
            </label>
            <input
              type="date"
              required
              value={formData.event_date_from}
              onChange={(e) => handleInputChange("event_date_from", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date To *
            </label>
            <input
              type="date"
              required
              value={formData.event_date_to}
              onChange={(e) => handleInputChange("event_date_to", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type *
            </label>
            <select
              required
              value={formData.event_type}
              onChange={(e) => handleInputChange("event_type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select event type</option>
              <option value="celebrity_portrait">Celebrity Portrait</option>
              <option value="magazine_cover">Magazine Cover</option>
              <option value="red_carpet">Red Carpet Event</option>
              <option value="award_ceremony">Award Ceremony</option>
              <option value="fashion_shoot">Fashion Shoot</option>
              <option value="promotional">Promotional Campaign</option>
              <option value="personal">Personal Shoot</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Hours) *
            </label>
            <input
              type="number"
              required
              min="1"
              max="24"
              value={formData.duration_hours}
              onChange={(e) => handleInputChange("duration_hours", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Celebrity/Client Name *
            </label>
            <input
              type="text"
              required
              value={formData.celebrity_name}
              onChange={(e) => handleInputChange("celebrity_name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter celebrity or client name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shoot Purpose *
            </label>
            <select
              required
              value={formData.shoot_purpose}
              onChange={(e) => handleInputChange("shoot_purpose", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select purpose</option>
              <option value="magazine_publication">Magazine Publication</option>
              <option value="social_media">Social Media Content</option>
              <option value="press_release">Press Release</option>
              <option value="personal_collection">Personal Collection</option>
              <option value="commercial_ad">Commercial Advertisement</option>
              <option value="award_submission">Award Submission</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Style
            </label>
            <select
              value={formData.preferred_style}
              onChange={(e) => handleInputChange("preferred_style", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select style</option>
              <option value="elegant">Elegant & Sophisticated</option>
              <option value="casual">Casual & Natural</option>
              <option value="dramatic">Dramatic & Bold</option>
              <option value="minimalist">Minimalist & Clean</option>
              <option value="vintage">Vintage & Retro</option>
              <option value="modern">Modern & Contemporary</option>
              <option value="artistic">Artistic & Creative</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Guests
            </label>
            <input
              type="number"
              min="0"
              value={formData.estimated_guests}
              onChange={(e) => handleInputChange("estimated_guests", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Number of guests/crew"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={formData.budget_min}
                onChange={(e) => handleInputChange("budget_min", parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="self-center text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={formData.budget_max}
                onChange={(e) => handleInputChange("budget_max", parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Location *
          </label>
          <input
            type="text"
            required
            value={formData.location_address}
            onChange={(e) => handleInputChange("location_address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Full address of the event"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accommodation Type
            </label>
            <select
              value={formData.accommodation_type}
              onChange={(e) => handleInputChange("accommodation_type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select accommodation</option>
              <option value="self_arranged">Self Arranged</option>
              <option value="photographer_provided">Photographer Provided</option>
              <option value="luxury_hotel">Luxury Hotel</option>
              <option value="private_venue">Private Venue</option>
              <option value="studio">Studio</option>
              <option value="outdoor_location">Outdoor Location</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Privacy Level
            </label>
            <select
              value={formData.privacy_level}
              onChange={(e) => handleInputChange("privacy_level", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select privacy level</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="exclusive">Exclusive</option>
              <option value="confidential">Confidential</option>
              <option value="nda_required">NDA Required</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Venue Details
          </label>
          <textarea
            value={formData.venue_details}
            onChange={(e) => handleInputChange("venue_details", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Any specific details about the venue, lighting, setup, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Accommodation Details
          </label>
          <textarea
            value={formData.accommodation_details}
            onChange={(e) => handleInputChange("accommodation_details", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Details about accommodation arrangements, requirements, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Equipment Needed
          </label>
          <textarea
            value={formData.equipment_needed}
            onChange={(e) => handleInputChange("equipment_needed", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Specific equipment requirements, lighting, props, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requirements
          </label>
          <textarea
            value={formData.special_requirements}
            onChange={(e) => handleInputChange("special_requirements", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Any specific requirements, style preferences, special requests, or unique needs..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Additional Services</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.makeup_artist}
                  onChange={(e) => handleInputChange("makeup_artist", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Makeup Artist Required</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.stylist}
                  onChange={(e) => handleInputChange("stylist", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Stylist Required</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.security_needed}
                  onChange={(e) => handleInputChange("security_needed", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Security Required</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.media_coverage}
                  onChange={(e) => handleInputChange("media_coverage", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Media Coverage Expected</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.exclusive_rights}
                  onChange={(e) => handleInputChange("exclusive_rights", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Exclusive Rights Required</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Contact Method
            </label>
            <select
              value={formData.contact_preference}
              onChange={(e) => handleInputChange("contact_preference", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="both">Both</option>
              <option value="manager">Through Manager</option>
              <option value="agent">Through Agent</option>
            </select>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">Booking Summary</h4>
          <div className="text-sm text-purple-800 space-y-1">
            <p><strong>Photographer:</strong> {photographer.name}</p>
            <p><strong>Rate:</strong> {photographer.rate}</p>
            <p><strong>Client:</strong> {formData.celebrity_name || "Not specified"}</p>
            <p><strong>Event:</strong> {formData.event_type || "Not specified"}</p>
            <p><strong>Purpose:</strong> {formData.shoot_purpose || "Not specified"}</p>
            <p><strong>Date Range:</strong> {formData.event_date_from || "Not specified"} to {formData.event_date_to || "Not specified"}</p>
            <p><strong>Duration:</strong> {formData.duration_hours} hours</p>
            <p><strong>Budget:</strong> ${formData.budget_min || 0} - ${formData.budget_max || 0}</p>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </button>
        </div>
      </form>
    </div>
  )
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Model",
    comment: "Working with John was an absolute pleasure. His creativity and professionalism are unmatched.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Art Director",
    comment: "John's attention to detail and ability to capture the perfect moment consistently amaze me.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Fashion Designer",
    comment:
      "I've worked with many photographers, but John's work stands out. He truly understands how to showcase designs.",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb",
  },
]

const faqs = [
  {
    question: "How do I book a photoshoot?",
    answer:
      "You can book a photoshoot by contacting us through the form on this page or by calling our studio directly. We'll discuss your needs and find the perfect photographer for your project.",
  },
  {
    question: "What should I wear for my photoshoot?",
    answer:
      "It depends on the type of photoshoot. For portraits, we recommend solid colors and avoiding busy patterns. For fashion shoots, we'll work with you or your stylist to select the best outfits.",
  },
  {
    question: "How long does a typical photoshoot last?",
    answer:
      "The duration varies depending on the type of shoot. Portrait sessions usually last 1-2 hours, while fashion or commercial shoots can take several hours or even a full day.",
  },
  {
    question: "Do you provide hair and makeup services?",
    answer:
      "Yes, we can arrange professional hair and makeup services for your shoot. Let us know your requirements when booking, and we'll take care of the rest.",
  },
]

const PhotographerCard = ({ photographer, onPortfolioClick }: { photographer: Photographer; onPortfolioClick: (photographer: Photographer) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={photographer.profile_image_url || photographer.image || "/placeholder.svg"}
          alt={photographer.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{photographer.name}</h3>
        <p className="text-purple-600 font-medium mb-2">{photographer.specialization}</p>
        
        {/* Rating and Review Count */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < photographer.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {photographer.rating.toFixed(1)} ({photographer.total_reviews} reviews)
          </span>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Awards & Recognition</h4>
          <div className="flex flex-wrap gap-2">
            {photographer.awards.map((award: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                <Award className="w-3 h-3 mr-1" />
                {award}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Celebrity Clients</h4>
          <div className="flex flex-wrap gap-2">
            {photographer.celebrities.map((celeb: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                <Star className="w-3 h-3 mr-1" />
                {celeb}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {photographer.social.instagram && (
            <a
                href={`https://instagram.com/${photographer.social.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {photographer.social.twitter && (
              <a 
                href={`https://twitter.com/${photographer.social.twitter.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {photographer.social.facebook && (
              <a 
                href={`https://facebook.com/${photographer.social.facebook}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
          </div>
          <button
            onClick={() => onPortfolioClick(photographer)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Portfolio
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const PortfolioModal: React.FC<{ photographer: Photographer | null; isOpen: boolean; onClose: () => void }> = ({
  photographer,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [activeTab, setActiveTab] = useState<"portfolio" | "about" | "reviews" | "booking">("portfolio")

  if (!isOpen || !photographer) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photographer.portfolio.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photographer.portfolio.length) % photographer.portfolio.length)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-xl overflow-hidden max-w-7xl w-full max-h-[95vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 relative">
            <Image
              src={photographer.portfolio[currentImageIndex] || "/placeholder.svg"}
              alt={`Portfolio ${currentImageIndex + 1}`}
              layout="responsive"
              width={16}
              height={9}
              objectFit="cover"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              {currentImageIndex + 1} / {photographer.portfolio.length}
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[80vh]">
            <h2 className="text-3xl font-bold mb-4">{photographer.name}</h2>
            <p className="text-purple-600 font-medium mb-4">{photographer.specialization}</p>

            <div className="flex mb-6 border-b">
              <button
                className={`px-4 py-2 ${activeTab === "portfolio" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("portfolio")}
              >
                Portfolio
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "about" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "reviews" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({photographer.total_reviews})
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "booking" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("booking")}
              >
                Booking
              </button>
            </div>

            {activeTab === "portfolio" && (
              <div className="grid grid-cols-3 gap-4">
                {photographer.portfolio.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Portfolio ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-4">
                <p className="text-gray-600">{photographer.bio}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Experience</h4>
                    <p>{photographer.experience}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Rate</h4>
                    <p>{photographer.rate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Location</h4>
                    <p>{photographer.location}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Languages</h4>
                    <p>{photographer.languages.join(", ")}</p>
                  </div>
                </div>
                
                {/* Equipment Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Equipment</h4>
                  <p className="text-gray-600">{photographer.equipment}</p>
                </div>
                
                {/* Rating and Reviews Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Rating & Reviews</h4>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < photographer.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {photographer.rating.toFixed(1)} ({photographer.total_reviews} reviews)
                    </span>
                  </div>
                  
                  {/* Recent Reviews */}
                  {photographer.reviews && photographer.reviews.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-700">Recent Reviews</h5>
                      {photographer.reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {review.created_at}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {review.booking_title}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            - {review.reviewer.full_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Awards & Recognition</h4>
                  <div className="flex flex-wrap gap-2">
                    {photographer.awards.map((award, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Social Media Links */}
                {(photographer.social.instagram || photographer.social.twitter || photographer.social.facebook) && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">Connect</h4>
                    <div className="flex space-x-4">
                      {photographer.social.instagram && (
                        <a
                          href={`https://instagram.com/${photographer.social.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                        >
                          <Instagram className="w-5 h-5 mr-2" />
                          <span className="text-sm">{photographer.social.instagram}</span>
                        </a>
                      )}
                      {photographer.social.twitter && (
                        <a
                          href={`https://twitter.com/${photographer.social.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-400 hover:text-blue-500 transition-colors"
                        >
                          <Twitter className="w-5 h-5 mr-2" />
                          <span className="text-sm">{photographer.social.twitter}</span>
                        </a>
                      )}
                      {photographer.social.facebook && (
                        <a
                          href={`https://facebook.com/${photographer.social.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Facebook className="w-5 h-5 mr-2" />
                          <span className="text-sm">Facebook</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < photographer.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-700">
                    {photographer.rating.toFixed(1)} out of 5
                  </span>
                  <span className="text-sm text-gray-500">
                    ({photographer.total_reviews} reviews)
                  </span>
                </div>
                
                {photographer.reviews && photographer.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {photographer.reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-medium">
                                {review.reviewer.full_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{review.reviewer.full_name}</h5>
                              <p className="text-sm text-gray-500">{review.created_at}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Event: {review.booking_title}</span>
                          {review.event_date && (
                            <span>Date: {new Date(review.event_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h4>
                    <p className="text-gray-500">Be the first to review this photographer!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "booking" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>Available: {photographer.availability.join(", ")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span>Rate: {photographer.rate}</span>
                </div>
                
                {/* Booking Status Display */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Booking Process</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>1. Fill out the booking form below</p>
                    <p>2. Photographer will review your request</p>
                    <p>3. You'll receive an email with the decision</p>
                    <p>4. If accepted, proceed to payment</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    console.log("Toggle booking form, current state:", showContactForm)
                    setShowContactForm(!showContactForm)
                  }}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {showContactForm ? "Hide Booking Form" : "Book Now"}
                </button>
                
                {showContactForm && (
                  <div className="mt-4 border-t pt-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Booking Form</h4>
                    <BookingForm photographer={photographer} onClose={() => setShowContactForm(false)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative bg-purple-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="relative h-64">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <Image
                src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                alt={testimonials[currentIndex].name}
                width={80}
                height={80}
                className="rounded-full mb-4"
              />
              <p className="text-xl font-medium mb-4">{testimonials[currentIndex].comment}</p>
              <p className="font-semibold">{testimonials[currentIndex].name}</p>
              <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mt-4 text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Photoshoot() {
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null)
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegisteredCameraman, setIsRegisteredCameraman] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real application, you would check this with your backend
    const isRegistered = localStorage.getItem("isRegisteredCameraman") === "true"
    setIsRegisteredCameraman(isRegistered)
  }, [])

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/photographers?t=' + Date.now(), {
          cache: 'no-cache'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch photographers')
        }
        
        const data = await response.json()
        console.log("Fetched photographers data:", data)
        setPhotographers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch photographers')
      } finally {
        setLoading(false)
      }
    }

    fetchPhotographers()
  }, [])

  const handleCameramanClick = () => {
    if (isRegisteredCameraman) {
      router.push("/cameraman-dashboard")
    } else {
      router.push("/cameraman-registration")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e"
            alt="Professional Photography"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </motion.div>
        <div className="relative z-10 text-center text-white">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Elite Photography
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-8"
          >
            Experience photography at its finest with our award-winning photographers
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={handleCameramanClick}
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            {isRegisteredCameraman ? "Cameraman Dashboard" : "Become a Cameraman"}
          </motion.button>
        </div>
      </section>

      {/* Photographers Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Elite Photographers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p>Loading photographers...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">
              {error}
            </div>
          ) : photographers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p>No photographers found.</p>
            </div>
          ) : (
                         photographers.map((photographer) => (
            <PhotographerCard
              key={photographer.id}
              photographer={photographer}
                 onPortfolioClick={(photographer) => setSelectedPhotographer(photographer)}
            />
             ))
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* FAQ Section */}
      <FAQSection />

      {/* Booking Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Photoshoot?</h2>
          <p className="text-xl mb-8">Let's create something extraordinary together.</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Book Now
          </button>
        </div>
      </section>

      {/* Portfolio Modal */}
      <PortfolioModal
        photographer={selectedPhotographer}
        isOpen={!!selectedPhotographer}
        onClose={() => setSelectedPhotographer(null)}
      />
    </div>
  )
}
