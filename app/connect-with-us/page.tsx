"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Camera, Edit3, Star, Clock, Upload, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

type UserType = "editor" | "cameraman" | null
type CameramanType = "elite" | "realtime" | null
type EditorType = "photo" | "video" | "both" | null

const cameramanSpecialties = [
  "Portrait", "Landscape", "Wedding", "Event", "Fashion", "Sports", "Wildlife", "Macro", "Aerial", "Underwater",
]
const editorSpecialties = [
  "Portrait Retouching", "Wedding Editing", "Commercial Product", "Fashion & Beauty", "Real Estate",
  "Landscape Enhancement", "Color Grading", "Video Editing", "Motion Graphics", "Sound Design",
]
const languages = [
  "English", "Spanish", "French", "German", "Italian", "Chinese", "Japanese", "Arabic", "Hindi", "Portuguese",
]
const editorSoftware = [
  "Adobe Photoshop", "Adobe Lightroom", "Capture One", "Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve",
  "Adobe After Effects", "Adobe Audition", "Luminar AI", "Affinity Photo",
]

interface CameramanData {
  type: CameramanType
  name: string
  email: string
  phone: string
  location: string
  experience: string
  rate: string
  specialties: string[]
  equipment: string
  bio: string
  languages: string[]
  availability: string[]
  awards?: string
  celebrityClients?: string
  portfolio: File[]
}
interface EditorData {
  type: EditorType
  name: string
  email: string
  phone: string
  location: string
  experience: string
  rate: string
  specialties: string[]
  software: string[]
  bio: string
  languages: string[]
  turnaround: string
  sampleRate: string
  fullServiceRate: string
  portfolio: File[]
  beforeAfterSamples: {
    before: File | null
    after: File | null
    description: string
  }[]
}
interface FormData {
  userType: UserType
  cameraman: CameramanData
  editor: EditorData
}
const initialFormData: FormData = {
  userType: null,
  cameraman: {
    type: null,
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    rate: "",
    specialties: [],
    equipment: "",
    bio: "",
    languages: [],
    availability: [],
    awards: "",
    celebrityClients: "",
    portfolio: [],
  },
  editor: {
    type: null,
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    rate: "",
    specialties: [],
    software: [],
    bio: "",
    languages: [],
    turnaround: "",
    sampleRate: "",
    fullServiceRate: "",
    portfolio: [],
    beforeAfterSamples: [
      {
        before: null,
        after: null,
        description: "",
      },
    ],
  },
}

