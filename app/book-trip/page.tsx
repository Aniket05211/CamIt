"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import {
  Camera,
  MapPin,
  CheckCircle,
  Star,
  Globe,
  Award,
  Shield,
  Users,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  Heart,
  Eye,
  PlayCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const inquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  destination: z.string().min(2, "Destination is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  groupSize: z.number().min(1, "Group size must be at least 1"),
  budget: z.number().min(500, "Minimum budget is $500"),
  photographyStyle: z.string({ required_error: "Photography style is required" }),
  specialRequests: z.string().optional(),
  hearAboutUs: z.string().optional(),
})

const featuredDestinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop&crop=center",
    description: "Iconic blue domes, stunning sunsets, and whitewashed villages create the perfect romantic backdrop",
    highlights: ["Sunset Photography", "Architecture", "Coastal Views", "Romantic Settings"],
    bestTime: "April - October",
    priceRange: "$1,200 - $2,500",
    featured: true,
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop&crop=center",
    description: "Ancient temples, cherry blossoms, and traditional culture offer timeless photographic opportunities",
    highlights: ["Temple Photography", "Cherry Blossoms", "Cultural Heritage", "Traditional Architecture"],
    bestTime: "March - May, October - November",
    priceRange: "$1,500 - $3,000",
    featured: true,
  },
  {
    id: 3,
    name: "Iceland",
    image: "https://images.unsplash.com/photo-1539066834862-2e0c2e2c9b8e?w=600&h=400&fit=crop&crop=center",
    description: "Dramatic landscapes, Northern Lights, and natural wonders create breathtaking photographic moments",
    highlights: ["Northern Lights", "Waterfalls", "Glaciers", "Volcanic Landscapes"],
    bestTime: "September - March (Northern Lights)",
    priceRange: "$2,000 - $4,000",
    featured: true,
  },
  {
    id: 4,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop&crop=center",
    description: "Tropical paradise with rice terraces, temples, and pristine beaches for diverse photography styles",
    highlights: ["Rice Terraces", "Temple Architecture", "Beach Photography", "Cultural Portraits"],
    bestTime: "April - October",
    priceRange: "$800 - $2,000",
  },
  {
    id: 5,
    name: "Patagonia",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center",
    description: "Rugged wilderness, dramatic peaks, and pristine lakes offer adventure photography at its finest",
    highlights: ["Mountain Photography", "Wildlife", "Adventure Shots", "Dramatic Landscapes"],
    bestTime: "November - March",
    priceRange: "$2,500 - $5,000",
  },
  {
    id: 6,
    name: "Morocco",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&h=400&fit=crop&crop=center",
    description: "Vibrant markets, stunning architecture, and desert landscapes provide rich cultural photography",
    highlights: ["Street Photography", "Architecture", "Desert Scenes", "Cultural Immersion"],
    bestTime: "October - April",
    priceRange: "$1,000 - $2,500",
  },
]

