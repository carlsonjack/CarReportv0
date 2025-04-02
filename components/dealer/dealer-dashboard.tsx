"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import LeadFlowChart from "./lead-flow-chart"
import LeadGeographicMap from "./lead-geographic-map"
import RevenueAttributionChart from "./revenue-attribution-chart"
import DealerStats from "./dealer-stats"

export default function DealerDashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Welcome, Springfield Toyota</h2>
          <p className="text-gray-500">View your lead performance and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <DealerStats />

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="leads">Lead Flow</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Distribution</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Attribution</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Lead Flow Tracker</CardTitle>
              <CardDescription>Real-time view of inventory matched leads being purchased</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LeadFlowChart timeRange={timeRange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Lead Distribution</CardTitle>
              <CardDescription>Heatmap showing where your leads are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <LeadGeographicMap timeRange={timeRange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Attribution</CardTitle>
              <CardDescription>Direct revenue impact from purchased leads over the last month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <RevenueAttributionChart timeRange={timeRange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

