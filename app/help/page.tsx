"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Phone,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  X,
  FileText,
  Camera,
  User,
  Building2,
  Book,
  Lightbulb,
  Shield,
} from "lucide-react"

const faqs = [
  {
    question: "How do I book a photographer?",
    answer:
      "To book a photographer, navigate to our search page, enter your event details, browse through available photographers, and select the one that best fits your needs. You can then proceed to book directly through our platform.",
  },
  {
    question: "What types of events do you cover?",
    answer:
      "We cover a wide range of events including weddings, corporate events, birthdays, concerts, sports events, and more. If you have a specific event type not listed, please contact us for custom solutions.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend booking as early as possible, especially for popular dates or large events. For weddings, we suggest booking 6-12 months in advance. For other events, 2-3 months ahead is usually sufficient.",
  },
  {
    question: "What happens if I need to cancel or reschedule?",
    answer:
      "Our cancellation and rescheduling policies vary depending on how far in advance you notify us. Please refer to our Terms of Service for detailed information, or contact our customer support team for assistance.",
  },
  {
    question: "How do I become a photographer on CamIt?",
    answer:
      "To become a photographer on CamIt, visit our 'Become a Photographer' page and follow the application process. You'll need to submit a portfolio, pass a background check, and complete our onboarding process.",
  },
]

const popularTopics = [
  {
    title: "Booking Process",
    icon: "📅",
    description: "Learn how to search for photographers, compare options, and book your perfect match for your event.",
    steps: [
      "Navigate to the 'Search' page on CamIt",
      "Enter your event details, including date, location, and type of event",
      "Browse through the list of available photographers",
      "Use filters to narrow down your options based on price, style, and ratings",
      "Click on a photographer's profile to view their portfolio and details",
      "If you like a photographer, click the 'Book Now' button",
      "Select your package and any additional services",
      "Review your booking details and proceed to payment",
      "Receive a confirmation email with your booking details",
    ],
  },
  {
    title: "Photographer Guidelines",
    icon: "📸",
    description:
      "Understand the standards and expectations we have for our photographers to ensure a great experience.",
    steps: [
      "Maintain a professional demeanor at all times",
      "Arrive at least 30 minutes before the scheduled time",
      "Bring backup equipment to handle any technical issues",
      "Dress appropriately for the event",
      "Communicate clearly with the client about their expectations",
      "Capture a variety of shots as per the agreed package",
      "Edit and deliver photos within the promised timeframe",
      "Respond promptly to client messages and inquiries",
      "Adhere to CamIt's code of conduct and ethical guidelines",
    ],
  },
  {
    title: "Payment & Refunds",
    icon: "💳",
    description: "Get information about our payment processes, cancellation policies, and refund procedures.",
    steps: [
      "Payment is processed securely through our platform",
      "We accept major credit cards and PayPal",
      "A deposit may be required at the time of booking",
      "Full payment is typically due before the event",
      "Cancellations made 30+ days before the event are fully refundable",
      "Cancellations 15-29 days before the event incur a 50% fee",
      "Cancellations less than 14 days before the event are non-refundable",
      "Refunds are processed within 5-10 business days",
      "For disputes, contact our customer support team",
    ],
  },
  {
    title: "Event Types",
    icon: "🎉",
    description: "Explore the various types of events we cater to and find specialized photographers for each.",
    steps: [
      "Weddings: Full-day coverage, engagement shoots, bridal portraits",
      "Corporate Events: Conferences, product launches, team building activities",
      "Birthdays: Children's parties, milestone celebrations, surprise parties",
      "Concerts: Live music events, festivals, backstage coverage",
      "Sports Events: Tournaments, races, team photos",
      "Fashion Shows: Runway photography, backstage shots, lookbooks",
      "Family Portraits: In-studio or on-location family photo sessions",
      "Real Estate: Interior and exterior property photography",
      "Food Photography: Restaurant menus, cookbook shoots, food blogging",
    ],
  },
  {
    title: "Account Management",
    icon: "👤",
    description: "Learn how to manage your profile, update your information, and handle your bookings.",
    steps: [
      "Log in to your CamIt account",
      "Navigate to the 'Profile' or 'Account Settings' page",
      "Update your personal information (name, email, phone number)",
      "Change your password regularly for security",
      "Add or update your profile picture",
      "Manage your notification preferences",
      "View your booking history and upcoming events",
      "Leave reviews for photographers you've worked with",
      "Contact support for any account-related issues",
    ],
  },
  {
    title: "Technical Support",
    icon: "🖥️",
    description: "Get help with any technical issues you might encounter while using our platform.",
    steps: [
      "Check our FAQ section for common issues and solutions",
      "Clear your browser cache and cookies",
      "Try accessing CamIt from a different browser or device",
      "Ensure your internet connection is stable",
      "Check if CamIt is experiencing any known outages",
      "Use the in-app chat support for immediate assistance",
      "Email our support team with screenshots of the issue",
      "For account access problems, use the 'Forgot Password' feature",
      "Follow our social media for updates on any ongoing technical issues",
    ],
  },
]

