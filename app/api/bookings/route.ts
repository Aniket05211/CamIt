import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const status = searchParams.get("status")

  const supabase = createServerSupabaseClient()

  try {
    // Build query
    let query = supabase.from("bookings").select(`
        *,
        client:client_id(id, full_name, avatar_url),
        cameraman:cameraman_id(
          id,
          users!inner(id, full_name, avatar_url)
        )
      `)

    // Filter by user ID if provided
    if (userId) {
      // Check if user is client or cameraman
      const { data: user } = await supabase.from("users").select("user_type").eq("id", userId).single()

      if (user?.user_type === "client") {
        query = query.eq("client_id", userId)
      } else if (user?.user_type === "cameraman") {
        // For cameraman, we need to find their profile ID first
        const { data: cameramanProfile } = await supabase
          .from("cameraman_profiles")
          .select("id")
          .eq("user_id", userId)
          .single()

        if (cameramanProfile) {
          query = query.eq("cameraman_id", cameramanProfile.id)
        }
      }
    }

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status)
    }

    // Order by booking date
    query = query.order("booking_date", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching bookings:", error)
      // Return mock data for development
      return NextResponse.json([
        {
          id: "1",
          client: {
            id: "c1",
            name: "Ananya Desai",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          },
          cameraman: {
            id: "1",
            name: "Rahul Sharma",
            avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
          },
          date: "2023-06-15",
          time: "14:00:00",
          duration: 3,
          location: "Delhi, India",
          address: "123 Main St, Delhi",
          coordinates: [77.209, 28.6139],
          price: 450,
          status: "completed",
          payment_status: "paid",
          payment_method: "credit_card",
          special_requirements: "Outdoor photoshoot",
          created_at: "2023-05-01T10:00:00Z",
          updated_at: "2023-06-16T18:00:00Z",
        },
        {
          id: "2",
          client: {
            id: "c1",
            name: "Ananya Desai",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          },
          cameraman: {
            id: "2",
            name: "Priya Patel",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          },
          date: "2023-07-20",
          time: "10:00:00",
          duration: 2,
          location: "Mumbai, India",
          address: "456 Park Ave, Mumbai",
          coordinates: [72.8777, 19.076],
          price: 300,
          status: "confirmed",
          payment_status: "pending",
          payment_method: null,
          special_requirements: "Indoor studio session",
          created_at: "2023-06-10T15:30:00Z",
          updated_at: "2023-06-11T09:00:00Z",
        },
      ])
    }

    // Format the response
    const formattedBookings = data.map((booking) => ({
      id: booking.id,
      client: {
        id: booking.client.id,
        name: booking.client.full_name,
        avatar: booking.client.avatar_url,
      },
      cameraman: {
        id: booking.cameraman.id,
        name: booking.cameraman.users.full_name,
        avatar: booking.cameraman.users.avatar_url,
      },
      date: booking.booking_date,
      time: booking.booking_time,
      duration: booking.duration_hours,
      location: booking.location,
      address: booking.address,
      coordinates: booking.coordinates,
      price: booking.price,
      status: booking.status,
      payment_status: booking.payment_status,
      payment_method: booking.payment_method,
      special_requirements: booking.special_requirements,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
    }))

    return NextResponse.json(formattedBookings)
  } catch (error) {
    console.error("Error in bookings API:", error)
    // Return mock data in case of error for development
    return NextResponse.json([
      {
        id: "1",
        client: {
          id: "c1",
          name: "Ananya Desai",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        },
        cameraman: {
          id: "1",
          name: "Rahul Sharma",
          avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
        },
        date: "2023-06-15",
        time: "14:00:00",
        duration: 3,
        location: "Delhi, India",
        address: "123 Main St, Delhi",
        coordinates: [77.209, 28.6139],
        price: 450,
        status: "completed",
        payment_status: "paid",
        payment_method: "credit_card",
        special_requirements: "Outdoor photoshoot",
        created_at: "2023-05-01T10:00:00Z",
        updated_at: "2023-06-16T18:00:00Z",
      },
      {
        id: "2",
        client: {
          id: "c1",
          name: "Ananya Desai",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        },
        cameraman: {
          id: "2",
          name: "Priya Patel",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        },
        date: "2023-07-20",
        time: "10:00:00",
        duration: 2,
        location: "Mumbai, India",
        address: "456 Park Ave, Mumbai",
        coordinates: [72.8777, 19.076],
        price: 300,
        status: "confirmed",
        payment_status: "pending",
        payment_method: null,
        special_requirements: "Indoor studio session",
        created_at: "2023-06-10T15:30:00Z",
        updated_at: "2023-06-11T09:00:00Z",
      },
    ])
  }
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "client_id",
      "cameraman_id",
      "booking_date",
      "booking_time",
      "duration_hours",
      "location",
      "address",
      "coordinates",
      "price",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        client_id: body.client_id,
        cameraman_id: body.cameraman_id,
        booking_date: body.booking_date,
        booking_time: body.booking_time,
        duration_hours: body.duration_hours,
        location: body.location,
        address: body.address,
        coordinates: body.coordinates,
        price: body.price,
        status: "pending",
        payment_status: "pending",
        payment_method: body.payment_method || null,
        special_requirements: body.special_requirements || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating booking:", error)
      // Return mock data for development
      return NextResponse.json({
        id: "new-booking-id",
        client_id: body.client_id,
        cameraman_id: body.cameraman_id,
        booking_date: body.booking_date,
        booking_time: body.booking_time,
        duration_hours: body.duration_hours,
        location: body.location,
        address: body.address,
        coordinates: body.coordinates,
        price: body.price,
        status: "pending",
        payment_status: "pending",
        payment_method: body.payment_method || null,
        special_requirements: body.special_requirements || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error in bookings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
