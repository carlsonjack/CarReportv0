"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<"user" | "dealer">("user")
  const router = useRouter()
  const { toast } = useToast()

  // Check if we're on a dashboard page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname
      if (path.includes("/dealer/dashboard")) {
        setIsLoggedIn(true)
        setUserType("dealer")
      } else if (path.includes("/account/")) {
        setIsLoggedIn(true)
        setUserType("user")
      }
    }
  }, [])

  const handleSignOut = () => {
    setIsLoggedIn(false)
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account",
    })
    router.push("/")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 shadow-sm z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-blue-600">Car</span>
            Report
          </Link>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-8">
              <Link href="/how-it-works" className="text-sm font-medium hover:text-blue-600 transition-colors">
                How It Works
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-sm font-medium hover:text-blue-600 transition-colors">
                FAQ
              </Link>
              <Link href="/dealer" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Dealer
              </Link>
            </nav>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {userType === "dealer" ? "ST" : "JS"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">
                      {userType === "dealer" ? "Springfield Toyota" : "John Smith"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(userType === "dealer" ? "/dealer/dashboard" : "/account/dashboard")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(userType === "dealer" ? "/dealer/profile" : "/account/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(userType === "dealer" ? "/dealer/settings" : "/account/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleLogin}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

