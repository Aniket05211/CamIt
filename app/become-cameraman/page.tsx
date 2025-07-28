"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, Camera, DollarSign, MessageSquare, Shield, Star, Users, ChevronDown } from "lucide-react"
import { Disclosure } from "@headlessui/react"

const requirements = [
  {
    icon: Star,
    title: "Requirements",
    items: [
      "Be at least 18 years old",
      "Clear a background screening",
      "Own professional camera equipment",
      "Have a portfolio of work",
    ],
  },
  {
    icon: Camera,
    title: "Documents",
    items: [
      "Valid government ID",
      "Proof of residence",
      "Equipment insurance documentation",
      "Professional certifications (if any)",
    ],
  },
  {
    icon: Users,
    title: "Signup process",
    items: [
      "Complete online application",
      "Submit portfolio and documents",
      "Pass equipment verification",
      "Complete orientation",
    ],
  },
]

const benefits = [
  { icon: Calendar, title: "Set your own hours", description: "You decide when and how often you shoot." },
  { icon: DollarSign, title: "Get paid fast", description: "Weekly payments in your bank account." },
  {
    icon: MessageSquare,
    title: "Get support at every click",
    description: "If there's anything that you need, you can reach us anytime.",
  },
]

const safetyFeatures = [
  {
    icon: Shield,
    title: "Protection on every shoot",
    description: "Each booking you take through the CamIt app is insured to protect you and your equipment.",
  },
  {
    icon: MessageSquare,
    title: "Help if you need it",
    description:
      "The Emergency Button calls local authorities. The app displays your booking details for quick reference.",
  },
  {
    icon: Users,
    title: "Community Guidelines",
    description: "Our standards help create safe connections and positive interactions with everyone.",
  },
]

const FAQs = [
  {
    question: "How much can I earn as a CamIt photographer?",
    answer:
      "Earnings vary based on your experience, location, and availability. Many of our photographers earn between $500 to $2000 per week.",
  },
  {
    question: "Do I need my own equipment?",
    answer:
      "Yes, you'll need to have your own professional-grade camera equipment. This typically includes a DSLR or mirrorless camera, various lenses, and lighting equipment.",
  },
  {
    question: "How do I get paid?",
    answer: "We process payments weekly. You'll receive your earnings via direct deposit to your bank account.",
  },
  {
    question: "What kind of support does CamIt provide?",
    answer:
      "We offer 24/7 customer support, training resources, and a community forum where you can connect with other photographers.",
  },
]

export default function BecomeCameraman() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("photographer")
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null)

  const handleGetStarted = () => {
    router.push("/cameraman-registration")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <HeroSection onGetStarted={handleGetStarted} />
      <BenefitsSection benefits={benefits} />
      <RequirementsSection requirements={requirements} activeTab={activeTab} setActiveTab={setActiveTab} />
      <EarningOptionsSection />
      <SafetySection safetyFeatures={safetyFeatures} />
      <TestimonialsSection />
      <FAQSection faqs={FAQs} activeFAQ={activeFAQ} setActiveFAQ={setActiveFAQ} />
      <CTASection onGetStarted={handleGetStarted} />
    </div>
  )
}

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="relative bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="sm:text-center lg:text-left"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Shoot when you want,</span>{" "}
                <span className="block text-indigo-400 xl:inline">earn what you need</span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Join CamIt as a professional photographer and start earning on your own schedule. Be part of a community
                that values your skills and creativity.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={onGetStarted}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get started
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <Image
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Photographer at work"
          fill
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
        />
      </div>
    </div>
  )
}

function BenefitsSection({ benefits }: { benefits: { icon: any; title: string; description: string }[] }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Benefits</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Why shoot with us
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Join CamIt and enjoy the perks of being your own boss while having the support of a professional network.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <benefit.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{benefit.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{benefit.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

function RequirementsSection({
  requirements,
  activeTab,
  setActiveTab,
}: {
  requirements: { icon: any; title: string; items: string[] }[]
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Requirements</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Here's what you need to sign up
          </p>
        </div>

        <div className="mt-10">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab("photographer")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "photographer" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              To photograph
            </button>
            <button
              onClick={() => setActiveTab("videographer")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "videographer" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              To shoot video
            </button>
          </div>

          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {requirements.map((req, index) => (
              <motion.div
                key={req.title}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <req.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{req.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  <ul className="list-disc pl-5 space-y-2">
                    {req.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

function EarningOptionsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Earning Options</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Choose how you want to work
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Users className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Join a studio</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Find and join a photography studio and start shooting for them using the CamIt app. Benefit from
                established clientele and professional resources.
              </dd>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Star className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Become a partner photographer</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Start making money as an independent photographer. Connect with clients directly and upload your
                portfolio to your profile.
              </dd>
            </motion.div>
          </dl>
        </div>
      </div>
    </div>
  )
}

function SafetySection({ safetyFeatures }: { safetyFeatures: { icon: any; title: string; description: string }[] }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Safety</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Safety on the job
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Your safety drives us to continuously raise the bar.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {safetyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah J.",
      role: "Wedding Photographer",
      content:
        "Joining CamIt has been a game-changer for my career. I've been able to book more clients and grow my business faster than I ever thought possible.",
    },
    {
      name: "Michael R.",
      role: "Event Photographer",
      content:
        "The flexibility CamIt offers is unmatched. I can choose my own hours and types of events I want to shoot, which has greatly improved my work-life balance.",
    },
    {
      name: "Emily T.",
      role: "Portrait Photographer",
      content:
        "The support from the CamIt team is exceptional. They're always there to help with any issues and provide valuable resources to improve my skills.",
    },
  ]

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, []) // Removed testimonials.length from dependencies

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <img className="mx-auto h-8" src="/logo.png" alt="CamIt" />
          <blockquote className="mt-10">
            <div className="max-w-3xl mx-auto text-center text-2xl leading-9 font-medium text-gray-900">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {testimonials[currentTestimonial].content}
                </motion.p>
              </AnimatePresence>
            </div>
            <footer className="mt-8">
              <div className="md:flex md:items-center md:justify-center">
                <div className="md:flex-shrink-0">
                  <img
                    className="mx-auto h-10 w-10 rounded-full"
                    src={`https://i.pravatar.cc/300?img=${currentTestimonial + 1}`}
                    alt=""
                  />
                </div>
                <div className="mt-3 text-center md:mt-0 md:ml-4 md:flex md:items-center">
                  <div className="text-base font-medium text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <svg className="hidden md:block mx-1 h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 0h3L9 20H6l5-20z" />
                  </svg>
                  <div className="text-base font-medium text-gray-500">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

function FAQSection({
  faqs,
  activeFAQ,
  setActiveFAQ,
}: {
  faqs: { question: string; answer: string }[]
  activeFAQ: number | null
  setActiveFAQ: (index: number | null) => void
}) {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently asked questions</h2>
          <dl className="mt-6 space-y-6 divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button
                        className="text-left w-full flex justify-between items-start text-gray-400"
                        onClick={() => setActiveFAQ(open ? null : index)}
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <span className="ml-6 h-7 flex items-center">
                          <ChevronDown
                            className={`${activeFAQ === index ? "-rotate-180" : "rotate-0"} h-6 w-6 transform`}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base text-gray-500">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="bg-indigo-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to start your journey?</span>
          <span className="block">Join CamIt today.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-200">
          Start earning money doing what you love. Sign up now and become part of our growing community of professional
          photographers.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
        >
          Get started
        </button>
      </div>
    </div>
  )
}
