"use client"

import { useState, Suspense, useEffect } from "react"
import SearchBox from "@/components/search-box"
import ReportSummary from "@/components/report-summary"
import DetailedReport from "@/components/detailed-report"
import FeaturesSection from "@/components/features-section"
import Footer from "@/components/footer"
import Header from "@/components/header"
import AnimatedBackground from "@/components/animated-background"
import { Toaster } from "@/components/ui/toaster"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  // Add state to track if full report is being shown
  const [isFullReportVisible, setIsFullReportVisible] = useState(false)
  // Add a state variable to track if the payment form is visible
  const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false)
  // Add state to track hash
  const [currentHash, setCurrentHash] = useState("")
  // Add state to track if chat is expanded
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  // Add state to track if we're in the browser
  const [isBrowser, setIsBrowser] = useState(false)

  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Listen for hash changes to detect when payment form is shown
  useEffect(() => {
    if (!isBrowser) return

    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
      setIsPaymentFormVisible(window.location.hash === "#payment")
    }

    // Check on initial load
    setCurrentHash(window.location.hash)
    setIsPaymentFormVisible(window.location.hash === "#payment")

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Clean up
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [isBrowser])

  // Add an effect to handle report generation
  useEffect(() => {
    if (currentHash === "#report" && !isFullReportVisible) {
      setIsFullReportVisible(true)
    }
  }, [currentHash, isFullReportVisible])

  // Direct check for payment form visibility using state instead of window
  const isPaymentFormActive = isPaymentFormVisible || currentHash === "#payment"

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <AnimatedBackground />
      <Header />

      <div className="container mx-auto px-6 relative">
        {/* Only show hero section if full report is not visible */}
        {!isFullReportVisible && !isPaymentFormActive && (
          <section className={`pt-${isChatExpanded ? "32" : "40"} pb-20 transition-all duration-300`}>
            <AnimatePresence>
              {!isChatExpanded && (
                <motion.div
                  className="max-w-6xl mx-auto text-center mb-16"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <h2 className="text-6xl font-extrabold mb-6">Car Shopping? Let Me Help.</h2>
                  <p className="text-xl font-medium text-gray-700">
                    Get the complete history of any vehicle. Know what to buy or avoid.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <Suspense fallback={<div className="h-16 w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
              <SearchBox
                onFullReportVisible={setIsFullReportVisible}
                onExpandChange={setIsChatExpanded} // Pass the state setter
              />
            </Suspense>
          </section>
        )}

        {/* If full report is visible, add more padding at the top */}
        {isFullReportVisible && !isPaymentFormActive && (
          <section className="pt-32">
            <Suspense fallback={<div className="h-16 w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
              <SearchBox onFullReportVisible={setIsFullReportVisible} onExpandChange={setIsChatExpanded} />
            </Suspense>
          </section>
        )}

        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
          {/* Pass the handler to the ReportSummary component */}
          <ReportSummary onFullReportVisible={setIsFullReportVisible} onPaymentFormVisible={setIsPaymentFormVisible} />
        </Suspense>

        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
          <DetailedReport />
        </Suspense>
      </div>

      {/* Only show features section if full report is not visible */}
      {!isFullReportVisible && !isPaymentFormActive && <FeaturesSection />}

      <Footer />

      {/* Add fixed search box at the bottom when full report is visible or after payment */}
      {(isFullReportVisible || currentHash === "#payment" || currentHash.includes("report")) && (
        <div className="fixed bottom-8 left-0 right-0 z-50">
          <div className="container mx-auto px-6">
            <SearchBox onFullReportVisible={setIsFullReportVisible} isFixed={true} onExpandChange={setIsChatExpanded} />
          </div>
        </div>
      )}

      <Toaster />
    </main>
  )
}

