"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, Car, Clock, Download, Search } from "lucide-react"

export default function UserDashboard() {
  const [recentReports] = useState([
    {
      id: "1",
      vehicle: "2018 Toyota Camry XSE",
      date: "March 15, 2025",
      vin: "4T1BZ1HK5JU123456",
      score: 87,
    },
    {
      id: "2",
      vehicle: "2020 Honda Accord Sport",
      date: "February 28, 2025",
      vin: "1HGCV2F34LA012345",
      score: 92,
    },
  ])

  const [savedVehicles] = useState([
    {
      id: "1",
      vehicle: "2018 Toyota Camry XSE",
      vin: "4T1BZ1HK5JU123456",
    },
    {
      id: "2",
      vehicle: "2020 Honda Accord Sport",
      vin: "1HGCV2F34LA012345",
    },
    {
      id: "3",
      vehicle: "2019 Ford F-150 XLT",
      vin: "1FTEW1EP5KFA12345",
    },
  ])

  const [searchHistory] = useState([
    {
      id: "1",
      query: "2018 Toyota Camry accident history",
      date: "March 15, 2025",
    },
    {
      id: "2",
      query: "Honda Accord reliability",
      date: "February 28, 2025",
    },
    {
      id: "3",
      query: "Ford F-150 service records",
      date: "February 20, 2025",
    },
    {
      id: "4",
      query: "Best SUVs under $30,000",
      date: "February 15, 2025",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{recentReports.length}</h3>
                <p className="text-gray-500">Reports Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Car className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{savedVehicles.length}</h3>
                <p className="text-gray-500">Saved Vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Search className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{searchHistory.length}</h3>
                <p className="text-gray-500">Recent Searches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
          <TabsTrigger value="vehicles">Saved Vehicles</TabsTrigger>
          <TabsTrigger value="searches">Search History</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>View and download your recently generated vehicle reports</CardDescription>
            </CardHeader>
            <CardContent>
              {recentReports.length > 0 ? (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{report.vehicle}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>VIN: {report.vin}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {report.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold">{report.score}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No reports yet</h3>
                  <p className="text-gray-500 mb-4">You haven't generated any vehicle reports yet.</p>
                  <Button>Generate a Report</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Saved Vehicles</CardTitle>
              <CardDescription>Vehicles you've saved for future reference</CardDescription>
            </CardHeader>
            <CardContent>
              {savedVehicles.length > 0 ? (
                <div className="space-y-4">
                  {savedVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Car className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{vehicle.vehicle}</h4>
                          <div className="text-sm text-gray-500">
                            <span>VIN: {vehicle.vin}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Get Report
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No saved vehicles</h3>
                  <p className="text-gray-500 mb-4">You haven't saved any vehicles yet.</p>
                  <Button>Add a Vehicle</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="searches">
          <Card>
            <CardHeader>
              <CardTitle>Search History</CardTitle>
              <CardDescription>Your recent searches on CarReport</CardDescription>
            </CardHeader>
            <CardContent>
              {searchHistory.length > 0 ? (
                <div className="space-y-4">
                  {searchHistory.map((search) => (
                    <div key={search.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Search className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{search.query}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {search.date}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Search Again
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No search history</h3>
                  <p className="text-gray-500 mb-4">You haven't performed any searches yet.</p>
                  <Button>Start Searching</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

