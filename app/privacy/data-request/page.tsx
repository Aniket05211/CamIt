"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DataRequest() {
  const [requestSubmitted, setRequestSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the request to your backend
    setRequestSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Request Your Data
        </motion.h1>

        <Card>
          <CardContent className="p-6">
            {!requestSubmitted ? (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-600 mb-6">
                  You can request a copy of your personal data that we have stored. This process may take up to 30 days
                  to complete.
                </p>
                <Button type="submit" className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Request Data Download
                </Button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Request Submitted</h2>
                  <p className="text-gray-600">
                    We've received your request for data download. We'll process your request and send you an email with
                    further instructions within 30 days.
                  </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What's included in your data?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Profile information</li>
            <li>Photos you've uploaded</li>
            <li>Booking history</li>
            <li>Reviews and ratings</li>
            <li>Messages with photographers or clients</li>
            <li>Payment information (last 4 digits only)</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
