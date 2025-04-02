import type { Metadata } from "next"
import FaqContent from "@/components/faq-content"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | CarReport",
  description: "Find answers to common questions about CarReport vehicle history reports and services.",
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-center mb-12">Find answers to the most common questions about CarReport</p>

          <FaqContent />
        </div>
      </div>
      <Footer />
    </main>
  )
}

