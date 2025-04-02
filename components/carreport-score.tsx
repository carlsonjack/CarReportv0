"use client"

import { useState } from "react"
import { AlertTriangle, DollarSign, Users, Bell, Gauge, Shield, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import CarReportScoreLogo from "./carreport-score-logo"

interface CarReportScoreProps {
  score: number
  accidentScore: number
  ownershipScore: number
  recallsScore: number
  mileageScore: number
  marketValueScore: number
  safetyScore: number
}

export default function CarReportScore({
  score = 83,
  accidentScore = 8,
  ownershipScore = 8,
  recallsScore = 8,
  mileageScore = 9,
  marketValueScore = 8,
  safetyScore = 10,
}: CarReportScoreProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-green-400"
    if (score >= 40) return "bg-yellow-400"
    if (score >= 20) return "bg-orange-400"
    return "bg-red-500"
  }

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    if (score >= 20) return "Poor"
    return "High Risk"
  }

  const scoreColor = getScoreColor(score)
  const scoreText = getScoreText(score)

  // Calculate factor scores for the bar visualization
  const factorScores = [
    { name: "Accident History", score: accidentScore, weight: 0.3, icon: <AlertTriangle className="h-5 w-5" /> },
    { name: "Ownership Pattern", score: ownershipScore, weight: 0.2, icon: <Users className="h-5 w-5" /> },
    { name: "Recalls & Maintenance", score: recallsScore, weight: 0.15, icon: <Bell className="h-5 w-5" /> },
    { name: "Mileage vs. Expected", score: mileageScore, weight: 0.15, icon: <Gauge className="h-5 w-5" /> },
    { name: "Market Value", score: marketValueScore, weight: 0.1, icon: <DollarSign className="h-5 w-5" /> },
    { name: "Safety Rating", score: safetyScore, weight: 0.1, icon: <Shield className="h-5 w-5" /> },
  ]

  return (
    <>
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="mb-1">
              <CarReportScoreLogo />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-600 flex items-center gap-1"
              onClick={() => setIsModalOpen(true)}
            >
              <Info className="h-4 w-4" />
              <span className="text-sm">Learn More</span>
            </Button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="relative w-full h-8 bg-gray-200 rounded-full mb-2 overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full ${scoreColor} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${score}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between w-full px-1">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">100</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="text-4xl font-bold">{score}</div>
              <div className="flex flex-col">
                <span className={`font-semibold ${scoreColor.replace("bg-", "text-")}`}>{scoreText}</span>
                <span className="text-sm text-gray-500">out of 100</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-gray-700">
              This score reflects the vehicle's overall quality based on accident history, ownership, recalls, mileage,
              market value, and safety ratings.
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Key factors:</span> No accidents, 2 previous owners, good market value
            </p>
          </div>

          <Button className="w-full" onClick={() => setIsModalOpen(true)}>
            View Detailed Score Breakdown
          </Button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">
                CAR<span className="text-black">REPORT</span> Score Methodology
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Vehicle's Score: {score}/100</h3>
                <div className="relative w-full h-8 bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full ${scoreColor} rounded-full`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <p className="text-gray-700">
                  The CarReport Score distills critical factors into a single, easy-to-understand score. A higher score
                  means a safer, better-valued, and more reliably maintained vehicle, helping you quickly gauge overall
                  quality.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
                <div className="space-y-4">
                  {factorScores.map((factor, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1 rounded-full">{factor.icon}</div>
                          <span className="font-medium">{factor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{factor.score}/10</span>
                          <span className="text-xs text-gray-400">({Math.round(factor.weight * 100)}%)</span>
                        </div>
                      </div>
                      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                          style={{ width: `${factor.score * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How We Calculate the Score</h3>
                <p className="text-gray-700 mb-4">
                  Each factor is rated on a 0-10 scale, then combined into a weighted average to create your final score
                  out of 100.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      Accident & Damage History (30%)
                    </h4>
                    <p className="text-sm text-gray-700 ml-6">
                      Evaluates the severity and frequency of accidents. No accidents scores highest, while multiple or
                      severe accidents reduce the score significantly.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Ownership & Usage Pattern (20%)
                    </h4>
                    <p className="text-sm text-gray-700 ml-6">
                      Considers the number and type of previous owners. Single personal owner scores highest, while
                      multiple owners or commercial usage lowers the score.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      Recalls & Maintenance Issues (15%)
                    </h4>
                    <p className="text-sm text-gray-700 ml-6">
                      Assesses open recalls and maintenance history. No open recalls scores highest, while multiple
                      unresolved recalls reduces the score.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-blue-600" />
                      Mileage vs. Expected Age Mileage (15%)
                    </h4>
                    <p className="text-sm text-gray-700 ml-6">
                      Compares actual mileage to expected mileage based on vehicle age. Mileage within 10% of expected
                      scores highest.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      Market Value Alignment (10%)
                    </h4>
                    <p className="text-sm text-gray-700 ml-6">
                      Evaluates if the price is fair compared to market value. "Great Price" ratings score highest,
                      while overpriced vehicles score lower.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Safety Rating (10%)
                    </h4>
                    <p className="text-sm text-gray-700 ml-6">
                      Based on NHTSA or similar safety ratings. 5-star ratings score highest, while lower safety ratings
                      reduce the score.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">What This Means For You</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-medium">80-100:</span> Excellent condition with minimal issues. A confident
                    purchase.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">60-79:</span> Good condition with minor concerns. Worth considering
                    with proper inspection.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">40-59:</span> Fair condition with some issues to address. Proceed with
                    caution.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">20-39:</span> Poor condition with significant concerns. Consider
                    alternatives.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">0-19:</span> High risk with major issues. Not recommended for
                    purchase.
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t">
              <Button className="w-full" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