const helpCenterResources = [
  {
    title: "User Guide",
    icon: Book,
    description: "Learn how to use CamIt with our comprehensive user guide.",
    topics: ["Account Setup", "Searching for Photographers", "Booking Process", "Managing Reservations"],
    content:
      "Our user guide provides step-by-step instructions on how to navigate the CamIt platform, from creating an account to booking your first photographer. It covers topics such as searching for photographers, managing your bookings, and communicating with photographers. Whether you're new to CamIt or looking to make the most of our features, this guide is your go-to resource.",
  },
  {
    title: "Photographer Resources",
    icon: Camera,
    description: "Access tools and tips to succeed as a CamIt photographer.",
    topics: ["Profile Optimization", "Pricing Strategies", "Customer Service", "Legal Considerations"],
    content:
      "For photographers, we offer a wealth of resources to help you succeed on our platform. This includes tips on creating an attractive profile, pricing your services competitively, and providing excellent customer service. You'll also find information on our photographer policies, payment processes, and how to handle disputes or issues that may arise during bookings.",
  },
  {
    title: "Booking Tips",
    icon: Lightbulb,
    description: "Get advice on how to book the perfect photographer for your event.",
    topics: [
      "Choosing the Right Photographer",
      "Communication Best Practices",
      "Preparing for Your Shoot",
      "Post-Shoot Expectations",
    ],
    content:
      "Our booking tips guide provides insider advice on how to choose the right photographer for your specific event. Learn how to read photographer profiles effectively, what questions to ask before booking, and how to communicate your vision clearly. We also provide tips on preparing for your photo shoot to ensure you get the best possible results.",
  },
  {
    title: "Safety Guidelines",
    icon: Shield,
    description: "Learn about our safety measures and best practices for users.",
    topics: ["Verification Process", "Safe Meeting Practices", "Dispute Resolution", "Emergency Procedures"],
    content:
      "Safety is our top priority at CamIt. Our safety guidelines outline the measures we take to ensure a safe experience for both clients and photographers. This includes our verification processes, in-app safety features, and guidelines for safe interactions. We also provide advice on what to do in case of any safety concerns and how to report issues to our team.",
  },
]

