"use client"

import type React from "react"

import { useState } from "react"
import { Info, Building, User, Briefcase, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TimelineEvent {
  id: string
  date: string
  title: string
  mileage: number
  mileageDelta?: number
  description: string
  icon: React.ReactNode
  type: "title" | "registration" | "accident" | "service" | "sale"
  usageType?: "personal" | "commercial" | "lease"
  state?: string
  highlight?: boolean
  isUserEntered?: boolean
}

interface VehicleTimelineVisualProps {
  events: TimelineEvent[]
  vehicleYear: number
  vehicleMake: string
  vehicleModel: string
}

export default function VehicleTimelineVisual({
  events,
  vehicleYear,
  vehicleMake,
  vehicleModel,
}: VehicleTimelineVisualProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Filter only title events for the horizontal timeline
  const titleEvents = sortedEvents.filter((event) => event.type === "title" || event.type === "sale")

  // Check for mileage discrepancies
  const hasMileageDiscrepancy = titleEvents.some((event, index, arr) => {
    if (index > 0 && event.isUserEntered && event.mileage < arr[index - 1].mileage) {
      return true
    }
    return false
  })

  // Calculate statistics
  const totalMileage = sortedEvents[sortedEvents.length - 1].mileage
  const timeSpanYears = (new Date().getTime() - new Date(sortedEvents[0].date).getTime()) / (1000 * 60 * 60 * 24 * 365)
  const averageMileagePerYear = Math.round(totalMileage / timeSpanYears)
  const industryAverageMileage = 15000
  const mileageComparisonPercent = Math.round(
    ((averageMileagePerYear - industryAverageMileage) / industryAverageMileage) * 100,
  )

  // Count unique owners and states
  const uniqueOwners = new Set(
    sortedEvents
      .filter((event) => event.type === "title" || event.type === "sale")
      .map((event) => event.id.split("-")[0]),
  ).size

  const uniqueStates = new Set(sortedEvents.filter((event) => event.state).map((event) => event.state)).size

  // Check for accidents
  const accidentCount = sortedEvents.filter((event) => event.type === "accident").length

  // Get usage types
  const usageTypes = [...new Set(sortedEvents.filter((event) => event.usageType).map((event) => event.usageType))]

  // Determine mileage classification
  const mileageClassification =
    averageMileagePerYear < 10000
      ? "VERY LOW MILEAGE"
      : averageMileagePerYear < 13000
        ? "LOW MILEAGE"
        : averageMileagePerYear > 18000
          ? "HIGH MILEAGE"
          : "AVERAGE MILEAGE"

  // Calculate total mileage across all periods for proportional display
  const calculateTotalMileageDelta = () => {
    let total = 0
    for (let i = 0; i < titleEvents.length - 1; i++) {
      const mileageDelta = titleEvents[i + 1].mileage - titleEvents[i].mileage
      total += Math.abs(mileageDelta) // Use absolute value to handle potential discrepancies
    }
    return total
  }

  const totalMileageDelta = calculateTotalMileageDelta()

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Explanation Section */}
      {showExplanation && (
        <div className="bg-blue-50 border-b border-blue-100 p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-blue-800 text-lg">Goal of the Timeline</h4>
                <p className="text-sm text-blue-700">
                  This visual summarizes the <strong>ownership timeline and usage history</strong> of a{" "}
                  <strong>
                    {vehicleYear} {vehicleMake} {vehicleModel}
                  </strong>
                  , using title transfer events to:
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Hide Explanation
            </button>
          </div>

          <ul className="list-disc pl-10 text-sm text-blue-700 space-y-1 mb-3">
            <li>Track how much the vehicle has been driven between owners</li>
            <li>Identify the number of owners and states</li>
            <li>Evaluate mileage trends (like low/high usage)</li>
            <li>Confirm accident history</li>
            <li>Show the vehicle's usage type</li>
          </ul>

          <p className="text-sm text-blue-700 font-medium pl-6">
            It answers the question:
            <br />👉 "How many times has this vehicle changed hands, how much has it been driven, and what can we infer
            about its usage?"
          </p>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">What the Timeline Shows</h5>
            <p className="text-sm text-blue-700 mb-2">
              Each point on the timeline represents a <strong>title transfer or registration event</strong>. The numbers
              show <strong>miles driven between events</strong>, not total odometer readings.
            </p>
          </div>
        </div>
      )}

      {/* Horizontal Timeline */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Title Transfer Timeline</h3>
          {!showExplanation && (
            <button
              onClick={() => setShowExplanation(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Show Explanation
            </button>
          )}
        </div>

        {/* Enhanced Timeline with Mileage Bars */}
        <div className="relative mt-12 mb-32">
          {/* Timeline line */}
          <div className="absolute h-1 bg-gray-200 left-0 right-0 top-16"></div>

          {/* Timeline events */}
          <div className="flex justify-between relative">
            {titleEvents.map((event, index) => {
              const nextEvent = index < titleEvents.length - 1 ? titleEvents[index + 1] : null
              const mileageDelta = nextEvent ? nextEvent.mileage - event.mileage : 0
              const hasMileageIssue = nextEvent?.isUserEntered && nextEvent.mileage < event.mileage

              // Calculate proportional width for mileage bars
              const mileageProportion =
                totalMileageDelta > 0 && nextEvent ? Math.abs(mileageDelta) / totalMileageDelta : 0

              return (
                <div key={event.id} className="flex flex-col items-center relative" style={{ minWidth: "80px" }}>
                  {/* Connector line */}
                  <div className="absolute h-8 w-0.5 bg-gray-200 top-8 left-1/2 -translate-x-1/2"></div>

                  {/* Event icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      event.isUserEntered && hasMileageIssue
                        ? "bg-red-100 border-2 border-red-400"
                        : event.highlight
                          ? "bg-yellow-100 border-2 border-yellow-400"
                          : "bg-white border-2 border-blue-400"
                    }`}
                  >
                    {event.icon}
                  </div>

                  {/* Date */}
                  <div className="text-xs font-medium mt-2 text-gray-600">{event.date}</div>

                  {/* Title */}
                  <div className="font-bold text-sm mt-1">
                    {event.title}
                    {event.isUserEntered && <span className="text-xs text-gray-500">*</span>}
                  </div>

                  {/* Mileage */}
                  <div className="text-xs text-gray-600 mt-1">{event.mileage.toLocaleString()} Miles</div>

                  {/* State badge if available */}
                  {event.state && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {event.state}
                    </Badge>
                  )}

                  {/* Usage type icon */}
                  {event.usageType && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="mt-2 text-gray-500">
                            {event.usageType === "personal" && <User className="h-4 w-4" />}
                            {event.usageType === "commercial" && <Building className="h-4 w-4" />}
                            {event.usageType === "lease" && <Briefcase className="h-4 w-4" />}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {event.usageType === "personal" && "Personal Use"}
                            {event.usageType === "commercial" && "Commercial Use"}
                            {event.usageType === "lease" && "Lease Vehicle"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mileage bars - rendered separately to ensure proper positioning */}
          <div className="absolute left-0 right-0 top-[16.5rem]">
            {titleEvents.map((event, index) => {
              if (index >= titleEvents.length - 1) return null

              const nextEvent = titleEvents[index + 1]
              const mileageDelta = nextEvent.mileage - event.mileage
              const hasMileageIssue = nextEvent.isUserEntered && nextEvent.mileage < event.mileage

              // Calculate proportional width and position
              const mileageProportion =
                totalMileageDelta > 0 ? Math.abs(mileageDelta) / totalMileageDelta : 1 / (titleEvents.length - 1)

              // Calculate position based on cumulative mileage up to this point
              let cumulativeProportion = 0
              for (let i = 0; i < index; i++) {
                const delta = Math.abs(titleEvents[i + 1].mileage - titleEvents[i].mileage)
                cumulativeProportion += delta / totalMileageDelta
              }

              return (
                <div
                  key={`mileage-${event.id}`}
                  className={`absolute rounded-lg flex items-center justify-center px-4 py-2 ${
                    hasMileageIssue ? "bg-red-100" : "bg-green-100"
                  }`}
                  style={{
                    left: `${cumulativeProportion * 100}%`,
                    width: `${mileageProportion * 100}%`,
                    height: "2rem",
                    // Add small margin to prevent touching the timeline points
                    margin: "0 5px",
                  }}
                >
                  <span className={`text-sm font-medium ${hasMileageIssue ? "text-red-700" : "text-green-700"}`}>
                    {hasMileageIssue
                      ? `${Math.abs(mileageDelta).toLocaleString()} Miles discrepancy`
                      : `${mileageDelta.toLocaleString()} Miles driven`}
                    {nextEvent.isUserEntered && !hasMileageIssue && "*"}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Mileage discrepancy warning */}
          {hasMileageDiscrepancy && (
            <div className="mt-24 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 font-medium">
                  *User-entered mileage is lower than the last recorded title mileage.
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Please verify the listing mileage, as discrepancies may indicate input errors or possible odometer
                  tampering.
                </p>
              </div>
            </div>
          )}

          {/* User-entered mileage note */}
          {titleEvents.some((event) => event.isUserEntered) && !hasMileageDiscrepancy && (
            <div className="mt-24 text-xs text-gray-500 text-right">*User-entered mileage difference</div>
          )}
        </div>

        {/* Summary Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-5 border">
          <h4 className="text-lg font-bold mb-4">Title History Summary</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-700 mb-3">Vehicle Statistics</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Mileage:</span>
                  <span className="font-bold">
                    {totalMileage.toLocaleString()} miles
                    {titleEvents[titleEvents.length - 1].isUserEntered && (
                      <span className="text-xs text-gray-500 ml-1">*</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Accidents:</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">{accidentCount} reported</span>
                    {accidentCount === 0 ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">CLEAN</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">ACCIDENT HISTORY</Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Owners:</span>
                  <span className="font-bold">
                    {uniqueOwners} owners across {uniqueStates} {uniqueStates === 1 ? "state" : "states"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Usage Types:</span>
                  <div className="flex gap-1">
                    {usageTypes.map((type) => (
                      <Badge key={type} variant="outline" className="capitalize">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-700 mb-3">Mileage Analysis</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average per year:</span>
                  <span className="font-bold">{averageMileagePerYear.toLocaleString()} miles/year</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Compared to average:</span>
                  <span className={`font-bold ${mileageComparisonPercent <= 0 ? "text-green-600" : "text-yellow-600"}`}>
                    {mileageComparisonPercent <= 0
                      ? `${Math.abs(mileageComparisonPercent)}% lower`
                      : `${mileageComparisonPercent}% higher`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Classification:</span>
                  <Badge
                    className={`
                    ${mileageClassification.includes("VERY LOW") ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                    ${mileageClassification.includes("LOW") && !mileageClassification.includes("VERY") ? "bg-green-50 text-green-700 hover:bg-green-50" : ""}
                    ${mileageClassification.includes("AVERAGE") ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : ""}
                    ${mileageClassification.includes("HIGH") ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""}
                  `}
                  >
                    {mileageClassification}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Industry Average:</span> The average vehicle is driven approximately
                    15,000 miles per year. This vehicle's usage is {mileageComparisonPercent <= 0 ? "below" : "above"}{" "}
                    that average.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

