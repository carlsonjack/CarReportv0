"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { ArrowDownRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OwnershipCostAnalysisProps {
  vehicleData: {
    year: number
    make: string
    model: string
    trim?: string
  }
}

export default function OwnershipCostAnalysis({ vehicleData }: OwnershipCostAnalysisProps) {
  const [activeView, setActiveView] = useState<"annual" | "fiveYear">("annual")

  // Sample data for the depreciation chart
  const depreciationData = [
    { year: 2019, value: 54765 },
    { year: 2020, value: 45000 },
    { year: 2021, value: 38000 },
    { year: 2022, value: 32000 },
    { year: 2023, value: 28000 },
    { year: 2024, value: 25000 },
  ]

  // Cost breakdown data
  const costCategories = [
    { name: "Fuel", vehicle: 3145, average: 4245 },
    { name: "Maintenance", vehicle: 1235, average: 1503 },
    { name: "Insurance", vehicle: 500, average: 400 },
    { name: "Repairs", vehicle: 3344, average: 4566 },
    { name: "Financing", vehicle: 2100, average: 3103 },
    { name: "State Fees", vehicle: 50, average: 50 },
    { name: "Depreciation", vehicle: 4257, average: 4245 },
  ]

  // Calculate totals
  const vehicleTotal = costCategories.reduce((sum, item) => sum + item.vehicle, 0)
  const averageTotal = costCategories.reduce((sum, item) => sum + item.average, 0)
  const savings = averageTotal - vehicleTotal

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Custom tooltip for depreciation chart
  const DepreciationTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.year}</p>
          <p className="text-blue-600">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Depreciation Chart */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vehicle Depreciation</CardTitle>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Shows how your vehicle's value decreases over time. The steeper the curve, the faster the
                      depreciation.
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <CardDescription>
              Original MSRP: {formatCurrency(54765)} • Current Value: {formatCurrency(25000)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={depreciationData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} domain={[0, 60000]} />
                  <Tooltip content={<DepreciationTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right column - Cost Summary */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Annual Cost of Ownership</CardTitle>
            <CardDescription>
              {vehicleData.year} {vehicleData.make} {vehicleData.model} {vehicleData.trim}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold">{formatCurrency(vehicleTotal)}</div>
                <p className="text-gray-500">Total Annual Cost</p>
                <div className="mt-2 flex items-center text-green-600">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span className="font-medium">{formatCurrency(savings)} less than average</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Your Vehicle</p>
                  <p className="text-2xl font-bold">{formatCurrency(vehicleTotal)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Average Full-Size Pickup</p>
                  <p className="text-2xl font-bold">{formatCurrency(averageTotal)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Breakdown</CardTitle>
            <Tabs defaultValue="annual" onValueChange={(value) => setActiveView(value as "annual" | "fiveYear")}>
              <TabsList>
                <TabsTrigger value="annual">Annual</TabsTrigger>
                <TabsTrigger value="fiveYear">5-Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Comparing {vehicleData.year} {vehicleData.make} {vehicleData.model} to average full-size pickup trucks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costCategories} layout="vertical" margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), ""]}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend />
                <Bar
                  name={`${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`}
                  dataKey="vehicle"
                  fill="#2563eb"
                  barSize={20}
                />
                <Bar name="Average Full-Size Pickup" dataKey="average" fill="#94a3b8" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Cost Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Category</th>
                  <th className="text-right py-2 px-4">
                    {vehicleData.year} {vehicleData.make} {vehicleData.model}
                  </th>
                  <th className="text-right py-2 px-4">Full-Size Pickups</th>
                  <th className="text-right py-2 px-4">Difference</th>
                </tr>
              </thead>
              <tbody>
                {costCategories.map((category, index) => {
                  const difference = category.average - category.vehicle
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{category.name}</td>
                      <td className="text-right py-2 px-4">{formatCurrency(category.vehicle)}</td>
                      <td className="text-right py-2 px-4">{formatCurrency(category.average)}</td>
                      <td
                        className={`text-right py-2 px-4 ${difference > 0 ? "text-green-600" : difference < 0 ? "text-red-600" : ""}`}
                      >
                        {difference > 0 ? "+" : ""}
                        {formatCurrency(difference)}
                      </td>
                    </tr>
                  )
                })}
                <tr className="bg-gray-50 font-bold">
                  <td className="py-2 px-4">Total</td>
                  <td className="text-right py-2 px-4">{formatCurrency(vehicleTotal)}</td>
                  <td className="text-right py-2 px-4">{formatCurrency(averageTotal)}</td>
                  <td
                    className={`text-right py-2 px-4 ${savings > 0 ? "text-green-600" : savings < 0 ? "text-red-600" : ""}`}
                  >
                    {savings > 0 ? "+" : ""}
                    {formatCurrency(savings)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-lg">Cost Efficiency</h4>
              <p className="text-gray-600">
                Your {vehicleData.year} {vehicleData.make} {vehicleData.model} costs{" "}
                <span className="font-medium text-green-600">{formatCurrency(savings)} less per year</span> than the
                average full-size pickup truck, making it a more economical choice in its class.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-lg">Depreciation Impact</h4>
              <p className="text-gray-600">
                This vehicle has depreciated by <span className="font-medium">{formatCurrency(54765 - 25000)}</span>{" "}
                since new, which is approximately{" "}
                <span className="font-medium">{Math.round(((54765 - 25000) / 54765) * 100)}%</span> of its original
                MSRP.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-lg">Highest Cost Categories</h4>
              <p className="text-gray-600">
                Your biggest annual expenses are{" "}
                <span className="font-medium">
                  depreciation (${costCategories.find((c) => c.name === "Depreciation")?.vehicle})
                </span>{" "}
                and{" "}
                <span className="font-medium">fuel (${costCategories.find((c) => c.name === "Fuel")?.vehicle})</span>,
                which together account for{" "}
                <span className="font-medium">
                  {Math.round(
                    (((costCategories.find((c) => c.name === "Depreciation")?.vehicle || 0) +
                      (costCategories.find((c) => c.name === "Fuel")?.vehicle || 0)) /
                      vehicleTotal) *
                      100,
                  )}
                  %
                </span>{" "}
                of your total ownership costs.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-lg">Budget Planning</h4>
              <p className="text-gray-600">
                To own this vehicle, you should budget approximately{" "}
                <span className="font-medium">{formatCurrency(Math.round(vehicleTotal / 12))}</span> per month for all
                ownership costs, including depreciation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

