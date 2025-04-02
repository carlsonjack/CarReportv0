"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  Users,
  BarChart3,
  Target,
  Zap,
  Shield,
  DollarSign,
  ChevronRight,
  Mail,
  Phone,
  Building,
} from "lucide-react"

export default function DealerSolutionsContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [contactForm, setContactForm] = useState({
    name: "",
    dealershipName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Request submitted successfully",
        description: "A CarReport representative will contact you shortly.",
      })
      setContactForm({
        name: "",
        dealershipName: "",
        email: "",
        phone: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">CarReport Dealer Solutions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform your lead generation with the most sophisticated vehicle data platform in the industry.
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-16">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-16 animate-fadeIn">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">The Most Enriched Leads in the Market</h2>
                <p className="text-xl mb-6">
                  CarReport delivers more intelligent, more relevant, and more actionable leads than any other provider.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Higher Quality Leads</strong> - Connect with buyers who are
                      further along in their purchase journey
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Detailed Customer Insights</strong> - Understand exactly what
                      each buyer is looking for
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Increased Conversion Rates</strong> - Close more deals with
                      better-qualified prospects
                    </span>
                  </li>
                </ul>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-700 hover:bg-blue-50 border-0"
                  onClick={() => setActiveTab("features")}
                >
                  Explore Features
                  <ChevronRight className="ml-2 h-5 w-5" />
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

          {/* Key Benefits */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">Why Dealerships Choose CarReport</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BenefitCard
                icon={<Target className="h-10 w-10 text-blue-600" />}
                title="40% Higher Conversion Rate"
                description="Our leads convert at nearly double the industry average because buyers are further along in their purchase journey."
              />
              <BenefitCard
                icon={<DollarSign className="h-10 w-10 text-blue-600" />}
                title="28% Lower Cost Per Acquisition"
                description="Spend less to acquire each customer with our highly qualified leads and efficient targeting."
              />
              <BenefitCard
                icon={<Users className="h-10 w-10 text-blue-600" />}
                title="3.5x More Customer Data"
                description="Gain deeper insights into each prospect's preferences, budget, and timeline to tailor your approach."
              />
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <ol className="space-y-6 relative border-l border-gray-200 pl-8 py-2">
                  <li className="relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-xl font-bold mb-2">Consumers Search for Vehicles</h3>
                    <p className="text-gray-600">
                      Car shoppers use CarReport to research vehicles, check history reports, and determine fair market
                      values.
                    </p>
                  </li>
                  <li className="relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-xl font-bold mb-2">AI Captures Intent Data</h3>
                    <p className="text-gray-600">
                      Our AI assistant Pascal gathers detailed information about the buyer's preferences, budget, and
                      timeline.
                    </p>
                  </li>
                  <li className="relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-xl font-bold mb-2">Leads Are Matched to Inventory</h3>
                    <p className="text-gray-600">
                      We match interested buyers with dealerships that have relevant inventory meeting their criteria.
                    </p>
                  </li>
                  <li className="relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                    <h3 className="text-xl font-bold mb-2">You Receive Enriched Leads</h3>
                    <p className="text-gray-600">
                      Dealerships receive detailed lead information including vehicle preferences, budget, timeline, and
                      specific buyer needs to help close more deals.
                    </p>
                  </li>
                </ol>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Sample Lead Data</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-500">Customer</h4>
                    <p className="font-semibold">John Smith</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Vehicle Interest</h4>
                    <p className="font-semibold">2020-2022 Toyota RAV4 Hybrid</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Budget Range</h4>
                    <p className="font-semibold">$28,000 - $32,000</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Purchase Timeline</h4>
                    <p className="font-semibold">Within 2 weeks</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Must-Have Features</h4>
                    <p className="font-semibold">AWD, Leather Seats, Sunroof</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Financing Preference</h4>
                    <p className="font-semibold">Pre-approved for $30,000</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Trade-In Vehicle</h4>
                    <p className="font-semibold">2016 Honda Civic EX (72,000 miles)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">What Our Dealer Partners Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="CarReport leads have transformed our business. The quality of information we receive about each prospect has helped us increase our closing rate by 35% in just three months."
                author="Michael Johnson"
                position="Sales Manager"
                dealership="Prestige Auto Group"
              />
              <TestimonialCard
                quote="The level of detail in each lead is incredible. We know exactly what customers want before they walk in the door, which has dramatically improved our customer experience and sales efficiency."
                author="Sarah Williams"
                position="General Manager"
                dealership="Eastside Motors"
              />
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Lead Generation?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join leading dealerships nationwide who are using CarReport to connect with more qualified buyers and
              close more deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
                onClick={() => setActiveTab("pricing")}
              >
                View Pricing Options
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
              >
                Contact Sales Team
              </Button>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="features" className="space-y-16 animate-fadeIn">
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Dealer Solutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-blue-600" />}
                title="AI-Powered Lead Matching"
                description="Our proprietary algorithm matches buyer intent with your inventory in real-time, delivering leads that are specifically interested in vehicles you have available."
              />
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
                title="Advanced Analytics Dashboard"
                description="Track lead performance, conversion rates, and ROI with our comprehensive analytics platform. Gain insights to optimize your sales process and marketing strategy."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-blue-600" />}
                title="Verified Buyer Information"
                description="All leads are verified for accuracy and intent, ensuring you're connecting with serious buyers who are actively looking to purchase a vehicle."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-blue-600" />}
                title="Customer Preference Insights"
                description="Understand exactly what features, options, and price points your prospects are looking for before you make contact, allowing for personalized sales approaches."
              />
            </div>
          </section>

          <section className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Seamless CRM Integration</h3>
                <p className="text-lg mb-6">
                  CarReport integrates with all major dealer CRM systems, ensuring leads flow directly into your
                  existing workflow without disruption.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Real-time Lead Delivery</strong> - Leads are delivered instantly
                      to your CRM as they're generated
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Custom Field Mapping</strong> - All lead data is mapped to your
                      specific CRM fields
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Automated Follow-up</strong> - Trigger automated workflows based
                      on lead characteristics
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold">Lead Activity Tracking</strong> - Monitor ongoing customer
                      engagement with your inventory
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-4">Supported CRM Systems</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-semibold">DealerSocket</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-semibold">VinSolutions</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-semibold">Elead</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-semibold">CDK</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-semibold">Dealertrack</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-semibold">Reynolds & Reynolds</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-semibold">AutoRaptor</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <p className="font-semibold">And many more...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-12">Additional Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Market Intelligence</h3>
                  <p className="text-gray-600 mb-4">
                    Access real-time data on local market trends, competitive pricing, and inventory demand to optimize
                    your stocking and pricing strategy.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Local market analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Competitive pricing data</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Inventory demand forecasting</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Targeted Marketing</h3>
                  <p className="text-gray-600 mb-4">
                    Leverage our consumer data to create highly targeted marketing campaigns that reach the right buyers
                    at the right time.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Custom audience creation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Multi-channel campaign management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Performance tracking and optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Sales Training</h3>
                  <p className="text-gray-600 mb-4">
                    Equip your team with the skills and knowledge to effectively convert our high-quality leads into
                    sales through our specialized training program.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Lead handling best practices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Personalized sales approaches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Ongoing coaching and support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-16 animate-fadeIn">
          <section>
            <h2 className="text-3xl font-bold text-center mb-12">Flexible Pricing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-blue-100">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">Starter</h3>
                    <div className="text-3xl font-bold mb-1">
                      $499<span className="text-lg font-normal">/month</span>
                    </div>
                    <p className="text-gray-500">For small dealerships</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Up to 25 qualified leads per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Basic CRM integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Standard lead data</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Email and phone support</span>
                    </li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>
              <Card className="border-blue-600 shadow-md relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">Professional</h3>
                    <div className="text-3xl font-bold mb-1">
                      $999<span className="text-lg font-normal">/month</span>
                    </div>
                    <p className="text-gray-500">For mid-size dealerships</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Up to 75 qualified leads per month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Advanced CRM integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Enhanced lead data with buyer preferences</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Basic market intelligence reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Priority support with dedicated account manager</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                </CardContent>
              </Card>
              <Card className="border-blue-100">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                    <div className="text-3xl font-bold mb-1">Custom</div>
                    <p className="text-gray-500">For dealer groups & large operations</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Unlimited qualified leads</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Premium CRM integration with custom workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Comprehensive lead data with predictive insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Full market intelligence platform</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Targeted marketing campaigns</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span>Executive support with strategic consulting</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-gray-500 mt-8">
              All plans include a 30-day money-back guarantee. No long-term contracts required.
            </p>
          </section>

          <section className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">How are leads delivered?</h3>
                    <p className="text-gray-600">
                      Leads are delivered in real-time directly to your CRM system. You'll also receive email and SMS
                      notifications for new leads based on your preferences.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">What makes CarReport leads different?</h3>
                    <p className="text-gray-600">
                      Our leads include comprehensive buyer intent data gathered through our AI assistant, providing
                      detailed information about preferences, budget, timeline, and specific vehicle interests.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Is there a contract or commitment?</h3>
                    <p className="text-gray-600">
                      No long-term contracts are required. All plans are month-to-month with a 30-day money-back
                      guarantee.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Can I upgrade or downgrade my plan?</h3>
                    <p className="text-gray-600">
                      Yes, you can change your plan at any time. Changes take effect at the start of your next billing
                      cycle.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-center">Calculate Your ROI</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Monthly Leads</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">25</div>
                        <div className="text-xs text-gray-500">Starter</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">75</div>
                        <div className="text-xs text-gray-500">Professional</div>
                      </div>
                      <div className="border rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">150+</div>
                        <div className="text-xs text-gray-500">Enterprise</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Conversion Rate</label>
                    <div className="border rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">12-18%</div>
                      <div className="text-xs text-gray-500">Industry average: 8-10%</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Profit Per Vehicle</label>
                    <div className="border rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">$1,800 - $2,500</div>
                      <div className="text-xs text-gray-500">Based on dealer feedback</div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Potential Monthly Return</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">$5,400+</div>
                        <div className="text-xs text-gray-500">Starter</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">$16,200+</div>
                        <div className="text-xs text-gray-500">Professional</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">$32,400+</div>
                        <div className="text-xs text-gray-500">Enterprise</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* Contact Form */}
      <section id="contact" className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Our Sales Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-lg mb-6">
              Ready to transform your lead generation strategy? Our team is here to answer your questions and help you
              find the right solution for your dealership.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-gray-600">(800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-gray-600">dealers@carreport.com</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="font-medium mb-2">What happens next?</p>
              <ol className="space-y-2 pl-5 list-decimal">
                <li>We'll contact you within 1 business day to discuss your needs</li>
                <li>Our team will provide a personalized demo of our platform</li>
                <li>We'll create a custom proposal based on your dealership's requirements</li>
                <li>Once approved, we'll have you up and running within 48 hours</li>
              </ol>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="dealershipName" className="block text-sm font-medium text-gray-700 mb-1">
                  Dealership Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="dealershipName"
                    name="dealershipName"
                    value={contactForm.dealershipName}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your dealership and what you're looking for"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Request Information"
                )}
              </Button>
              <p className="text-xs text-center text-gray-500 mt-4">
                By submitting this form, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper Components
function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">{icon}</div>
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

function TestimonialCard({
  quote,
  author,
  position,
  dealership,
}: { quote: string; author: string; position: string; dealership: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <p className="italic mb-4">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">
            {position}, {dealership}
          </p>
        </div>
      </div>
    </div>
  )
}

