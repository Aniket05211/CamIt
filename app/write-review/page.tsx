"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Star, Upload, ThumbsUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  cameraman: z.string().min(2, {
    message: "Cameraman name must be at least 2 characters.",
  }),
  tripType: z.string({
    required_error: "Please select a trip type.",
  }),
  rating: z.number().min(1).max(5),
  review: z.string().min(10, {
    message: "Review must be at least 10 characters.",
  }),
  wouldRecommend: z.boolean(),
})

const tripTypes = [
  { value: "vacation", label: "Vacation" },
  { value: "wedding", label: "Wedding" },
  { value: "event", label: "Event" },
  { value: "portrait", label: "Portrait Session" },
  { value: "other", label: "Other" },
]

export default function WriteReview() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cameraman: "",
      rating: 0,
      review: "",
      wouldRecommend: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Here you would typically send the form data to your backend
    console.log(values)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      })
      form.reset()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Share Your Experience</h1>
        <p className="text-xl text-center mb-12 text-gray-600">
          Your feedback helps others find great cameramen and improves our service.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Write Your Review</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="cameraman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cameraman Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the cameraman's name"
                          {...field}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormDescription>The name of the cameraman you're reviewing.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tripType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue placeholder="Select your trip type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tripTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>What kind of trip or session did you have?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${
                                star <= field.value ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                              onClick={() => form.setValue("rating", star)}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>Rate your experience from 1 to 5 stars.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Review</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your review here"
                          className="resize-none border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Share your experience with this cameraman.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wouldRecommend"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I would recommend this cameraman to others</FormLabel>
                        <FormDescription>
                          Check this box if you would recommend this cameraman to friends or family.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </Form>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Why Your Review Matters</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <ThumbsUp className="h-6 w-6 mr-2 text-blue-500" />
                  <span className="text-gray-700">Help other travelers make informed decisions</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-6 w-6 mr-2 text-blue-500" />
                  <span className="text-gray-700">Recognize excellent service from our cameramen</span>
                </li>
                <li className="flex items-center">
                  <Upload className="h-6 w-6 mr-2 text-blue-500" />
                  <span className="text-gray-700">Contribute to improving our service quality</span>
                </li>
                <li className="flex items-center">
                  <Award className="h-6 w-6 mr-2 text-blue-500" />
                  <span className="text-gray-700">Help cameramen gain recognition for their work</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Review Guidelines</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Be honest and objective in your review</li>
                <li>Provide specific details about your experience</li>
                <li>Mention both positive aspects and areas for improvement</li>
                <li>Keep your review respectful and constructive</li>
                <li>Avoid mentioning personal information or that of others</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
