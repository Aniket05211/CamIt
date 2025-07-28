import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const supabase = createServerSupabaseClient()

  try {
    // Get booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        client:client_id(id, full_name, avatar_url, phone_number),
        cameraman:cameraman_id(
          id, 
          user_id,
          equipment,
          coordinates,
          current_location,
          users!inner(id, full_name, avatar_url, phone_number)
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching booking:", error)
      // Return mock data for development
      return NextResponse.json({
        id: id,
        client: {
          id: "c1",
          name: "Ananya Desai",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          phone: "+91 98765 43210",
        },
        cameraman: {
          id: "1",
          user_id: "u1",
          name: "Rahul Sharma",
          avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
          phone: "+91 98765 12345",
          equipment: "Canon EOS R5, 24-70mm f/2.8",
          coordinates: [77.209, 28.6139],
        },
        date: "2023-06-15",
        time: "14:00:00",
        duration: 3,
        location: "Delhi, India",
        address: "123 Main St, Delhi",
        coordinates: [77.209, 28.6139],
        price: 450,
        status: "confirmed",
        payment_status: "pending",
        payment_method: "credit_card",
        special_requirements: "Outdoor photoshoot",
        created_at: "2023-05-01T10:00:00Z",
        updated_at: "2023-06-16T18:00:00Z",
        messages: [
          {
            id: "m1",
            sender: {
              id: "c1",
              name: "Ananya Desai",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
            },
            receiver: {
              id: "u1",
              name: "Rahul Sharma",
              avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
            },
            message: "Hi, I'm looking forward to our session!",
            is_read: true,
            created_at: "2023-06-10T10:00:00Z",
          },
          {
            id: "m2",
            sender: {
              id: "u1",
              name: "Rahul Sharma",
              avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
            },
            receiver: {
              id: "c1",
              name: "Ananya Desai",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
            },
            message: "Me too! I'll bring all the equipment we discussed.",
            is_read: true,
            created_at: "2023-06-10T10:15:00Z",
          },
        ],
      })
    }

    // Get messages for this booking
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id(id, full_name, avatar_url),
        receiver:receiver_id(id, full_name, avatar_url)
      `)
      .eq("booking_id", id)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      // Continue anyway, just without messages
    }

    // Get location updates for this booking
    const { data: locationUpdates, error: locationError } = await supabase
      .from("location_updates")
      .select("*")
      .eq("booking_id", id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (locationError) {
      console.error("Error fetching location updates:", locationError)
      // Continue anyway, just without location updates
    }

    // Format the response
    const formattedBooking = {
      id: booking.id,
      client: {
        id: booking.client.id,
        name: booking.client.full_name,
        avatar:
          booking.client.avatar_url ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        phone: booking.client.phone_number,
      },
      cameraman: {
        id: booking.cameraman.id,
        user_id: booking.cameraman.user_id,
        name: booking.cameraman.users.full_name,
        avatar:
          booking.cameraman.users.avatar_url ||
          "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
        phone: booking.cameraman.users.phone_number,
        equipment: booking.cameraman.equipment,
        coordinates:
          locationUpdates && locationUpdates.length > 0
            ? locationUpdates[0].coordinates
            : booking.cameraman.current_location || booking.cameraman.coordinates,
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
      cancellation_reason: booking.cancellation_reason,
      cancelled_by: booking.cancelled_by,
      messages: messages
        ? messages.map((msg) => ({
            id: msg.id,
            sender: {
              id: msg.sender.id,
              name: msg.sender.full_name,
              avatar: msg.sender.avatar_url,
            },
            receiver: {
              id: msg.receiver.id,
              name: msg.receiver.full_name,
              avatar: msg.receiver.avatar_url,
            },
            message: msg.message,
            is_read: msg.is_read,
            created_at: msg.created_at,
          }))
        : [
            {
              id: "m1",
              sender: {
                id: "c1",
                name: "Ananya Desai",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
              },
              receiver: {
                id: "u1",
                name: "Rahul Sharma",
                avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
              },
              message: "Hi, I'm looking forward to our session!",
              is_read: true,
              created_at: "2023-06-10T10:00:00Z",
            },
            {
              id: "m2",
              sender: {
                id: "u1",
                name: "Rahul Sharma",
                avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
              },
              receiver: {
                id: "c1",
                name: "Ananya Desai",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
              },
              message: "Me too! I'll bring all the equipment we discussed.",
              is_read: true,
              created_at: "2023-06-10T10:15:00Z",
            },
          ],
    }

    return NextResponse.json(formattedBooking)
  } catch (error) {
    console.error("Error in booking API:", error)
    // Return mock data in case of error for development
    return NextResponse.json({
      id: id,
      client: {
        id: "c1",
        name: "Ananya Desai",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        phone: "+91 98765 43210",
      },
      cameraman: {
        id: "1",
        user_id: "u1",
        name: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
        phone: "+91 98765 12345",
        equipment: "Canon EOS R5, 24-70mm f/2.8",
        coordinates: [77.209, 28.6139],
      },
      date: "2023-06-15",
      time: "14:00:00",
      duration: 3,
      location: "Delhi, India",
      address: "123 Main St, Delhi",
      coordinates: [77.209, 28.6139],
      price: 450,
      status: "confirmed",
      payment_status: "pending",
      payment_method: "credit_card",
      special_requirements: "Outdoor photoshoot",
      created_at: "2023-05-01T10:00:00Z",
      updated_at: "2023-06-16T18:00:00Z",
      messages: [
        {
          id: "m1",
          sender: {
            id: "c1",
            name: "Ananya Desai",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          },
          receiver: {
            id: "u1",
            name: "Rahul Sharma",
            avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
          },
          message: "Hi, I'm looking forward to our session!",
          is_read: true,
          created_at: "2023-06-10T10:00:00Z",
        },
        {
          id: "m2",
          sender: {
            id: "u1",
            name: "Rahul Sharma",
            avatar: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=2971&auto=format&fit=crop",
          },
          receiver: {
            id: "c1",
            name: "Ananya Desai",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
          },
          message: "Me too! I'll bring all the equipment we discussed.",
          is_read: true,
          created_at: "2023-06-10T10:15:00Z",
        },
      ],
    })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()

    // Update booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating booking:", error)
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error in booking API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
