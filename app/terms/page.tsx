"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Book, HelpCircle, ChevronRight, ChevronDown, ChevronUp, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const TermsSection = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200">
      <button className="w-full py-4 flex items-center justify-between text-left" onClick={onToggle}>
        <span className="text-lg font-medium text-gray-900">{title}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-4"
        >
          <div className="prose prose-sm max-w-none text-gray-600">{content}</div>
        </motion.div>
      )}
    </div>
  )
}

export default function Terms() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      id: "overview",
      title: "Overview",
      content: (
        <>
          <p>
            Welcome to CamIt. By using our services, you agree to these terms, our Privacy Policy, and our Community
            Guidelines.
          </p>
          <p className="mt-4">
            These terms outline your rights and responsibilities when using CamIt's platform to connect with
            photographers or offer your services as a photographer.
          </p>
        </>
      ),
    },
    {
      id: "photographer",
      title: "Photographer Terms",
      content: (
        <>
          <p>As a photographer on CamIt, you agree to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Maintain professional standards and quality of service</li>
            <li>Arrive on time for scheduled bookings</li>
            <li>Provide the agreed-upon deliverables within specified timeframes</li>
            <li>Maintain appropriate insurance coverage</li>
            <li>Follow our community guidelines and ethical standards</li>
          </ul>
        </>
      ),
    },
    {
      id: "client",
      title: "Client Terms",
      content: (
        <>
          <p>As a client using CamIt, you agree to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Provide accurate booking information</li>
            <li>Show up for scheduled sessions on time</li>
            <li>Pay for services as agreed</li>
            <li>Respect photographers' intellectual property rights</li>
            <li>Follow cancellation and rescheduling policies</li>
          </ul>
        </>
      ),
    },
    {
      id: "payments",
      title: "Payments and Fees",
      content: (
        <>
          <p>Payment terms include:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Secure payment processing through our platform</li>
            <li>Clear breakdown of service fees and charges</li>
            <li>Refund policies for cancellations</li>
            <li>Payment protection for both parties</li>
          </ul>
        </>
      ),
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      content: (
        <>
          <p>Our intellectual property terms cover:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Photographer's rights to their work</li>
            <li>Usage rights for clients</li>
            <li>Platform content ownership</li>
            <li>Licensing agreements</li>
          </ul>
        </>
      ),
    },
  ]

  const quickLinks = [
    {
      title: "Privacy Policy",
      description: "Learn how we handle your data",
      icon: Shield,
      href: "/privacy",
    },
    {
      title: "Community Guidelines",
      description: "Understanding our standards",
      icon: Book,
      href: "/help",
    },
    {
      title: "Help Center",
      description: "Get support when you need it",
      icon: HelpCircle,
      href: "/help",
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
            Terms of Service
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Last updated: {new Date().toLocaleDateString()}
          </motion.p>
        </div>

        {/* Quick Links */}
        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={link.href}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <link.icon className="h-6 w-6 text-purple-600" />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{link.title}</h3>
                            <p className="text-gray-600">{link.description}</p>
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

        {/* Terms Sections */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {sections.map((section) => (
              <TermsSection
                key={section.id}
                title={section.title}
                content={section.content}
                isOpen={openSection === section.id}
                onToggle={() => toggleSection(section.id)}
              />
            ))}
          </div>
        </section>

        {/* Accept Terms Button */}
        <div className="mt-12 text-center">
          <Link
            href="/search"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
          >
            <Check className="w-5 h-5 mr-2" />
            Accept Terms and Continue
          </Link>
        </div>
      </main>
    </div>
  )
}
