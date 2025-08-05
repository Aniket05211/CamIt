"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  Upload,
  Download,
  DollarSign,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Filter,
  Scissors,
  Video,
  ImageIcon,
  X,
  Award,
  Clock,
  ChevronDown,
  Search,
  Sparkles,
  Zap,
  MessageCircle,
  ThumbsUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

// Add this new import
import { styled } from "@stitches/react"

// Add this new styled component
const ScrollableDiv = styled("div", {
  "&::-webkit-scrollbar": { display: "none" },
  "-ms-overflow-style": "none",
  scrollbarWidth: "none",
})

// Sample data for editors (fallback)
const sampleEditors = [
  {
    id: 1,
    name: "Alex Morgan",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080",
    specialty: "Portrait & Wedding Photo Editing",
    rating: 4.9,
    reviews: 127,
    description:
      "Specializing in portrait retouching and color grading with 8+ years of experience working with professional photographers and magazines.",
    samples: [
      {
        id: 1,
        before: "https://images.unsplash.com/photo-1600275669439-14e40452d20b?q=80&w=2187",
        after: "https://images.unsplash.com/photo-1623091410901-00e2d268ee37?q=80&w=2070",
        type: "photo",
        description: "Wedding photo color enhancement and skin retouching",
      },
      {
        id: 2,
        before: "https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?q=80&w=2272",
        after: "https://images.unsplash.com/photo-1618721405821-80ebc4b63d26?q=80&w=2070",
        type: "photo",
        description: "Portrait enhancement with background blur adjustment",
      },
    ],
    pricing: { sample: 15, full: "75-150" },
    priceRange: "$$",
    turnaround: "24-48 hours",
    awards: ["Best Portrait Editor 2023", "Wedding Photography Excellence Award"],
    languages: ["English", "Spanish"],
    portfolio: [
      "https://images.unsplash.com/photo-1610901157620-340856d0a50f?q=80&w=2070",
      "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=2070",
      "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106",
      "https://images.unsplash.com/photo-1605379399843-5870eea9b74e?q=80&w=2106",
      "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106",
      "https://images.unsplash.com/photo-1581456495146-65a71b2c8e52?q=80&w=2272",
    ],
    serviceTypes: ["basic", "advanced"],
  },
  {
    id: 2,
    name: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061",
    specialty: "Commercial & Product Photography Editing",
    rating: 4.8,
    reviews: 93,
    description:
      "Former Adobe specialist with expertise in product photography enhancement, background removal, and commercial-grade retouching.",
    samples: [
      {
        id: 3,
        before: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2068",
        after: "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=2068",
        type: "photo",
        description: "Product photo with background removal and shadow enhancement",
      },
      {
        id: 4,
        before: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=2069",
        after: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
        type: "photo",
        description: "Commercial product enhancement with color correction",
      },
    ],
    pricing: { sample: 20, full: "90-200" },
    priceRange: "$$$",
    turnaround: "48-72 hours",
    awards: ["Commercial Photography Award", "Product Editing Excellence"],
    languages: ["English", "Mandarin"],
    portfolio: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2068",
      "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=2068",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=2069",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2064",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080",
    ],
    serviceTypes: ["advanced", "professional"],
  },
  {
    id: 3,
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2074",
    specialty: "Video Editing & Color Grading",
    rating: 4.7,
    reviews: 78,
    description:
      "Professional videographer and editor with experience in wedding films, music videos, and documentary editing using Premiere Pro and DaVinci Resolve.",
    samples: [
      {
        id: 5,
        thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2070",
        video: "https://player.vimeo.com/video/517031489?h=e5df4dd183",
        type: "video",
        description: "Wedding highlight film with cinematic color grading",
      },
      {
        id: 6,
        thumbnail: "https://images.unsplash.com/photo-1574717024453-e599f3984a15?q=80&w=2070",
        video: "https://player.vimeo.com/video/341373322?h=e5df4dd183",
        type: "video",
        description: "Commercial product video with motion graphics",
      },
    ],
    pricing: { sample: 25, full: "150-500" },
    priceRange: "$$$",
    turnaround: "3-5 days",
    awards: ["Film Editing Excellence Award", "Best Wedding Videographer 2022"],
    languages: ["English", "Portuguese"],
    portfolio: [
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2070",
      "https://images.unsplash.com/photo-1574717024453-e599f3984a15?q=80&w=2070",
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2071",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071",
      "https://images.unsplash.com/photo-1585023278576-33a4b48e95b9?q=80&w=2070",
      "https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?q=80&w=2071",
    ],
    serviceTypes: ["video", "professional"],
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2064",
    specialty: "Landscape & Travel Photography Editing",
    rating: 4.9,
    reviews: 112,
    description:
      "Travel photographer and editor specializing in dramatic landscape enhancements, sky replacements, and creating stunning travel imagery.",
    samples: [
      {
        id: 7,
        before: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074",
        after: "https://images.unsplash.com/photo-1433477155337-9aea4e790195?q=80&w=2069",
        type: "photo",
        description: "Landscape photo with sky enhancement and color grading",
      },
      {
        id: 8,
        before: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
        after: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070",
        type: "photo",
        description: "Travel photo with dramatic lighting and color enhancement",
      },
    ],
    pricing: { sample: 18, full: "85-180" },
    priceRange: "$$",
    turnaround: "24-48 hours",
    awards: ["Landscape Photography Award", "Travel Photographer of the Year Finalist"],
    languages: ["English", "French"],
    portfolio: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074",
      "https://images.unsplash.com/photo-1433477155337-9aea4e790195?q=80&w=2069",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070",
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=2070",
    ],
    serviceTypes: ["basic", "advanced"],
  },
]