const customerReviews = [
  {
    id: 1,
    name: "Sarah & Michael Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c96c5e24?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    date: "2 weeks ago",
    location: "Tuscany, Italy",
    locationImage: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=300&h=200&fit=crop&crop=center",
    review:
      "CamIt made our dream wedding in Tuscany absolutely perfect! From the initial consultation to the final photo delivery, everything was seamless. Our photographer captured every precious moment beautifully, and the team handled all the logistics flawlessly. We couldn't be happier with the results!",
    photos: 150,
    highlight: "Wedding Photography",
  },
  {
    id: 2,
    name: "Jennifer Martinez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    date: "1 month ago",
    location: "Tokyo, Japan",
    locationImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop&crop=center",
    review:
      "The family vacation photos from our Tokyo trip are absolutely stunning! CamIt connected us with a local photographer who knew all the best spots and timing. The cherry blossom shots are magazine-quality, and our kids loved the experience. Highly recommend for family trips!",
    photos: 85,
    highlight: "Family Photography",
  },
  {
    id: 3,
    name: "David Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    date: "3 weeks ago",
    location: "Iceland",
    locationImage: "https://images.unsplash.com/photo-1531168556467-80aace4d0144?w=300&h=200&fit=crop&crop=center",
    review:
      "The Northern Lights photography tour exceeded all expectations! CamIt's team was incredibly professional and knowledgeable. They knew exactly when and where to capture the aurora, and the results are breathtaking. Worth every penny for this once-in-a-lifetime experience.",
    photos: 120,
    highlight: "Adventure Photography",
  },
  {
    id: 4,
    name: "Emma & James Wilson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    date: "1 week ago",
    location: "Bali, Indonesia",
    locationImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=300&h=200&fit=crop&crop=center",
    review:
      "Our anniversary trip to Bali was made even more special by CamIt's photography service. The photographer was creative, professional, and made us feel comfortable throughout the shoot. The sunset beach photos are absolutely gorgeous, and we'll treasure them forever.",
    photos: 95,
    highlight: "Couple Photography",
  },
  {
    id: 5,
    name: "Robert Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    rating: 4,
    date: "2 months ago",
    location: "Morocco",
    locationImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=200&fit=crop&crop=center",
    review:
      "Great experience overall! The photographer was knowledgeable about local customs and got some amazing shots in the markets and desert. Communication was excellent, and the final photos captured the essence of Morocco beautifully. Minor delay in delivery but quality made up for it.",
    photos: 110,
    highlight: "Cultural Photography",
  },
  {
    id: 6,
    name: "Lisa Rodriguez",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face",
    rating: 5,
    date: "3 months ago",
    location: "Santorini, Greece",
    locationImage: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&h=200&fit=crop&crop=center",
    review:
      "CamIt turned our girls' trip into a professional photoshoot experience! The photographer was fun, creative, and knew all the Instagram-worthy spots. We felt like models for a day, and the photos are absolutely stunning. Already planning our next trip with them!",
    photos: 200,
    highlight: "Lifestyle Photography",
  },
]

const photographyStyles = [
  { value: "wedding", label: "Wedding Photography", icon: "💒" },
  { value: "family", label: "Family & Group", icon: "👨‍👩‍👧‍👦" },
  { value: "couple", label: "Couple & Engagement", icon: "💕" },
  { value: "adventure", label: "Adventure & Travel", icon: "🏔️" },
  { value: "lifestyle", label: "Lifestyle & Portrait", icon: "📸" },
  { value: "commercial", label: "Commercial & Brand", icon: "🏢" },
]

const processSteps = [
  {
    step: 1,
    title: "Share Your Vision",
    description: "Tell us about your dream trip, photography style, and preferences through our simple form.",
    icon: MessageCircle,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center",
  },
  {
    step: 2,
    title: "Get Matched",
    description: "Our team carefully selects the perfect photographer based on your location, style, and budget.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center",
  },
  {
    step: 3,
    title: "Plan Together",
    description: "Connect with your photographer to plan the perfect itinerary and shot list for your trip.",
    icon: Calendar,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center",
  },
  {
    step: 4,
    title: "Capture Memories",
    description: "Enjoy your trip while our professional photographer captures every precious moment.",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop&crop=center",
  },
  {
    step: 5,
    title: "Receive Your Photos",
    description: "Get professionally edited, high-resolution photos delivered within 7-14 days.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center",
  },
]

const valuePropositions = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "All photographers are thoroughly vetted and verified for quality and reliability",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=300&fit=crop&crop=center",
  },
  {
    icon: Globe,
    title: "Worldwide Coverage",
    description: "Professional photographers available in 150+ destinations around the globe",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&crop=center",
  },
  {
    icon: Award,
    title: "Award-Winning Quality",
    description: "Our photographers have won numerous awards and recognition in the industry",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop&crop=center",
  },
]

