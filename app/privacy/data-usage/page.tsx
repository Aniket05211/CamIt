"use client"

import { motion } from "framer-motion"
import { Zap, Target, Shield, MessageCircle, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DataUsage() {
  const usagePurposes = [
    {
      title: "Service Improvement",
      description: "We analyze usage patterns to enhance our platform's functionality and user experience.",
      icon: Zap,
    },
    {
      title: "Personalization",
      description: "We use your preferences and behavior to tailor our services to your needs.",
      icon: Target,
    },
    {
      title: "Security",
      description: "Your data helps us detect and prevent fraud and ensure platform security.",
      icon: Shield,
    },
    {
      title: "Communication",
      description: "We use your contact information to send important updates and respond to inquiries.",
      icon: MessageCircle,
    },
    {
      title: "Analytics",
      description: "We analyze aggregated data to understand trends and improve our business strategies.",
      icon: TrendingUp,
    },
    {
      title: "Community Building",
      description: "We use data to foster connections between photographers and clients.",
      icon: Users,
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
          How We Use Your Data
        </motion.h1>

        <p className="text-xl text-gray-600 mb-12">
          At CamIt, we use your data responsibly to provide and improve our services. Here's an overview of how we
          utilize the information we collect:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {usagePurposes.map((purpose, index) => (
            <motion.div
              key={purpose.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <purpose.icon className="w-8 h-8 text-purple-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{purpose.title}</h3>
                      <p className="text-gray-600">{purpose.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Your Data, Your Control</h2>
          <p className="mb-6">
            We believe in transparency and giving you control over your data. You can always review and adjust your
            privacy settings or request information about your data usage.
          </p>
          <a
            href="/privacy/choices"
            className="inline-flex items-center px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-purple-600 transition-colors duration-200"
          >
            Manage Your Choices
          </a>
        </section>
      </main>
    </div>
  )
}
