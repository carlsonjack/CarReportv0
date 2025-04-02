"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card } from "@/components/ui/card"

interface LeadFlowChartProps {
  timeRange: string
}

export default function LeadFlowChart({ timeRange }: LeadFlowChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // Generate mock data based on time range
    const generateData = () => {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
      const result = []

      const now = new Date()
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        // Generate random data with some patterns
        const sedanLeads = Math.floor(Math.random() * 10) + 5
        const suvLeads = Math.floor(Math.random() * 15) + 8
        const truckLeads = Math.floor(Math.random() * 8) + 3

        result.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          "Sedan Leads": sedanLeads,
          "SUV Leads": suvLeads,
          "Truck Leads": truckLeads,
          "Total Leads": sedanLeads + suvLeads + truckLeads,
        })
      }

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <LeadTypeCard title="Sedan Leads" value="124" change="+8%" color="#3b82f6" />
        <LeadTypeCard title="SUV Leads" value="186" change="+15%" color="#10b981" />
        <LeadTypeCard title="Truck Leads" value="73" change="+4%" color="#f59e0b" />
        <LeadTypeCard title="Total Leads" value="383" change="+11%" color="#6366f1" />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "none",
            }}
          />
          <Legend />
          <Area type="monotone" dataKey="Sedan Leads" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
          <Area type="monotone" dataKey="SUV Leads" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          <Area type="monotone" dataKey="Truck Leads" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

interface LeadTypeCardProps {
  title: string
  value: string
  change: string
  color: string
}

function LeadTypeCard({ title, value, change, color }: LeadTypeCardProps) {
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold mt-1">{value}</p>
          </div>
          <div className="text-sm font-medium text-green-600">{change}</div>
        </div>
        <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Number.parseInt(change)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </Card>
  )
}

