"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Loading booking details...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch your booking information.</p>
      </div>
    </div>
  )
}
