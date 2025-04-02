"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface VehicleHistoryCardProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger"
  onClick?: () => void
}

export default function VehicleHistoryCard({
  title,
  subtitle,
  icon,
  variant = "default",
  onClick,
}: VehicleHistoryCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-100"
      case "warning":
        return "bg-yellow-50 border-yellow-100"
      case "danger":
        return "bg-red-50 border-red-100"
      default:
        return "bg-gray-50 border-gray-100"
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "danger":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-colors",
        getVariantStyles(),
        onClick && "cursor-pointer hover:border-gray-300",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={cn("flex-shrink-0", getIconStyles())}>{icon}</div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

