"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OTPConfirmation() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number.parseInt(element.value))) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.nextSibling) {
      ;(element.nextSibling as HTMLInputElement).focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically verify the OTP with your backend
    console.log("OTP submitted:", otp.join(""))
    // For now, we'll just move to the dashboard
    router.push("/cameraman-dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify your phone number</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a code to your phone. Please enter it below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="sr-only">
                One-time password
              </label>
              <div className="flex justify-between">
                {otp.map((data, index) => {
                  return (
                    <input
                      className="w-12 h-12 text-center form-control rounded border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      type="text"
                      name="otp"
                      maxLength={1}
                      key={index}
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                    />
                  )
                })}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Didn't receive the code?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Resend OTP
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
