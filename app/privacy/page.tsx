"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, User, FileText, Download, Settings, ChevronRight, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Privacy() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const privacyCards = [
    {
      title: "Your Data Rights",
      description: "Control how your information is used",
      icon: User,
      action: "Manage",
      href: "/privacy/data-rights",
    },
    {
      title: "Data Protection",
      description: "How we keep your information secure",
      icon: Lock,
      action: "Learn More",
      href: "/privacy/data-protection",
    },
    {
      title: "Download Your Data",
      description: "Get a copy of your personal information",
      icon: Download,
      action: "Request",
      href: "/privacy/data-request",
    },
  ]

  const privacyTopics = [
    {
      title: "Information We Collect",
      description: "Learn about the data we gather and why",
      icon: FileText,
      href: "/privacy/data-collection",
    },
    {
      title: "Data Usage",
      description: "How we use your information",
      icon: Settings,
      href: "/privacy/data-usage",
    },
    {
      title: "Your Choices",
      description: "Control your privacy preferences",
      icon: Shield,
      href: "/privacy/choices",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Take control of your privacy and learn how we protect it.
          </motion.p>
        </div>

        {/* Privacy Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Your Privacy Controls</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {privacyCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-32 mb-4 relative">
                      <card.icon className="w-12 h-12 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <Link
                      href={card.href}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {card.action}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Privacy Topics Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Learn More About Privacy</h2>
          <div className="space-y-4">
            {privacyTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={topic.href}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <topic.icon className="h-6 w-6 text-purple-600" />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{topic.title}</h3>
                            <p className="text-gray-600">{topic.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="mb-6">Contact our privacy team for assistance with your privacy concerns.</p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              Contact Us
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
