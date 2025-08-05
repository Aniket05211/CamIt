"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestBookingPage() {
  const [testResult, setTestResult] = useState<string>("")

  const createTestBooking = async () => {
    try {
      const response = await fetch("/api/bookings?test=create")
      const result = await response.json()
      setTestResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setTestResult(`Error: ${error}`)
    }
  }

  const fetchClientBookings = async () => {
    try {
      const response = await fetch("/api/bookings?client_id=fb3cf51f-967a-4f1c-8456-46ca57727151")
      const result = await response.json()
      setTestResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setTestResult(`Error: ${error}`)
    }
  }

  const fetchPhotographerBookings = async () => {
    try {
      const response = await fetch("/api/bookings?photographer_id=fb3cf51f-967a-4f1c-8456-46ca57727151&status=pending")
      const result = await response.json()
      setTestResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setTestResult(`Error: ${error}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Booking System Test</h1>
      
      <div className="space-y-4">
        <Button onClick={createTestBooking}>
          Create Test Booking
        </Button>
        
        <Button onClick={fetchClientBookings}>
          Fetch Client Bookings
        </Button>
        
        <Button onClick={fetchPhotographerBookings}>
          Fetch Photographer Pending Bookings
        </Button>
      </div>
      
      {testResult && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Test Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  )
} 