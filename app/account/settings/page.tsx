import { Suspense } from "react"
import Header from "@/components/header"
import UserSettings from "@/components/user/user-settings"
import { Toaster } from "@/components/ui/toaster"

export default function UserSettingsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
          <UserSettings />
        </Suspense>
      </div>
      <Toaster />
    </main>
  )
}

