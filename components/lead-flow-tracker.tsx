"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { format, subDays } from "date-fns"

const generateMockData = () => {
  const data = []
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = subDays(now, i)
    data.push({
      date: format(date, "yyyy-MM-dd"),
      sedan: Math.floor(Math.random() * 10) + 2,
      suv: Math.floor(Math.random() * 15) + 5,
      truck: Math.floor(Math.random() * 8) + 1,
    })
  }

  return data
}

export default function LeadFlowTracker() {
  const data = generateMockData()

  // Calculate totals
  const sedanTotal = data.reduce((sum, item) => sum + item.sedan, 0)
  const suvTotal = data.reduce((sum, item) => sum + item.suv, 0)
  const truckTotal = data.reduce((sum, item) => sum + item.truck, 0)
  const total = sedanTotal + suvTotal + truckTotal

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">Lead Flow Tracker</h2>
        <p className="text-muted-foreground">Real-time view of inventory matched leads being purchased</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">SEDAN LEADS</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-medium">{sedanTotal}</span>
                <span className="text-sm text-emerald-600">+8%</span>
              </div>
              <Progress
                value={(sedanTotal / total) * 100}
                className="h-1 mt-2 bg-blue-100"
                indicatorClassName="bg-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">SUV LEADS</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-medium">{suvTotal}</span>
                <span className="text-sm text-emerald-600">+15%</span>
              </div>
              <Progress
                value={(suvTotal / total) * 100}
                className="h-1 mt-2 bg-green-100"
                indicatorClassName="bg-green-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">TRUCK LEADS</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-medium">{truckTotal}</span>
                <span className="text-sm text-emerald-600">+4%</span>
              </div>
              <Progress
                value={(truckTotal / total) * 100}
                className="h-1 mt-2 bg-yellow-100"
                indicatorClassName="bg-yellow-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">TOTAL LEADS</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-medium">{total}</span>
                <span className="text-sm text-emerald-600">+11%</span>
              </div>
              <Progress value={100} className="h-1 mt-2 bg-purple-100" indicatorClassName="bg-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Flow Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                sedan: {
                  label: "Sedan",
                  color: "hsl(var(--chart-1))",
                },
                suv: {
                  label: "SUV",
                  color: "hsl(var(--chart-2))",
                },
                truck: {
                  label: "Truck",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), "MMM d")} />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sedan"
                    stackId="1"
                    stroke="var(--color-sedan)"
                    fill="var(--color-sedan)"
                  />
                  <Area type="monotone" dataKey="suv" stackId="1" stroke="var(--color-suv)" fill="var(--color-suv)" />
                  <Area
                    type="monotone"
                    dataKey="truck"
                    stackId="1"
                    stroke="var(--color-truck)"
                    fill="var(--color-truck)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

