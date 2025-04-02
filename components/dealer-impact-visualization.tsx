"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"

// Sample data with lines that are close before intervention and diverge after
const fullData = [
  { name: "Jan 11", withCarReport: 22, withoutCarReport: 21, avgPrice: 32500 },
  { name: "Jan 18", withCarReport: 23, withoutCarReport: 22, avgPrice: 32800 },
  { name: "Jan 25", withCarReport: 20, withoutCarReport: 20, avgPrice: 32600 },
  { name: "Feb 01", withCarReport: 25, withoutCarReport: 24, avgPrice: 32900 },
  { name: "Feb 08", withCarReport: 26, withoutCarReport: 26, avgPrice: 33100 },
  // Intervention point
  { name: "Feb 15", withCarReport: 31, withoutCarReport: 27, avgPrice: 33200 },
  { name: "Feb 22", withCarReport: 37, withoutCarReport: 28, avgPrice: 33400 },
  { name: "Mar 01", withCarReport: 41, withoutCarReport: 29, avgPrice: 33500 },
  { name: "Mar 08", withCarReport: 45, withoutCarReport: 30, avgPrice: 33600 },
  { name: "Mar 15", withCarReport: 48, withoutCarReport: 31, avgPrice: 33700 },
  { name: "Mar 22", withCarReport: 52, withoutCarReport: 32, avgPrice: 33800 },
]

// Custom tooltip that shows sales and revenue impact
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const withCarReport = payload.find((p) => p.dataKey === "withCarReport")?.value
    const withoutCarReport = payload.find((p) => p.dataKey === "withoutCarReport")?.value

    if (withCarReport !== undefined && withoutCarReport !== undefined) {
      const difference = withCarReport - withoutCarReport
      const percentDiff = ((difference / withoutCarReport) * 100).toFixed(1)

      // Find the average price for this date
      const dataPoint = fullData.find((d) => d.name === label)
      const avgPrice = dataPoint?.avgPrice || 33000

      // Calculate revenue impact
      const revenueImpact = difference * avgPrice

      return (
        <div className="bg-white border border-gray-200 p-4 text-sm shadow-lg rounded">
          <p className="font-medium mb-2 text-base">{label}</p>
          <div className="space-y-1">
            <p className="text-blue-600 font-medium">With CarReport: {withCarReport} sales</p>
            <p className="text-gray-700">Without CarReport: {withoutCarReport} sales</p>
            {difference > 0 && (
              <>
                <div className="h-px bg-gray-200 my-2"></div>
                <p className="font-medium text-blue-600">
                  {difference} additional sales (+{percentDiff}%)
                </p>
                <p className="font-medium text-blue-600">${revenueImpact.toLocaleString()} additional revenue</p>
              </>
            )}
          </div>
        </div>
      )
    }
  }
  return null
}

export default function DealerImpactVisualization() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 0, 1)) // Jan 1, 2025
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2025, 2, 31)) // Mar 31, 2025

  // Filter data based on selected date range
  const filterDataByDateRange = () => {
    if (!startDate || !endDate) return fullData

    const start = startDate.getTime()
    const end = endDate.getTime()

    return fullData.filter((item) => {
      const itemDate = new Date(item.name + ", 2025").getTime()
      return itemDate >= start && itemDate <= end
    })
  }

  const data = filterDataByDateRange()

  // Calculate summary metrics
  const interventionIndex = fullData.findIndex((d) => d.name === "Feb 15")
  const postInterventionData = data.filter((_, i) => i >= interventionIndex)
  const totalWithCarReport = postInterventionData.reduce((sum, d) => sum + d.withCarReport, 0)
  const totalWithoutCarReport = postInterventionData.reduce((sum, d) => sum + d.withoutCarReport, 0)
  const additionalSales = totalWithCarReport - totalWithoutCarReport
  const percentIncrease = (additionalSales / totalWithoutCarReport) * 100

  // Calculate average price for revenue impact
  const avgPrice = postInterventionData.reduce((sum, d) => sum + d.avgPrice, 0) / postInterventionData.length
  const revenueImpact = additionalSales * avgPrice

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">Sales Impact Analysis</h2>
        <p className="text-muted-foreground">
          Showing how CarReport has boosted your sales compared to what you would have sold without it
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ADDITIONAL SALES</span>
              <span className="text-3xl font-medium text-blue-600">{additionalSales.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">+{percentIncrease.toFixed(1)}% more sales</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ACTUAL SALES</span>
              <span className="text-3xl font-medium">{totalWithCarReport.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">Since Feb 10, 2025</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">REVENUE IMPACT</span>
              <span className="text-3xl font-medium text-blue-600">${revenueImpact.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">Additional revenue generated</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Date Range</div>
        <div className="flex space-x-4">
          <div>
            <span className="text-sm text-muted-foreground mr-2">From:</span>
            <DatePicker date={startDate} onSelect={setStartDate} id="start-date" />
          </div>
          <div>
            <span className="text-sm text-muted-foreground mr-2">To:</span>
            <DatePicker date={endDate} onSelect={setEndDate} id="end-date" />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <defs>
                  <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e6f4ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e6f4ff" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                {/* Make sure grid is visible across entire chart */}
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{
                    value: "Sales Volume",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                    offset: 0,
                  }}
                />

                {/* Ensure tooltip is properly configured */}
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ strokeDasharray: "3 3" }}
                  wrapperStyle={{ zIndex: 100 }}
                  isAnimationActive={false}
                />

                <Legend verticalAlign="bottom" height={36} iconType="circle" />

                {/* Make reference line extend full height */}
                <ReferenceLine
                  x="Feb 15"
                  stroke="#666"
                  strokeDasharray="3 3"
                  label={{
                    value: "CarReport Integration",
                    position: "insideTopRight",
                    fill: "#666",
                    fontSize: 12,
                  }}
                  isFront={true}
                />

                {/* Draw areas in correct order */}
                <Area
                  type="monotone"
                  dataKey="withoutCarReport"
                  stroke="#333333"
                  strokeWidth={2}
                  fill="#ffffff"
                  fillOpacity={1}
                  activeDot={{ r: 6, stroke: "#333333", strokeWidth: 1, fill: "#fff" }}
                  name="Expected Sales Without CarReport"
                  isAnimationActive={false}
                />

                <Area
                  type="monotone"
                  dataKey="withCarReport"
                  stroke="#1e88e5"
                  strokeWidth={2}
                  fill="url(#splitColor)"
                  fillOpacity={1}
                  activeDot={{ r: 6, stroke: "#1e88e5", strokeWidth: 1, fill: "#fff" }}
                  name="Sales With CarReport"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Info size={12} />
              <span>The blue shaded area shows additional sales generated by CarReport</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

