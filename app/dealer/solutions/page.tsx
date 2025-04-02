import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import DealerSolutionsContent from "@/components/dealer/dealer-solutions-content"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Dealer Solutions | CarReport",
  description: "Transform your lead generation with CarReport's sophisticated vehicle data platform for dealerships.",
}

export default function DealerSolutionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <DealerSolutionsContent />
      </div>
      <Footer />
      <Toaster />
    </main>
  )
}

