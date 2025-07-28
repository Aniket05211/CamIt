import Link from "next/link"
import { Phone, MessageSquare, Mail, MessageCircle } from "lucide-react"

export default function BookWedding() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Book a Cameraman for Your Wedding
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl">
            Preserve your special day with stunning photos and videos from our professional cameramen.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Why Choose Us for Your Wedding?</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Experienced wedding photographers and videographers</li>
            <li>Customizable packages to fit your wedding style and budget</li>
            <li>Pre-wedding consultations to understand your vision</li>
            <li>High-quality equipment for stunning photos and videos</li>
            <li>Quick turnaround for edited photos and highlight videos</li>
            <li>Option for multiple cameramen to capture every angle</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Get More Information</h2>
          <p className="text-gray-700 mb-4">
            Ready to book a cameraman for your wedding? Contact us through any of the following methods:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-black mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Call Us</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-black mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Chat with Us</h3>
                <Link href="#" className="text-indigo-600 hover:text-gray-700">
                  Start a live chat
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-black mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Email Us</h3>
                <a href="mailto:info@camit.com" className="text-indigo-600 hover:text-gray-700">
                  info@camit.com
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-black mr-4" />
              <div>
                <h3 className="text-lg font-semibold">WhatsApp</h3>
                <a href="https://wa.me/15551234567" className="text-indigo-600 hover:text-gray-700">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
