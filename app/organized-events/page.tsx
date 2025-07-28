"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Camera, X, ChevronDown } from "lucide-react"

const eventCategories = [
  { id: "all", name: "All Events" },
  { id: "wedding", name: "Weddings" },
  { id: "corporate", name: "Corporate Events" },
  { id: "concert", name: "Concerts" },
  { id: "sports", name: "Sports Events" },
  { id: "fashion", name: "Fashion Shows" },
]

const events = [
  {
    id: 1,
    title: "Annual Tech Conference",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description: "A gathering of tech enthusiasts and industry leaders",
    date: "2023-09-15",
    location: "San Francisco, CA",
    category: "corporate",
    attendees: 5000,
    details:
      "Join us for the biggest tech conference of the year! Featuring keynote speakers from leading tech companies, hands-on workshops, and networking opportunities. This event is perfect for developers, entrepreneurs, and tech enthusiasts looking to stay ahead in the rapidly evolving world of technology.",
  },
  {
    id: 2,
    title: "Summer Music Festival",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description: "Three days of non-stop music from top artists",
    date: "2023-07-20",
    location: "Austin, TX",
    category: "concert",
    attendees: 50000,
    details:
      "Get ready for the hottest music festival of the summer! With over 100 artists performing across 5 stages, this 3-day event promises an unforgettable experience for music lovers of all genres. Enjoy food from local vendors, interactive art installations, and camping options for the full festival experience.",
  },
  {
    id: 3,
    title: "International Food Fair",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description: "A culinary journey around the world",
    date: "2023-08-05",
    location: "New York, NY",
    category: "corporate",
    attendees: 10000,
    details:
      "Embark on a global culinary adventure at our International Food Fair! Sample dishes from over 50 countries, watch live cooking demonstrations from world-renowned chefs, and participate in food workshops. This event is a must-attend for foodies, chefs, and anyone passionate about international cuisine.",
  },
  {
    id: 4,
    title: "Elegant Wedding Ceremony",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description: "A beautiful celebration of love",
    date: "2023-06-12",
    location: "Napa Valley, CA",
    category: "wedding",
    attendees: 200,
    details:
      "Witness the union of two souls in a breathtaking vineyard setting. This intimate wedding ceremony features elegant decor, gourmet catering, and live music. As a guest, you'll be part of a day filled with love, laughter, and unforgettable moments in one of California's most picturesque locations.",
  },
  {
    id: 5,
    title: "World Cup Soccer Finals",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description: "The ultimate showdown in international soccer",
    date: "2023-07-10",
    location: "London, UK",
    category: "sports",
    attendees: 80000,
    details:
      "Experience the thrill of international soccer at its finest! The World Cup Finals bring together the best teams from around the globe in a battle for soccer supremacy. With state-of-the-art facilities, passionate fans, and world-class athletes, this event promises heart-pounding action and unforgettable moments of sporting history.",
  },
  {
    id: 6,
    title: "Paris Fashion Week",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description: "Showcasing the latest trends in haute couture",
    date: "2023-09-25",
    location: "Paris, France",
    category: "fashion",
    attendees: 3000,
    details:
      "Step into the glamorous world of high fashion at Paris Fashion Week. Witness the unveiling of next season's trends from the world's top designers, attend exclusive runway shows, and rub shoulders with fashion icons and celebrities. This event is the pinnacle of style and creativity in the fashion industry.",
  },
]

const reviews = [
  {
    id: 1,
    name: "Alice Johnson",
    rating: 5,
    comment: "Amazing event! The photographers captured every moment perfectly.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80",
  },
  {
    id: 2,
    name: "Bob Smith",
    rating: 4,
    comment: "Great experience overall. Would definitely use CamIt for future events.",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80",
  },
  {
    id: 3,
    name: "Carol Davis",
    rating: 5,
    comment: "The attention to detail was impressive. Our wedding photos turned out beautifully!",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1261&q=80",
  },
]

const faqs = [
  {
    question: "How do I book photography services for my event?",
    answer:
      "Booking photography services for your event is easy with CamIt. Simply navigate to our 'Book Event' page, select your event type, date, and location, and choose from our available photographers. You can also customize your package based on your specific needs.",
  },
  {
    question: "What types of events do you cover?",
    answer:
      "We cover a wide range of events including weddings, corporate events, concerts, sports events, fashion shows, and more. Our diverse pool of professional photographers allows us to cater to virtually any type of event you might be planning.",
  },
  {
    question: "How far in advance should I book a photographer for my event?",
    answer:
      "We recommend booking your photographer as early as possible, especially for large events or during peak seasons. For weddings, we suggest booking 6-12 months in advance. For other events, 2-3 months ahead is usually sufficient, but it's always better to book early to ensure availability.",
  },
  {
    question: "Can I choose a specific photographer for my event?",
    answer:
      "Yes, you can browse through our photographers' portfolios and select the one that best fits your style and needs. If you have a preferred photographer, you can request them specifically when making your booking.",
  },
  {
    question: "What happens if the photographer is unable to attend my event?",
    answer:
      "In the rare case that your assigned photographer is unable to attend, we have a backup system in place. We will immediately assign another qualified photographer with a similar style to cover your event, ensuring that your day is captured beautifully no matter what.",
  },
]

export default function OrganizedEvents() {
  const [currentReview, setCurrentReview] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const filteredEvents =
    selectedCategory === "all" ? events : events.filter((event) => event.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Our Organized Events</h1>

        {/* Event Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {eventCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} layout="fill" objectFit="cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{event.attendees.toLocaleString()} attendees</span>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(event.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Event Details Modal */}
        {selectedEvent !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">{events.find((e) => e.id === selectedEvent)?.title}</h3>
                  <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <Image
                  src={events.find((e) => e.id === selectedEvent)?.image || "/placeholder.svg"}
                  alt={events.find((e) => e.id === selectedEvent)?.title || "Event"}
                  width={600}
                  height={400}
                  objectFit="cover"
                  className="rounded-lg mb-4"
                />
                <p className="text-gray-600 mb-4">{events.find((e) => e.id === selectedEvent)?.details}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{events.find((e) => e.id === selectedEvent)?.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{events.find((e) => e.id === selectedEvent)?.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{events.find((e) => e.id === selectedEvent)?.attendees.toLocaleString()} attendees</span>
                  </div>
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Professional photography included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Image
                src={reviews[currentReview].avatar || "/placeholder.svg"}
                alt={reviews[currentReview].name}
                width={64}
                height={64}
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{reviews[currentReview].name}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < reviews[currentReview].rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{reviews[currentReview].comment}</p>
            <div className="flex justify-between">
              <button onClick={prevReview} className="text-blue-600 hover:text-blue-800 focus:outline-none">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={nextReview} className="text-blue-600 hover:text-blue-800 focus:outline-none">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Event Statistics */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Event Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Calendar, label: "Events Organized", value: "500+" },
              { icon: Users, label: "Total Attendees", value: "1M+" },
              { icon: Camera, label: "Photos Taken", value: "10M+" },
              { icon: Star, label: "Average Rating", value: "4.9" },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Book Your Next Event */}
        <section className="bg-blue-600 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Book Your Next Event</h2>
          <p className="text-xl mb-6 text-center">
            Ready to create unforgettable memories? Let us capture the essence of your next event.
          </p>
          <div className="flex justify-center">
            <a
              href="/book-event"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Book Now
            </a>
          </div>
        </section>
      </main>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4">
                    <span>{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="h-5 w-5" />
                    </span>
                  </summary>
                  <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-gray-600">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
