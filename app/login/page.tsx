import { Suspense } from "react"
import UserLogin from "@/components/user/user-login"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Login to CarReport</h1>
          <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
            <UserLogin />
          </Suspense>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

