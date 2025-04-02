"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PaymentForm from "./payment-form"

// Add this at the top level, outside the component
declare global {
  interface Window {
    carReportData?: {
      vin: string
      state: string
      mileage: number
      askingPrice: number
    }
  }
}

// Add the prop to the interface
interface ReportSummaryProps {
  onFullReportVisible?: (isVisible: boolean) => void
  onPaymentFormVisible?: (isVisible: boolean) => void
}

export default function ReportSummary({ onFullReportVisible, onPaymentFormVisible }: ReportSummaryProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [carData, setCarData] = useState({
    make: "Toyota",
    model: "Camry",
    year: 2018,
    trim: "Platinum",
    vin: "4JGFB5KBXMA395199",
    score: 87,
    verdict: "good", // 'good', 'caution', 'avoid'
    price: 18750,
    marketValue: 19200,
    mileage: 45000,
    state: "Unknown",
    askingPrice: 0,
    owners: 1,
    accidents: 0,
    recalls: 1,
    titleIssues: false,
  })

  // Pascal avatar URL
  const pascalAvatarUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-13%20at%203.29.45%20PM-itBSE42MGY7SfAjuVIcZgqEyHpUlGe.jpeg"

  // In the useEffect hook, modify the dependency array to prevent infinite loops
  useEffect(() => {
    // Function to check hash and update visibility
    const checkHash = () => {
      console.log("Hash changed to:", window.location.hash)

      if (window.location.hash === "#report") {
        setIsVisible(true)

        // Log the data we're receiving
        console.log("Car report data:", window.carReportData)

        // Update car data if available
        if (window.carReportData) {
          setCarData((prev) => ({
            ...prev,
            vin: window.carReportData.vin || prev.vin,
            mileage: window.carReportData.mileage || prev.mileage,
            state: window.carReportData.state || prev.state,
            askingPrice: window.carReportData.askingPrice || prev.askingPrice,
          }))
        }
      } else {
        setIsVisible(false)
      }
    }

    // Initial check
    checkHash()

    // Listen for hash changes
    window.addEventListener("hashchange", checkHash)

    return () => {
      window.removeEventListener("hashchange", checkHash)
    }
  }, []) // Remove carData from the dependency array to prevent infinite loops

  if (!isVisible) return null

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "good":
        return "text-green-600"
      case "caution":
        return "text-amber-600"
      case "avoid":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "good":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "caution":
        return <AlertTriangle className="h-6 w-6 text-amber-600" />
      case "avoid":
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <Info className="h-6 w-6 text-gray-600" />
    }
  }

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case "good":
        return "Good Deal"
      case "caution":
        return "Proceed with Caution"
      case "avoid":
        return "Avoid This Vehicle"
      default:
        return "Unknown"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-amber-600"
    return "bg-red-600"
  }

  // Update the handleGetFullReport function to show the payment form inline
  const handleGetFullReport = () => {
    setShowPayment(true)

    // Update the full report visibility state if the prop is provided
    if (onFullReportVisible) {
      onFullReportVisible(true)
    }

    // Update payment form visibility
    if (onPaymentFormVisible) {
      onPaymentFormVisible(true)
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleClosePayment = () => {
    setShowPayment(false)

    // Update payment form visibility
    if (onPaymentFormVisible) {
      onPaymentFormVisible(false)
    }
  }

  if (showPayment) {
    return (
      <section id="report" className="mb-12 pt-20 scroll-mt-20 animate-fadeIn">
        <PaymentForm
          vehicleData={{
            year: carData.year,
            make: carData.make,
            model: carData.model,
            trim: carData.trim,
            vin: carData.vin,
            mileage: carData.mileage,
          }}
          onClose={handleClosePayment}
        />
      </section>
    )
  }

  return (
    <section id="report" className="mb-12 scroll-mt-8 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {carData.year} {carData.make} {carData.model} {carData.trim}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                <p className="text-gray-500 text-sm">VIN: {carData.vin}</p>
                <p className="text-gray-500 text-sm">Type: Pickup Truck</p>
                <p className="text-gray-500 text-sm">State: {carData.state}</p>
                <p className="text-gray-500 text-sm">Vehicle Age: 5 Years</p>
                <p className="text-gray-500 text-sm">Engine: 3.0L V6 F DOHC 24V</p>
                <p className="text-gray-500 text-sm">Fuel Type: Gasoline</p>
                <p className="text-gray-500 text-sm">Drivetrain: All-Wheel Drive</p>
                {carData.askingPrice > 0 && (
                  <p className="text-gray-500 text-sm">Asking Price: ${carData.askingPrice.toLocaleString()}</p>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGetFullReport}>
                Get Full Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="relative">
              <h3 className="font-semibold mb-2 px-1">CarReport Score</h3>
              <Card className="blur-[4px]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold invisible">CarReport Score</h3>
                    <span className="text-2xl font-bold">{carData.score}</span>
                  </div>
                  <Progress
                    value={carData.score}
                    className="h-2 mb-2"
                    indicatorClassName={getScoreColor(carData.score)}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute inset-0 flex items-center justify-center mt-8">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  onClick={handleGetFullReport}
                >
                  Unlock Score
                </Button>
              </div>
            </div>

            <div className="relative">
              <h3 className="font-semibold mb-2 px-1">Verdict</h3>
              <Card className="blur-[4px]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {getVerdictIcon(carData.verdict)}
                    <div>
                      <h3 className="font-semibold invisible">Verdict</h3>
                      <p className={`font-bold ${getVerdictColor(carData.verdict)}`}>
                        {getVerdictText(carData.verdict)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {carData.verdict === "good"
                      ? "This vehicle has a clean history with no major issues reported. It appears to be priced below market value."
                      : carData.verdict === "caution"
                        ? "This vehicle has some minor issues that should be addressed, but overall it may still be a good purchase."
                        : "This vehicle has serious issues that make it a risky purchase. We recommend avoiding it."}
                  </p>
                </CardContent>
              </Card>
              <div className="absolute inset-0 flex items-center justify-center mt-8">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  onClick={handleGetFullReport}
                >
                  See Our Verdict
                </Button>
              </div>
            </div>

            <div className="relative">
              <h3 className="font-semibold mb-2 px-1">Price Analysis</h3>
              <Card className="blur-[4px]">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 invisible">Price Analysis</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold">${carData.price.toLocaleString()}</span>
                    <Badge variant={carData.price <= carData.marketValue ? "success" : "destructive"}>
                      {carData.price <= carData.marketValue ? "Below Market" : "Above Market"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Market value: ${carData.marketValue.toLocaleString()}</p>
                  <div className="text-xs text-gray-500">
                    {carData.price < carData.marketValue
                      ? `$${(carData.marketValue - carData.price).toLocaleString()} below similar vehicles`
                      : `$${(carData.price - carData.marketValue).toLocaleString()} above similar vehicles`}
                  </div>
                </CardContent>
              </Card>
              <div className="absolute inset-0 flex items-center justify-center mt-8">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  onClick={handleGetFullReport}
                >
                  View Price Analysis
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Listing Mileage</h4>
              <p className="text-lg font-semibold">{carData.mileage.toLocaleString()} miles</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Owners</h4>
              <p className="text-lg font-semibold">
                {carData.owners} {carData.owners === 1 ? "owner" : "owners"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Accidents</h4>
              <p className="text-lg font-semibold">{carData.accidents} reported</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Title Status</h4>
              <p className="text-lg font-semibold">{carData.titleIssues ? "Issues reported" : "Clean"}</p>
            </div>
          </div>

          <div className="relative bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start gap-3 blur-[4px]">
              <div className="flex-shrink-0 mt-1">
                <Avatar className="h-8 w-8 border border-blue-100">
                  <AvatarImage src={pascalAvatarUrl} alt="Pascal" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">P</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1 invisible">Pascal's Insight</h4>
                <p className="text-sm text-blue-700">
                  This {carData.year} {carData.make} {carData.model} appears to be a good value. With only one owner, no
                  accidents, and regular maintenance, it's priced below similar vehicles in your area. The single recall
                  has been addressed according to service records.
                </p>
              </div>
            </div>
            <h4 className="absolute top-4 left-16 font-medium text-blue-800">Pascal's Insight</h4>
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                onClick={handleGetFullReport}
              >
                Unlock Expert Insights
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Report generated:</span> {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </section>
  )
}

