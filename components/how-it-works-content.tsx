"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, CheckCircle, ArrowRight, BarChart3, Shield, Car, Zap, Users } from "lucide-react"
import CarReportLogo from "./car-report-logo"
import DealerContactModal from "./dealer/dealer-contact-modal"

export default function HowItWorksContent() {
  const [activeTab, setActiveTab] = useState("consumers")
  const [showDealerModal, setShowDealerModal] = useState(false)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How CarReport Works</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Not just another vehicle history report. CarReport is the first true shopping tool for car buyers and sellers,
          powered by the most sophisticated vehicle data platform on the market.
        </p>
      </div>

      <Tabs defaultValue="consumers" value={activeTab} onValueChange={setActiveTab} className="mb-16">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="consumers">For Car Shoppers</TabsTrigger>
            <TabsTrigger value="dealers">For Dealers</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="consumers" className="space-y-16 animate-fadeIn">
          {/* Process Steps */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">The CarReport Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProcessCard
                icon={<Search className="h-10 w-10 text-blue-600" />}
                step="1"
                title="Search Any Vehicle"
                description="Enter a VIN, license plate, or simply describe the car you're interested in. Our AI assistant Pascal will guide you through the process."
              />
              <ProcessCard
                icon={<FileText className="h-10 w-10 text-blue-600" />}
                step="2"
                title="Get Comprehensive Data"
                description="Receive a detailed report with vehicle history, market value, ownership costs, and personalized recommendations."
              />
              <ProcessCard
                icon={<CheckCircle className="h-10 w-10 text-blue-600" />}
                step="3"
                title="Make Confident Decisions"
                description="Use our actionable insights to negotiate better deals, avoid problematic vehicles, and find the perfect car for your needs."
              />
            </div>
          </section>

          {/* Key Features */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-blue-600" />}
                title="AI-Powered Insights"
                description="Our AI assistant Pascal analyzes thousands of data points to provide personalized recommendations and insights specific to your needs."
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
                title="True Market Value"
                description="Get accurate pricing information based on real-time market data, vehicle condition, history, and local market factors."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-blue-600" />}
                title="Comprehensive History"
                description="Access detailed accident records, service history, ownership timeline, and title information from our extensive database."
              />
              <FeatureCard
                icon={<Car className="h-8 w-8 text-blue-600" />}
                title="Total Cost of Ownership"
                description="Understand the full financial picture with projected maintenance costs, fuel economy, insurance estimates, and depreciation forecasts."
              />
            </div>
          </section>

          {/* Testimonials */}
          <section className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="CarReport saved me from buying a car with hidden damage. The AI assistant asked all the right questions and the report revealed issues the dealer never mentioned."
                author="Michael T."
                location="Boston, MA"
              />
              <TestimonialCard
                quote="I was able to negotiate $2,000 off the asking price because CarReport showed me the vehicle was overpriced for its condition and history. Best $9 I've ever spent!"
                author="Sarah K."
                location="Chicago, IL"
              />
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Smarter Car Buying Decisions?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get started with CarReport today and join thousands of informed car shoppers who make better decisions
              with our comprehensive data and AI-powered insights.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Try CarReport Now
            </Button>
          </section>
        </TabsContent>

        <TabsContent value="dealers" className="animate-fadeIn">
          <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 md:p-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">CarReport for Dealers</h2>
                <p className="text-xl mb-6">
                  Transform your lead generation with the most sophisticated vehicle data platform in the industry.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">More Enriched Leads</strong> - Receive the most detailed and
                      actionable customer information in the market
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Higher Conversion Rates</strong> - Connect with buyers who are
                      further along in their purchase journey
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">AI-Powered Insights</strong> - Leverage our sophisticated data
                      platform to better understand and serve potential customers
                    </span>
                  </li>
                </ul>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-700 hover:bg-blue-50 border-0 text-lg px-8"
                  onClick={() => setShowDealerModal(true)}
                >
                  Learn More About Dealer Solutions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-blue-700 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white p-8 rounded-full">
                      <Users className="h-24 w-24 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Join Leading Dealerships Nationwide</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Partner with CarReport to transform your lead generation and connect with more qualified buyers. Our
              dealer solutions provide the most intelligent, relevant, and actionable leads in the market.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              onClick={() => setShowDealerModal(true)}
            >
              Explore Dealer Solutions
            </Button>
          </section>
        </TabsContent>
      </Tabs>

      {/* How We Get Our Data */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">How We Get Our Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg mb-6">
              CarReport aggregates data from thousands of sources to provide the most comprehensive vehicle information
              available. Our sophisticated data platform processes millions of records daily to ensure you get accurate,
              up-to-date information.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Government Records</strong> - Title information, registration
                  details, and reported accidents
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Insurance Companies</strong> - Claims data, total loss records, and
                  damage reports
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Service Centers</strong> - Maintenance records, repair history, and
                  recall information
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Auction Data</strong> - Wholesale pricing, condition reports, and
                  sales history
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Dealer Networks</strong> - Inventory information, pricing data, and
                  vehicle specifications
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-2xl p-8 flex flex-col items-center">
            <div className="mb-6">
              <CarReportLogo className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">The CarReport Advantage</h3>
            <p className="text-center mb-6">
              Our proprietary AI technology analyzes and connects data points that other reports miss, giving you a more
              complete picture of any vehicle's history and value.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">500M+</div>
                <div className="text-sm text-gray-600">Vehicle Records</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">25K+</div>
                <div className="text-sm text-gray-600">Data Sources</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">99.8%</div>
                <div className="text-sm text-gray-600">Data Accuracy</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Real-time Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FaqCard
            question="How is CarReport different from other vehicle history reports?"
            answer="CarReport goes beyond basic history data to provide a complete car shopping tool. We combine comprehensive vehicle history with market value analysis, ownership cost projections, and AI-powered recommendations tailored to your specific needs."
          />
          <FaqCard
            question="How much does a CarReport cost?"
            answer="A single CarReport costs $8.99 with no hidden fees or subscriptions. This gives you complete access to all vehicle data, market analysis, and AI-powered insights for one vehicle."
          />
          <FaqCard
            question="How accurate is the information in CarReport?"
            answer="CarReport aggregates data from thousands of verified sources with 99.8% accuracy. However, we always recommend a professional inspection before purchasing any used vehicle, as some incidents may go unreported."
          />
          <FaqCard
            question="Can I use CarReport on my mobile device?"
            answer="Yes! CarReport is fully optimized for mobile devices. You can access our platform from any smartphone, tablet, or computer with an internet connection."
          />
          <FaqCard
            question="How recent is the data in CarReport?"
            answer="Our database is updated in real-time, with most records appearing within 24-48 hours of being reported. This ensures you're getting the most current information available."
          />
          <FaqCard
            question="What if I find inaccurate information in my report?"
            answer="While rare, if you believe there's an error in your report, please contact our customer support team. We'll investigate the issue and make corrections if necessary."
          />
        </div>
        <div className="text-center mt-8">
          <Link href="/faq">
            <Button variant="outline" size="lg">
              View All FAQs
            </Button>
          </Link>
        </div>
      </section>
      <DealerContactModal open={showDealerModal} onOpenChange={setShowDealerModal} />
    </div>
  )
}

// Helper Components
function ProcessCard({
  icon,
  step,
  title,
  description,
}: { icon: React.ReactNode; step: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">{icon}</div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {step}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-full">{icon}</div>
          <div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ quote, author, location }: { quote: string; author: string; location: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <p className="italic mb-4">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
    </div>
  )
}

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-3">{question}</h3>
        <p className="text-gray-600">{answer}</p>
      </CardContent>
    </Card>
  )
}

