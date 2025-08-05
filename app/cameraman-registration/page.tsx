"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Upload, CheckCircle, Star, Clock, ChevronRight, ChevronLeft, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

type CameramanType = "elite" | "realtime" | null

const specialties = [
  "Portrait",
  "Landscape",
  "Wedding",
  "Event",
  "Fashion",
  "Sports",
  "Wildlife",
  "Macro",
  "Aerial",
  "Underwater",
]

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Chinese",
  "Japanese",
  "Arabic",
  "Hindi",
  "Portuguese",
]

interface CameramanData {
  type: CameramanType
  full_name: string
  email: string
  phone_number: string
  location: string
  experience_years: number
  hourly_rate: number
  daily_rate?: number
  specializations: string[]
  equipment: string[]
  bio: string
  languages: string[]
  availability: string[]
  awards?: string
  celebrity_clients?: string
  portfolio: File[]
  location_city?: string
  location_state?: string
  location_country?: string
}

const initialData: CameramanData = {
  type: null,
  full_name: "",
  email: "",
  phone_number: "",
  location: "",
  experience_years: 0,
  hourly_rate: 0,
  daily_rate: 0,
  specializations: [],
  equipment: [],
  bio: "",
  languages: [],
  availability: [],
  portfolio: [],
  location_city: "",
  location_state: "",
  location_country: "",
}

