"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface LeadGeographicMapProps {
  timeRange: string
}

export default function LeadGeographicMap({ timeRange }: LeadGeographicMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [regions, setRegions] = useState<any[]>([])

  useEffect(() => {
    setIsLoading(true)

    // Generate mock data for regions
    const generateRegions = () => {
      return [
        { name: "Boston", leads: 87, lat: 42.3601, lng: -71.0589, intensity: 0.9 },
        { name: "Worcester", leads: 54, lat: 42.2626, lng: -71.8023, intensity: 0.7 },
        { name: "Springfield", leads: 112, lat: 42.1015, lng: -72.5898, intensity: 1 },
        { name: "Cambridge", leads: 43, lat: 42.3736, lng: -71.1097, intensity: 0.6 },
        { name: "Lowell", leads: 38, lat: 42.6334, lng: -71.3162, intensity: 0.5 },
        { name: "Brockton", leads: 29, lat: 42.0834, lng: -71.0184, intensity: 0.4 },
        { name: "New Bedford", leads: 25, lat: 41.6362, lng: -70.9342, intensity: 0.3 },
        { name: "Quincy", leads: 31, lat: 42.2529, lng: -71.0023, intensity: 0.4 },
        { name: "Lynn", leads: 22, lat: 42.4668, lng: -70.9495, intensity: 0.3 },
        { name: "Fall River", leads: 19, lat: 41.7014, lng: -71.155, intensity: 0.2 },
      ]
    }

    // Simulate API call
    setTimeout(() => {
      setRegions(generateRegions())
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Lead Regions</h3>
            <div className="space-y-4">
              {regions
                .sort((a, b) => b.leads - a.leads)
                .slice(0, 5)
                .map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${0.2 + region.intensity * 0.8})`,
                          color: `rgba(30, 64, 175, ${0.5 + region.intensity * 0.5})`,
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{region.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold">{region.leads}</span>
                      <span className="text-gray-500 text-sm ml-1">leads</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lead Growth by Region</h3>
            <div className="space-y-4">
              {regions
                .sort((a, b) => b.intensity - a.intensity)
                .slice(0, 5)
                .map((region, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{region.name}</span>
                      <span className="text-sm text-green-600">+{Math.floor(region.intensity * 30)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${region.intensity * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative h-[300px] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Interactive map visualization</p>
            <p className="text-sm text-gray-400">
              This would be an interactive heatmap showing lead distribution across Massachusetts.
              <br />
              The actual implementation would use a mapping library like Mapbox or Google Maps.
            </p>
          </div>
        </div>

        {/* This is a placeholder for the actual map */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M170,50 L250,150 L150,230 L270,320 L190,400 L275,450 L400,420 L550,450 L650,350 L720,220 L650,120 L500,80 L350,120 L170,50"
              fill="#3b82f6"
              fillOpacity="0.3"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          </svg>

          {/* Render pins for each region */}
          {regions.map((region, index) => (
            <div
              key={index}
              className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(region.lng + 73) * 200}px`,
                top: `${(43 - region.lat) * 200}px`,
              }}
            >
              <div
                className="w-full h-full rounded-full animate-pulse"
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${region.intensity})`,
                  boxShadow: `0 0 0 ${region.intensity * 15}px rgba(59, 130, 246, 0.2)`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