const requiredDocuments = [
  {
    title: "For Clients",
    icon: User,
    documents: [
      "Valid government-issued ID (e.g., driver's license, passport)",
      "Proof of address (utility bill, bank statement)",
      "Event details and requirements document",
      "Signed contract or agreement (provided by CamIt)",
      "Payment information (credit card or bank details)",
    ],
  },
  {
    title: "For Photographers",
    icon: Camera,
    documents: [
      "Valid government-issued ID (e.g., driver's license, passport)",
      "Proof of address (utility bill, bank statement)",
      "Professional portfolio (10-20 best works)",
      "Resume or CV highlighting photography experience",
      "Equipment list with insurance details",
      "Business license (if applicable)",
      "Tax identification number",
      "Bank account details for payments",
      "Signed photographer agreement (provided by CamIt)",
      "Background check consent form",
    ],
  },
  {
    title: "For Business Clients",
    icon: Building2,
    documents: [
      "Business registration certificate",
      "Tax identification number",
      "Proof of business address",
      "Authorized representative's ID",
      "Company logo (high-resolution)",
      "Signed business client agreement (provided by CamIt)",
      "Event details and requirements document",
      "Payment information (company credit card or bank details)",
    ],
  },
]

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [filteredFaqs, setFilteredFaqs] = useState(faqs)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null)

  useEffect(() => {
    const filtered = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredFaqs(filtered)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl mb-8">Find answers to common questions or get in touch with our support team.</p>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full py-3 px-4 pr-12 rounded-lg text-gray-900 shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Topics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {popularTopics.map((topic, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTopic(topic.title)}
            >
              <span className="text-4xl mb-4 block">{topic.icon}</span>
              <h3 className="text-lg font-semibold">{topic.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="w-full text-left p-6 focus:outline-none"
                  onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    {activeQuestion === index ? (
                      <ChevronDown className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {activeQuestion === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Required Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {requiredDocuments.map((docType, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedDocumentType(docType.title)}
            >
              <docType.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{docType.title}</h3>
              <p className="text-gray-600">Click to view required documents</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Options */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="bg-white p-6 rounded-lg shadow-md text-center" whileHover={{ y: -5 }}>
              <Phone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak with a support representative</p>
              <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                +1 (234) 567-890
              </a>
            </motion.div>
            <motion.div className="bg-white p-6 rounded-lg shadow-md text-center" whileHover={{ y: -5 }}>
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </motion.div>
            <motion.div className="bg-white p-6 rounded-lg shadow-md text-center" whileHover={{ y: -5 }}>
              <Mail className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Send us an email anytime</p>
              <a href="mailto:support@camit.com" className="text-blue-600 hover:underline">
                support@camit.com
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Help Center Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Help Center Resources</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore our comprehensive guides and resources to make the most of your CamIt experience. Whether you're a
          client or a photographer, we've got you covered.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {helpCenterResources.map((resource, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedResource(resource.title)}
            >
              <div className="flex items-center mb-4">
                <resource.icon className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">{resource.title}</h3>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">{resource.description}</p>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Topics covered:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {resource.topics.slice(0, 3).map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
              <span className="text-blue-600 flex items-center mt-4">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal for Popular Topics */}
      {selectedTopic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTopic(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{selectedTopic}</h3>
                <button onClick={() => setSelectedTopic(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                {popularTopics.find((topic) => topic.title === selectedTopic)?.description}
              </p>
              <h4 className="text-xl font-semibold mb-4">Steps:</h4>
              <ol className="list-decimal list-inside space-y-2">
                {popularTopics
                  .find((topic) => topic.title === selectedTopic)
                  ?.steps.map((step, index) => (
                    <li key={index} className="text-gray-700">
                      <span className="font-medium">{step}</span>
                    </li>
                  ))}
              </ol>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal for Help Center Resources */}
      {selectedResource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedResource(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{selectedResource}</h3>
                <button onClick={() => setSelectedResource(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 whitespace-pre-line">
                {helpCenterResources.find((resource) => resource.title === selectedResource)?.content}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal for Required Documents */}
      {selectedDocumentType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDocumentType(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Required Documents: {selectedDocumentType}</h3>
                <button onClick={() => setSelectedDocumentType(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Please ensure you have the following documents ready for a smooth experience with CamIt:
              </p>
              <ul className="list-disc list-inside space-y-2">
                {requiredDocuments
                  .find((doc) => doc.title === selectedDocumentType)
                  ?.documents.map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <FileText className="w-5 h-5 mr-2 mt-1 flex-shrink-0 text-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-700">
                  Note: All documents should be clear, legible, and up-to-date. CamIt may request additional documents
                  in certain cases to ensure the safety and quality of our services.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
