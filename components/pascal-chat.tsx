"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, Send } from "lucide-react"

// Define conversation stages
const STAGES = {
  INITIAL: "initial",
  ASK_STATE: "askState",
  ASK_MILEAGE: "askMileage",
  ASK_PRICE: "askPrice",
  SHOW_REPORT: "showReport",
}

export function PascalChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm Pascal, your car assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationStage, setConversationStage] = useState(STAGES.INITIAL)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)

  // Use a ref to store car data to avoid state update timing issues
  const carDataRef = useRef({
    vin: "",
    state: "",
    mileage: 0,
    askingPrice: 0,
  })

  // Debug logging for stage changes
  useEffect(() => {
    console.log("Conversation stage changed to:", conversationStage)
  }, [conversationStage])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  // Function to add an assistant message and update the stage
  const addAssistantMessage = (content, newStage) => {
    setMessages((prev) => [...prev, { role: "assistant", content, timestamp: new Date() }])
    setConversationStage(newStage)
  }

  // Function to handle VIN detection
  const detectVin = (input) => {
    const cleanedInput = input.replace(/\s|-/g, "").toUpperCase()
    // Very basic VIN validation - just check length and alphanumeric
    return cleanedInput.length >= 16 && cleanedInput.length <= 18
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userInput = input.trim()

    // Add user message to chat with timestamp
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
          window.carReportData = { ...carDataRef.current }

          console.log("Final car data:", window.carReportData)

          addAssistantMessage(
            `Thank you! I've recorded the asking price as $${price.toLocaleString()}. Here's your vehicle report:`,
            STAGES.SHOW_REPORT,
          )

          // Set hash to show report AFTER updating the stage and messages
          setTimeout(() => {
            window.location.hash = "report"
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
    setMessages([{ role: "assistant", content: "Hello! I'm Pascal, your car assistant. How can I help you today?" }])
    // Clear the report from view
    window.location.hash = ""
  }

  // Format timestamp
  const formatTime = (date) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl bg-white shadow-xl transition-all duration-300 ease-in-out ${
        isMinimized ? "h-16 w-64" : "h-[500px] w-[380px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-primary p-4 text-primary-foreground">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground text-primary">
            P
          </div>
          Pascal - Car Assistant
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary/80"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </div>

      {/* Chat content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-1 flex-col overflow-hidden"
          >
            {/* Messages area */}
            <ScrollArea className="flex-1 p-4">
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
                          <Avatar className="mt-1 h-8 w-8">
                            <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-medium text-primary-foreground">
                              P
                            </div>
                          </Avatar>
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
                      <Avatar className="mt-1 h-8 w-8">
                        <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-medium text-primary-foreground">
                          P
                        </div>
                      </Avatar>
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

            {/* Input area */}
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-full"
                />
                <Button type="submit" size="icon" className="h-10 w-10 rounded-full">
                  <Send size={18} />
                </Button>
              </form>
              {conversationStage === STAGES.SHOW_REPORT && (
                <Button variant="outline" className="mt-2 w-full" onClick={resetConversation}>
                  Start New Search
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PascalChat

