"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Video, Users, Heart, Plane, Building2, ChevronRight, Star } from "lucide-react"
import { useInView } from "react-intersection-observer"

const services = [
  {
    icon: Camera,
    title: "Event Photography",
    description: "Professional photography for all types of events",
    link: "/book-event",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3",
  },
  {
    icon: Video,
    title: "Videography",
    description: "High-quality video production services",
    link: "/book-event",
    image:
      "https://images.unsplash.com/photo-1579965342575-16428a7c8881?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
  },
  {
    icon: Heart,
    title: "Wedding Photography",
    description: "Capture your special day with our expert photographers",
    link: "/book-wedding",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3",
  },
  {
    icon: Plane,
    title: "Travel Photography",
    description: "Document your journey with a professional photographer",
    link: "/book-trip",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2021&ixlib=rb-4.0.3",
  },
  {
    icon: Building2,
    title: "Corporate Photography",
    description: "Professional photography for your business needs",
    link: "/business",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
  },
  {
    icon: Users,
    title: "Portrait Photography",
    description: "Professional portraits for individuals and groups",
    link: "/book-event",
    image:
      "https://images.unsplash.com/photo-1603574670812-d24560880210?auto=format&fit=crop&q=80&w=1780&ixlib=rb-4.0.3",
  },
]

const testimonials = [
  {
    name: "Emily Johnson",
    role: "Bride",
    comment: "CamIt made our wedding day even more special. The photos are absolutely stunning!",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1887&ixlib=rb-4.0.3",
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    comment: "The corporate event photos were delivered promptly and exceeded our expectations.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1887&ixlib=rb-4.0.3",
  },
  {
    name: "Sarah Thompson",
    role: "Travel Blogger",
    comment: "Having a CamIt photographer during my travels added a whole new dimension to my content.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
  },
]

const ServiceCard = ({ service, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-64 w-full">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-50" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <service.icon className="h-8 w-8 mb-2" />
        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
        <p className="text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {service.description}
        </p>
        <Link href={service.link} className="inline-flex items-center text-sm font-semibold hover:underline">
          Learn more <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  )
}

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <Image
        src={testimonial.avatar || "/placeholder.svg"}
        alt={testimonial.name}
        width={50}
        height={50}
        className="rounded-full mr-4"
      />
      <div>
        <h4 className="font-semibold">{testimonial.name}</h4>
        <p className="text-sm text-gray-600">{testimonial.role}</p>
      </div>
    </div>
    <p className="text-gray-700">{testimonial.comment}</p>
    <div className="flex mt-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
      ))}
    </div>
  </div>
)

export default function Services() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
          alt="Photography Services"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
          >
            Explore our range of professional photography and videography services
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="relative h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <TestimonialCard testimonial={testimonials[currentTestimonial]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Capture Your Moments?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let our professional photographers help you create lasting memories.
          </p>
          <Link
            href="/book-event"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "How far in advance should I book a photographer?",
                answer:
                  "We recommend booking at least 2-4 weeks in advance for most events. For weddings and large events, 3-6 months ahead is ideal to ensure availability.",
              },
              {
                question: "What equipment do your photographers use?",
                answer:
                  "Our photographers use professional-grade DSLR and mirrorless cameras, along with a variety of high-quality lenses suitable for different types of photography.",
              },
              {
                question: "How long does it take to receive the photos?",
                answer:
                  "Turnaround time varies depending on the type and size of the event. Generally, you can expect to receive your edited photos within 2-3 weeks after the event.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4">
                    <span>{faq.question}</span>
                    <ChevronRight className="h-5 w-5 text-gray-500 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-gray-600">{faq.answer}</p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
