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
} from "lucide-react"
import { useRouter } from "next/navigation"

const photographers = [
  {
    id: 1,
    name: "John Smith",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    specialization: "Fashion & Portrait",
    awards: ["International Photography Award 2023", "Fashion Photographer of the Year"],
    celebrities: ["Emma Watson", "Tom Hardy", "Zendaya"],
    portfolio: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "https://images.unsplash.com/photo-1521577352947-9bb58764b69a",
      "https://images.unsplash.com/photo-1488161628813-04466f872be2",
      "https://images.unsplash.com/photo-1492288991661-058aa541ff43",
      "https://images.unsplash.com/photo-1502324166188-b4fe5151460b",
    ],
    social: {
      instagram: "@johnsmith",
      twitter: "@johnsmith_photo",
      facebook: "johnsmithphoto",
    },
    bio: "With over 15 years of experience in fashion and portrait photography, John Smith has established himself as a leading figure in the industry. His unique vision and ability to capture the essence of his subjects have earned him numerous accolades and a loyal celebrity clientele.",
    experience: "15+ years",
    rate: "$500/hour",
    equipment: "Canon EOS R5, Various L-series lenses, Profoto lighting",
    location: "New York, NY",
    availability: ["Monday", "Wednesday", "Friday"],
    languages: ["English", "Spanish"],
  },
  {
    id: 2,
    name: "Emily Chen",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    specialization: "Landscape & Nature",
    awards: ["National Geographic Photographer of the Year", "Fine Art Photography Awards Winner"],
    celebrities: ["David Attenborough", "Leonardo DiCaprio"],
    portfolio: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
      "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    ],
    social: {
      instagram: "@emilychen_nature",
      twitter: "@emilychenphotos",
      facebook: "emilychenphotography",
    },
    bio: "Emily Chen is a renowned landscape and nature photographer, known for her breathtaking captures of the world's most beautiful natural wonders. Her work has been featured in National Geographic and numerous international exhibitions.",
    experience: "12 years",
    rate: "$600/hour",
    equipment: "Nikon Z9, Wide-angle and telephoto lenses, DJI Mavic 3 Pro",
    location: "Los Angeles, CA",
    availability: ["Tuesday", "Thursday", "Saturday"],
    languages: ["English", "Mandarin"],
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    specialization: "Sports & Action",
    awards: ["Sports Photographer of the Year", "Olympic Committee Excellence in Photography"],
    celebrities: ["Usain Bolt", "Serena Williams", "Cristiano Ronaldo"],
    portfolio: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a26",
      "https://images.unsplash.com/photo-1560089000-7433a4ebbd64",
      "https://images.unsplash.com/photo-1565992441121-4367c2967103",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    ],
    social: {
      instagram: "@marcusrodriguez_sports",
      twitter: "@mrodriguezsports",
      facebook: "marcusrodriguezsportsphotography",
    },
    bio: "Marcus Rodriguez is an award-winning sports photographer who has covered major sporting events worldwide, including the Olympics, World Cup, and NBA Finals. His dynamic action shots have graced the covers of Sports Illustrated and ESPN Magazine.",
    experience: "18 years",
    rate: "$800/hour",
    equipment: "Sony Alpha 1, 400mm f/2.8 GM lens, Underwater housing for aquatic sports",
    location: "London, UK",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    languages: ["English", "Portuguese"],
  },
]

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

const PhotographerCard = ({ photographer, onPortfolioClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative h-64">
        <Image
          src={photographer.image || "/placeholder.svg"}
          alt={photographer.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{photographer.name}</h3>
        <p className="text-purple-600 font-medium mb-4">{photographer.specialization}</p>

        <div className="mb-4">
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

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Celebrity Clients</h4>
          <div className="flex flex-wrap gap-2">
            {photographer.celebrities.map((celeb, index) => (
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
            <a
              href={`https://instagram.com/${photographer.social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5 text-gray-600 hover:text-pink-600" />
            </a>
            <a href={`https://twitter.com/${photographer.social.twitter}`} target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-400" />
            </a>
            <a href={`https://facebook.com/${photographer.social.facebook}`} target="_blank" rel="noopener noreferrer">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600" />
            </a>
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

interface Photographer {
  id: number
  name: string
  image: string
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
}

const PortfolioModal: React.FC<{ photographer: Photographer | null; isOpen: boolean; onClose: () => void }> = ({
  photographer,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [activeTab, setActiveTab] = useState<"portfolio" | "about" | "booking">("portfolio")

  if (!isOpen || !photographer) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photographer.portfolio.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photographer.portfolio.length) % photographer.portfolio.length)
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
          <div className="w-full md:w-1/2 p-8 overflow-y-auto">
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
                    className="relative aspect-square cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => setCurrentImageIndex(index)}
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
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {showContactForm ? "Hide Booking Form" : "Book Now"}
                </button>
                {showContactForm && (
                  <form className="space-y-4">
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
                    <input
                      type="date"
                      placeholder="Preferred Date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <textarea
                      placeholder="Additional Details"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Submit Booking Request
                    </button>
                  </form>
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
  const [openIndex, setOpenIndex] = useState(null)

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
  const [selectedPhotographer, setSelectedPhotographer] = useState(null)
  const [isRegisteredCameraman, setIsRegisteredCameraman] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real application, you would check this with your backend
    const isRegistered = localStorage.getItem("isRegisteredCameraman") === "true"
    setIsRegisteredCameraman(isRegistered)
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
          {photographers.map((photographer) => (
            <PhotographerCard
              key={photographer.id}
              photographer={photographer}
              onPortfolioClick={setSelectedPhotographer}
            />
          ))}
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
