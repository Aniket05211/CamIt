"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Eye, Share2, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function PrivacyChoices() {
  const [notifications, setNotifications] = useState(true)
  const [dataSharing, setDataSharing] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState(true)

  const handleDeleteAccount = () => {
    // Implement account deletion logic
    console.log("Account deletion requested")
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
          Your Privacy Choices
        </motion.h1>

        <p className="text-xl text-gray-600 mb-12">
          Manage your privacy settings and control how your data is used on CamIt.
        </p>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bell className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <p className="text-gray-600">Receive updates about new features and promotions</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Share2 className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Data Sharing</h3>
                    <p className="text-gray-600">Allow us to share your data with trusted partners</p>
                  </div>
                </div>
                <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Eye className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Profile Visibility</h3>
                    <p className="text-gray-600">Make your profile visible to other users</p>
                  </div>
                </div>
                <Switch checked={profileVisibility} onCheckedChange={setProfileVisibility} />
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Actions</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Trash2 className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                    <p className="text-gray-600">Permanently remove your account and all associated data</p>
                  </div>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
          <p className="mb-6">
            If you have any questions about your privacy choices or how we handle your data, please don't hesitate to
            contact us.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-white rounded-full text-white hover:bg-white hover:text-purple-600 transition-colors duration-200"
          >
            Contact Support
          </a>
        </section>
      </main>
    </div>
  )
}
