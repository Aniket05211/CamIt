import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const specialty = searchParams.get("specialty")
  const minRating = searchParams.get("minRating")
  const maxDistance = searchParams.get("maxDistance")
  const priceMin = searchParams.get("priceMin")
  const priceMax = searchParams.get("priceMax")
  const availability = searchParams.get("availability")

  const supabase = createServerSupabaseClient()

  try {
    // Build query
    let query = supabase.from("cameraman_profiles").select(`
        *,
        users!inner(id, full_name, avatar_url)
      `)

    // Apply filters if provided
    if (minRating) {
      query = query.gte("rating", Number.parseFloat(minRating))
    }

    if (priceMin && priceMax) {
      query = query.gte("hourly_rate", Number.parseFloat(priceMin)).lte("hourly_rate", Number.parseFloat(priceMax))
    }

    if (specialty && specialty !== "all") {
      query = query.contains("specialties", [specialty])
    }

    if (availability && availability !== "any") {
      query = query.contains("availability", [availability])
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching cameramen:", error)
    }

    // If no data from database, return mock data with proper structure
    const mockData = [
      {
        id: "1",
        user_id: "1",
        full_name: "Rahul Sharma",
        avatar_url: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
        bio: "Professional wedding photographer with 8+ years experience",
        equipment: "Canon EOS R5, 24-70mm f/2.8",
        experience_years: 8,
        hourly_rate: 150,
        specialties: ["Wedding", "Portrait", "Events"],
        rating: 4.8,
        location: "New Delhi, India",
        coordinates: [77.209, 28.6139],
        distance: lat && lng ? calculateDistance(Number.parseFloat(lat), Number.parseFloat(lng), 28.6139, 77.209) : 2.5,
        is_available: true,
      },
      {
        id: "2",
        user_id: "2",
        full_name: "Priya Patel",
        avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        bio: "Fashion and commercial photographer",
        equipment: "Sony A7 IV, Multiple Prime Lenses",
        experience_years: 6,
        hourly_rate: 200,
        specialties: ["Fashion", "Commercial", "Product"],
        rating: 4.9,
        location: "Mumbai, India",
        coordinates: [72.8777, 19.076],
        distance: lat && lng ? calculateDistance(Number.parseFloat(lat), Number.parseFloat(lng), 19.076, 72.8777) : 3.2,
        is_available: true,
      },
      {
        id: "3",
        user_id: "3",
        full_name: "Amit Kumar",
        avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop",
        bio: "Landscape and architectural photographer",
        equipment: "Nikon Z7 II, 14-24mm f/2.8",
        experience_years: 10,
        hourly_rate: 180,
        specialties: ["Landscape", "Architecture", "Real Estate"],
        rating: 4.7,
        location: "Bangalore, India",
        coordinates: [77.5946, 12.9716],
        distance:
          lat && lng ? calculateDistance(Number.parseFloat(lat), Number.parseFloat(lng), 12.9716, 77.5946) : 1.8,
        is_available: true,
      },
      {
        id: "4",
        user_id: "4",
        full_name: "Neha Gupta",
        avatar_url:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        bio: "Event and sports photographer",
        equipment: "Canon EOS R6, 70-200mm f/2.8",
        experience_years: 5,
        hourly_rate: 120,
        specialties: ["Events", "Sports", "Action"],
        rating: 4.6,
        location: "Gurgaon, India",
        coordinates: [77.0266, 28.4595],
        distance:
          lat && lng ? calculateDistance(Number.parseFloat(lat), Number.parseFloat(lng), 28.4595, 77.0266) : 4.1,
        is_available: true,
      },
      {
        id: "5",
        user_id: "5",
        full_name: "Vikram Singh",
        avatar_url:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        bio: "Portrait and family photographer",
        equipment: "Sony A7 III, 85mm f/1.4",
        experience_years: 7,
        hourly_rate: 160,
        specialties: ["Portrait", "Family", "Maternity"],
        rating: 4.9,
        location: "Noida, India",
        coordinates: [77.391, 28.5355],
        distance: lat && lng ? calculateDistance(Number.parseFloat(lat), Number.parseFloat(lng), 28.5355, 77.391) : 3.7,
        is_available: true,
      },
    ]

    // Use database data if available, otherwise use mock data
    let formattedData = mockData

    if (data && data.length > 0) {
      formattedData = data.map((cameraman) => ({
        id: cameraman.id,
        user_id: cameraman.user_id,
        full_name: cameraman.users.full_name,
        avatar_url: cameraman.users.avatar_url,
        bio: cameraman.bio,
        equipment: cameraman.equipment,
        experience_years: cameraman.experience_years,
        hourly_rate: cameraman.hourly_rate,
        specialties: cameraman.specialties || [],
        rating: cameraman.rating,
        location: cameraman.location,
        coordinates: cameraman.coordinates,
        distance:
          lat && lng && cameraman.coordinates
            ? calculateDistance(
                Number.parseFloat(lat),
                Number.parseFloat(lng),
                cameraman.coordinates[1],
                cameraman.coordinates[0],
              )
            : null,
        is_available: cameraman.is_available,
      }))
    }

    // Apply distance filter if specified
    if (maxDistance && lat && lng) {
      formattedData = formattedData.filter((cameraman) => {
        return cameraman.distance !== null && cameraman.distance <= Number.parseFloat(maxDistance)
      })
    }

    // Apply specialty filter
    if (specialty && specialty !== "all") {
      formattedData = formattedData.filter((cameraman) => {
        return cameraman.specialties.includes(specialty)
      })
    }

    // Apply rating filter
    if (minRating) {
      formattedData = formattedData.filter((cameraman) => {
        return cameraman.rating >= Number.parseFloat(minRating)
      })
    }

    // Apply price filter
    if (priceMin && priceMax) {
      formattedData = formattedData.filter((cameraman) => {
        return (
          cameraman.hourly_rate >= Number.parseFloat(priceMin) && cameraman.hourly_rate <= Number.parseFloat(priceMax)
        )
      })
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error in cameramen API:", error)
    // Return mock data in case of error
    return NextResponse.json([
      {
        id: "1",
        user_id: "1",
        full_name: "Rahul Sharma",
        avatar_url: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
        bio: "Professional wedding photographer",
        equipment: "Canon EOS R5",
        experience_years: 8,
        hourly_rate: 150,
        specialties: ["Wedding", "Portrait"],
        rating: 4.8,
        location: "New Delhi",
        coordinates: [77.209, 28.6139],
        distance: 2.5,
        is_available: true,
      },
    ])
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
