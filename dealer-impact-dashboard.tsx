"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Bar,
} from "recharts"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format, subDays } from "date-fns"

// Types
interface DealerImpactRequest {
  dealer_id: number
  start_date?: string
  end_date?: string
  intervention_date?: string
  average_order_value?: number
  average_margin?: number
}

interface DealerImpactSummary {
  total_observed_sales: number
  predicted_sales_without_carreport: number
  additional_sales_from_carreport: number
  relative_effect_percentage: number
  confidence_interval: [number, number]
  revenue_impact: number
  margin_impact: number
  average_order_value: number
  average_margin: number
  p_value: number
  is_statistically_significant: boolean
}

interface ChartData {
  dates: string[]
  actual: number[]
  predicted: number[]
  lower_bound: number[]
  upper_bound: number[]
  point_effects: number[]
  cumulative_effects: number[]
  intervention_date: string
}

interface DealerImpactResponse {
  summary: DealerImpactSummary
  chart_data: ChartData
  report_text: string
}

export default function DealerImpactDashboard() {
  const [dealerId, setDealerId] = useState<number>(1)
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 90))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [interventionDate, setInterventionDate] = useState<Date>(subDays(new Date(), 30))
  const [averageOrderValue, setAverageOrderValue] = useState<number>(45000)
  const [averageMargin, setAverageMargin] = useState<number>(3000)
  const [impactData, setImpactData] = useState<DealerImpactResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("overview")

  // Format dates for API
  const formatDateForApi = (date: Date) => format(date, "yyyy-MM-dd")

  // Fetch impact data
  const fetchImpactData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/dealers/${dealerId}/impact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealer_id: dealerId,
          start_date: formatDateForApi(startDate),
          end_date: formatDateForApi(endDate),
          intervention_date: formatDateForApi(interventionDate),
          average_order_value: averageOrderValue,
          average_margin: averageMargin,
        } as DealerImpactRequest),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch impact data")
      }

      const data = await response.json()
      setImpactData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Format chart data
  const formatChartData = (chartData: ChartData) => {
    return chartData.dates.map((date, index) => ({
      date,
      actual: chartData.actual[index],
      predicted: chartData.predicted[index],
      lowerBound: chartData.lower_bound[index],
      upperBound: chartData.upper_bound[index],
      pointEffect: chartData.point_effects[index],
      cumulativeEffect: chartData.cumulative_effects[index],
    }))
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  // Format number
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
    }).format(value)
  }

  // Load data on initial render
  useEffect(() => {
    fetchImpactData()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dealer Impact Analysis</h1>
        <Button onClick={fetchImpactData} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh Analysis"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="start-date">Start Date</Label>
                <DatePicker id="start-date" date={startDate} onSelect={setStartDate} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="end-date">End Date</Label>
                <DatePicker id="end-date" date={endDate} onSelect={setEndDate} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CarReport Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Label htmlFor="intervention-date">Integration Date</Label>
              <DatePicker id="intervention-date" date={interventionDate} onSelect={setInterventionDate} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Label htmlFor="aov">AOV ($)</Label>
              <Input
                id="aov"
                type="number"
                value={averageOrderValue}
                onChange={(e) => setAverageOrderValue(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Label htmlFor="margin">Margin per Vehicle ($)</Label>
              <Input
                id="margin"
                type="number"
                value={averageMargin}
                onChange={(e) => setAverageMargin(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {impactData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Additional Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">
                    {formatNumber(impactData.summary.additional_sales_from_carreport)}
                  </span>
                  <span className="text-sm text-muted-foreground">vehicles</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPercentage(impactData.summary.relative_effect_percentage)} increase in sales
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">{formatCurrency(impactData.summary.revenue_impact)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Additional revenue from CarReport</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profit Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold">{formatCurrency(impactData.summary.margin_impact)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Additional profit from CarReport</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impact Summary</CardTitle>
              <CardDescription>Analysis of CarReport's impact on your dealership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <p className="whitespace-pre-line">{impactData.report_text}</p>
              </div>

              {!impactData.summary.is_statistically_significant && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    This analysis is not yet statistically significant. Continue collecting data to improve confidence
                    in these results.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Sales Overview</TabsTrigger>
              <TabsTrigger value="pointwise">Pointwise Effects</TabsTrigger>
              <TabsTrigger value="cumulative">Cumulative Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Actual sales vs. predicted sales without CarReport</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        actual: {
                          label: "Actual Sales",
                          color: "hsl(var(--chart-1))",
                        },
                        predicted: {
                          label: "Predicted Without CarReport",
                          color: "hsl(var(--chart-2))",
                        },
                        confidence: {
                          label: "Confidence Interval",
                          color: "hsl(var(--chart-2) / 0.2)",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={formatChartData(impactData.chart_data)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                              const date = new Date(value)
                              return format(date, "MMM d")
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            label={{
                              value: "Sales",
                              angle: -90,
                              position: "insideLeft",
                              style: { textAnchor: "middle" },
                            }}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <ReferenceLine
                            x={impactData.chart_data.intervention_date}
                            stroke="#ff7300"
                            strokeDasharray="3 3"
                            label={{ value: "CarReport Integration", position: "top", fill: "#ff7300" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="upperBound"
                            stroke="transparent"
                            fill="var(--color-confidence)"
                            name="Confidence Interval"
                            stackId="1"
                          />
                          <Area
                            type="monotone"
                            dataKey="lowerBound"
                            stroke="transparent"
                            fill="var(--color-confidence)"
                            name="Confidence Interval"
                            stackId="1"
                          />
                          <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="var(--color-predicted)"
                            name="Predicted Without CarReport"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="var(--color-actual)"
                            name="Actual Sales"
                            strokeWidth={2}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pointwise" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pointwise Effects</CardTitle>
                  <CardDescription>Daily impact of CarReport on sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        pointEffect: {
                          label: "Daily Effect",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formatChartData(impactData.chart_data)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                              const date = new Date(value)
                              return format(date, "MMM d")
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            label={{
                              value: "Additional Sales",
                              angle: -90,
                              position: "insideLeft",
                              style: { textAnchor: "middle" },
                            }}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <ReferenceLine
                            x={impactData.chart_data.intervention_date}
                            stroke="#ff7300"
                            strokeDasharray="3 3"
                            label={{ value: "CarReport Integration", position: "top", fill: "#ff7300" }}
                          />
                          <ReferenceLine y={0} stroke="#000" />
                          <Bar dataKey="pointEffect" fill="var(--color-pointEffect)" name="Daily Effect" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cumulative" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cumulative Impact</CardTitle>
                  <CardDescription>Total accumulated impact of CarReport over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        cumulativeEffect: {
                          label: "Cumulative Effect",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formatChartData(impactData.chart_data)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                              const date = new Date(value)
                              return format(date, "MMM d")
                            }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            label={{
                              value: "Cumulative Additional Sales",
                              angle: -90,
                              position: "insideLeft",
                              style: { textAnchor: "middle" },
                            }}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <ReferenceLine
                            x={impactData.chart_data.intervention_date}
                            stroke="#ff7300"
                            strokeDasharray="3 3"
                            label={{ value: "CarReport Integration", position: "top", fill: "#ff7300" }}
                          />
                          <ReferenceLine y={0} stroke="#000" />
                          <Line
                            type="monotone"
                            dataKey="cumulativeEffect"
                            stroke="var(--color-cumulativeEffect)"
                            name="Cumulative Effect"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