export default function CameramanRegistration() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<CameramanData>(initialData)
  const [isEditing, setIsEditing] = useState(false)

  const totalSteps = data.type === "elite" ? 8 : 7
  const progress = ((step + 1) / totalSteps) * 100

  const handleChange = (field: keyof CameramanData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      console.log("Submitting data:", data)
      
      // Create user first
      const userResponse = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          phone_number: data.phone_number,
          user_type: data.type === "elite" ? "elite" : "realtime",
        }),
      })

      if (!userResponse.ok) {
        throw new Error("Failed to create user")
      }

      const userResponseData = await userResponse.json()
      console.log("User created:", userResponseData)
      
      if (!userResponseData.success) {
        throw new Error(userResponseData.error || "Failed to create user")
      }
      
      const userData = userResponseData.data

      // Create photographer profile
      const profileResponse = await fetch("/api/photographer-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userData.id,
          experience_years: data.experience_years,
          hourly_rate: data.hourly_rate,
          daily_rate: data.daily_rate,
          bio: data.bio,
          specializations: data.specializations,
          equipment: data.equipment,
          location: data.location,
          location_city: data.location_city,
          location_state: data.location_state,
          location_country: data.location_country,
          languages: data.languages,
          availability: data.availability,
          awards: data.awards,
          celebrity_clients: data.celebrity_clients,
          photographer_type: data.type,
          is_available: true,
          rating: 0,
          total_reviews: 0,
        }),
      })

      if (!profileResponse.ok) {
        throw new Error("Failed to create photographer profile")
      }

      const profileResponseData = await profileResponse.json()
      console.log("Profile created:", profileResponseData)
      
      if (!profileResponseData.success) {
        throw new Error(profileResponseData.error || "Failed to create photographer profile")
      }
      
      const profileData = profileResponseData.data

      // Store user data in localStorage
      localStorage.setItem("camit_user", JSON.stringify({
        id: userData.id,
        email: userData.email,
        name: userData.full_name,
        user_type: userData.user_type,
      }))

      toast({
        title: "Registration Successful!",
        description: "Your profile has been created. Redirecting to dashboard...",
      })

      setTimeout(() => {
        router.push("/cameraman-dashboard")
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Cameraman Type</CardTitle>
              <CardDescription>Select the type of cameraman you want to register as.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleChange("type", "elite")}
                className={`w-full ${data.type === "elite" ? "bg-purple-600" : "bg-gray-200 text-gray-800"}`}
              >
                <Star className="w-6 h-6 mr-2" />
                Elite Cameraman
              </Button>
              <Button
                onClick={() => handleChange("type", "realtime")}
                className={`w-full ${data.type === "realtime" ? "bg-indigo-600" : "bg-gray-200 text-gray-800"}`}
              >
                <Clock className="w-6 h-6 mr-2" />
                Real-Time Cameraman
              </Button>
            </CardContent>
          </Card>
        )
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Tell us about yourself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={data.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={data.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="+1 (555) 987-6543"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={data.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Tell us about your photography experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Select onValueChange={(value) => handleChange("experience_years", parseInt(value))} value={data.experience_years.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0-2 years</SelectItem>
                    <SelectItem value="3">3-5 years</SelectItem>
                    <SelectItem value="6">6-10 years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {data.type === "elite" && (
                <>
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={data.hourly_rate}
                      onChange={(e) => handleChange("hourly_rate", parseFloat(e.target.value) || 0)}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="daily_rate">Daily Rate (USD) - Optional</Label>
                    <Input
                      id="daily_rate"
                      type="number"
                      value={data.daily_rate || ""}
                      onChange={(e) => handleChange("daily_rate", parseFloat(e.target.value) || 0)}
                      placeholder="800"
                    />
                  </div>
                </>
              )}
              <div>
                <Label>Specializations</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {specialties.map((specialty) => (
                    <div key={specialty} className="flex items-center">
                      <Checkbox
                        id={specialty}
                        checked={data.specializations.includes(specialty)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleChange("specializations", [...data.specializations, specialty])
                          } else {
                            handleChange(
                              "specializations",
                              data.specializations.filter((s) => s !== specialty),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={specialty} className="ml-2">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Equipment and Bio</CardTitle>
              <CardDescription>Tell us about your gear and yourself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="equipment">Equipment (comma-separated)</Label>
                <Input
                  id="equipment"
                  value={data.equipment.join(", ")}
                  onChange={(e) => handleChange("equipment", e.target.value.split(", ").map(item => item.trim()).filter(item => item))}
                  placeholder="Canon EOS R5, 24-70mm f/2.8 lens, Professional lighting"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell us about yourself and your photography experience"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Languages{data.type === "elite" ? " and Availability" : ""}</CardTitle>
              <CardDescription>
                Let us know which languages you speak{data.type === "elite" ? " and when you're available" : ""}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Languages</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {languages.map((language) => (
                    <div key={language} className="flex items-center">
                      <Checkbox
                        id={language}
                        checked={data.languages.includes(language)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleChange("languages", [...data.languages, language])
                          } else {
                            handleChange(
                              "languages",
                              data.languages.filter((l) => l !== language),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={language} className="ml-2">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {data.type === "elite" && (
                <div>
                  <Label>Availability</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Weekdays", "Weekends", "Evenings", "Holidays"].map((time) => (
                      <div key={time} className="flex items-center">
                        <Checkbox
                          id={time}
                          checked={data.availability.includes(time)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleChange("availability", [...data.availability, time])
                            } else {
                              handleChange(
                                "availability",
                                data.availability.filter((a) => a !== time),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={time} className="ml-2">
                          {time}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      case 5:
        return data.type === "elite" ? (
          <Card>
            <CardHeader>
              <CardTitle>Elite Cameraman Details</CardTitle>
              <CardDescription>Provide additional information for Elite Cameraman status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="awards">Awards & Recognition</Label>
                <Input
                  id="awards"
                  value={data.awards}
                  onChange={(e) => handleChange("awards", e.target.value)}
                  placeholder="List your notable awards and recognitions"
                />
              </div>
              <div>
                <Label htmlFor="celebrity_clients">Celebrity Clients</Label>
                <Input
                  id="celebrity_clients"
                  value={data.celebrity_clients || ""}
                  onChange={(e) => handleChange("celebrity_clients", e.target.value)}
                  placeholder="List any notable clients you've worked with"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Availability</CardTitle>
              <CardDescription>Understand how real-time availability works.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                As a Real-Time Cameraman, you can toggle your availability on and off at any time. When you're
                available:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your current location will be shared with nearby users</li>
                <li>You may receive immediate booking requests</li>
                <li>You can accept or reject bookings in real-time</li>
              </ul>
              <p>You'll be able to manage your real-time availability from your dashboard after registration.</p>
            </CardContent>
          </Card>
        )
      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>Upload samples of your work.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="portfolio"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input
                    id="portfolio"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => handleChange("portfolio", Array.from(e.target.files || []))}
                  />
                </label>
              </div>
              {data.portfolio.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Selected files:</p>
                  <ul className="list-disc pl-5">
                    {data.portfolio.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )
      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Information</CardTitle>
              <CardDescription>Please review your information before submitting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="font-semibold capitalize">{key}:</span>
                  <span className="text-gray-600">
                    {Array.isArray(value)
                      ? value.length > 0
                        ? value.join(", ")
                        : "None selected"
                      : value?.toString() || "N/A"}
                  </span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsEditing(true)} className="w-full">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Information
              </Button>
            </CardFooter>
          </Card>
        )
      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Submission Confirmation</CardTitle>
              <CardDescription>You're all set! Review your submission one last time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Registration Complete!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for registering as a {data.type} cameraman. We're excited to have you on board!
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Next Steps:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Set up your profile and portfolio</li>
                  <li>Complete any necessary background checks</li>
                  <li>Start accepting booking requests</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full">
                Finish and Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        )
    }
  }

  if (isEditing) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Edit Your Information</h1>
        {renderStep()}
        <div className="mt-6 flex justify-between">
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-6">Cameraman Registration</h1>
        <Progress value={progress} className="mb-6" />
        {renderStep()}
        <div className="mt-6 flex justify-between">
          {step > 0 && (
            <Button onClick={handlePrevious}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          {step < totalSteps - 1 ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Submit Registration
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
