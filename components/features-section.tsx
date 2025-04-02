import { FileText, Shield, BarChart3 } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Comprehensive History</h3>
            <p className="text-gray-600 text-lg">
              Get detailed accident records, title information, and service history.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Buy or Avoid Verdict</h3>
            <p className="text-gray-600 text-lg">
              Get a clear recommendation based on the vehicle's history and condition.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Market Comparison</h3>
            <p className="text-gray-600 text-lg">
              See how this vehicle compares to similar models in pricing and reliability.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

