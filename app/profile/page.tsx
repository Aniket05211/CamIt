"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { User, Camera, Settings, Shield, Bell, Upload, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone_number?: string
  avatar?: string
  bio?: string
  location?: string
  user_type: string
  is_verified: boolean
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    bio: "",
    location: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    darkMode: false,
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)

      // Get user from localStorage
      const storedUser = localStorage.getItem("camit_user")
      if (!storedUser) {
        toast({
          title: "Error",
          description: "Please log in to view your profile.",
          variant: "destructive",
        })
        return
      }

      const userData = JSON.parse(storedUser)

      // Try to get additional profile data from API
      try {
        const response = await fetch(`/api/profile`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.user) {
            setUser(result.user)
            setFormData({
              full_name: result.user.full_name || "",
              phone_number: result.user.phone_number || "",
              bio: result.user.bio || "",
              location: result.user.location || "",
            })
            if (result.user.avatar) {
              setPreviewUrl(result.user.avatar)
            }
            return
          }
        }
      } catch (apiError) {
        console.log("API not available, using localStorage data")
      }

      // Fallback to localStorage data
      setUser({
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name || "",
        phone_number: userData.phone_number || "",
        user_type: userData.user_type || "client",
        is_verified: userData.is_verified || false,
        avatar: userData.avatar,
        bio: userData.bio || "",
        location: userData.location || "",
      })

      setFormData({
        full_name: userData.full_name || "",
        phone_number: userData.phone_number || "",
        bio: userData.bio || "",
        location: userData.location || "",
      })

      if (userData.avatar) {
        setPreviewUrl(userData.avatar)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoUpload = async () => {
    if (!selectedFile || !previewUrl) return

    try {
      setUploadingPhoto(true)

      // Save to localStorage and update user state
      const updatedUser = { ...user, avatar: previewUrl }
      setUser(updatedUser as UserProfile)

      // Update localStorage
      const storedUser = localStorage.getItem("camit_user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        userData.avatar = previewUrl
        localStorage.setItem("camit_user", JSON.stringify(userData))
      }

      // Try to save to API
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: previewUrl }),
        })

        if (response.ok) {
          console.log("Photo saved to API successfully")
        }
      } catch (apiError) {
        console.log("API not available, photo saved locally")
      }

      toast({
        title: "Success",
        description: "Profile photo updated successfully!",
      })

      setSelectedFile(null)
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)

      // Update user state
      const updatedUser = { ...user, ...formData } as UserProfile
      setUser(updatedUser)

      // Update localStorage
      const storedUser = localStorage.getItem("camit_user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        Object.assign(userData, formData)
        localStorage.setItem("camit_user", JSON.stringify(userData))
      }

      // Try to save to API
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          console.log("Profile saved to API successfully")
        }
      } catch (apiError) {
        console.log("API not available, profile saved locally")
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
            <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <User className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "personal"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Personal Info</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "security"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Security</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("preferences")}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "preferences"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Preferences</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "personal" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Profile Photo Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="h-5 w-5" />
                      <span>Profile Photo</span>
                    </CardTitle>
                    <CardDescription>Upload a professional photo to help others recognize you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={previewUrl || user.avatar} alt={user.full_name} />
                          <AvatarFallback className="text-2xl">{user.full_name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Camera className="h-6 w-6 text-white" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPhoto}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Photo
                          </Button>
                          {selectedFile && (
                            <Button
                              onClick={handlePhotoUpload}
                              disabled={uploadingPhoto}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                              {uploadingPhoto ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Save Photo
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={user.email} disabled className="bg-gray-50" />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                          id="phone_number"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Security Settings</span>
                    </CardTitle>
                    <CardDescription>Manage your account security and authentication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Account Status</h3>
                        <p className="text-sm text-gray-500">
                          {user.is_verified ? "Your account is verified" : "Account verification pending"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.is_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Enable Two-Factor Authentication
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                    <CardDescription>Choose how you want to be notified about updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive booking updates via email</p>
                        </div>
                        <Switch
                          checked={preferences.emailNotifications}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
                        </div>
                        <Switch
                          checked={preferences.smsNotifications}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, smsNotifications: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Marketing Emails</h3>
                          <p className="text-sm text-gray-500">Receive promotional content and offers</p>
                        </div>
                        <Switch
                          checked={preferences.marketingEmails}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, marketingEmails: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Dark Mode</h3>
                          <p className="text-sm text-gray-500">Use dark theme for the interface</p>
                        </div>
                        <Switch
                          checked={preferences.darkMode}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
