"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

type FormData = {
  email: string
  password: string
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const controls = useAnimation()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

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
  }, [])

  // Load debug info on component mount
  useEffect(() => {
    const loadDebugInfo = async () => {
      try {
        const response = await fetch("/api/debug/users")
        const data = await response.json()
        setDebugInfo(data)
        console.log("Debug info loaded:", data)
      } catch (error) {
        console.error("Failed to load debug info:", error)
      }
    }
    loadDebugInfo()
  }, [])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      console.log("Submitting login data:", { email: data.email, password: "[HIDDEN]" })

      // First, let's debug the user lookup
      const debugResponse = await fetch("/api/debug/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "find_user",
          email: data.email,
        }),
      })
      const debugResult = await debugResponse.json()
      console.log("User lookup debug:", debugResult)

      // Test password hash
      const hashResponse = await fetch("/api/debug/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_hash",
          password: data.password,
        }),
      })
      const hashResult = await hashResponse.json()
      console.log("Password hash debug:", hashResult)

      // Now attempt login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("Login response:", result)

      if (!response.ok || result.error) {
        toast({
          title: "Login Failed",
          description: result.error || "Login failed. Please check your credentials.",
          variant: "destructive",
        })
      } else {
        // Store user data in localStorage
        localStorage.setItem("camit_user", JSON.stringify(result.user))

        toast({
          title: "Success",
          description: result.message || "Login successful!",
        })

        // Trigger a page reload to update the navbar
        window.location.href = "/"
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Debug Info Panel (only in development) */}
      {debugInfo && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
          <h4 className="font-bold mb-2">Debug Info</h4>
          <p>Total Users: {debugInfo.total}</p>
          <p>File Exists: {debugInfo.fileExists ? "Yes" : "No"}</p>
          {debugInfo.users.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Available Users:</p>
              {debugInfo.users.map((user: any, i: number) => (
                <div key={i} className="ml-2">
                  <p>• {user.email}</p>
                  <p className="text-gray-400"> Type: {user.user_type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                  <p className="text-blue-200">Sign in to your account</p>
                  {debugInfo && debugInfo.total > 0 && (
                    <p className="text-green-400 text-sm mt-2">{debugInfo.total} user(s) available for testing</p>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                          Signing in...
                        </div>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </motion.div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                  Don't have an account?{" "}
                  <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block relative overflow-hidden">
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1780&ixlib=rb-4.0.3"
                  alt="Professional photographer at work"
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
                  <h3 className="text-2xl font-bold mb-4">Welcome back to CamIt</h3>
                  <p className="text-blue-200 mb-6">
                    Continue your photography journey with us. Connect, create, and capture amazing moments.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
