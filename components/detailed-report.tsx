"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Car,
  FileText,
  AlertTriangle,
  Calendar,
  DollarSign,
  Wrench,
  BarChart,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DetailedReport() {
  const [isVisible, setIsVisible] = useState(false)

  // Pascal avatar URL
  const pascalAvatarUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-13%20at%203.29.45%20PM-itBSE42MGY7SfAjuVIcZgqEyHpUlGe.jpeg"

  useEffect(() => {
    // Check if hash is #detailed-report to show the detailed report
    const checkHash = () => {
      if (window.location.hash === "#detailed-report") {
        setIsVisible(true)
      }
    }

    // Initial check
    checkHash()

    // Listen for hash changes
    window.addEventListener("hashchange", checkHash)

    return () => {
      window.removeEventListener("hashchange", checkHash)
    }
  }, [])

  if (!isVisible) return null

  return (
    <section id="detailed-report" className="mb-12 scroll-mt-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Detailed Vehicle Report</h2>

          <Tabs defaultValue="title-history" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="title-history" className="text-sm">
                <FileText className="h-4 w-4 mr-2" />
                Title History
              </TabsTrigger>
              <TabsTrigger value="service-records" className="text-sm">
                <Wrench className="h-4 w-4 mr-2" />
                Service Records
              </TabsTrigger>
              <TabsTrigger value="market-comparison" className="text-sm">
                <BarChart className="h-4 w-4 mr-2" />
                Market Comparison
              </TabsTrigger>
              <TabsTrigger value="cost-ownership" className="text-sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Cost of Ownership
              </TabsTrigger>
            </TabsList>

            <TabsContent value="title-history">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Title & Ownership Timeline</h3>
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
                      date="June 20, 2018"
                      title="Title Issued"
                      description="Massachusetts title #MA12345678 issued"
                      icon={<FileText className="h-5 w-5 text-green-600" />}
                    />

                    <TimelineItem
                      date="August 3, 2019"
                      title="Registration Renewed"
                      description="Registration renewed in Massachusetts"
                      icon={<Calendar className="h-5 w-5 text-gray-600" />}
                    />

                    <TimelineItem
                      date="August 5, 2020"
                      title="Registration Renewed"
                      description="Registration renewed in Massachusetts"
                      icon={<Calendar className="h-5 w-5 text-gray-600" />}
                    />

                    <TimelineItem
                      date="August 10, 2021"
                      title="Registration Renewed"
                      description="Registration renewed in Massachusetts"
                      icon={<Calendar className="h-5 w-5 text-gray-600" />}
                    />

                    <TimelineItem
                      date="August 8, 2022"
                      title="Registration Renewed"
                      description="Registration renewed in Massachusetts"
                      icon={<Calendar className="h-5 w-5 text-gray-600" />}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Title Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    title="Title Status"
                    value="Clean"
                    icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                  />
                  <InfoCard
                    title="Salvage History"
                    value="None"
                    icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                  />
                  <InfoCard
                    title="Odometer Reading"
                    value="45,000 miles"
                    icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                    description="No odometer rollbacks detected"
                  />
                  <InfoCard
                    title="Lemon/Manufacturer Buyback"
                    value="None"
                    icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="service-records">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Service & Maintenance History</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-6">
                    <TimelineItem
                      date="July 10, 2018"
                      title="First Service"
                      description="Break-in oil change and inspection at 1,200 miles"
                      icon={<Wrench className="h-5 w-5 text-blue-600" />}
                      mileage="1,200"
                    />

                    <TimelineItem
                      date="January 5, 2019"
                      title="Regular Maintenance"
                      description="Oil change, tire rotation, and multi-point inspection"
                      icon={<Wrench className="h-5 w-5 text-blue-600" />}
                      mileage="7,500"
                    />

                    <TimelineItem
                      date="March 15, 2019"
                      title="Recall Service"
                      description="Recall #19V-005: ECU software update completed"
                      icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
                      mileage="10,200"
                    />

                    <TimelineItem
                      date="July 22, 2019"
                      title="Regular Maintenance"
                      description="Oil change, cabin and engine air filter replacement"
                      icon={<Wrench className="h-5 w-5 text-blue-600" />}
                      mileage="15,400"
                    />

                    <TimelineItem
                      date="February 8, 2020"
                      title="Regular Maintenance"
                      description="Oil change, brake inspection, tire rotation"
                      icon={<Wrench className="h-5 w-5 text-blue-600" />}
                      mileage="22,800"
                    />

                    <TimelineItem
                      date="September 12, 2020"
                      title="Regular Maintenance"
                      description="30,000 mile service: transmission fluid change, spark plugs"
                      icon={<Wrench className="h-5 w-5 text-blue-600" />}
                      mileage="30,100"
                    />

                    <TimelineItem
                      date="May 5, 2021"
                      title="Regular Maintenance"
                      description="Oil change, tire rotation, brake fluid flush"
                      icon={<Wrench className="h-5 w-5 text-blue-600" />}
                      mileage="36,500"
                    />

                    <TimelineItem
                      date="December 18, 2021"
                      title="Regular Maintenance"
                      description="Oil change, new wiper blades, battery test"
                      icon={<Wrench className="h-5 w-5 text-blue-600" />}
                      mileage="41,200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Recalls & Safety Issues</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Recall #19V-005</h4>
                        <p className="text-sm text-gray-600 mb-2">ECU Software Update</p>
                        <p className="text-sm text-gray-600">
                          Recall issued January 2019 for potential engine stalling issue. Service completed on March 15,
                          2019.
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Recall Addressed
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="market-comparison">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Market Value Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium text-sm text-gray-500 mb-2">This Vehicle</h4>
                      <div className="text-2xl font-bold mb-1">$18,750</div>
                      <div className="flex items-center">
                        <Badge variant="success" className="text-xs">
                          $450 below market
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Market Average</h4>
                      <div className="text-2xl font-bold mb-1">$19,200</div>
                      <div className="text-sm text-gray-500">Based on 24 similar vehicles</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Price Range</h4>
                      <div className="text-2xl font-bold mb-1">$17,500 - $21,000</div>
                      <div className="text-sm text-gray-500">For similar year, make, model</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="font-medium mb-4">Price Factors</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Mileage (45,000)</span>
                        <span className="text-sm text-green-600">Better than average</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: "35%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Lower (Better)</span>
                        <span>Average (55,000)</span>
                        <span>Higher</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Condition</span>
                        <span className="text-sm text-green-600">Above average</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Poor</span>
                        <span>Average</span>
                        <span>Excellent</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">History</span>
                        <span className="text-sm text-green-600">Clean history</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Issues</span>
                        <span>Minor issues</span>
                        <span>Clean</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Similar Vehicles in Your Area</h4>
                  <div className="space-y-4">
                    <SimilarVehicleCard
                      year="2018"
                      make="Toyota"
                      model="Camry"
                      trim="SE"
                      price={17500}
                      mileage={52000}
                      distance={12}
                      condition="Good"
                    />

                    <SimilarVehicleCard
                      year="2018"
                      make="Toyota"
                      model="Camry"
                      trim="XLE"
                      price={20500}
                      mileage={38000}
                      distance={18}
                      condition="Excellent"
                    />

                    <SimilarVehicleCard
                      year="2018"
                      make="Toyota"
                      model="Camry"
                      trim="XSE"
                      price={19800}
                      mileage={42000}
                      distance={25}
                      condition="Very Good"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cost-ownership">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">5-Year Cost of Ownership</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">Total 5-Year Cost</h4>
                        <div className="text-3xl font-bold mb-4">$31,250</div>
                        <div className="space-y-3">
                          <CostItem
                            label="Purchase Price"
                            value={18750}
                            icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                          />
                          <CostItem label="Fuel" value={5200} icon={<DollarSign className="h-4 w-4 text-gray-500" />} />
                          <CostItem
                            label="Insurance"
                            value={4500}
                            icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                          />
                          <CostItem
                            label="Maintenance & Repairs"
                            value={2800}
                            icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                          />
                          <CostItem
                            label="Taxes & Fees"
                            value={1500}
                            icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                          />
                          <CostItem
                            label="Depreciation"
                            value={-1500}
                            icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                            isNegative
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">Compared to Similar Vehicles</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Fuel Economy</span>
                              <span className="text-sm text-green-600">Better than average</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-green-600 rounded-full" style={{ width: "70%" }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">29 MPG combined (26 city, 35 highway)</div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Maintenance Cost</span>
                              <span className="text-sm text-green-600">Lower than average</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-green-600 rounded-full" style={{ width: "80%" }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Toyota Camry has lower than average maintenance costs
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Insurance Cost</span>
                              <span className="text-sm text-amber-600">Average</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-amber-600 rounded-full" style={{ width: "50%" }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Insurance costs are typical for this vehicle class
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Depreciation</span>
                              <span className="text-sm text-green-600">Better than average</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-green-600 rounded-full" style={{ width: "75%" }}></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Toyota Camry holds value better than most competitors
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Avatar className="h-8 w-8 border border-blue-100">
                      <AvatarImage src={pascalAvatarUrl} alt="Pascal" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">P</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Pascal's Cost Analysis</h4>
                    <p className="text-sm text-blue-700">
                      This Toyota Camry is projected to cost less to own than similar midsize sedans. Its excellent fuel
                      economy, reliability, and strong resale value make it a cost-effective choice over a 5-year
                      ownership period. Maintenance costs are typically 15% lower than the segment average.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t px-6 py-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 mb-1">Want to see the complete vehicle history?</p>
            <p className="text-xs text-gray-500">
              Get access to all service records, detailed ownership history, and more.
            </p>
          </div>
          <Button size="lg">Purchase Full Report</Button>
        </div>
      </div>
    </section>
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
            {mileage && <span className="text-sm text-gray-500">{mileage} miles</span>}
          </div>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function InfoCard({
  title,
  value,
  icon,
  description,
}: {
  title: string
  value: string
  icon: React.ReactNode
  description?: string
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-lg font-semibold mb-1">{value}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  )
}

function SimilarVehicleCard({
  year,
  make,
  model,
  trim,
  price,
  mileage,
  distance,
  condition,
}: {
  year: string
  make: string
  model: string
  trim: string
  price: number
  mileage: number
  distance: number
  condition: string
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 bg-gray-100 p-4 flex items-center justify-center">
          <Car className="h-16 w-16 text-gray-400" />
        </div>
        <div className="p-4 md:w-3/4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <h4 className="font-medium">
              {year} {make} {model} {trim}
            </h4>
            <span className="text-lg font-bold">${price.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              {mileage.toLocaleString()} miles
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              {distance} miles away
            </div>
            <div className="flex items-center gap-1">
              <Info className="h-4 w-4 text-gray-400" />
              {condition} condition
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CostItem({
  label,
  value,
  icon,
  isNegative = false,
}: {
  label: string
  value: number
  icon: React.ReactNode
  isNegative?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`font-medium ${isNegative ? "text-red-600" : ""}`}>
        {isNegative ? "-" : ""}${Math.abs(value).toLocaleString()}
      </span>
    </div>
  )
}

