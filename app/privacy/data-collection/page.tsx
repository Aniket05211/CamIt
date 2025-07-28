"use client"

import { motion } from "framer-motion"
import { User, Calendar, MessageSquare, CreditCard, MapPin, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DataCollection() {
  const dataTypes = [
    {
      title: "Profile Information",
      description: "Name, email, phone number, profile picture",
      icon: User,
    },
    {
      title: "Booking Details",
      description: "Date, time, location, and type of photography session",
      icon: Calendar,
    },
    {
      title: "Communication Data",
      description: "Messages between you and photographers or clients",
      icon: MessageSquare,
    },
    {
      title: "Payment Information",
      description: "Payment method details (stored securely by our payment processor)",
      icon: CreditCard,
    },
    {
      title: "Location Data",
      description: "Approximate location for nearby photographer searches",
      icon: MapPin,
    },
    {
      title: "Photos",
      description: "Images uploaded or shared through our platform",
      icon: Camera,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Information We Collect
        </motion.h1>

        <p className="text-xl text-gray-600 mb-12">
          To provide and improve our services, we collect various types of information. Here's an overview of the data
          we gather:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {dataTypes.map((dataType, index) => (
            <motion.div
              key={dataType.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <dataType.icon className="w-8 h-8 text-purple-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{dataType.title}</h3>
                      <p className="text-gray-600">{dataType.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white p-8">
          <h2 className="text-2xl font-bold mb-4">How We Use This Information</h2>
          <p className="mb-6">
            We use the collected information to provide, improve, and personalize our services, process transactions,
            communicate with you, and ensure the security of our platform. For more details on how we use your data,
            please refer to our full Privacy Policy.
          </p>
          <a
            href="/privacy"
            className="inline-flex items-center px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-purple-600 transition-colors duration-200"
          >
            View Full Privacy Policy
          </a>
        </section>
      </main>
    </div>
  )
}
