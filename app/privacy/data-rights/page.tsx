"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, Trash2, Download, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function DataRights() {
  const [marketingConsent, setMarketingConsent] = useState(true)
  const [dataSharing, setDataSharing] = useState(true)

  const dataRightsOptions = [
    {
      title: "View Your Data",
      description: "See what information we have about you",
      icon: Eye,
      href: "/privacy/view-data",
    },
    {
      title: "Download Your Data",
      description: "Get a copy of your personal information",
      icon: Download,
      href: "/privacy/data-request",
    },
    {
      title: "Delete Your Data",
      description: "Request deletion of your account and data",
      icon: Trash2,
      href: "/privacy/delete-account",
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
          Manage Your Data Rights
        </motion.h1>

        <section className="mb-12">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Marketing Communications</h3>
                  <p className="text-gray-600">Receive updates about our services and promotions</p>
                </div>
                <Switch checked={marketingConsent} onCheckedChange={setMarketingConsent} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Data Sharing</h3>
                  <p className="text-gray-600">Allow us to share your data with trusted partners</p>
                </div>
                <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Data Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {dataRightsOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={option.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="h-12 mb-4">
                        <option.icon className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                      <p className="text-gray-600 mb-4">{option.description}</p>
                      <div className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
                        Learn more
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
