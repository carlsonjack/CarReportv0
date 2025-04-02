"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer } from "@/components/ui/chart"
import { Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts"
import { format, subDays } from "date-fns"
import { Info } from "lucide-react"

// Types
interface ImpactData {
  dates: string[]
  actual: number[]
  predicted: number[]
  lower: number[]
  upper: number[]
  cumulative: number[]
  interventionDate: string
}

export default function DealerImpactVisualization() {
  const [impactData, setImpactData] = useState<ImpactData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Format data for chart
  const formatChartData = (data: ImpactData) => {
    return data.dates.map((date, i) => ({
      date,
      actual: data.actual[i],
      predicted: data.predicted[i],
      lower: data.lower[i],
      upper: data.upper[i],
      cumulative: data.cumulative[i],
      effect: data.actual[i] - data.predicted[i],
    }))
  }

  // Generate mock data for demonstration
  const generateMockData = () => {
    const endDate = new Date()
    const startDate = subDays(endDate, 90)
    const interventionDate = subDays(endDate, 45)

    const dates: string[] = []
    const actual: number[] = []
    const predicted: number[] = []
    const lower: number[] = []
    const upper: number[] = []
    const cumulative: number[] = []

    let currentDate = new Date(startDate)
    let cumulativeEffect = 0

    while (currentDate <= endDate) {
      const dateStr = format(currentDate, "yyyy-MM-dd")
      dates.push(dateStr)

      const baseline = 20 + Math.sin(dates.length / 7) * 3

      // Before intervention, actual and predicted are similar
      if (currentDate < interventionDate) {
        const noise = (Math.random() - 0.5) * 2
        actual.push(baseline + noise)
        predicted.push(baseline)
        lower.push(baseline - 2)
        upper.push(baseline + 2)
        cumulative.push(0)
      }
      // After intervention, actual is higher than predicted
      else {
        const daysSinceIntervention = Math.floor(
          (currentDate.getTime() - interventionDate.getTime()) / (1000 * 60 * 60 * 24),
        )
        const effect = 5 * (1 - Math.exp(-daysSinceIntervention / 15))
        const noise = (Math.random() - 0.5) * 2

        actual.push(baseline + effect + noise)
        predicted.push(baseline)
        lower.push(baseline - 2)
        upper.push(baseline + 2)

        cumulativeEffect += baseline + effect + noise - baseline
        cumulative.push(cumulativeEffect)
      }

      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
    }

    return {
      dates,
      actual,
      predicted,
      lower,
      upper,
      cumulative,
      interventionDate: format(interventionDate, "yyyy-MM-dd"),
    }
  }

  // Load data on initial render
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setImpactData(generateMockData())
      setIsLoading(false)
    }, 1000)
  }, [])

  // Custom tooltip that follows Tufte principles
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dateLabel = format(new Date(label), "MMM d, yyyy")
      const actualValue = payload[0].value.toFixed(1)
      const predictedValue = payload[1]?.value.toFixed(1)
      const effect = payload[0].value - payload[1]?.value

      return (
        <div className="bg-background border border-border p-2 text-xs shadow-sm">
          <p className="font-medium">{dateLabel}</p>
          <p className="text-foreground">Actual: {actualValue}</p>
          <p className="text-muted-foreground">Predicted: {predictedValue}</p>
          {predictedValue && (
            <p className={`font-medium ${effect >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              Effect: {effect.toFixed(1)} ({effect >= 0 ? "+" : ""}
              {((effect / Number(predictedValue)) * 100).toFixed(1)}%)
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (isLoading || !impactData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading impact analysis...</p>
      </div>
    )
  }

  const chartData = formatChartData(impactData)

  // Calculate summary metrics
  const postInterventionData = chartData.filter((d) => new Date(d.date) >= new Date(impactData.interventionDate))

  const totalActual = postInterventionData.reduce((sum, d) => sum + d.actual, 0)
  const totalPredicted = postInterventionData.reduce((sum, d) => sum + d.predicted, 0)
  const totalEffect = totalActual - totalPredicted
  const percentEffect = (totalEffect / totalPredicted) * 100

  // Find the last cumulative effect
  const lastCumulative = chartData[chartData.length - 1]?.cumulative || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">Causal Impact Analysis</h2>
        <p className="text-muted-foreground">
          Showing actual sales volume compared to predicted volume without CarReport integration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ADDITIONAL SALES</span>
              <span className="text-3xl font-medium">{totalEffect.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                {percentEffect >= 0 ? "+" : ""}
                {percentEffect.toFixed(1)}% vs. baseline
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ACTUAL SALES</span>
              <span className="text-3xl font-medium">{totalActual.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                Since {format(new Date(impactData.interventionDate), "MMM d, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">PREDICTED SALES</span>
              <span className="text-3xl font-medium">{totalPredicted.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">Without CarReport</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
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
                  label: "95% Confidence Interval",
                  color: "hsl(var(--chart-2) / 0.15)",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <Line data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted) / 0.3)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => value.toFixed(0)}
                    domain={["dataMin - 5", "dataMax + 5"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    x={impactData.interventionDate}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="3 3"
                    label={{
                      value: "CarReport Integration",
                      position: "top",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />

                  {/* Confidence interval */}
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="transparent"
                    fill="var(--color-confidence)"
                    fillOpacity={1}
                    name="95% Confidence Interval"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="transparent"
                    fill="hsl(var(--background))"
                    fillOpacity={1}
                    name="95% Confidence Interval"
                    isAnimationActive={false}
                  />

                  {/* Predicted line */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="var(--color-predicted)"
                    strokeWidth={2}
                    dot={false}
                    name="Predicted Without CarReport"
                    isAnimationActive={false}
                  />

                  {/* Actual line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-actual)"
                    strokeWidth={2.5}
                    dot={false}
                    name="Actual Sales"
                    isAnimationActive={false}
                  />
                </Line>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Info size={12} />
              <span>The blue band shows the predicted sales range without CarReport integration</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="h-[250px]">
            <ChartContainer
              config={{
                cumulative: {
                  label: "Cumulative Effect",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <Line data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted) / 0.3)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => value.toFixed(0)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    x={impactData.interventionDate}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="3 3"
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />

                  {/* Cumulative effect line */}
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="var(--color-cumulative)"
                    strokeWidth={2.5}
                    dot={false}
                    name="Cumulative Effect"
                    isAnimationActive={false}
                  />
                </Line>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Info size={12} />
              <span>Cumulative additional sales attributed to CarReport over time</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

