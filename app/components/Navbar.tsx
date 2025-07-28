"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Globe, Menu, X, User, LogOut, Settings } from "lucide-react"
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAboutMenu, setShowAboutMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPhotographerProfile, setHasPhotographerProfile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    setUser(userData)
    if (userData) {
      fetch(`/api/check-photographer-profile?user_id=${userData.id}`)
        .then((res) => res.json())
        .then((data) => setHasPhotographerProfile(data.exists))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAboutMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
                  {/* Show Cameraman Dashboard or Connect With Us based on photographer profile */}
                  {user && hasPhotographerProfile ? (
                    <Link href="/cameraman-dashboard" className="text-[16px] text-white hover:opacity-70 transition-opacity">
                      Cameraman Dashboard
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
                      <Button variant="ghost" className="text-white hover:bg-white/10">
                        <User className="h-5 w-5 mr-2" />
                        {user.full_name || "My Account"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {hasPhotographerProfile ? (
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
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
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
                {/* Show Cameraman Dashboard or Connect With Us based on photographer profile */}
                {user && hasPhotographerProfile ? (
                  <Link href="/cameraman-dashboard" className="block px-3 py-2 text-[16px] text-white hover:bg-gray-900">
                    Cameraman Dashboard
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
                    {hasPhotographerProfile && (
                      <Link
                        href="/cameraman-dashboard"
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