// Sample editing services
const editingServices = [
  {
    id: 1,
    title: "Basic Photo Retouching",
    description: "Color correction, exposure adjustment, and basic retouching",
    priceRange: "$25-50",
    deliveryTime: "24 hours",
    icon: <Filter className="h-6 w-6" />,
    type: "basic",
  },
  {
    id: 2,
    title: "Advanced Photo Editing",
    description: "Skin retouching, object removal, background replacement",
    priceRange: "$50-100",
    deliveryTime: "48 hours",
    icon: <ImageIcon className="h-6 w-6" />,
    type: "advanced",
  },
  {
    id: 3,
    title: "Video Editing (up to 5 min)",
    description: "Cutting, transitions, basic color grading, and audio adjustment",
    priceRange: "$100-250",
    deliveryTime: "3 days",
    icon: <Scissors className="h-6 w-6" />,
    type: "video",
  },
  {
    id: 4,
    title: "Professional Video Production",
    description: "Full video editing with effects, color grading, and sound design",
    priceRange: "$250-500",
    deliveryTime: "5 days",
    icon: <Video className="h-6 w-6" />,
    type: "professional",
  },
]

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "David Chen",
    role: "Wedding Photographer",
    comment:
      "The editing quality I received was exceptional. Alex transformed my raw photos into stunning masterpieces that my clients absolutely loved.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2187",
    rating: 5,
    editor: "Alex Morgan",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "E-commerce Business Owner",
    comment:
      "Sophia's product photo editing skills helped increase our conversion rate by 35%. The attention to detail and consistent quality is remarkable.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187",
    rating: 5,
    editor: "Sophia Chen",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Independent Filmmaker",
    comment:
      "Marcus took my amateur footage and transformed it into a professional-looking film. His color grading skills are on another level.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2187",
    rating: 4,
    editor: "Marcus Johnson",
  },
]