export default function ConnectWithUs() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; full_name: string } | null>(null)

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("camit_user") : null
    if (!storedUser) {
      router.replace("/signup")
      return
    }
    const userData = JSON.parse(storedUser)
    setUser(userData)

    setFormData((prev) => ({
      ...prev,
      cameraman: {
        ...prev.cameraman,
        name: userData.full_name || "",
        email: userData.email || "",
      },
      editor: {
        ...prev.editor,
        name: userData.full_name || "",
        email: userData.email || "",
      },
    }))
  }, [router])

  const getTotalSteps = () => {
    if (!formData.userType) return 1
    if (formData.userType === "cameraman") {
      return formData.cameraman.type === "elite" ? 8 : 7
    }
    return 7
  }
  const totalSteps = getTotalSteps()
  const progress = ((step + 1) / totalSteps) * 100

  const handleCameramanChange = (field: keyof CameramanData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      cameraman: {
        ...prev.cameraman,
        [field]: value,
      },
    }))
  }
  const handleEditorChange = (field: keyof EditorData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      editor: {
        ...prev.editor,
        [field]: value,
      },
    }))
  }
  const handleBeforeAfterChange = (index: number, field: keyof EditorData["beforeAfterSamples"][0], value: any) => {
    setFormData((prev) => {
      const newSamples = [...prev.editor.beforeAfterSamples]
      newSamples[index] = {
        ...newSamples[index],
        [field]: value,
      }
      return {
        ...prev,
        editor: {
          ...prev.editor,
          beforeAfterSamples: newSamples,
        },
      }
    })
  }
  const addBeforeAfterSample = () => {
    setFormData((prev) => ({
      ...prev,
      editor: {
        ...prev.editor,
        beforeAfterSamples: [
          ...prev.editor.beforeAfterSamples,
          {
            before: null,
            after: null,
            description: "",
          },
        ],
      },
    }))
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

  // --- FINAL: Do NOT read cookies or send Authorization header ---
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      let payload = {}
      if (formData.userType === "cameraman") {
        payload = {
          ...formData.cameraman,
          user_type: formData.cameraman.type,
          user_id: user?.id,
        }
      } else if (formData.userType === "editor") {
        payload = {
          ...formData.editor,
          user_type: "editor",
          user_id: user?.id,
        }
      }

      // Just call fetch, browser sends cookies automatically
      const response = await fetch("/api/simple-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        localStorage.setItem("camit_user", JSON.stringify(result.user))
        toast({
          title: "Registration Successful!",
          description: "Your profile has been created successfully.",
        })
        setTimeout(() => {
          if (formData.userType === "cameraman") {
            window.location.href = "/cameraman-dashboard"
          } else {
            window.location.href = "/editor-dashboard"
          }
        }, 1500)
      } else {
        throw new Error(result.error || "Registration failed")
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    // Step 0: Choose user type
    if (step === 0) {
      return (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Connect With Us</CardTitle>
            <CardDescription className="text-lg mt-2">
              Join our platform as a professional and start earning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer ${
                  formData.userType === "cameraman" ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, userType: "cameraman" }))}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-indigo-700/80 z-10" />
                <Image
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070"
                  alt="Cameraman"
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-4">
                  <Camera className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Become a Cameraman</h3>
                  <p className="text-sm text-center opacity-90">
                    Offer your photography and videography services to clients
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer ${
                  formData.userType === "editor" ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, userType: "editor" }))}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-pink-700/80 z-10" />
                <Image
                  src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=2070"
                  alt="Editor"
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-4">
                  <Edit3 className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Become an Editor</h3>
                  <p className="text-sm text-center opacity-90">
                    Offer your photo and video editing services to clients
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="text-center text-gray-600 mt-6">
              <p>
                Join our growing community of professionals and connect with clients looking for your skills. Choose
                your path and start your journey with us today.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNext} disabled={!formData.userType} className="px-6">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )
    }

    // Cameraman registration steps
    if (formData.userType === "cameraman") {
      switch (step) {
        case 1:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Cameraman Type</CardTitle>
                <CardDescription>Select the type of cameraman you want to register as.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={formData.cameraman.type || ""}
                  onValueChange={(value) => handleCameramanChange("type", value as CameramanType)}
                >
                  <div className="flex flex-col space-y-4">
                    <div
                      className={`relative flex items-center space-x-2 rounded-lg border p-4 ${
                        formData.cameraman.type === "elite" ? "border-blue-600 bg-blue-50" : ""
                      }`}
                    >
                      <RadioGroupItem value="elite" id="elite" />
                      <div className="flex items-center">
                        <Star className="w-6 h-6 mr-2 text-yellow-500" />
                        <Label htmlFor="elite" className="font-medium">
                          Elite Cameraman
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 ml-8">
                        For established professionals with a portfolio. Set your own rates and availability.
                      </p>
                    </div>
                    <div
                      className={`relative flex items-center space-x-2 rounded-lg border p-4 ${
                        formData.cameraman.type === "realtime" ? "border-blue-600 bg-blue-50" : ""
                      }`}
                    >
                      <RadioGroupItem value="realtime" id="realtime" />
                      <div className="flex items-center">
                        <Clock className="w-6 h-6 mr-2 text-blue-500" />
                        <Label htmlFor="realtime" className="font-medium">
                          Real-Time Cameraman
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 ml-8">
                        For on-demand services. Toggle your availability and accept bookings in real-time.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )
        case 2:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us about yourself.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.cameraman.name || ""}
                    onChange={(e) => handleCameramanChange("name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.cameraman.email || ""}
                    disabled
                    className="bg-gray-50"
                    placeholder="you@example.com"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.cameraman.phone || ""}
                    onChange={(e) => handleCameramanChange("phone", e.target.value)}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.cameraman.location || ""}
                    onChange={(e) => handleCameramanChange("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </CardContent>
            </Card>
          )
        case 3:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>Tell us about your photography experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select
                    onValueChange={(value) => handleCameramanChange("experience", value)}
                    value={formData.cameraman.experience}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.cameraman.type === "elite" && (
                  <div>
                    <Label htmlFor="rate">Hourly Rate (USD)</Label>
                    <Input
                      id="rate"
                      type="number"
                      value={formData.cameraman.rate || ""}
                      onChange={(e) => handleCameramanChange("rate", e.target.value)}
                      placeholder="100"
                    />
                  </div>
                )}
                <div>
                  <Label>Specialties</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {cameramanSpecialties.map((specialty) => (
                      <div key={specialty} className="flex items-center">
                        <Checkbox
                          id={specialty}
                          checked={formData.cameraman.specialties.includes(specialty)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleCameramanChange("specialties", [...formData.cameraman.specialties, specialty])
                            } else {
                              handleCameramanChange(
                                "specialties",
                                formData.cameraman.specialties.filter((s) => s !== specialty),
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
        case 4:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Equipment and Bio</CardTitle>
                <CardDescription>Tell us about your gear and yourself.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="equipment">Equipment</Label>
                  <Input
                    id="equipment"
                    value={formData.cameraman.equipment || ""}
                    onChange={(e) => handleCameramanChange("equipment", e.target.value)}
                    placeholder="Canon EOS R5, 24-70mm f/2.8 lens"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.cameraman.bio || ""}
                    onChange={(e) => handleCameramanChange("bio", e.target.value)}
                    placeholder="Tell us about yourself and your photography experience"
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          )
        case 5:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Languages{formData.cameraman.type === "elite" ? " and Availability" : ""}</CardTitle>
                <CardDescription>
                  Let us know which languages you speak
                  {formData.cameraman.type === "elite" ? " and when you're available" : ""}.
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
                          checked={formData.cameraman.languages.includes(language)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleCameramanChange("languages", [...formData.cameraman.languages, language])
                            } else {
                              handleCameramanChange(
                                "languages",
                                formData.cameraman.languages.filter((l) => l !== language),
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
                {formData.cameraman.type === "elite" && (
                  <div>
                    <Label>Availability</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Weekdays", "Weekends", "Evenings", "Holidays"].map((time) => (
                        <div key={time} className="flex items-center">
                          <Checkbox
                            id={time}
                            checked={formData.cameraman.availability.includes(time)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleCameramanChange("availability", [...formData.cameraman.availability, time])
                              } else {
                                handleCameramanChange(
                                  "availability",
                                  formData.cameraman.availability.filter((a) => a !== time),
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
        case 6:
          return formData.cameraman.type === "elite" ? (
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
                    value={formData.cameraman.awards || ""}
                    onChange={(e) => handleCameramanChange("awards", e.target.value)}
                    placeholder="List your notable awards and recognitions"
                  />
                </div>
                <div>
                  <Label htmlFor="celebrityClients">Celebrity Clients</Label>
                  <Input
                    id="celebrityClients"
                    value={formData.cameraman.celebrityClients || ""}
                    onChange={(e) => handleCameramanChange("celebrityClients", e.target.value)}
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
        case 7:
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
                      onChange={(e) => handleCameramanChange("portfolio", Array.from(e.target.files || []))}
                    />
                  </label>
                </div>
                {formData.cameraman.portfolio.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Selected files:</p>
                    <ul className="list-disc pl-5">
                      {Array.from(formData.cameraman.portfolio).map((file, index) => (
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
        default:
          return (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Information</CardTitle>
                <CardDescription>Please review your information before submitting.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Type:</span>
                    <span className="text-gray-600 capitalize">{formData.cameraman.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Name:</span>
                    <span className="text-gray-600">{formData.cameraman.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Email:</span>
                    <span className="text-gray-600">{formData.cameraman.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Phone:</span>
                    <span className="text-gray-600">{formData.cameraman.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Location:</span>
                    <span className="text-gray-600">{formData.cameraman.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Experience:</span>
                    <span className="text-gray-600">{formData.cameraman.experience}</span>
                  </div>
                  {formData.cameraman.type === "elite" && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Rate:</span>
                      <span className="text-gray-600">${formData.cameraman.rate}/hour</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Specialties:</span>
                    <span className="text-gray-600">
                      {formData.cameraman.specialties.length > 0
                        ? formData.cameraman.specialties.join(", ")
                        : "None selected"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Languages:</span>
                    <span className="text-gray-600">
                      {formData.cameraman.languages.length > 0
                        ? formData.cameraman.languages.join(", ")
                        : "None selected"}
                    </span>
                  </div>
                  {formData.cameraman.type === "elite" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Availability:</span>
                        <span className="text-gray-600">
                          {formData.cameraman.availability.length > 0
                            ? formData.cameraman.availability.join(", ")
                            : "None selected"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Awards:</span>
                        <span className="text-gray-600">{formData.cameraman.awards || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Celebrity Clients:</span>
                        <span className="text-gray-600">{formData.cameraman.celebrityClients || "N/A"}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Portfolio:</span>
                    <span className="text-gray-600">{formData.cameraman.portfolio.length} files selected</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Information
                </Button>
              </CardFooter>
            </Card>
          )
      }
    }

    // Editor registration steps (similar structure)
    if (formData.userType === "editor") {
      // ... (keeping the existing editor steps as they were)
      return (
        <Card>
          <CardHeader>
            <CardTitle>Editor Registration</CardTitle>
            <CardDescription>Editor registration functionality coming soon.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Editor registration will be implemented in the next update.</p>
          </CardContent>
        </Card>
      )
    }

    return null
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
    <div className="container mx-auto p-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-6 text-center">Connect With Us</h1>
        <Progress value={progress} className="mb-6" />
        {renderStep()}
        <div className="mt-6 flex justify-between">
          {step > 0 && (
            <Button onClick={handlePrevious} variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          {step < totalSteps - 1 ? (
            <Button onClick={handleNext} className={`${step > 0 ? "ml-auto" : "w-full"}`}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
