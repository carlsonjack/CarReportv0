"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, RefreshCw, Download } from "lucide-react"
import DealerImpactVisualization from "@/components/dealer-impact-visualization"
import LeadFlowChart from "@/components/dealer/lead-flow-chart"
import LeadGeographicMap from "@/components/dealer/lead-geographic-map"
import RevenueAttributionChart from "@/components/dealer/revenue-attribution-chart"
import Header from "@/components/header"

export default function DealerDashboardPage() {
  const [timeframe, setTimeframe] = useState("30")
  const dealerName = "Springfield Toyota"

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dealer Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {dealerName}. View your performance and analytics.</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last 365 days</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">TOTAL LEADS</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-medium">247</span>
                  <span className="text-sm text-emerald-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12.5%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Last {timeframe} days</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">CONVERSION RATE</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-medium">18.3%</span>
                  <span className="text-sm text-emerald-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    2.1%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Leads to sales</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">REVENUE GENERATED</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-medium">$42,850</span>
                  <span className="text-sm text-emerald-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8.7%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">From lead purchases</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">COST PER LEAD</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-medium">$24.75</span>
                  <span className="text-sm text-red-600 flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    3.2%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Average cost</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="impact" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="impact">Causal Impact</TabsTrigger>
            <TabsTrigger value="lead-flow">Lead Flow</TabsTrigger>
            <TabsTrigger value="geographic">Geographic Distribution</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Attribution</TabsTrigger>
          </TabsList>

          <TabsContent value="impact" className="mt-4">
            <DealerImpactVisualization />
          </TabsContent>

          <TabsContent value="lead-flow" className="mt-4">
            <LeadFlowChart />
          </TabsContent>

          <TabsContent value="geographic" className="mt-4">
            <LeadGeographicMap />
          </TabsContent>

          <TabsContent value="revenue" className="mt-4">
            <RevenueAttributionChart />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

