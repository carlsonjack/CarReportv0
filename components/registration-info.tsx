import type React from "react"
import { CalendarDays, ClipboardCheck, DollarSign, HelpCircle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock registration data - this would be replaced with actual data from API/CSV
const registrationData = {
  Alabama: { fee: "$23–$105", frequency: "Yearly", inspection: "None required" },
  Alaska: { fee: "$100–$200", frequency: "Every 2 years", inspection: "None required" },
  Arizona: { fee: "$45–$90", frequency: "Yearly", inspection: "Emissions testing in certain counties" },
  Arkansas: { fee: "$25–$30", frequency: "Yearly", inspection: "None required" },
  California: { fee: "$60–$180", frequency: "Yearly", inspection: "Emissions testing required" },
  Colorado: { fee: "$75–$125", frequency: "Yearly", inspection: "Emissions testing in certain counties" },
  Connecticut: { fee: "$80–$120", frequency: "Every 2 years", inspection: "Emissions testing required" },
  Delaware: { fee: "$40–$90", frequency: "Yearly", inspection: "Safety inspection required" },
  Florida: { fee: "$70–$100", frequency: "Yearly or biennially", inspection: "None required" },
  Georgia: { fee: "$20–$95", frequency: "Yearly", inspection: "Emissions testing in certain counties" },
  Hawaii: { fee: "$45–$75", frequency: "Yearly", inspection: "Safety inspection required" },
  Idaho: { fee: "$45–$70", frequency: "Yearly", inspection: "None required" },
  Illinois: { fee: "$151", frequency: "Yearly", inspection: "Emissions testing in certain counties" },
  Indiana: { fee: "$21–$30", frequency: "Yearly", inspection: "None required" },
  Iowa: { fee: "$50–$80", frequency: "Yearly", inspection: "None required" },
  Kansas: { fee: "$35–$75", frequency: "Yearly", inspection: "None required" },
  Kentucky: { fee: "$21–$30", frequency: "Yearly", inspection: "None required" },
  Louisiana: { fee: "$20–$82", frequency: "Every 2 years", inspection: "Safety inspection required" },
  Maine: { fee: "$35–$45", frequency: "Yearly", inspection: "Safety inspection required" },
  Maryland: { fee: "$135–$187", frequency: "Every 2 years", inspection: "Safety inspection for new registrations" },
  Massachusetts: { fee: "$60–$80", frequency: "Every 2 years", inspection: "Safety and emissions testing required" },
  Michigan: { fee: "$100–$200", frequency: "Yearly", inspection: "None required" },
  Minnesota: { fee: "$35–$75", frequency: "Yearly", inspection: "None required" },
  Mississippi: { fee: "$12.75–$30", frequency: "Yearly", inspection: "None required" },
  Missouri: { fee: "$18.75–$51", frequency: "Every 2 years", inspection: "Safety inspection required" },
  Montana: { fee: "$87–$217", frequency: "Yearly", inspection: "None required" },
  Nebraska: { fee: "$15–$30", frequency: "Yearly", inspection: "None required" },
  Nevada: { fee: "$33–$63", frequency: "Yearly", inspection: "Emissions testing in certain counties" },
  "New Hampshire": { fee: "$31.20–$45.60", frequency: "Yearly", inspection: "Safety inspection required" },
  "New Jersey": { fee: "$46.50–$84", frequency: "Yearly", inspection: "Emissions testing required" },
  "New Mexico": { fee: "$27–$62", frequency: "Yearly or biennially", inspection: "None required" },
  "New York": { fee: "$26–$140", frequency: "Every 2 years", inspection: "Safety and emissions testing required" },
  "North Carolina": {
    fee: "$36–$56",
    frequency: "Yearly",
    inspection: "Safety and emissions testing in certain counties",
  },
  "North Dakota": { fee: "$49–$274", frequency: "Yearly", inspection: "None required" },
  Ohio: { fee: "$31–$56", frequency: "Yearly", inspection: "E-check in certain counties" },
  Oklahoma: { fee: "$21–$91", frequency: "Yearly", inspection: "None required" },
  Oregon: { fee: "$112–$152", frequency: "Every 2 years", inspection: "Emissions testing in certain counties" },
  Pennsylvania: { fee: "$38–$42", frequency: "Yearly", inspection: "Safety and emissions testing required" },
  "Rhode Island": { fee: "$30–$46", frequency: "Every 2 years", inspection: "Safety and emissions testing required" },
  "South Carolina": { fee: "$24–$40", frequency: "Every 2 years", inspection: "None required" },
  "South Dakota": { fee: "$36–$144", frequency: "Yearly", inspection: "None required" },
  Tennessee: { fee: "$26.50–$56.50", frequency: "Yearly", inspection: "Emissions testing in certain counties" },
  Texas: {
    fee: "$51.75–$54.75",
    frequency: "Yearly",
    inspection: "Safety inspection required, emissions in certain counties",
  },
  Utah: { fee: "$44–$69", frequency: "Yearly", inspection: "Safety inspection for older vehicles" },
  Vermont: { fee: "$70–$76", frequency: "Yearly", inspection: "Safety inspection required" },
  Virginia: { fee: "$30.75–$51.75", frequency: "Yearly", inspection: "Safety inspection required" },
  Washington: { fee: "$30–$93", frequency: "Yearly", inspection: "Emissions testing in certain counties" },
  "West Virginia": { fee: "$30–$60", frequency: "Yearly", inspection: "Safety inspection required" },
  Wisconsin: { fee: "$85–$106", frequency: "Yearly", inspection: "Emissions testing in certain counties" },
  Wyoming: { fee: "$30–$60", frequency: "Yearly", inspection: "None required" },
  "District of Columbia": {
    fee: "$72–$155",
    frequency: "Every 2 years",
    inspection: "Safety and emissions testing required",
  },
}

interface RegistrationInfoProps {
  state: string
  year?: number
  vehicleType?: string
}

const RegistrationInfo: React.FC<RegistrationInfoProps> = ({
  state = "New York",
  year = new Date().getFullYear() + 1,
  vehicleType = "sedan",
}) => {
  // Get registration data for the specified state, or default to New York
  const stateData = registrationData[state as keyof typeof registrationData] || registrationData["New York"]

  return (
    <Card className="w-full bg-white shadow-sm border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Registering this car in {state} in {year}
        </CardTitle>
        <CardDescription className="text-gray-600">What to expect when registering your vehicle</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">What to Expect</h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-blue-50 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="font-medium">Registration Fee:</span>{" "}
                <span className="text-blue-700">{stateData.fee}</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-blue-50 p-2 rounded-full">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="font-medium">Registration Frequency:</span> <span>{stateData.frequency}</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-blue-50 p-2 rounded-full">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Inspection Requirement:</span> <span>{stateData.inspection}</span>
                {stateData.inspection.includes("VIN") && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          VIN inspection verifies your vehicle identification number matches your documentation.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Each U.S. state sets its own vehicle registration laws and requirements. These can vary significantly
                from simple VIN verification to comprehensive safety and emissions testing. The requirements shown here
                are tailored to {state}. For example, states like Alaska require no inspections, while Rhode Island
                requires both safety and emissions testing.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RegistrationInfo