// FAQ data with categories
const faqCategories = [
  {
    id: "general",
    name: "General Questions",
    icon: <Search className="h-5 w-5" />,
    questions: [
      {
        question: "What file formats do you accept?",
        answer:
          "We accept most common formats including JPG, PNG, RAW, CR2, NEF for photos and MP4, MOV, AVI for videos. Maximum file size is 2GB per project.",
      },
      {
        question: "How long does editing take?",
        answer:
          "Turnaround times vary by editor and project complexity. Photo editing typically takes 24-48 hours, while video editing can take 3-7 days depending on length and requirements.",
      },
      {
        question: "What if I'm not satisfied with the edits?",
        answer:
          "All editors offer revision options. If you're not satisfied after revisions, we offer a money-back guarantee on full service projects.",
      },
    ],
  },
  {
    id: "pricing",
    name: "Pricing & Payment",
    icon: <DollarSign className="h-5 w-5" />,
    questions: [
      {
        question: "How does pricing work?",
        answer:
          "Pricing varies based on the complexity of the edit, the editor's experience level, and the number of files. Sample edits are available at a reduced cost so you can test an editor's style before committing to a full project.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards, PayPal, and bank transfers for larger projects. Payment is processed securely through our platform.",
      },
      {
        question: "Is there a refund policy?",
        answer:
          "Yes, we offer a satisfaction guarantee. If you're not happy with the final result after revision attempts, you can request a refund within 7 days of delivery.",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical Details",
    icon: <Zap className="h-5 w-5" />,
    questions: [
      {
        question: "How do sample edits work?",
        answer:
          "You pay a small fee for the editor to edit one photo or a short video clip. This gives you a preview of their style and quality before committing to a larger project.",
      },
      {
        question: "What editing software do your editors use?",
        answer:
          "Our editors use professional industry-standard software including Adobe Photoshop, Lightroom, Premiere Pro, After Effects, DaVinci Resolve, and Final Cut Pro depending on their specialization.",
      },
      {
        question: "Can I request specific editing styles?",
        answer:
          "You can provide reference images or videos, describe your desired style, or even request that the editor match your existing brand aesthetic.",
      },
    ],
  },
  {
    id: "delivery",
    name: "Delivery & Support",
    icon: <MessageCircle className="h-5 w-5" />,
    questions: [
      {
        question: "How will I receive my edited files?",
        answer:
          "All edited files are delivered through our secure platform. You'll receive a notification when your files are ready, and you can download them directly from your dashboard.",
      },
      {
        question: "What resolution will my edited photos be delivered in?",
        answer:
          "We deliver photos in the same resolution they were uploaded in. If you need specific dimensions or file formats, you can specify this in your project requirements.",
      },
      {
        question: "Is there customer support available?",
        answer:
          "Yes, our customer support team is available 24/7 to assist with any questions or concerns. You can reach us through live chat, email, or phone.",
      },
    ],
  },
]

// Before-After Slider Component
const BeforeAfterSlider = ({ before, after, description }) => {
  const [position, setPosition] = useState(50)

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <Image
          src={after || "/placeholder.svg"}
          alt="After editing"
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=500"
          }}
        />
      </div>
      <div className="absolute inset-0" style={{ width: `${position}%`, overflow: "hidden" }}>
        <Image
          src={before || "/placeholder.svg"}
          alt="Before editing"
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=500"
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute h-full w-1 bg-white" style={{ left: `${position}%` }} />
        <div
          className="absolute h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <ChevronRight className="h-4 w-4 -rotate-90" />
          <ChevronRight className="h-4 w-4 rotate-90" />
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Slider
          value={[position]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setPosition(value[0])}
          className="z-10"
        />
      </div>
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Before</div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">After</div>
      {description && (
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full mx-auto inline-block">
            {description}
          </div>
        </div>
      )}
    </div>
  )
}

// Video Sample Component
const VideoSample = ({ thumbnail, video, description }) => {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-lg group">
      <Image
        src={thumbnail || "/placeholder.svg"}
        alt="Video thumbnail"
        fill
        className="object-cover"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg?height=300&width=500"
        }}
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <Progress value={playing ? 45 : 0} className="h-1 w-full" />
        <div className="flex justify-between text-xs text-white mt-1">
          <span>{playing ? "00:45" : "00:00"}</span>
          <span>02:30</span>
        </div>
      </div>
      {description && (
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full mx-auto inline-block">
            {description}
          </div>
        </div>
      )}
      {playing && (
        <div className="absolute inset-0 bg-black/20">
          <iframe
            src={`${video}?autoplay=1&loop=1&background=1`}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  )
}

