"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Camera, Users, Star, DollarSign, Zap, Globe } from "lucide-react"

const stats = [
  { icon: Camera, label: "Events Captured", value: "10,000+" },
  { icon: Users, label: "Happy Clients", value: "50,000+" },
  { icon: Star, label: "Average Rating", value: "4.9" },
  { icon: DollarSign, label: "Revenue Generated", value: "$10M+" },
]

const values = [
  { icon: Camera, title: "Quality", description: "We deliver exceptional photography that exceeds expectations." },
  { icon: Zap, title: "Innovation", description: "We embrace cutting-edge technology to stay ahead in the industry." },
  { icon: Users, title: "Customer-Centric", description: "Our clients are at the heart of everything we do." },
  { icon: Globe, title: "Global Reach", description: "We connect talented photographers with clients worldwide." },
]

const teamMembers = [
  { name: "John Doe", role: "Founder & CEO", image: "https://source.unsplash.com/random/200x200?face,1" },
  { name: "Jane Smith", role: "CTO", image: "https://source.unsplash.com/random/200x200?face,2" },
  { name: "Mike Johnson", role: "Head of Operations", image: "https://source.unsplash.com/random/200x200?face,3" },
  { name: "Sarah Brown", role: "Lead Designer", image: "https://source.unsplash.com/random/200x200?face,4" },
]

export default function AboutUs() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % values.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
          alt="CamIt Team"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">About CamIt</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Connecting talented photographers with clients worldwide to capture life's most precious moments.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              CamIt was born out of a passion for photography and a vision to revolutionize how people connect with
              professional photographers. Founded in 2015, we've grown from a small startup to a global platform,
              serving clients and photographers across the world.
            </p>
            <p className="text-lg text-gray-600">
              Our mission is to make professional photography accessible to everyone while providing photographers with
              opportunities to showcase their talent and grow their careers.
            </p>
          </div>
          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1551651653-c5186a1fbba2?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
              alt="CamIt Journey"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">CamIt by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
        <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === activeIndex ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <value.icon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join the CamIt Community</h2>
          <p className="text-xl mb-8">
            Whether you're a photographer looking to grow your career or a client seeking professional photography
            services, CamIt is here for you.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/become-cameraman"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Become a Photographer
            </Link>
            <Link
              href="/search"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Find a Photographer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
