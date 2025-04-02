"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, ArrowRight } from "lucide-react"

interface RevenueAttributionChartProps {
  timeRange: string
}

export default function RevenueAttributionChart({ timeRange }: RevenueAttributionChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    roi: 0,
    averageSaleValue: 0,
    leadConversion: 0,
  })

  useEffect(() => {
    setIsLoading(true)

    // Generate mock data based on time range
    const generateData = () => {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
      const result = []

      let totalRevenue = 0
      let totalCost = 0

      const now = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Generate random data with some patterns
        const leadCost = Math.floor(Math.random() * 500) + 500
        const revenue = Math.floor(Math.random() * 3000) + 1000

        totalCost += leadCost
        totalRevenue += revenue

        result.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          "Lead Cost": leadCost,
          Revenue: revenue,
          Profit: revenue - leadCost,
        })
      }

      setMetrics({
        totalRevenue: totalRevenue,
        roi: (((totalRevenue - totalCost) / totalCost) * 100).toFixed(1),
        averageSaleValue: (totalRevenue / days).toFixed(0),
        leadConversion: (Math.random() * 10 + 15).toFixed(1),
      })

      return result
    }

    // Simulate API call
    setTimeout(() => {
      setData(generateData())
      setIsLoading(false)
    }, 1000)
  }, [timeRange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          description="From purchased leads"
        />

        <MetricCard
          title="ROI"
          value={`${metrics.roi}%`}
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          description="Return on investment"
        />

        <MetricCard
          title="Avg. Sale Value"
          value={`$${Number.parseInt(metrics.averageSaleValue).toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
          description="Per day"
        />

        <MetricCard
          title="Lead Conversion"
          value={`${metrics.leadConversion}%`}
          icon={<ArrowRight className="h-5 w-5 text-amber-600" />}
          description="Leads to sales"
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "none",
            }}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="Lead Cost" fill="#f87171" />
          <Bar dataKey="Revenue" fill="#34d399" />
          <Bar dataKey="Profit" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}

function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gray-100 p-2 rounded-full">{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}

