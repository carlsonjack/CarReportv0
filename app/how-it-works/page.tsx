import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HowItWorksContent from "@/components/how-it-works-content"

export const metadata: Metadata = {
  title: "How It Works | CarReport",
  description:
    "Learn how CarReport provides sophisticated vehicle data to help you make informed car buying decisions.",
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <HowItWorksContent />
      </div>
      <Footer />
    </main>
  )
}

