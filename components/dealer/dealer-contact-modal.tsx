"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CarReportLogo from "../car-report-logo"

// Define the form schemas for each step
const step1Schema = z.object({
  fullName: z.string().min(2, { message: "Please enter your full name" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
})

const step2Schema = z.object({
  dealershipName: z.string().min(2, { message: "Please enter your dealership name" }),
  city: z.string().min(2, { message: "Please enter your city" }),
  state: z.string().min(1, { message: "Please select your state" }),
  inventorySize: z.string().min(1, { message: "Please select your inventory size" }),
})

const step3Schema = z.object({
  intent: z.string().min(1, { message: "Please select your primary goal" }),
  notes: z.string().optional(),
})

// Combine all schemas for the complete form
const formSchema = step1Schema.merge(step2Schema).merge(step3Schema)

// Define the form data type
type FormData = z.infer<typeof formSchema>

interface DealerContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// US States array for dropdown
const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

export default function DealerContactModal({ open, onOpenChange }: DealerContactModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Create the form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dealershipName: "",
      city: "",
      state: "",
      inventorySize: "",
      intent: "",
      notes: "",
    },
    mode: "onChange",
  })

  // Reset the form and step when the modal is closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        if (!isSubmitted) {
          form.reset()
        }
        setStep(1)
        setIsSubmitted(false)
      }, 300)
    }
  }, [open, form, isSubmitted])

  // Handle form submission
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data)
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  // Handle next step
  const handleNext = async () => {
    let canProceed = false

    if (step === 1) {
      const step1Valid = await form.trigger(["fullName", "email", "phone"])
      canProceed = step1Valid
    } else if (step === 2) {
      const step2Valid = await form.trigger(["dealershipName", "city", "state", "inventorySize"])
      canProceed = step2Valid
    }

    if (canProceed) {
      setStep(step + 1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    setStep(step - 1)
  }

  // Get the current schema based on the step
  const getCurrentSchema = () => {
    switch (step) {
      case 1:
        return step1Schema
      case 2:
        return step2Schema
      case 3:
        return step3Schema
      default:
        return step1Schema
    }
  }

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-gray-900 border-0">
        <div className="absolute right-4 top-4 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {!isSubmitted ? (
          <>
            {/* Progress indicator */}
            <div className="bg-blue-600 p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <DialogTitle className="text-xl font-bold text-white">Partner with CarReport</DialogTitle>
                <div className="flex space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === step ? "bg-white" : "bg-white/30"}`} />
                  ))}
                </div>
              </div>
              <DialogDescription className="text-blue-100">
                {step === 1 && "Tell us about yourself so we can get in touch."}
                {step === 2 && "Tell us about your dealership."}
                {step === 3 && "What are your primary goals?"}
              </DialogDescription>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={variants}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@yourdealership.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={variants}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="dealershipName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dealership Name</FormLabel>
                            <FormControl>
                              <Input placeholder="ABC Motors" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* City and State fields side by side */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Chicago" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {US_STATES.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="inventorySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inventory Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select inventory size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="under_50">Under 50 vehicles</SelectItem>
                                <SelectItem value="50_200">50–200 vehicles</SelectItem>
                                <SelectItem value="201_500">201–500 vehicles</SelectItem>
                                <SelectItem value="over_500">500+ vehicles</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={variants}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="intent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Goal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your primary goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="generate_leads">Generate more leads</SelectItem>
                                <SelectItem value="increase_exposure">Increase exposure</SelectItem>
                                <SelectItem value="integrate">Integrate with CarReport</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us more about your specific needs..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between pt-2">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < 3 ? (
                    <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-8 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-4">Thanks! Our team will reach out shortly.</DialogTitle>
            <DialogDescription className="mb-6 text-gray-600 dark:text-gray-400">
              We've received your information and a CarReport representative will contact you within 1 business day to
              discuss your dealership's needs.
            </DialogDescription>
            <div className="mb-6">
              <CarReportLogo className="h-12 w-12 mx-auto" />
            </div>
            <Button onClick={() => onOpenChange(false)} className="bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}

