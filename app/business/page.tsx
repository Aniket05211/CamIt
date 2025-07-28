"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState("conduct")
  const contactFormRef = useRef<HTMLDivElement>(null)

  const scrollToContact = () => {
    contactFormRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Business background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">Business Opportunities</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Grow Your Business With Our Partnership</h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Discover how our innovative solutions and collaborative approach can help you scale your business and
              achieve sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={scrollToContact}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="500+" label="Business Partners" icon={<Briefcase className="h-8 w-8 text-blue-600" />} />
            <StatCard number="95%" label="Partner Satisfaction" icon={<Award className="h-8 w-8 text-blue-600" />} />
            <StatCard number="$10M+" label="Partner Revenue" icon={<DollarSign className="h-8 w-8 text-blue-600" />} />
            <StatCard number="24/7" label="Support Available" icon={<Clock className="h-8 w-8 text-blue-600" />} />
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Business Opportunities</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Whether you're looking to conduct business with us or build a partnership, we offer multiple ways to
              collaborate and grow together.
            </p>
          </div>

          <Tabs defaultValue="conduct" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="conduct" className="text-base py-3">
                  Conduct Business
                </TabsTrigger>
                <TabsTrigger value="partner" className="text-base py-3">
                  Build a Partnership
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="conduct" className="mt-6">
              <BusinessConductSection />
            </TabsContent>

            <TabsContent value="partner" className="mt-6">
              <BusinessPartnershipSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Find answers to common questions about doing business with us.</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">
                What are the requirements to become a business partner?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                To become a business partner, you'll need to have a registered business, a good track record in your
                industry, and align with our company values. The specific requirements vary by partnership type, but we
                generally look for partners who are committed to quality, innovation, and customer satisfaction.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">
                How long does the application process take?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                The application process typically takes 2-4 weeks from submission to approval. This includes initial
                review, background checks, and final decision. For larger partnerships, the process may include
                additional steps such as in-person meetings or site visits.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">
                What kind of support do you provide to business partners?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                We provide comprehensive support including dedicated account managers, marketing resources, technical
                assistance, training programs, and access to our partner portal. Our partners also receive regular
                business reviews and strategic planning sessions to ensure mutual growth.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">
                Are there any fees associated with becoming a partner?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Partnership fees vary depending on the type of partnership. Some programs have annual membership fees,
                while others operate on a commission or revenue-sharing model. We're transparent about all costs
                upfront, and many partners find that the benefits and increased revenue significantly outweigh any fees.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">
                Can I upgrade my partnership level over time?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                Yes, we offer a tiered partnership structure that allows partners to progress as their business grows.
                We conduct regular reviews with our partners to assess performance and identify opportunities for
                advancement. Many of our top-tier partners started at entry levels and scaled up over time.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-slate-50" ref={contactFormRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-slate-600 mb-6">
                Fill out the form and one of our business development representatives will contact you within 24 hours
                to discuss your specific needs and opportunities.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-slate-600">business@example.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Schedule a Meeting</h3>
                    <p className="text-slate-600">Book a 30-minute consultation</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                  <CardDescription>Tell us about your business and how we can help</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="first-name" className="text-sm font-medium">
                          First Name
                        </label>
                        <Input id="first-name" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="last-name" className="text-sm font-medium">
                          Last Name
                        </label>
                        <Input id="last-name" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">
                        Company Name
                      </label>
                      <Input id="company" placeholder="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="interest" className="text-sm font-medium">
                        I'm interested in
                      </label>
                      <select
                        id="interest"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select an option</option>
                        <option value="conduct">Conducting Business</option>
                        <option value="partner">Building a Partnership</option>
                        <option value="other">Other Opportunities</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea id="message" placeholder="Tell us about your business needs..." rows={4} />
                    </div>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Submit Inquiry</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to transform your business?</h2>
              <p className="text-blue-100 mt-2">Join our network of successful business partners today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" onClick={scrollToContact}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Business Conduct Section
function BusinessConductSection() {
  return (
    <div className="space-y-12">
      {/* Process Steps */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            step: 1,
            title: "Initial Consultation",
            description:
              "Schedule a meeting with our business team to discuss your needs and explore potential opportunities.",
            icon: <Users className="h-10 w-10 text-blue-600" />,
          },
          {
            step: 2,
            title: "Proposal & Agreement",
            description:
              "Receive a customized proposal outlining services, terms, and pricing. Review and sign the agreement.",
            icon: <Briefcase className="h-10 w-10 text-blue-600" />,
          },
          {
            step: 3,
            title: "Implementation & Growth",
            description: "Begin working with our dedicated team to implement solutions and grow your business.",
            icon: <TrendingUp className="h-10 w-10 text-blue-600" />,
          },
        ].map((item) => (
          <Card key={item.step} className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <div className="bg-blue-600 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Planning Services */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Event Planning Services</h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-bold mb-4">Book Events Directly</h4>
              <p className="text-slate-700 mb-4">
                Our platform allows you to seamlessly plan and book events of any size. From intimate gatherings to
                large corporate functions, our streamlined booking process ensures a hassle-free experience.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Instant availability checking for venues and photographers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Customizable packages to fit your specific event needs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Secure payment processing with flexible payment options</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Dedicated event coordinator for premium bookings</span>
                </li>
              </ul>
              <Link href="/book-event" passHref>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Planning Your Event <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069"
                alt="Event Planning"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Business Listing Benefits */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-8 mb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=2070"
                alt="Business Listing"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h4 className="text-xl font-bold mb-4">List Your Business</h4>
              <p className="text-slate-700 mb-4">
                Expand your reach and attract new customers by listing your business on our platform. Enjoy free
                advertising and connect with clients actively seeking your services.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Free basic listing with premium upgrade options</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Targeted exposure to relevant customers in your area</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Detailed analytics dashboard to track performance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Integrated review system to build your reputation</span>
                </li>
              </ul>
              <Link href="/business-registration" passHref>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  List Your Business <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Photographer Services */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-8">
          <h4 className="text-xl font-bold mb-6 text-center">Photographer Services</h4>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-600 mr-2" />
                  Real-Time Photography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Offer on-demand photography services with our real-time booking system. Clients can book your services
                  for immediate needs, from last-minute events to spontaneous photo shoots.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>GPS-based matching with nearby clients</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Flexible scheduling with instant notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Set your own availability and pricing</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  Elite Photography Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Join our exclusive Elite Photographer program to access premium clients and high-value bookings.
                  Showcase your expertise and command premium rates for your exceptional services.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Verified Elite badge on your profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Priority placement in search results</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Access to exclusive high-budget events</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="text-center">
            <Link href="/cameraman-registration" passHref>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Become a Photographer <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Editor Opportunities */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Editor Opportunities</h3>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-bold mb-4">Expand Your Editing Business</h4>
              <p className="text-slate-700 mb-4">
                Join our network of professional editors and connect with clients seeking your expertise. Whether you
                specialize in photo retouching, video editing, or audio production, our platform helps you grow your
                client base.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Create a professional portfolio to showcase your work</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Set your own rates and service packages</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Secure payment processing with protection for both parties</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Direct communication with clients through our messaging system</span>
                </li>
              </ul>
              <Link href="/editor-registration" passHref>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Register as an Editor <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
                alt="Editing Services"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Business Partnership Section
function BusinessPartnershipSection() {
  return (
    <div className="space-y-12">
      {/* Partnership Types */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Partnership Opportunities</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Venue Partnership",
              description:
                "Partner with us to list your venue and receive bookings for events, photoshoots, and productions.",
              benefits: [
                "Increased venue visibility",
                "Automated booking management",
                "Verified client bookings",
                "Marketing support",
              ],
              color: "bg-blue-600",
            },
            {
              title: "Equipment Rental Alliance",
              description: "List your photography and video equipment for rental to our network of professionals.",
              benefits: [
                "Access to verified professionals",
                "Insurance coverage options",
                "Flexible rental terms",
                "Secure payment processing",
              ],
              color: "bg-purple-600",
            },
            {
              title: "Creative Agency Collaboration",
              description: "Collaborate with our platform to offer comprehensive creative services to your clients.",
              benefits: [
                "Access to our talent network",
                "White-label options",
                "Project management tools",
                "Revenue sharing model",
              ],
              color: "bg-emerald-600",
            },
          ].map((program, index) => (
            <Card key={index} className="relative overflow-hidden border-none shadow-lg">
              <div className={`absolute top-0 left-0 right-0 h-2 ${program.color}`} />
              <CardHeader className="pt-8">
                <CardTitle>{program.title}</CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {program.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Learn More</Button>
                <Button className={program.color}>Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Integration Opportunities */}
      <div className="bg-slate-100 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-6">Technology Integration Opportunities</h3>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>
                Integrate our booking and service platform directly into your website or application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Our comprehensive API allows you to embed our photography, videography, and editing services directly
                into your own digital platforms.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>RESTful API with comprehensive documentation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Webhooks for real-time event notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Customizable UI components</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Sandbox environment for testing</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Request API Access
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>White Label Solutions</CardTitle>
              <CardDescription>Offer our platform under your own brand to your customers.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Our white label solution allows you to provide our comprehensive booking and service platform to your
                customers under your own brand.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Custom branding and domain</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Admin dashboard for management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Revenue sharing or flat fee models</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Request Demo
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Educational Partnerships */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Educational Partnerships</h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"
                alt="Educational Partnership"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Partner with Photography & Film Schools</h4>
              <p className="text-slate-700 mb-4">
                We offer special partnership programs for educational institutions teaching photography, videography,
                and film production. Help your students gain real-world experience and build their portfolios.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Student discount programs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Internship and apprenticeship opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Guest lectures and workshops</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Collaborative projects and competitions</span>
                </li>
              </ul>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Explore Educational Partnerships</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center">Partner Success Stories</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              name: "Skyline Studios",
              quote:
                "Partnering with CamIt has transformed our photography studio business. We've seen a 200% increase in bookings and expanded our client base significantly.",
              person: "Sarah Johnson",
              title: "Studio Owner",
              image: "/placeholder.svg?height=80&width=80",
            },
            {
              name: "EventSpace Venues",
              quote:
                "As a venue partner, we've been able to fill our calendar with quality events. The platform's booking system has streamlined our operations and reduced administrative work.",
              person: "Michael Chen",
              title: "Operations Director",
              image: "/placeholder.svg?height=80&width=80",
            },
          ].map((story, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <Image
                      src={story.image || "/placeholder.svg"}
                      alt={story.name}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>
                  <h4 className="text-xl font-bold mb-2">{story.name}</h4>
                  <p className="text-slate-600 italic mb-4">"{story.quote}"</p>
                  <div>
                    <p className="font-medium">{story.person}</p>
                    <p className="text-slate-500 text-sm">{story.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-16 bg-slate-900 text-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Partners Say</h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Hear from businesses that have successfully partnered with us and achieved remarkable growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "The partnership has been instrumental in our growth strategy. Their team's expertise and support have helped us scale faster than we could have on our own.",
              author: "Jennifer Lee",
              position: "COO, Innovate Solutions",
              image: "/placeholder.svg?height=64&width=64",
              delay: 0,
            },
            {
              quote:
                "We've been able to reach new markets and increase our revenue by 150% since becoming a strategic partner. The collaborative approach has been refreshing.",
              author: "David Wilson",
              position: "Founder, Wilson Enterprises",
              image: "/placeholder.svg?height=64&width=64",
              delay: 0.2,
            },
            {
              quote:
                "The resources and training provided to partners are exceptional. It's clear they're invested in our success as much as their own.",
              author: "Maria Rodriguez",
              position: "VP of Sales, Global Connect",
              image: "/placeholder.svg?height=64&width=64",
              delay: 0.4,
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: testimonial.delay }}
              className="bg-slate-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <svg className="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-slate-300 mb-6 flex-grow">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-slate-400 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Stat Card Component
function StatCard({ number, label, icon }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-3xl md:text-4xl font-bold mb-2">{number}</h3>
      <p className="text-slate-600">{label}</p>
    </div>
  )
}