// Editor Card Component (similar to PhotographerCard in photoshoot page)
const EditorCard = ({ editor, onPortfolioClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative h-64">
        <Image
          src={editor.avatar || "/placeholder.svg"}
          alt={editor.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=300"
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{editor.name}</h3>
        <p className="text-blue-600 font-medium mb-4">{editor.specialty}</p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Price Range</h4>
          <div className="flex items-center">
            <span className="text-lg font-bold">{editor.priceRange}</span>
            <span className="ml-2 text-sm text-gray-500">Sample: ${editor.pricing.sample}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(editor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">{editor.rating}</span>
            <span className="ml-1 text-sm text-muted-foreground">({editor.reviews} reviews)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {editor.awards.map((award, index) => (
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

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">{editor.turnaround}</span>
          </div>
          <button
            onClick={() => onPortfolioClick(editor)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Portfolio
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Portfolio Modal Component (similar to PortfolioModal in photoshoot page)
const PortfolioModal = ({ editor, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(null)
  const [activeTab, setActiveTab] = useState("portfolio")

  if (!isOpen || !editor) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % editor.portfolio.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + editor.portfolio.length) % editor.portfolio.length)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-xl overflow-hidden max-w-7xl w-full max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 relative">
            <Image
              src={editor.portfolio[currentImageIndex] || "/placeholder.svg"}
              alt={`Portfolio ${currentImageIndex + 1}`}
              layout="responsive"
              width={16}
              height={9}
              objectFit="cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=600&width=800"
              }}
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
              {currentImageIndex + 1} / {editor.portfolio.length}
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[80vh] scrollbar-hide">
            <h2 className="text-3xl font-bold mb-4">{editor.name}</h2>
            <p className="text-blue-600 font-medium mb-4">{editor.specialty}</p>

            <div className="flex mb-6 border-b">
              <button
                className={`px-4 py-2 ${activeTab === "portfolio" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("portfolio")}
              >
                Portfolio
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "samples" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("samples")}
              >
                Before & After
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "about" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "booking" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("booking")}
              >
                Book
              </button>
            </div>

            <ScrollableDiv className="overflow-y-auto max-h-[calc(80vh-200px)]">
              {activeTab === "portfolio" && (
                <div className="grid grid-cols-2 gap-4">
                  {editor.portfolio.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Portfolio ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "samples" && (
                <div className="space-y-6">
                  {editor.samples.map((sample) => (
                    <div key={sample.id} className="space-y-2">
                      {sample.type === "photo" ? (
                        <BeforeAfterSlider
                          before={sample.before}
                          after={sample.after}
                          description={sample.description}
                        />
                      ) : (
                        <VideoSample
                          thumbnail={sample.thumbnail}
                          video={sample.video}
                          description={sample.description}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "about" && (
                <div className="space-y-4">
                  <p className="text-gray-600">{editor.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Turnaround Time</h4>
                      <p>{editor.turnaround}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Price Range</h4>
                      <p>${editor.pricing.full}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Sample Edit</h4>
                      <p>${editor.pricing.sample}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-1">Languages</h4>
                      <p>{editor.languages.join(", ")}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Awards & Recognition</h4>
                    <div className="flex flex-wrap gap-2">
                      {editor.awards.map((award, index) => (
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
                  {(editor.instagram_handle || editor.twitter_handle || editor.youtube_handle || editor.facebook_handle) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Social Media</h4>
                      <div className="flex gap-3">
                        {editor.instagram_handle && (
                          <a
                            href={`https://instagram.com/${editor.instagram_handle.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            {editor.instagram_handle}
                          </a>
                        )}
                        {editor.twitter_handle && (
                          <a
                            href={`https://twitter.com/${editor.twitter_handle.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                            {editor.twitter_handle}
                          </a>
                        )}
                        {editor.youtube_handle && (
                          <a
                            href={`https://youtube.com/${editor.youtube_handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            {editor.youtube_handle}
                          </a>
                        )}
                        {editor.facebook_handle && (
                          <a
                            href={`https://facebook.com/${editor.facebook_handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            {editor.facebook_handle}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "booking" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>Turnaround: {editor.turnaround}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span>Full Service: ${editor.pricing.full}</span>
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={() => setShowContactForm("sample")} className="flex-1" variant="outline">
                      Request Sample
                    </Button>
                    <Button onClick={() => setShowContactForm("book")} className="flex-1">
                      Book Now
                    </Button>
                  </div>
                  {showContactForm && (
                    <form className="space-y-4 mt-6">
                      <h3 className="text-xl font-semibold">
                        {showContactForm === "sample" ? "Request a Sample" : "Book Full Service"}
                      </h3>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Service Type</option>
                        <option value="photo">Photo Editing</option>
                        <option value="video">Video Editing</option>
                      </select>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, MP4 (max 100MB)</p>
                      </div>
                      <textarea
                        placeholder="Project Details"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      ></textarea>
                      <Button type="submit" className="w-full">
                        {showContactForm === "sample" ? "Request Sample" : "Submit Booking Request"}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </ScrollableDiv>
          </div>
        </div>
      </div>
    </div>
  )
}

// Advanced FAQ Section Component
const AdvancedFAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("general")
  const [openQuestion, setOpenQuestion] = useState(null)

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about our editing services and how we work
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="mr-3">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold flex items-center">
                    {faqCategories.find((c) => c.id === activeCategory)?.icon}
                    <span className="ml-2">{faqCategories.find((c) => c.id === activeCategory)?.name}</span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {faqCategories
                    .find((c) => c.id === activeCategory)
                    ?.questions.map((faq, index) => (
                      <div key={index} className="p-6">
                        <button
                          className="flex justify-between items-center w-full text-left"
                          onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                        >
                          <span className="text-lg font-medium">{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 transform transition-transform ${
                              openQuestion === index ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openQuestion === index && (
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonial Carousel Component
const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative bg-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="relative h-80">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <div className="relative mb-6">
                <Image
                  src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                  }}
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                  <ThumbsUp className="w-5 h-5 text-blue-500 fill-blue-500" />
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-xl font-medium mb-4 max-w-3xl">{testimonials[currentIndex].comment}</p>
              <p className="font-semibold">{testimonials[currentIndex].name}</p>
              <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
              <p className="text-sm text-blue-600 mt-1">Editor: {testimonials[currentIndex].editor}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Main Editors Page Component
export default function EditorsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedService, setSelectedService] = useState(null)
  const [selectedEditor, setSelectedEditor] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editors, setEditors] = useState(sampleEditors)
  const [loading, setLoading] = useState(true)

  const editorsRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  // Fetch editors data
  useEffect(() => {
    const fetchEditors = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/editors?limit=all&available=true')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            if (data.editors && data.editors.length > 0) {
              // Transform API data to match component expectations
              const transformedEditors = data.editors.map((editor, index) => ({
                id: editor.id || index + 1,
                name: editor.name,
                avatar: editor.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080",
                specialty: editor.specialties?.join(", ") || "Photo & Video Editing",
                rating: editor.rating,
                reviews: editor.reviews,
                description: editor.bio || "Professional editor with years of experience.",
                samples: [], // Will be populated from separate API
                pricing: { 
                  sample: parseFloat(editor.hourlyRate) || 15, 
                  full: editor.rate || "75-150" 
                },
                priceRange: "$$",
                turnaround: `${editor.turnaround} hours`,
                awards: [], // Will be populated from separate API
                languages: editor.languages || ["English"],
                portfolio: editor.portfolio || [],
                serviceTypes: editor.specialties?.includes("Video Editing") ? ["basic", "advanced"] : ["basic"],
                type: editor.type,
                location: editor.location,
                experience: editor.experience,
                isAvailable: editor.isAvailable
              }))
              setEditors(transformedEditors)
            } else {
              // No editors found, show sample data
              console.log("No editors found in database, showing sample data")
              setEditors(sampleEditors)
            }
          } else {
            setEditors(sampleEditors)
          }
        } else {
          setEditors(sampleEditors)
        }
      } catch (error) {
        console.error("Error fetching editors:", error)
        setEditors(sampleEditors)
      } finally {
        setLoading(false)
      }
    }

    fetchEditors()
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Filter editors based on active tab, selected service, search query, and availability
  const filteredEditors = editors.filter((editor) => {
    // Only show available editors
    if (!editor.isAvailable) return false

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "photo" && editor.specialty.toLowerCase().includes("video")) return false
      if (activeTab === "video" && !editor.specialty.toLowerCase().includes("video")) return false
    }

    // Filter by selected service
    if (selectedService && !editor.serviceTypes.includes(selectedService)) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        editor.name.toLowerCase().includes(query) ||
        editor.specialty.toLowerCase().includes(query) ||
        editor.description.toLowerCase().includes(query)
      )
    }

    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading editors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden rounded-b-3xl shadow-2xl mb-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2076')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-black/40"></div> {/* Light dark overlay for text readability */}
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Photo & Video Editing Services</h1>
            <p className="text-xl opacity-90 mb-8">
              Transform your raw footage into stunning visuals with our network of professional editors. Get sample
              edits before committing to full projects.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-white/90 shadow-lg"
                onClick={() => scrollToSection(editorsRef)}
              >
                Find an Editor
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => scrollToSection(howItWorksRef)}
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Editing Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {editingServices.map((service) => (
            <Card
              key={service.id}
              className={`overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                selectedService === service.type ? "ring-2 ring-blue-600 shadow-lg" : ""
              }`}
              onClick={() => setSelectedService(selectedService === service.type ? null : service.type)}
            >
              <CardHeader className="pb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  {service.icon}
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="font-normal">
                    {service.deliveryTime}
                  </Badge>
                  <span className="font-bold text-lg">{service.priceRange}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${selectedService === service.type ? "bg-blue-700" : ""}`}
                  variant={selectedService === service.type ? "default" : "outline"}
                >
                  {selectedService === service.type ? "Selected" : "Select Service"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12" ref={editorsRef}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold">Our Professional Editors</h2>
            <p className="text-muted-foreground mt-2">Browse our curated selection of expert photo and video editors</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search editors..."
                className="pl-10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Editors</TabsTrigger>
                <TabsTrigger value="photo">Photo Editing</TabsTrigger>
                <TabsTrigger value="video">Video Editing</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredEditors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredEditors.map((editor) => (
              <EditorCard key={editor.id} editor={editor} onPortfolioClick={setSelectedEditor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No editors found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <Button
              onClick={() => {
                setActiveTab("all")
                setSelectedService(null)
                setSearchQuery("")
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* FAQ Section */}
      <AdvancedFAQSection />

      {/* How It Works Section */}
      <div className="bg-white py-16" ref={howItWorksRef}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Upload Your Files</h3>
              <p className="text-muted-foreground">
                Upload your photos or videos and describe your editing requirements
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Get a Sample Edit</h3>
              <p className="text-muted-foreground">
                Pay a small fee to see a sample of your edited work before committing
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Receive Final Edits</h3>
              <p className="text-muted-foreground">
                Approve the work, make payment, and download your professionally edited files
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 py-16">
        <div className="container mx-auto px-4 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Photos & Videos?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have elevated their visual content with our professional editing
            services.
          </p>
          <Button size="lg" className="bg-white text-blue-900 hover:bg-white/90">
            Get Started Today
          </Button>
        </div>
      </div>

      {/* Portfolio Modal */}
      <PortfolioModal editor={selectedEditor} isOpen={!!selectedEditor} onClose={() => setSelectedEditor(null)} />
    </div>
  )
}
