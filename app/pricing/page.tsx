"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, X } from "lucide-react"

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Basic",
      price: isAnnual ? 299 : 29,
      description: "Perfect for small events",
      features: [
        "1 Professional Photographer",
        "4 Hours Coverage",
        "100 Edited Photos",
        "Online Gallery",
        "Digital Downloads",
      ],
      notIncluded: ["Multiple Photographers", "Same Day Editing", "Printed Albums", "Video Coverage"],
    },
    {
      name: "Professional",
      price: isAnnual ? 599 : 59,
      description: "Ideal for weddings & large events",
      features: [
        "2 Professional Photographers",
        "8 Hours Coverage",
        "300 Edited Photos",
        "Online Gallery",
        "Digital Downloads",
        "Same Day Preview",
        "Printed Album",
      ],
      notIncluded: ["Video Coverage"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: isAnnual ? 999 : 99,
      description: "Complete coverage for premium events",
      features: [
        "3 Professional Photographers",
        "12 Hours Coverage",
        "500 Edited Photos",
        "Online Gallery",
        "Digital Downloads",
        "Same Day Preview",
        "Printed Album",
        "Video Coverage",
        "Drone Shots",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-F78V0XlIaaPc5tlK9BBmw0o57K7dwN.png"
              alt="CamIt Logo"
              width={120}
              height={120}
              className="dark:invert"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Capture your special moments with our professional photography services. Choose the plan that suits your
            event.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center space-x-4 mb-12">
          <span className={`text-sm ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>Monthly billing</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 bg-gray-200"
            role="switch"
            aria-checked={isAnnual}
          >
            <span
              className={`${
                isAnnual ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>
            Annual billing
            <span className="ml-1.5 inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl ${
                plan.popular
                  ? "bg-white shadow-xl border-2 border-purple-500 scale-105"
                  : "bg-white/60 shadow-lg border border-gray-200"
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 mt-2">{plan.description}</p>
              </div>
              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                  {typeof plan.price === "number" && (
                    <span className="text-xl font-normal text-gray-500">{isAnnual ? "/year" : ""}</span>
                  )}
                </p>
              </div>
              <ul className="mb-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded?.map((feature) => (
                  <li key={feature} className="flex items-start opacity-50">
                    <X className="h-5 w-5 text-red-500 shrink-0 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/payment?plan=${plan.name.toLowerCase()}`}
                className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Compare Plan Features</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Basic</th>
                  <th className="text-center py-4 px-4">Professional</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Number of Photographers",
                  "Hours of Coverage",
                  "Edited Photos",
                  "Online Gallery",
                  "Digital Downloads",
                  "Same Day Preview",
                  "Printed Album",
                  "Video Coverage",
                  "Drone Shots",
                ].map((feature) => (
                  <tr key={feature} className="border-b">
                    <td className="py-4 px-4 text-gray-600">{feature}</td>
                    <td className="text-center py-4 px-4">
                      {feature === "Number of Photographers" && "1"}
                      {feature === "Hours of Coverage" && "4"}
                      {feature === "Edited Photos" && "100"}
                      {feature === "Online Gallery" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Digital Downloads" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Same Day Preview" && <X className="h-5 w-5 text-red-500 mx-auto" />}
                      {feature === "Printed Album" && <X className="h-5 w-5 text-red-500 mx-auto" />}
                      {feature === "Video Coverage" && <X className="h-5 w-5 text-red-500 mx-auto" />}
                      {feature === "Drone Shots" && <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature === "Number of Photographers" && "2"}
                      {feature === "Hours of Coverage" && "8"}
                      {feature === "Edited Photos" && "300"}
                      {feature === "Online Gallery" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Digital Downloads" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Same Day Preview" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Printed Album" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Video Coverage" && <X className="h-5 w-5 text-red-500 mx-auto" />}
                      {feature === "Drone Shots" && <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="text-center py-4 px-4">
                      {feature === "Number of Photographers" && "3"}
                      {feature === "Hours of Coverage" && "12"}
                      {feature === "Edited Photos" && "500"}
                      {feature === "Online Gallery" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Digital Downloads" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Same Day Preview" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Printed Album" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Video Coverage" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                      {feature === "Drone Shots" && <Check className="h-5 w-5 text-green-500 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
