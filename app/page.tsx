"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Camera,
  Search,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  Plane,
  Heart,
  Users,
} from "lucide-react"

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "Can I book multiple cameramen for my event?",
      answer:
        "Yes, you can book multiple cameramen for your event. This is especially useful for large events like weddings or corporate conferences where you need coverage from different angles.",
    },
    {
      question: "How far in advance should I book a cameraman?",
      answer:
        "We recommend booking at least 2-4 weeks in advance to ensure availability. For special events like weddings, we suggest booking 3-6 months ahead.",
    },
    {
      question: "What happens if I need to cancel my booking?",
      answer:
        "You can cancel your booking up to 48 hours before the scheduled time for a full refund. Cancellations within 48 hours may be subject to a cancellation fee.",
    },
    {
      question: "Can I request specific equipment or shooting styles?",
      answer:
        "Yes, you can discuss your specific requirements with the cameraman before booking. Many of our professionals have various equipment options and can adapt to different shooting styles.",
    },
    {
      question: "Is there a minimum booking duration?",
      answer:
        "Most cameramen have a minimum booking duration of 2 hours. However, this can vary depending on the type of event and the professional's own policies.",
    },
  ]

  const carouselImages = [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      alt: "Wedding photography",
    },
    {
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      alt: "Corporate event videography",
    },
    {
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      alt: "Music video production",
    },
    {
      src: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3",
      alt: "Documentary filming",
    },
    {
      src: "https://images.unsplash.com/photo-1554941829-202a0b2403b8?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      alt: "Fashion photography",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [carouselImages.length])



  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <header className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.pinimg.com/236x/75/6e/c0/756ec09c21fc03ef7177cb8501283754.jpg"
            alt="Background"
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Find Your Perfect <span className="text-blue-500">Cameraman</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl">
              Book skilled cameramen in your area for your photography needs.
            </p>
            <div className="mt-10">
              <Link
                href="/search"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-black bg-white hover:bg-gray-100 transition-colors duration-300"
              >
                Find a Cameraman
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="relative h-96 overflow-hidden rounded-2xl shadow-xl">
            {carouselImages.map((image, index) => (
              <motion.div
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
              </motion.div>
            ))}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Search",
                description: "Find cameramen in your area based on your specific needs.",
              },
              { icon: Camera, title: "Book", description: "Choose the perfect cameraman and book their services." },
              {
                icon: Star,
                title: "Review",
                description: "Share your experience and help others find great cameramen.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <Link
                  href={step.title === "Search" ? "/search" : step.title === "Book" ? "/book-trip" : "/write-review"}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {step.title === "Search" ? "Search Now" : step.title === "Book" ? "Book Now" : "Write a Review"}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Book for Your Specific Needs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Calendar,
                  title: "Book for Event",
                  description: "Find the perfect cameraman for your special event.",
                },
                {
                  icon: Plane,
                  title: "Book for Trip",
                  description: "Capture your travel memories with a professional cameraman.",
                },
                {
                  icon: Heart,
                  title: "Book for Wedding",
                  description: "Preserve your wedding memories with expert photography.",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-6">
                    <service.icon className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Link
                      href={`/book-${service.title.split(" ")[2].toLowerCase()}`}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Learn More <ArrowRight className="inline-block ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-12">Do more in the app</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link
                href="#"
                className="group relative bg-white rounded-lg border p-6 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      alt="QR Code"
                      width={128}
                      height={128}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Download the CamIt app</h3>
                    <p className="text-gray-600 mt-1">Scan to download</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </Link>

              <Link
                href="/signup"
                className="group relative bg-white rounded-lg border p-6 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Camera className="w-16 h-16 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Sign up to book</h3>
                    <p className="text-gray-600 mt-1">Get started with CamIt</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
              Why use the CamIt app?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking</h3>
                <p className="text-gray-600">Book professional cameramen with just a few taps on your phone.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600">
                  Get instant notifications about your booking status and cameraman location.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Offers</h3>
                <p className="text-gray-600">
                  Get access to special discounts and promotional offers only available in the app.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button className="w-full text-left p-6 focus:outline-none" onClick={() => toggleFaq(index)}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Event Statistics */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Event Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Calendar, label: "Events Organized", value: "500+" },
                { icon: Users, label: "Total Attendees", value: "1M+" },
                { icon: Camera, label: "Photos Taken", value: "10M+" },
                { icon: Star, label: "Average Rating", value: "4.9" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-xl font-semibold mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold mb-4">Ready to Book Your Cameraman?</h2>
            <p className="text-xl mb-8">Let's capture your moments together.</p>
            <Link
              href="/search"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-black bg-white hover:bg-gray-100 transition-colors duration-300"
            >
              Find a Cameraman Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
