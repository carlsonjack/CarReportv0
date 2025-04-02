"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  Gauge,
  User,
  Car,
  ArrowLeft,
  AlertCircle,
  Clock,
  Calendar,
  FileText,
  DollarSign,
  MapPin,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CarReportScore from "./carreport-score"
import OwnershipCostAnalysis from "./ownership-cost-analysis"
import KBBPriceComparison from "./kbb-price-comparison"
import VehicleTimelineVisual from "./vehicle-timeline-visual"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import RegistrationInfo from "./registration-info"

interface FullReportProps {
  vehicleData: {
    year: number
    make: string
    model: string
    trim: string
    vin: string
    mileage: number
  }
  onBack: () => void
}

export default function FullReport({ vehicleData, onBack }: FullReportProps) {
  const [activeSection, setActiveSection] = useState<string>("overview")

  // Pascal avatar URL
  const pascalAvatarUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-13%20at%203.29.45%20PM-itBSE42MGY7SfAjuVIcZgqEyHpUlGe.jpeg"

  // Ensure the Pascal chat is visible after report is shown
  useEffect(() => {
    // Set a small timeout to ensure the DOM is updated
    const timer = setTimeout(() => {
      // Update URL hash to include report to trigger the fixed search box
      if (!window.location.hash.includes("report")) {
        window.location.hash = "report-complete"
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Sample timeline events data - normal scenario
  const timelineEvents = [
    {
      id: "owner1-title1",
      date: "10/15/2020",
      title: "First Title",
      mileage: 0,
      description: "Vehicle first purchased",
      icon: <Car className="h-5 w-5 text-blue-600" />,
      type: "title",
      usageType: "personal",
      state: "MA",
    },
    {
      id: "owner2-title2",
      date: "08/22/2021",
      title: "Second Title",
      mileage: 15600,
      mileageDelta: 15600,
      description: "Transferred to second owner",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      type: "title",
      usageType: "commercial",
      state: "NY",
    },
    {
      id: "owner3-title3",
      date: "01/10/2022",
      title: "Third Title",
      mileage: 17200,
      mileageDelta: 1600,
      description: "Transferred to third owner",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      type: "title",
      usageType: "lease",
      state: "CT",
    },
    {
      id: "owner4-title4",
      date: "01/15/2024",
      title: "Fourth Title",
      mileage: 62800,
      mileageDelta: 45600,
      description: "Transferred to fourth owner",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      type: "title",
      usageType: "personal",
      state: "MA",
    },
    {
      id: "current-listing",
      date: "Today",
      title: "Listing Mileage",
      mileage: 65400,
      mileageDelta: 2600,
      description: "Current vehicle listing",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      type: "sale",
      highlight: true,
      isUserEntered: true,
    },
  ]

  // Sample timeline events data - with mileage discrepancy
  const timelineEventsWithDiscrepancy = [
    {
      id: "owner1-title1",
      date: "10/15/2020",
      title: "First Title",
      mileage: 0,
      description: "Vehicle first purchased",
      icon: <Car className="h-5 w-5 text-blue-600" />,
      type: "title",
      usageType: "personal",
      state: "MA",
    },
    {
      id: "owner2-title2",
      date: "08/22/2021",
      title: "Second Title",
      mileage: 15600,
      mileageDelta: 15600,
      description: "Transferred to second owner",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      type: "title",
      usageType: "commercial",
      state: "NY",
    },
    {
      id: "owner3-title3",
      date: "01/10/2022",
      title: "Third Title",
      mileage: 17200,
      mileageDelta: 1600,
      description: "Transferred to third owner",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      type: "title",
      usageType: "lease",
      state: "CT",
    },
    {
      id: "current-listing",
      date: "Today",
      title: "Listing Mileage",
      mileage: 52800,
      description: "Current vehicle listing",
      icon: <DollarSign className="h-5 w-5 text-red-600" />,
      type: "sale",
      highlight: true,
      isUserEntered: true,
    },
    {
      id: "owner4-title4",
      date: "01/15/2024",
      title: "Fourth Title",
      mileage: 62800,
      description: "Transferred to fourth owner",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      type: "title",
      usageType: "personal",
      state: "MA",
    },
  ]

  // Toggle between the two datasets for demonstration
  const [showDiscrepancy, setShowDiscrepancy] = useState(false)
  const currentTimelineEvents = showDiscrepancy ? timelineEventsWithDiscrepancy : timelineEvents

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fadeIn mb-32">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700 -ml-2 flex items-center gap-1"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Summary
          </Button>
          <Button variant="outline" className="bg-transparent text-white border-white hover:bg-blue-700">
            Download PDF
          </Button>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {vehicleData.year} {vehicleData.make} {vehicleData.model} {vehicleData.trim}
            </h1>
            <p className="text-blue-100">VIN: {vehicleData.vin}</p>
          </div>
          <div className="flex items-center gap-3 bg-blue-700 px-4 py-2 rounded-lg">
            <div className="text-right">
              <p className="text-blue-100 text-sm">Pascal's Verdict</p>
              <p className="font-bold text-lg">Proceed with Caution</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-300" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b">
        <Tabs defaultValue="overview" onValueChange={setActiveSection} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-14">
              <TabsTrigger value="overview" className="text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm">
                Vehicle History
              </TabsTrigger>
              <TabsTrigger value="value" className="text-sm">
                Value
              </TabsTrigger>
              <TabsTrigger value="ownership" className="text-sm">
                Ownership Costs
              </TabsTrigger>
              <TabsTrigger value="similar" className="text-sm">
                Similar Vehicles
              </TabsTrigger>
              <TabsTrigger value="specs" className="text-sm">
                Specifications
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === "overview" && (
          <div className="space-y-8">
            {/* Vehicle Summary */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-blue-50 border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-blue-800">Vehicle Snapshot</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Powered by</span>
                  <Image
                    src="/images/kbb-logo.png"
                    alt="Kelley Blue Book"
                    width={100}
                    height={30}
                    className="h-6 w-auto"
                  />
                </div>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* Vehicle Details Section */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Vehicle Image */}
                  <div className="md:w-1/3">
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <img
                        src="/images/2018_toyota_camry.png"
                        alt={`${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`}
                        className="w-full h-auto"
                      />
                      <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Listing Mileage:</span>
                          <span className="text-sm font-semibold">{vehicleData.mileage.toLocaleString()} miles</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="md:w-2/3">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 mb-6">
                      <div className="flex-shrink-0 mt-1">
                        <Avatar className="h-8 w-8 border border-blue-100">
                          <AvatarImage src={pascalAvatarUrl} alt="Pascal" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">P</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">Pascal's Recommendation</h4>
                        <p className="text-sm text-blue-700">
                          This {vehicleData.year} {vehicleData.make} {vehicleData.model} has an accident history that
                          requires attention. While the vehicle may still be a good purchase, I recommend getting a
                          professional inspection before buying. The price is fair considering the history, but you
                          should use this information to negotiate.
                        </p>
                      </div>
                    </div>

                    {/* Vehicle Specifications */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Trim</h4>
                        <p className="text-base font-semibold">{vehicleData.trim}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">VIN</h4>
                        <p className="text-base font-semibold">{vehicleData.vin}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                        <p className="text-base font-semibold">Sedan</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Vehicle Age</h4>
                        <p className="text-base font-semibold">5 Years</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Engine</h4>
                        <p className="text-base font-semibold">3.0L V6 F DOHC 24V</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Fuel Type</h4>
                        <p className="text-base font-semibold">Gasoline</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg col-span-2 md:col-span-3">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Drivetrain</h4>
                        <p className="text-base font-semibold">All-Wheel Drive</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle History Overview */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-3">Vehicle History Highlights</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium text-gray-700">Accident</span>
                      </div>
                      <p className="text-lg font-bold">1 Record Found</p>
                      <p className="text-xs text-gray-500 mt-1">Moderate damage reported</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-700">Total Loss</span>
                      </div>
                      <p className="text-lg font-bold">1 Record Found</p>
                      <p className="text-xs text-gray-500 mt-1">Rebuilt title issued</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">Safety Recalls</span>
                      </div>
                      <p className="text-lg font-bold">0 Open Records</p>
                      <p className="text-xs text-gray-500 mt-1">No active recalls</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Gauge className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Listing Mileage</span>
                      </div>
                      <p className="text-lg font-bold">10,400 Miles</p>
                      <p className="text-xs text-gray-500 mt-1">Current odometer reading</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Gauge className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Expected Mileage</span>
                      </div>
                      <p className="text-lg font-bold">12,400 Miles</p>
                      <p className="text-xs text-gray-500 mt-1">Slightly below average</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Registrations</span>
                      </div>
                      <p className="text-lg font-bold">3 Records Found</p>
                      <p className="text-xs text-gray-500 mt-1">Multiple registrations</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <Avatar className="h-6 w-6 border border-blue-100">
                          <AvatarImage src={pascalAvatarUrl} alt="Pascal" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">P</AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="text-xs text-blue-700">
                        <span className="font-medium">Pascal's Note:</span> This vehicle has been in an accident and was
                        declared a total loss. While it has been rebuilt with a valid title, this significantly impacts
                        its value and may affect insurance coverage. The mileage is slightly below average, which could
                        be due to the time it spent being repaired.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Controls - for testing the mileage discrepancy feature */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Timeline Demo Controls</h3>
                <Button
                  onClick={() => setShowDiscrepancy(!showDiscrepancy)}
                  variant={showDiscrepancy ? "destructive" : "outline"}
                >
                  {showDiscrepancy ? "Show Normal Timeline" : "Show Mileage Discrepancy"}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Click the button above to toggle between a normal timeline and one with a mileage discrepancy.
              </p>
            </div>

            {/* CarReport Score */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-blue-50 border-b px-6 py-4">
                <h3 className="text-lg font-bold text-blue-800">CarReport Score</h3>
              </div>
              <div className="p-6">
                <CarReportScore
                  score={83}
                  accidentScore={8}
                  ownershipScore={8}
                  recallsScore={8}
                  mileageScore={9}
                  marketValueScore={8}
                  safetyScore={10}
                />
              </div>
            </div>

            {/* Key Issues */}
            <div>
              <h2 className="text-xl font-bold mb-4">Key Issues to Consider</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h3 className="font-medium text-red-800">Accident History</h3>
                  </div>
                  <p className="text-sm text-red-700">
                    This vehicle was involved in an accident on June 12, 2020. The accident resulted in moderate damage
                    to the front-left of the vehicle. Repairs were completed at an authorized service center.
                  </p>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-medium text-yellow-800">Total Loss Record</h3>
                  </div>
                  <p className="text-sm text-yellow-700">
                    This vehicle was declared a total loss by an insurance company on June 15, 2020. It was later
                    rebuilt and issued a rebuilt title. This can significantly impact resale value and insurance costs.
                  </p>
                </div>
              </div>
            </div>

            {/* KBB Price Comparison */}
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-blue-50 border-b px-6 py-4">
                <h3 className="text-lg font-bold text-blue-800">Price Analysis</h3>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left side - KBB Value */}
                  <div className="flex-1 border-r-0 md:border-r border-gray-200 pr-0 md:pr-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Kelley Blue Book® Fair Purchase Price</h4>
                      <p className="text-2xl font-bold">${(27500).toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        The price others typically pay based on actual transactions
                      </p>
                    </div>

                    <div className="relative w-full max-w-[300px] mx-auto">
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-31%20at%2010.15.24%E2%80%AFAM-ilBbBs2mbl0zvkpG00Al7Xaqspkh0K.png"
                          alt="Kelley Blue Book Price Gauge"
                          width={300}
                          height={300}
                          className="w-full h-auto mb-2"
                        />
                        <p className="text-sm text-gray-500 italic">Gauge data currently unavailable</p>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Listing Price */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Listing Price</h4>
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-bold">${(25000).toLocaleString()}</p>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-medium">
                          GREAT PRICE
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Listing Price</span>
                        <span className="font-medium">${(25000).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">KBB Fair Purchase Price</span>
                        <span className="font-medium">${(27500).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-sm">Price Difference</span>
                        <span className="text-green-600 font-bold">- $1,500</span>
                      </div>
                    </div>

                    <div className="mt-4 text-sm">
                      <p className="text-green-600 font-medium">
                        This vehicle is priced <strong>below</strong> the KBB Fair Purchase Price.
                      </p>
                      <p className="mt-2 text-gray-600">
                        This suggests a competitive price that may represent a good value compared to similar vehicles
                        in the market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ownership Timeline */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Ownership Timeline</h2>
                <Button variant="link" className="text-blue-600" onClick={() => setActiveSection("history")}>
                  View Full History
                </Button>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-6">
                  <TimelineItem
                    date="June 15, 2018"
                    title="First Purchased"
                    description="Vehicle first purchased from Toyota of Springfield, MA"
                    icon={<Car className="h-5 w-5 text-blue-600" />}
                  />

                  <TimelineItem
                    date="June 12, 2020"
                    title="Accident Reported"
                    description="Moderate damage reported to front-left of vehicle"
                    icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                  />

                  <TimelineItem
                    date="June 15, 2020"
                    title="Total Loss Declared"
                    description="Vehicle declared total loss by insurance company"
                    icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                  />

                  <TimelineItem
                    date="August 30, 2020"
                    title="Rebuilt Title Issued"
                    description="Vehicle rebuilt and issued rebuilt title in Massachusetts"
                    icon={<FileText className="h-5 w-5 text-yellow-500" />}
                  />

                  <TimelineItem
                    date="September 15, 2020"
                    title="New Owner"
                    description="Vehicle purchased by second owner in Boston, MA"
                    icon={<User className="h-5 w-5 text-blue-600" />}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "value" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Vehicle Value Analysis</h2>

            {/* KBB Price Comparison */}
            <KBBPriceComparison listingPrice={25000} kbbPrice={27500} dealQuality="GREAT PRICE" />

            {/* Additional value content can be added here */}
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Value Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Positive Value Factors</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Low mileage for vehicle age</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Well-maintained with service records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Popular trim level with desirable features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>No open recalls</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Negative Value Factors</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>Accident history with moderate damage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>Rebuilt title status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>Previous total loss declaration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "history" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Complete Vehicle History</h2>

            {/* New Timeline Visual */}
            <VehicleTimelineVisual
              events={currentTimelineEvents}
              vehicleYear={vehicleData.year}
              vehicleMake={vehicleData.make}
              vehicleModel={vehicleData.model}
            />

            {/* Vehicle History Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <VehicleHistoryCard
                title="1 Accident"
                subtitle="1 Record Found"
                icon={<AlertTriangle className="h-6 w-6" />}
                variant="warning"
              />
              <VehicleHistoryCard
                title="Total Loss"
                subtitle="1 Record Found"
                icon={<AlertTriangle className="h-6 w-6" />}
                variant="warning"
              />
              <VehicleHistoryCard
                title="10,400 Miles"
                subtitle="Listing Mileage"
                icon={<Gauge className="h-6 w-6" />}
              />
              <VehicleHistoryCard
                title="12,400 Miles"
                subtitle="Expected Mileage"
                icon={<Gauge className="h-6 w-6" />}
              />
              <VehicleHistoryCard
                title="Registrations"
                subtitle="3 Records Found"
                icon={<User className="h-6 w-6" />}
              />
              <VehicleHistoryCard
                title="Safety Recalls"
                subtitle="0 Open Records"
                icon={<Shield className="h-6 w-6" />}
                variant="success"
              />
            </div>

            {/* Accident Details */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Accident Details</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Moderate Damage Reported</h4>
                      <p className="text-gray-600">June 12, 2020 in Boston, MA</p>
                    </div>
                  </div>

                  <div className="space-y-4 ml-16">
                    <div>
                      <h5 className="font-medium mb-1">Damage Location</h5>
                      <p className="text-gray-700">Front-left</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">Damage Severity</h5>
                      <p className="text-gray-700">Moderate</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">Airbags Deployed</h5>
                      <p className="text-gray-700">Yes - Driver side</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">Repairs</h5>
                      <p className="text-gray-700">
                        Repairs completed at Toyota of Boston on July 10, 2020. Repair cost: $8,450.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Loss Details */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Total Loss Details</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Total Loss Declared</h4>
                      <p className="text-gray-600">June 15, 2020 by Liberty Mutual Insurance</p>
                    </div>
                  </div>

                  <div className="space-y-4 ml-16">
                    <div>
                      <h5 className="font-medium mb-1">Reason</h5>
                      <p className="text-gray-700">Damage from accident exceeded 75% of vehicle value</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">Rebuilt Status</h5>
                      <p className="text-gray-700">Vehicle was rebuilt and issued a rebuilt title on August 30, 2020</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1">Impact on Value</h5>
                      <p className="text-gray-700">
                        A rebuilt title typically reduces a vehicle's value by 20-40% compared to a clean title vehicle.
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <h5 className="font-medium text-yellow-800">What This Means For You</h5>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Vehicles with rebuilt titles may be difficult to insure, finance, or resell. Some insurance
                        companies may offer only limited coverage or charge higher premiums. We recommend consulting
                        with your insurance provider before purchasing this vehicle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Timeline */}
            <div>
              <h3 className="text-xl font-bold mb-4">Complete Vehicle Timeline</h3>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-6">
                  <TimelineItem
                    date="June 15, 2018"
                    title="First Purchased"
                    description="Vehicle first purchased from Toyota of Springfield, MA"
                    icon={<Car className="h-5 w-5 text-blue-600" />}
                    mileage="0"
                  />

                  <TimelineItem
                    date="June 20, 2018"
                    title="Title Issued"
                    description="Massachusetts title #MA12345678 issued"
                    icon={<FileText className="h-5 w-5 text-green-600" />}
                    mileage="120"
                  />

                  <TimelineItem
                    date="July 15, 2018"
                    title="Service Visit"
                    description="First service completed at Toyota of Springfield"
                    icon={<Gauge className="h-5 w-5 text-blue-600" />}
                    mileage="1,250"
                  />

                  <TimelineItem
                    date="January 10, 2019"
                    title="Service Visit"
                    description="Regular maintenance - oil change, tire rotation"
                    icon={<Gauge className="h-5 w-5 text-blue-600" />}
                    mileage="7,500"
                  />

                  <TimelineItem
                    date="August 3, 2019"
                    title="Registration Renewed"
                    description="Registration renewed in Massachusetts"
                    icon={<Calendar className="h-5 w-5 text-gray-600" />}
                    mileage="15,200"
                  />

                  <TimelineItem
                    date="June 12, 2020"
                    title="Accident Reported"
                    description="Moderate damage reported to front-left of vehicle"
                    icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                    mileage="32,450"
                  />

                  <TimelineItem
                    date="June 15, 2020"
                    title="Total Loss Declared"
                    description="Vehicle declared total loss by insurance company"
                    icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                    mileage="32,450"
                  />

                  <TimelineItem
                    date="July 10, 2020"
                    title="Vehicle Repaired"
                    description="Repairs completed at Toyota of Boston"
                    icon={<Gauge className="h-5 w-5 text-blue-600" />}
                    mileage="32,450"
                  />

                  <TimelineItem
                    date="August 30, 2020"
                    title="Rebuilt Title Issued"
                    description="Vehicle rebuilt and issued rebuilt title in Massachusetts"
                    icon={<FileText className="h-5 w-5 text-yellow-500" />}
                    mileage="32,450"
                  />

                  <TimelineItem
                    date="September 15, 2020"
                    title="New Owner"
                    description="Vehicle purchased by second owner in Boston, MA"
                    icon={<User className="h-5 w-5 text-blue-600" />}
                    mileage="32,500"
                  />

                  <TimelineItem
                    date="October 5, 2020"
                    title="Service Visit"
                    description="Post-purchase inspection and maintenance"
                    icon={<Gauge className="h-5 w-5 text-blue-600" />}
                    mileage="33,200"
                  />

                  <TimelineItem
                    date="August 10, 2021"
                    title="Registration Renewed"
                    description="Registration renewed in Massachusetts"
                    icon={<Calendar className="h-5 w-5 text-gray-600" />}
                    mileage="38,600"
                  />

                  <TimelineItem
                    date="August 8, 2022"
                    title="Registration Renewed"
                    description="Registration renewed in Massachusetts"
                    icon={<Calendar className="h-5 w-5 text-gray-600" />}
                    mileage="45,800"
                  />

                  <TimelineItem
                    date="March 1, 2023"
                    title="Listed For Sale"
                    description="Vehicle listed for sale by current owner"
                    icon={<DollarSign className="h-5 w-5 text-green-600" />}
                    mileage="10,400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "ownership" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Cost of Ownership Analysis</h2>
            <OwnershipCostAnalysis
              vehicleData={{
                year: 2019,
                make: "Ford",
                model: "F-150",
                trim: "XLT 4x4",
              }}
            />

            {/* Registration Information */}
            <RegistrationInfo state="New York" year={new Date().getFullYear() + 1} vehicleType="pickup" />
          </div>
        )}

        {activeSection !== "overview" &&
          activeSection !== "history" &&
          activeSection !== "ownership" &&
          activeSection !== "value" && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                <p className="text-gray-500">This section is under development</p>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

// Helper Components
function TimelineItem({
  date,
  title,
  description,
  icon,
  mileage,
}: {
  date: string
  title: string
  description: string
  icon: React.ReactNode
  mileage?: string
}) {
  return (
    <div className="relative pl-10">
      <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
        {icon}
      </div>
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
          <h4 className="font-medium">{title}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {date}
            </span>
            {mileage && (
              <span className="text-sm text-gray-500 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {mileage} miles
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function VehicleHistoryCard({
  title,
  subtitle,
  icon,
  variant,
  onClick,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  variant?: "warning" | "success"
  onClick?: () => void
}) {
  let badgeColor = "bg-gray-100 text-gray-800"
  if (variant === "warning") {
    badgeColor = "bg-yellow-100 text-yellow-800"
  } else if (variant === "success") {
    badgeColor = "bg-green-100 text-green-800"
  }

  return (
    <div
      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`${badgeColor} p-2 rounded-full`}>{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

