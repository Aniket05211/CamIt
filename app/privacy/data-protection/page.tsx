"use client"

import { motion } from "framer-motion"
import { Shield, Lock, RefreshCw, Server } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DataProtection() {
  const protectionMeasures = [
    {
      title: "Encryption",
      description: "We use industry-standard encryption to protect your data in transit and at rest.",
      icon: Lock,
    },
    {
      title: "Regular Security Audits",
      description: "We conduct frequent security audits to identify and address potential vulnerabilities.",
      icon: RefreshCw,
    },
    {
      title: "Secure Data Centers",
      description: "Your data is stored in highly secure, state-of-the-art data centers.",
      icon: Server,
    },
    {
      title: "Access Controls",
      description: "We implement strict access controls to ensure only authorized personnel can access your data.",
      icon: Shield,
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
          How We Protect Your Data
        </motion.h1>

        <p className="text-xl text-gray-600 mb-12">
          At CamIt, we take the security and privacy of your data seriously. Here are some of the measures we take to
          ensure your information is protected:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {protectionMeasures.map((measure, index) => (
            <motion.div
              key={measure.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <measure.icon className="w-8 h-8 text-purple-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{measure.title}</h3>
                      <p className="text-gray-600">{measure.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h2>
          <p className="mb-6">
            We are committed to maintaining the trust and confidence of our users. If you have any questions or concerns
            about how we protect your data, please don't hesitate to contact our privacy team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-purple-600 transition-colors duration-200"
          >
            Contact Privacy Team
          </a>
        </section>
      </main>
    </div>
  )
}
