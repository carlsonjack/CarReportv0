"use client"

import type React from "react"

import { useState } from "react"
import {
  CheckCircle,
  AlertCircle,
  Truck,
  ShieldCheck,
  FileText,
  BarChart,
  RefreshCw,
  FileWarning,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import CarReportLogo from "./car-report-logo"
import FullReport from "./full-report"

interface PaymentFormProps {
  vehicleData: {
    year: number
    make: string
    model: string
    trim: string
    vin: string
    mileage: number
  }
  onClose: () => void
}

export default function PaymentForm({ vehicleData, onClose }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [name, setName] = useState("")
  const [country, setCountry] = useState("United States")
  const [zip, setZip] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [showFullReport, setShowFullReport] = useState(false)

  const { toast } = useToast()

  // Update the handleSubmit function
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Payment successful!",
        description: "Your full report is now available.",
      })
      setShowFullReport(true)
    }, 2000)
  }

  // Add a function to handle going back from the full report
  const handleBackFromFullReport = () => {
    setShowFullReport(false)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCardNumber(formatCardNumber(value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }

    setExpiry(value)
  }

  // Update the return statement for the full report
  if (showFullReport) {
    return <FullReport vehicleData={vehicleData} onBack={handleBackFromFullReport} />
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 animate-fadeIn">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Vehicle Info and Features */}
          <div>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-2">
                Get your comprehensive CarReport for only $8.99. No hidden fees. No subscriptions.
              </h3>
              <p className="text-gray-600 mb-4">
                We found <span className="text-blue-600 font-medium">18 records</span> on your vehicle.
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="w-1/3">
                  <img
                    src="/images/2018_toyota_camry.png"
                    alt={`${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`}
                    className="rounded-md bg-white p-2 border object-cover w-full h-auto"
                  />
                </div>
                <div className="w-2/3">
                  <h4 className="text-xl font-bold mb-2">
                    {vehicleData.year} {vehicleData.make} {vehicleData.model}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Trim:</p>
                      <p className="font-medium">{vehicleData.trim}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Engine:</p>
                      <p className="font-medium">3.0L V6 F DOHC 24V</p>
                    </div>
                    <div>
                      <p className="text-gray-500">VIN:</p>
                      <p className="font-medium">{vehicleData.vin}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fuel Type:</p>
                      <p className="font-medium">Gasoline</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type:</p>
                      <p className="font-medium">Sedan</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Drivetrain:</p>
                      <p className="font-medium">All-Wheel Drive</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vehicle Age:</p>
                      <p className="font-medium">5 Years</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="bg-white">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">Sales History</h5>
                      <p className="text-xs text-gray-500">3 Records Found</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">Safety Recalls</h5>
                      <p className="text-xs text-gray-500">0 Open Records</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">No Accidents</h5>
                      <p className="text-xs text-gray-500">0 Records Found</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">{vehicleData.mileage.toLocaleString()} Miles</h5>
                      <p className="text-xs text-gray-500">Last recorded mileage</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex-shrink-0">
                  <CarReportLogo className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Powered By:</p>
                  <p className="font-medium">Kelley Blue Book</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Your CarReport Includes:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">No Hidden Fees Like Other Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Kelley Blue Book® Price Advisor</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">VIN Lookups</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Theft Records</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Title Brand History</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Ownership History</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Recall History</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Most Affordable Report in the US</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Odometer Rollback Alert</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Lien & Impound Information</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Instant Access & Download</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                  <p className="text-gray-600 mb-2">
                    1x CarReport for {vehicleData.year} {vehicleData.make} {vehicleData.model}
                  </p>
                  <p className="text-sm text-gray-500">Order Total: $8.99 + Applicable Sales Tax</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-1">
                      Promotional Code
                    </label>
                    <Input
                      id="promo"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code (optional)"
                    />
                  </div>

                  <div>
                    <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">
                      Card information
                    </label>
                    <div className="space-y-2">
                      <Input
                        id="card"
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 1234 1234 1234"
                        maxLength={19}
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="text"
                          value={expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                        <Input
                          type="text"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                          placeholder="CVC"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name on card"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country or region
                    </label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Mexico">Mexico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP
                    </label>
                    <Input
                      id="zip"
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="12345"
                      maxLength={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
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
                        Processing...
                      </span>
                    ) : (
                      "Pay"
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By completing your purchase, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

