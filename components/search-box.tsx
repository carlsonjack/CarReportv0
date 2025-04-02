"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Car, FileText, Mic, Plus, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// Define conversation stages
const STAGES = {
  INITIAL: "initial",
  ASK_STATE: "askState",
  ASK_MILEAGE: "askMileage",
  ASK_PRICE: "askPrice",
  SHOW_REPORT: "showReport",
}

// Update the interface with new props
interface SearchBoxProps {
  onFullReportVisible?: (isVisible: boolean) => void
  isFixed?: boolean
  isHidden?: boolean
  initialQuery?: string
  onExpandChange?: (expanded: boolean) => void // Add this new prop
}

export default function SearchBox({
  onFullReportVisible,
  isFixed = false,
  isHidden = false,
  initialQuery = "",
  onExpandChange,
}: SearchBoxProps) {
  // If this is hidden, don't render anything
  if (isHidden) return null

  const [input, setInput] = useState(initialQuery)
  const [messages, setMessages] = useState<Array<{ role: string; content: string; timestamp?: Date }>>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [conversationStage, setConversationStage] = useState(STAGES.INITIAL)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [paymentFormVisible, setPaymentFormVisible] = useState(false)
  const [isBrowser, setIsBrowser] = useState(false)

  // Use a ref to store car data to avoid state update timing issues
  const carDataRef = useRef({
    vin: "",
    state: "",
    mileage: 0,
    askingPrice: 0,
  })

  // Set isBrowser to true once component mounts
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Check if payment form is visible
  useEffect(() => {
    if (!isBrowser) return

    // Set the initial value based on the hash
    const handleHashChange = () => {
      setPaymentFormVisible(window.location.hash === "#payment")
    }

    handleHashChange() // Call it once to set initial state

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [isBrowser])

  // Scroll to bottom of messages container when messages change, not the page
  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      // Only scroll the messages container, not the page
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      })
    }
  }, [messages, isTyping, isExpanded])

  // Function to add an assistant message and update the stage
  const addAssistantMessage = (content: string, newStage: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: content,
        timestamp: new Date(),
      },
    ])
    setConversationStage(newStage)
  }

  // Function to handle VIN detection
  const detectVin = (input: string) => {
    const cleanedInput = input.replace(/\s|-/g, "").toUpperCase()
    // Very basic VIN validation - just check length and alphanumeric
    return cleanedInput.length >= 16 && cleanedInput.length <= 18
  }

  // Function to ensure the container stays visible with the input at the bottom
  const ensureContainerVisible = () => {
    if (!isBrowser) return

    if (containerRef.current) {
      // Get the input field element
      const inputField = containerRef.current.querySelector("input")
      if (inputField) {
        // Calculate position to show input at bottom of viewport with some padding
        const rect = inputField.getBoundingClientRect()
        const scrollPosition = window.scrollY + rect.top - window.innerHeight + rect.height + 120 // 120px padding

        // Smooth scroll to position
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        })
      }
    }
  }

  const handleSend = () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a VIN, license plate, or describe the car you're interested in.",
        variant: "destructive",
      })
      return
    }

    const userInput = input.trim()

    // Expand the chat interface if it's not already expanded
    if (!isExpanded) {
      setIsExpanded(true)
      // Notify parent component about expansion
      if (onExpandChange) {
        onExpandChange(true)
      }
      // Wait for DOM update before scrolling
      setTimeout(ensureContainerVisible, 50)
    }

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userInput, timestamp: new Date() }])
    setInput("")
    setIsTyping(true)

    // Delay to simulate typing
    setTimeout(() => {
      setIsTyping(false)

      // Handle different conversation stages
      switch (conversationStage) {
        case STAGES.INITIAL:
          if (detectVin(userInput)) {
            // Store VIN and ask for state
            carDataRef.current.vin = userInput.replace(/\s|-/g, "").toUpperCase()
            addAssistantMessage(
              `Thanks for providing the VIN: ${carDataRef.current.vin}. What state is the car being sold in?`,
              STAGES.ASK_STATE,
            )
          } else {
            // Not a VIN, provide guidance
            addAssistantMessage(
              `I don't recognize that as a VIN. Please provide a valid Vehicle Identification Number (VIN) which is typically 17 characters.`,
              STAGES.INITIAL,
            )
          }
          break

        case STAGES.ASK_STATE:
          // Store state and ask for mileage
          carDataRef.current.state = userInput
          addAssistantMessage(
            `Got it, the car is being sold in ${userInput}. What is the current mileage?`,
            STAGES.ASK_MILEAGE,
          )
          break

        case STAGES.ASK_MILEAGE:
          // Store mileage and ask for price
          const mileage = Number.parseInt(userInput.replace(/\D/g, ""), 10) || 0
          carDataRef.current.mileage = mileage
          addAssistantMessage(
            `Thank you! I've recorded the mileage as ${mileage.toLocaleString()} miles. What is the asking price for this vehicle? (Enter 0 if unknown)`,
            STAGES.ASK_PRICE,
          )
          break

        case STAGES.ASK_PRICE:
          // Store price and show report
          const price = Number.parseFloat(userInput.replace(/[$,]/g, "")) || 0
          carDataRef.current.askingPrice = price

          // Make car data available to report component
          if (isBrowser) {
            window.carReportData = { ...carDataRef.current }
            console.log("Final car data:", window.carReportData)
          }

          addAssistantMessage(
            `Thank you! I've recorded the asking price as $${price.toLocaleString()}. Here's your vehicle report:`,
            STAGES.SHOW_REPORT,
          )

          // Set hash to show report AFTER updating the stage and messages
          setTimeout(() => {
            if (isBrowser) {
              window.location.hash = "report"
              // Update the full report visibility state if the prop is provided
              if (onFullReportVisible) {
                onFullReportVisible(true)
              }
            }
          }, 100)
          break

        default:
          // Default response
          addAssistantMessage(
            `I received your message: "${userInput}". If you'd like to check a vehicle, please provide the VIN (Vehicle Identification Number).`,
            STAGES.INITIAL,
          )
      }
    }, 1000)
  }

  const resetConversation = () => {
    setConversationStage(STAGES.INITIAL)
    carDataRef.current = { vin: "", state: "", mileage: 0, askingPrice: 0 }
    setMessages([])
    setIsExpanded(false)

    // Notify parent component about collapse
    if (onExpandChange) {
      onExpandChange(false)
    }

    // Clear the report from view
    if (isBrowser) {
      window.location.hash = ""
      if (onFullReportVisible) {
        onFullReportVisible(false)
      }
    }
  }

  // Format timestamp
  const formatTime = (date?: Date) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  // Also toggle body overflow based on expanded state
  useEffect(() => {
    // Don't prevent scrolling, just ensure the container is visible
    if (isExpanded) {
      ensureContainerVisible()
    }
  }, [isExpanded])

  const [showFixedSearchBox, setShowFixedSearchBox] = useState(false)

  useEffect(() => {
    setShowFixedSearchBox(isBrowser && window.location.hash !== "#payment")
  }, [isBrowser])

  // For the fixed version at the bottom of the screen
  if (isFixed) {
    // Hide the fixed version on the checkout page
    if (!showFixedSearchBox) {
      return null // Don't render anything on the checkout page
    }

    // Always render the fixed version on other pages, including after payment completion
    return (
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white p-1 rounded-full border-2 border-white shadow-md">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20of%20carreport_favicon%20%281%29-XB3pAWkpMwmRkcasp9dn01AVKC2dJB.png"
              alt="Pascal"
              className="h-16 w-16 rounded-full"
            />
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter VIN, license plate, or describe the car you're looking for"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-6 pr-12 py-5 h-14 text-base border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800"
                onClick={handleSend}
                disabled={isTyping}
              >
                {isTyping ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-3 px-1">
              <button
                className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded-md"
                onClick={resetConversation}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New search</span>
              </button>

              <button className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded-md">
                <Car className="h-3.5 w-3.5" />
                <span>VIN lookup</span>
              </button>

              <button className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded-md">
                <FileText className="h-3.5 w-3.5" />
                <span>History report</span>
              </button>

              <div className="ml-auto">
                <button className="flex items-center justify-center h-8 w-8 bg-gray-50 hover:bg-gray-100 rounded-full">
                  <Mic className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 py-2 border-t border-gray-100">
            CarReport provides vehicle history. Always verify important information.
          </div>
        </div>
      </div>
    )
  }

  // Regular version for the homepage - now with integrated chat
  // Don't render the regular version if we're showing a report and this isn't the fixed version
  if (isBrowser && window.location.hash === "#report" && !isFixed) {
    return null // Don't render anything for the top search box when report is shown
  }

  return (
    <div
      ref={containerRef}
      className={`max-w-3xl mx-auto relative pt-10 search-container transition-all duration-300 ease-in-out ${
        isExpanded ? "z-10" : ""
      }`}
      style={{
        position: "relative", // Always relative, not sticky
        zIndex: isExpanded ? 10 : "auto",
      }}
    >
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20of%20carreport_favicon%20%281%29-XB3pAWkpMwmRkcasp9dn01AVKC2dJB.png"
          alt="Pascal"
          className="h-20 w-20 rounded-full border-2 border-white shadow-md"
        />
      </div>

      <div
        className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "min-h-[400px]" : ""
        }`}
        onClick={(e) => {
          // Prevent clicks from propagating to elements that might cause scrolling
          e.stopPropagation()
        }}
      >
        {isExpanded && (
          <>
            <div className="flex items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20of%20carreport_favicon%20%281%29-XB3pAWkpMwmRkcasp9dn01AVKC2dJB.png"
                  alt="Pascal"
                  className="h-8 w-8 rounded-full"
                />
                <h2 className="text-lg font-semibold">Pascal - Car Assistant</h2>
              </div>
            </div>

            <ScrollArea
              className="p-4"
              style={{
                height: "min(300px, calc(70vh - 180px))",
                overflowY: "auto",
              }}
            >
              <div className="flex flex-col space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex max-w-[85%] items-start gap-3">
                        {message.role === "assistant" && (
                          <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20of%20carreport_favicon%20%281%29-XB3pAWkpMwmRkcasp9dn01AVKC2dJB.png"
                            alt="Pascal"
                            className="h-8 w-8 mt-1 rounded-full"
                          />
                        )}
                        <div className="flex flex-col">
                          <div
                            className={`rounded-2xl p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {message.content}
                          </div>
                          {message.timestamp && (
                            <span className="mt-1 text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                          )}
                        </div>
                        {message.role === "user" && (
                          <Avatar className="mt-1 h-8 w-8">
                            <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                              U
                            </div>
                          </Avatar>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex max-w-[85%] items-start gap-3">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20of%20carreport_favicon%20%281%29-XB3pAWkpMwmRkcasp9dn01AVKC2dJB.png"
                        alt="Pascal"
                        className="h-8 w-8 mt-1 rounded-full"
                      />
                      <div className="rounded-2xl bg-muted p-3">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-current delay-75" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-current delay-150" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </>
        )}

        <div className="p-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter VIN, license plate, or describe the car you're looking for"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-4 pr-12 py-4 h-14 text-base border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleSend}
              disabled={isTyping}
            >
              {isTyping ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isExpanded ? (
                <Send className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3 px-1">
            <button
              className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded-md"
              onClick={resetConversation}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New search</span>
            </button>

            <button className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded-md">
              <Car className="h-3.5 w-3.5" />
              <span>VIN lookup</span>
            </button>

            <button className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded-md">
              <FileText className="h-3.5 w-3.5" />
              <span>History report</span>
            </button>

            <div className="ml-auto">
              <button className="flex items-center justify-center h-8 w-8 bg-gray-50 hover:bg-gray-100 rounded-full">
                <Mic className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 py-2 border-t border-gray-100">
          CarReport provides vehicle history. Always verify important information.
        </div>
      </div>
    </div>
  )
}