export default function BookTrip() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      destination: "",
      startDate: undefined,
      endDate: undefined,
      groupSize: 2,
      budget: 1500,
      photographyStyle: "",
      specialRequests: "",
      hearAboutUs: "",
    },
  })

  async function onSubmit(values: z.infer<typeof inquirySchema>) {
    setIsSubmitting(true)

    try {
      // Format dates for email
      const formattedValues = {
        ...values,
        startDate: values.startDate ? format(values.startDate, "PPP") : "",
        endDate: values.endDate ? format(values.endDate, "PPP") : "",
      }

      const response = await fetch("/api/send-inquiry-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      })

      if (response.ok) {
        toast({
          title: "🎉 Inquiry Submitted Successfully!",
          description: "Our team will contact you within 24 hours with personalized recommendations.",
        })
        form.reset()
      } else {
        throw new Error("Failed to send inquiry")
      }
    } catch (error) {
      toast({
        title: "❌ Submission Failed",
        description: "There was an error submitting your inquiry. Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop&crop=center')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Capture Your Perfect Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Tell us about your dream trip, and we'll connect you with the perfect photographer to capture every
              precious moment
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-5 w-5" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Globe className="h-5 w-5" />
                <span>Worldwide Coverage</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Award className="h-5 w-5" />
                <span>Award-Winning Quality</span>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-2xl"
              onClick={() => document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Value Propositions with Images */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose CamIt?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional photography experiences that exceed your expectations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {valuePropositions.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={prop.image || "/placeholder.svg"}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <prop.icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{prop.title}</h3>
                    <p className="text-gray-600">{prop.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Process Images */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How CamIt Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From your initial inquiry to receiving stunning photos, we make the entire process seamless and enjoyable
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <div className="relative overflow-hidden rounded-2xl mb-4 shadow-lg">
                      <img
                        src={step.image || "/placeholder.svg"}
                        alt={step.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                        {step.step}
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 transform -translate-x-8"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations with Enhanced Images */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Featured Destinations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover breathtaking locations where our photographers create unforgettable memories
            </p>
          </motion.div>

          {/* Featured Destinations Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredDestinations.slice(0, 3).map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {destination.featured && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                      <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                        {destination.priceRange}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {destination.highlights.slice(0, 3).map((highlight) => (
                        <Badge key={highlight} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {destination.bestTime}
                      </span>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Destinations Row */}
          <div className="grid md:grid-cols-3 gap-6">
            {featuredDestinations.slice(3).map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold">{destination.name}</h4>
                      <p className="text-sm opacity-90">{destination.priceRange}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section with Improved Calendar */}
      <section id="inquiry-form" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Tell Us About Your Dream Trip</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share your vision with us, and we'll create a personalized photography experience just for you
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-0 bg-white">
                <CardHeader className="pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold">Trip Details</CardTitle>
                  <p className="text-blue-100">
                    Fill out the form below and our team will contact you within 24 hours with personalized
                    recommendations
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          Contact Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="your.email@example.com"
                                    type="email"
                                    {...field}
                                    className="h-12"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      {/* Trip Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          Trip Details
                        </h3>
                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                Destination *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Where would you like to go? (e.g., Paris, Tokyo, Bali)"
                                  {...field}
                                  className="h-12"
                                />
                              </FormControl>
                              <FormDescription>
                                Tell us your dream destination or let us know if you need suggestions
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Start Date *</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "h-12 text-left font-normal justify-start",
                                          !field.value && "text-muted-foreground",
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 z-[9999]"
                                    align="start"
                                    side="bottom"
                                    sideOffset={4}
                                    avoidCollisions={true}
                                    collisionPadding={20}
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className="rounded-md border shadow-lg bg-white"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>End Date *</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "h-12 text-left font-normal justify-start",
                                          !field.value && "text-muted-foreground",
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 z-[9999]"
                                    align="start"
                                    side="bottom"
                                    sideOffset={4}
                                    avoidCollisions={true}
                                    collisionPadding={20}
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className="rounded-md border shadow-lg bg-white"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="groupSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-blue-600" />
                                  Group Size *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="20"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className="h-12"
                                  />
                                </FormControl>
                                <FormDescription>How many people will be in your group?</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Budget Range *</FormLabel>
                                <FormControl>
                                  <div className="space-y-3">
                                    <Slider
                                      min={500}
                                      max={10000}
                                      step={250}
                                      value={[field.value]}
                                      onValueChange={(value) => field.onChange(value[0])}
                                      className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500">
                                      <span>$500</span>
                                      <span className="font-semibold text-blue-600">
                                        ${field.value.toLocaleString()}
                                      </span>
                                      <span>$10,000+</span>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>Your estimated budget for photography services</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Photography Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                          <Camera className="h-5 w-5 text-blue-600" />
                          Photography Preferences
                        </h3>
                        <FormField
                          control={form.control}
                          name="photographyStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Photography Style *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select your preferred photography style" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {photographyStyles.map((style) => (
                                    <SelectItem key={style.value} value={style.value}>
                                      <div className="flex items-center gap-2">
                                        <span>{style.icon}</span>
                                        <span>{style.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="specialRequests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Requests & Preferences</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about your vision, specific shots you want, any special occasions, or other preferences..."
                                  className="min-h-32 resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Help us understand your vision and create the perfect photography experience
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hearAboutUs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>How did you hear about us?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="google">Google Search</SelectItem>
                                  <SelectItem value="social">Social Media</SelectItem>
                                  <SelectItem value="referral">Friend/Family Referral</SelectItem>
                                  <SelectItem value="review">Review Site</SelectItem>
                                  <SelectItem value="advertisement">Advertisement</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-2" />
                            Get My Personalized Quote
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Need Help?
                  </CardTitle>
                  <p className="text-sm text-green-100">Our team is here to assist you</p>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50">
                    <Phone className="h-4 w-4 mr-2 text-blue-600" />
                    Call: +1 (555) 123-4567
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email: hello@camit.com
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50">
                    <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                    Live Chat
                  </Button>
                  <div className="text-center text-sm text-gray-600 pt-2 flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    Response time: Within 24 hours
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    What's Included
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>Professional photographer matching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>Personalized itinerary planning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>Professional equipment included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>High-resolution photo delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>Professional photo editing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators with Icons */}
              <Card className="shadow-xl border-0 bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 text-center text-gray-900">Trusted by Thousands</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                        <Users className="h-5 w-5" />
                        2,500+
                      </div>
                      <div className="text-xs text-gray-600">Happy Clients</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                        <Globe className="h-5 w-5" />
                        150+
                      </div>
                      <div className="text-xs text-gray-600">Destinations</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                        <Star className="h-5 w-5" />
                        4.9★
                      </div>
                      <div className="text-xs text-gray-600">Average Rating</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                        <Camera className="h-5 w-5" />
                        500+
                      </div>
                      <div className="text-xs text-gray-600">Photographers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews with Location Images */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.9</span>
              <span className="text-gray-600">from 2,500+ reviews</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {customerReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Location Image Header */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={review.locationImage || "/placeholder.svg"}
                      alt={review.location}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 text-white text-sm font-medium">{review.location}</div>
                    <Badge className="absolute top-2 right-2 bg-white/90 text-gray-900">{review.highlight}</Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                        <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                        <AvatarFallback>
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">{review.review}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                      <span className="flex items-center gap-1">
                        <Camera className="h-4 w-4" />
                        {review.photos} photos received
                      </span>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section with Background */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=600&fit=crop&crop=center')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-indigo-900/90"></div>
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-4">Ready to Capture Your Perfect Journey?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of travelers who have created unforgettable memories with CamIt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-2xl"
                onClick={() => document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Our Story
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
