"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function GeographicDistribution() {
  // Mock data for geographic distribution
  const regions = [
    { name: "Downtown", count: 87, percentage: 22, growth: 12 },
    { name: "North Suburbs", count: 124, percentage: 31, growth: 8 },
    { name: "South County", count: 76, percentage: 19, growth: -3 },
    { name: "East Side", count: 62, percentage: 15, growth: 5 },
    { name: "West County", count: 52, percentage: 13, growth: 15 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">Geographic Distribution</h2>
        <p className="text-muted-foreground">Lead distribution across your market area</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Distribution by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regions.map((region) => (
              <div key={region.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium">{region.name}</span>
                    <span className="text-sm text-muted-foreground">{region.count} leads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{region.percentage}%</span>
                    <span className={`text-xs ${region.growth >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {region.growth >= 0 ? "+" : ""}
                      {region.growth}%
                    </span>
                  </div>
                </div>
                <Progress value={region.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Zip Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { zipCode: "63141", count: 42, percentage: 10.5 },
                { zipCode: "63122", count: 38, percentage: 9.5 },
                { zipCode: "63105", count: 35, percentage: 8.8 },
                { zipCode: "63017", count: 31, percentage: 7.8 },
                { zipCode: "63131", count: 28, percentage: 7.0 },
              ].map((item) => (
                <div key={item.zipCode} className="flex justify-between items-center">
                  <span className="font-medium">{item.zipCode}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">{item.count} leads</span>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { range: "0-5 miles", count: 98, percentage: 24.5 },
                { range: "5-10 miles", count: 124, percentage: 31.0 },
                { range: "10-15 miles", count: 87, percentage: 21.8 },
                { range: "15-20 miles", count: 52, percentage: 13.0 },
                { range: "20+ miles", count: 39, percentage: 9.7 },
              ].map((item) => (
                <div key={item.range} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.range}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{item.count} leads</span>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

