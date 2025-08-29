"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Camera, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

type FormData = {
  name: string
  email: string
  password: string
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const controls = useAnimation()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const password = watch("password", "")

  useEffect(() => {
    controls.start({
      y: [10, 0, 10],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    })
  }, [controls])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      console.log("Submitting signup data:", { ...data, password: "[HIDDEN]" })

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
          full_name: data.name.trim(),
          user_type: "client", // Default to client
        }),
      })

      console.log("Response status:", response.status)

      let result
      try {
        result = await response.json()
        console.log("Response data:", result)
      } catch (parseError) {
        console.error("Failed to parse response:", parseError)
        toast({
          title: "Error",
          description: "Server error occurred. Please try again.",
          variant: "destructive",
        })
        return
      }

      if (!result.success) {
        if (result.code === "USER_EXISTS") {
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please try logging in instead.",
            variant: "destructive",
          })
        } else if (result.code === "VALIDATION_ERROR" && result.details) {
          const errorMessages = result.details.map((detail: any) => detail.message).join(", ")
          toast({
            title: "Validation Error",
            description: errorMessages,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Registration failed. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        // Store user data in localStorage after successful signup
        const userData = {
          id: result.user?.id || Date.now(),
          email: data.email,
          full_name: data.name,
          user_type: "client",
        }
        localStorage.setItem("camit_user", JSON.stringify(userData))

        toast({
          title: "Success",
          description: result.message || "Account created successfully! Please log in to continue.",
        })

        // Redirect to login page after successful signup
        router.push("/login")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    // Debug logging
    console.log("=== GOOGLE AUTH DEBUG ===")
    console.log("Environment variables:")
    console.log("NEXT_PUBLIC_GOOGLE_CLIENT_ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    console.log("NEXT_PUBLIC_GOOGLE_CLIENT_ID length:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.length)
    console.log("NEXT_PUBLIC_GOOGLE_CLIENT_ID exists:", !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)
    console.log("Window location origin:", window.location.origin)
    
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
    const redirectUri = `${window.location.origin}/api/auth/google/callback`
    
    console.log("Constructed values:")
    console.log("Client ID:", clientId)
    console.log("Redirect URI:", redirectUri)
    
    if (!clientId) {
      console.error("❌ GOOGLE CLIENT ID IS MISSING!")
      alert("Google Client ID not configured. Please check your environment variables.")
      return
    }
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "email profile",
      access_type: "offline",
      prompt: "consent",
      state: "signup",
    }).toString()}`

    console.log("Final Google Auth URL:", googleAuthUrl)
    console.log("=== END DEBUG ===")

    window.location.href = googleAuthUrl
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return 0
    let score = 0
    if (password.length > 6) score++
    if (password.length > 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strength = getPasswordStrength(password)
  const strengthText = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"]
  const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Floating elements for 3D effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10 backdrop-blur-md"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* Left Side - Form */}
            <div className="p-8 md:p-12 backdrop-blur-sm bg-white/10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="flex items-center mb-8">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="ml-3 text-2xl font-bold text-white">CamIt</h2>
                </div>

                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
                  <p className="text-blue-200">Join our community of photographers</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-blue-300" />
                        </div>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          {...register("name", { required: "Name is required" })}
                          className="pl-10 pr-4 py-3 w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-blue-300" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: "Please enter a valid email",
                            },
                          })}
                          className="pl-10 pr-4 py-3 w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-blue-300" />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          className="pl-10 pr-12 py-3 w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-100"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}

                    {/* Password strength indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(strength / 4) * 100}%` }}
                            className={`h-full ${strengthColor[strength]} transition-all duration-300`}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-slate-400">{strengthText[strength]}</p>
                          <div className="flex items-center text-xs text-slate-400">
                            {strength >= 3 && <CheckCircle className="h-3 w-3 text-green-500 mr-1" />}
                            {strength >= 3 ? "Secure password" : "Keep going"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating account...
                        </div>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </motion.div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-800/50 px-2 text-slate-400">Or continue with</span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium shadow-lg transition-all duration-200 border border-gray-300"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </motion.div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block relative overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1603574670812-d24560880210?auto=format&fit=crop&q=80&w=1780&ixlib=rb-4.0.3"
                  alt="Professional photographer"
                  fill
                  className="object-cover transform scale-110 filter brightness-75"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=1000&width=800"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    animate={controls}
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                    }}
                  >
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white/70" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <h3 className="text-2xl font-bold mb-4">Join thousands of photographers</h3>
                  <p className="text-blue-200 mb-6">
                    Connect with clients, showcase your work, and grow your photography business with CamIt.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-blue-200">Join 10,000+ photographers</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
