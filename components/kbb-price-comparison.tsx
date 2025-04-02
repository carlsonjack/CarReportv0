import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface KBBPriceComparisonProps {
  listingPrice: number
  kbbPrice: number
  dealQuality: "GREAT PRICE" | "GOOD PRICE" | "FAIR PRICE" | "HIGH PRICE"
}

export default function KBBPriceComparison({
  listingPrice = 25000,
  kbbPrice = 27500,
  dealQuality = "GREAT PRICE",
}: KBBPriceComparisonProps) {
  const priceDifference = kbbPrice - listingPrice
  const isPriceBelow = priceDifference > 0

  // Determine badge color based on deal quality
  const getBadgeColor = () => {
    switch (dealQuality) {
      case "GREAT PRICE":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "GOOD PRICE":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "FAIR PRICE":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "HIGH PRICE":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Price Analysis</h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - KBB Value */}
        <div className="flex-1 border-r-0 md:border-r border-gray-200 pr-0 md:pr-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Kelley Blue Book® Fair Purchase Price</h4>
            <p className="text-2xl font-bold">${kbbPrice.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">The price others typically pay based on actual transactions</p>
          </div>

          <div className="relative w-full max-w-[300px] mx-auto">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-31%20at%2010.15.24%E2%80%AFAM-ilBbBs2mbl0zvkpG00Al7Xaqspkh0K.png"
              alt="Kelley Blue Book Price Gauge"
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right side - Listing Price */}
        <div className="flex-1">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Listing Price</h4>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold">${listingPrice.toLocaleString()}</p>
              <Badge className={`${getBadgeColor()} font-medium`}>{dealQuality}</Badge>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Listing Price</span>
              <span className="font-medium">${listingPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">KBB Fair Purchase Price</span>
              <span className="font-medium">${kbbPrice.toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-sm">Price Difference</span>
              <span className={isPriceBelow ? "text-green-600" : "text-red-600"}>
                {isPriceBelow ? "-" : "+"} ${Math.abs(priceDifference).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <p className={isPriceBelow ? "text-green-600" : "text-red-600"}>
              This vehicle is priced <strong>{isPriceBelow ? "below" : "above"}</strong> the KBB Fair Purchase Price.
            </p>
            <p className="mt-2 text-gray-600">
              {isPriceBelow
                ? "This suggests a competitive price that may represent a good value compared to similar vehicles in the market."
                : "This suggests the price may be higher than what others typically pay for similar vehicles."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

