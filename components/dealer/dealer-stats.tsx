import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, DollarSign, Car } from "lucide-react"

export default function DealerStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Leads"
        value="247"
        change="+12.5%"
        trend="up"
        icon={<Users className="h-5 w-5 text-blue-600" />}
        description="Last 30 days"
      />

      <StatCard
        title="Conversion Rate"
        value="18.3%"
        change="+2.1%"
        trend="up"
        icon={<TrendingUp className="h-5 w-5 text-green-600" />}
        description="Leads to sales"
      />

      <StatCard
        title="Revenue Generated"
        value="$42,850"
        change="+8.7%"
        trend="up"
        icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        description="From lead purchases"
      />

      <StatCard
        title="Cost Per Lead"
        value="$24.75"
        change="-3.2%"
        trend="down"
        icon={<Car className="h-5 w-5 text-indigo-600" />}
        description="Average cost"
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  description: string
}

function StatCard({ title, value, change, trend, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-full">{icon}</div>
        </div>
        <div className="flex items-center mt-4">
          <span
            className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"} flex items-center`}
          >
            {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {change}
          </span>
          <span className="text-xs text-gray-500 ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

