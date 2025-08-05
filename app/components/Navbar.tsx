"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Globe, Menu, X, User, LogOut, Settings, Bell, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function getUserFromLocalStorage() {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("camit_user")
  return user ? JSON.parse(user) : null
}

interface Booking {
  id: string
  title: string
  photographer_name: string
  status: string
  created_at: string
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAboutMenu, setShowAboutMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPhotographerProfile, setHasPhotographerProfile] = useState(false)
  const [hasEditorProfile, setHasEditorProfile] = useState(false)
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    setUser(userData)
    
    const initializeUser = async () => {
      if (userData) {
        try {
          // Fetch complete user profile data
          const userResponse = await fetch(`/api/cameramen/${userData.id}`)
          if (userResponse.ok) {
            const userProfileData = await userResponse.json()
            if (userProfileData.success && userProfileData.data) {
              // Update user with complete profile data, but preserve user_type from localStorage
              setUser({
                ...userData,
                name: userProfileData.data.name,
                full_name: userProfileData.data.name,
                user_type: userData.user_type // Preserve the user_type from localStorage
              })
            }
          }

          const profileResponse = await fetch(`/api/check-photographer-profile?user_id=${userData.id}`)
          const profileData = await profileResponse.json()
          const isPhotographer = profileData.exists
          setHasPhotographerProfile(isPhotographer)
          
          // Check for editor profile
          const editorResponse = await fetch(`/api/editors/profile/${userData.id}`)
          const editorData = await editorResponse.json()
          const isEditor = editorData.success && editorData.editor_profile
          setHasEditorProfile(isEditor)
          
          // Fetch user's bookings only if they are NOT a photographer or editor (client users only)
          if (!isPhotographer && !isEditor) {
            fetchUserBookings(userData.id)
          }
        } catch (error) {
          console.error("Error checking photographer profile:", error)
        }
      } else {
        // If no userData, ensure we still set loading to false
        setIsLoading(false)
      }
      setIsLoading(false)
    }
    
    initializeUser()
  }, [])

  const fetchUserBookings = async (userId: string) => {
    try {
      setLoadingBookings(true)
      const response = await fetch(`/api/bookings?client_id=${userId}`)
      if (response.ok) {
        const bookings = await response.json()
        setUserBookings(bookings || [])
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const refreshBookings = () => {
    if (user?.id) {
      fetchUserBookings(user.id)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted'
      case 'rejected':
        return 'Rejected'
      case 'pending':
        return 'Pending'
      default:
        return status
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAboutMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Refresh bookings every 30 seconds - only for client users
  useEffect(() => {
    if (user?.id && !hasPhotographerProfile) {
      const interval = setInterval(refreshBookings, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [user?.id, hasPhotographerProfile])

  const toggleAboutMenu = () => {
    setShowAboutMenu(!showAboutMenu)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      localStorage.removeItem("camit_user")
      window.location.href = "/"
    } catch (error) {
      setUser(null)
      localStorage.removeItem("camit_user")
      window.location.href = "/"
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-black">
        <nav className="max-w-[1440px] mx-auto">
          <div className="relative">
            {/* Main Navigation */}
            <div className="flex items-center justify-between h-[56px] px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <Link href="/" className="text-[26px] font-bold text-white">
                  CamIt
                </Link>
                <div className="hidden md:flex items-center space-x-6 ml-8">
                  <Link href="/search" className="text-[16px] text-white hover:opacity-70 transition-opacity">
                    Book
                  </Link>
                  {/* Show Dashboard or Connect With Us based on user profile */}
                  {user && hasPhotographerProfile ? (
                    <Link href="/cameraman-dashboard" className="text-[16px] text-white hover:opacity-70 transition-opacity">
                      Cameraman Dashboard
                    </Link>
                  ) : user && hasEditorProfile ? (
                    <Link href="/editor-dashboard" className="text-[16px] text-white hover:opacity-70 transition-opacity">
                      Editor Dashboard
                    </Link>
                  ) : (
                    <Link href="/connect-with-us" className="text-[16px] text-white hover:opacity-70 transition-opacity">
                      Connect With Us
                    </Link>
                  )}
                  <Link href="/business" className="text-[16px] text-white hover:opacity-70 transition-opacity">
                    Business
                  </Link>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="text-[16px] text-white hover:opacity-70 transition-opacity flex items-center"
                      onClick={toggleAboutMenu}
                    >
                      About
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${showAboutMenu ? "rotate-180" : ""}`}
                      />
                    </button>
                    {showAboutMenu && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                        <Link href="/about" className="block px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-100">
                          About Us
                        </Link>
                        <Link href="/help" className="block px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-100">
                          Help Center
                        </Link>
                        <Link href="/contact" className="block px-4 py-2 text-[14px] text-gray-700 hover:bg-gray-100">
                          Contact
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button className="text-[16px] text-white hover:opacity-70 transition-opacity flex items-center">
                  <Globe className="h-5 w-5 mr-1" />
                  EN
                </button>
                <Link href="/help" className="text-[16px] text-white hover:opacity-70 transition-opacity">
                  Help
                </Link>
                {isLoading ? (
                  <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/10 relative">
                        <User className="h-5 w-5 mr-2" />
                        {user.name || user.full_name || "My Account"}
                        {!hasPhotographerProfile && !hasEditorProfile && userBookings.some(booking => booking.status === 'pending') && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{user.name || user.full_name || "My Account"}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* Booking Notifications - Only for Client Users */}
                      {!hasPhotographerProfile && !hasEditorProfile && userBookings.length > 0 ? (
                        <>
                          <DropdownMenuLabel className="text-xs text-gray-500 font-normal flex items-center justify-between">
                            <span>
                              <Bell className="h-3 w-3 mr-1 inline" />
                              Booking Status
                            </span>
                            <button
                              onClick={refreshBookings}
                              className="text-blue-500 hover:text-blue-700 text-xs"
                              disabled={loadingBookings}
                            >
                              {loadingBookings ? '...' : '↻'}
                            </button>
                          </DropdownMenuLabel>
                          {userBookings.slice(0, 3).map((booking) => (
                            <DropdownMenuItem key={booking.id} asChild>
                              <Link href="/bookings" className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  {getStatusIcon(booking.status)}
                                  <span className="ml-2 text-xs truncate max-w-[120px]">
                                    {booking.title}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 ml-2">
                                  {getStatusText(booking.status)}
                                </span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                          {userBookings.length > 3 && (
                            <DropdownMenuItem asChild>
                              <Link href="/bookings" className="text-xs text-blue-600">
                                View all {userBookings.length} bookings
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                        </>
                      ) : !hasPhotographerProfile && !hasEditorProfile && (
                        <>
                          <DropdownMenuLabel className="text-xs text-gray-500 font-normal flex items-center justify-between">
                            <span>
                              <Bell className="h-3 w-3 mr-1 inline" />
                              Booking Status
                            </span>
                            <button
                              onClick={refreshBookings}
                              className="text-blue-500 hover:text-blue-700 text-xs"
                              disabled={loadingBookings}
                            >
                              {loadingBookings ? '...' : '↻'}
                            </button>
                          </DropdownMenuLabel>
                          <DropdownMenuItem className="text-xs text-gray-500">
                            No bookings yet
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      
                      {user.user_type === "admin" ? (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/admin-dashboard">
                              <Settings className="h-4 w-4 mr-2" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/profile">
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                        </>
                      ) : hasPhotographerProfile ? (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/cameraman-dashboard">
                              <Settings className="h-4 w-4 mr-2" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/profile">
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                        </>
                      ) : hasEditorProfile ? (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/editor-dashboard">
                              <Settings className="h-4 w-4 mr-2" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/profile">
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/profile">
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/bookings">
                              <Bell className="h-4 w-4 mr-2" />
                              My Bookings
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link href="/login" className="text-[16px] text-white hover:opacity-70 transition-opacity">
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="text-[16px] bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:opacity-70 transition-opacity">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Secondary Navigation */}
            <div className="hidden md:block border-t border-[#333333]">
              <div className="flex items-center h-[48px] px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-8">
                  <Link href="/search" className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    Request a cameraman
                  </Link>
                  <Link href="/book-event" className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    Book for event
                  </Link>
                  <Link href="/photoshoot" className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    Photoshoot
                  </Link>
                  <Link href="/services" className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    Explore services
                  </Link>
                  <Link href="/editors" className="text-[14px] text-gray-400 hover:text-white transition-colors">
                    Editors
                  </Link>
                  <Link
                    href="/organized-events"
                    className="text-[14px] text-gray-400 hover:text-white transition-colors"
                  >
                    Our Organized Events
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/search" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                  Book
                </Link>
                {/* Show Dashboard or Connect With Us based on user profile */}
                {user && hasPhotographerProfile ? (
                  <Link href="/cameraman-dashboard" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                    Cameraman Dashboard
                  </Link>
                ) : user && hasEditorProfile ? (
                  <Link href="/editor-dashboard" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                    Editor Dashboard
                  </Link>
                ) : (
                  <Link href="/connect-with-us" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                    Connect With Us
                  </Link>
                )}
                <Link href="/business" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                  Business
                </Link>
                <Link href="/about" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                  About
                </Link>
                <Link href="/help" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                  Help
                </Link>
                {isLoading ? (
                  <div className="h-10 w-full bg-gray-700 animate-pulse rounded"></div>
                ) : user ? (
                  <>
                    {(hasPhotographerProfile || hasEditorProfile) && (
                      <Link
                        href={hasPhotographerProfile ? "/cameraman-dashboard" : "/editor-dashboard"}
                        className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-[16px] text-white hover:bg-gray-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 text-[16px] bg-white text-black rounded-full text-center"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}

export default Navbar
