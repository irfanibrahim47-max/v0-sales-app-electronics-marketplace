"use client"

import { useState } from "react"
import { use } from "react"
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Truck, 
  Store,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Check,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"

const productImages = [
  "/placeholder.svg?height=400&width=400",
  "/placeholder.svg?height=400&width=400",
  "/placeholder.svg?height=400&width=400",
  "/placeholder.svg?height=400&width=400",
]

const productSpecs = ["6.8\" AMOLED", "200MP Camera", "5000mAh", "12GB RAM", "256GB"]

const shopPrices = [
  { id: 1, name: "Tech World Electronics", distance: "0.5 km", price: 124999, rating: 4.5, inStock: true, delivery: true, deliveryTime: "Same Day" },
  { id: 2, name: "Digital Hub", distance: "1.2 km", price: 126999, rating: 4.2, inStock: true, delivery: true, deliveryTime: "Next Day" },
  { id: 3, name: "Smart Gadgets", distance: "2.5 km", price: 125499, rating: 4.3, inStock: true, delivery: false, deliveryTime: null },
  { id: 4, name: "Electronics Bazaar", distance: "2.0 km", price: 127999, rating: 4.7, inStock: false, delivery: true, deliveryTime: "2-3 Days" },
  { id: 5, name: "Mobile World", distance: "3.1 km", price: 123999, rating: 4.0, inStock: true, delivery: true, deliveryTime: "Same Day" },
]

type SortOption = "price" | "distance" | "rating"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [currentImage, setCurrentImage] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>("price")
  const [isWishlisted, setIsWishlisted] = useState(false)

  const sortedShops = [...shopPrices].sort((a, b) => {
    switch (sortBy) {
      case "price": return a.price - b.price
      case "distance": return parseFloat(a.distance) - parseFloat(b.distance)
      case "rating": return b.rating - a.rating
      default: return 0
    }
  })

  const lowestPrice = Math.min(...shopPrices.map(s => s.price))
  const bestDealShop = shopPrices.find(s => s.price === lowestPrice)

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[100px]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm pt-[34px]">
          <div className="flex items-center justify-between px-4 py-3 h-[56px]">
            <Link href="/home" className="p-1 -ml-1 active:bg-black/5 rounded-full">
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-1 active:bg-black/5 rounded-full">
                <Share2 className="w-5 h-5 text-[#212121]" />
              </button>
              <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-1 active:bg-black/5 rounded-full">
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#FF6161] text-[#FF6161]" : "text-[#212121]"}`} />
              </button>
            </div>
          </div>
        </header>

        {/* Image Carousel - Full Width */}
        <div className="relative bg-white">
          <div className="aspect-square flex items-center justify-center p-6">
            <img src={productImages[currentImage]} alt="Product" className="w-full h-full object-contain" />
          </div>
          
          <button 
            onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : productImages.length - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center active:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-[#212121]" />
          </button>
          <button 
            onClick={() => setCurrentImage(prev => prev < productImages.length - 1 ? prev + 1 : 0)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center active:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-[#212121]" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {productImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentImage ? "bg-[#2874F0]" : "bg-[#212121]/30"}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 py-4 bg-white mt-2">
          <Badge className="bg-[#2874F0]/10 text-[#2874F0] border-0 mb-2 text-[10px]">Samsung</Badge>
          <h1 className="text-[18px] font-semibold text-[#212121] mb-2 font-[family-name:var(--font-heading)]">
            Samsung Galaxy S24 Ultra 256GB
          </h1>
          <div className="flex gap-2 flex-wrap">
            {productSpecs.map((spec) => (
              <span key={spec} className="text-[10px] bg-[#F1F3F6] px-2 py-1 rounded-sm text-[#878787]">{spec}</span>
            ))}
          </div>
        </div>

        {/* Compare Prices Section */}
        <div className="px-4 py-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Compare Prices</h2>
            <span className="text-[12px] text-[#878787]">{shopPrices.length} shops</span>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
            {[
              { key: "price" as SortOption, label: "Lowest Price" },
              { key: "distance" as SortOption, label: "Nearest" },
              { key: "rating" as SortOption, label: "Best Rated" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key)}
                className={`px-3 py-2 text-[12px] rounded-sm whitespace-nowrap transition-colors h-10 min-w-[90px] ${
                  sortBy === option.key
                    ? "bg-[#2874F0] text-white font-medium"
                    : "bg-white text-[#878787] active:bg-[#F1F3F6]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Shop Cards - Full Width Stacked */}
          <div className="space-y-3">
            {sortedShops.map((shop) => (
              <Card 
                key={shop.id} 
                className={`border-0 shadow-sm bg-white ${shop.price === lowestPrice ? "ring-2 ring-[#FFD700]" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[14px] text-[#212121]">{shop.name}</h3>
                        {shop.price === lowestPrice && (
                          <Badge className="bg-[#FFD700] text-[#212121] text-[8px] border-0 px-1.5">Best Deal</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#878787] mt-1">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                          <span>{shop.rating}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{shop.distance}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[16px] font-bold text-[#212121] font-[family-name:var(--font-heading)]">
                      ₹{shop.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {shop.inStock ? (
                      <span className="flex items-center gap-1 text-[10px] text-[#388E3C]">
                        <Check className="w-3 h-3" /> In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-[#FF6161]">
                        <Clock className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                    {shop.delivery && (
                      <Badge className="bg-[#F1F3F6] text-[#212121] text-[8px] gap-1 border-0">
                        <Truck className="w-3 h-3" /> {shop.deliveryTime}
                      </Badge>
                    )}
                    {!shop.delivery && shop.inStock && (
                      <Badge className="bg-[#F1F3F6] text-[#212121] text-[8px] gap-1 border-0">
                        <Store className="w-3 h-3" /> Pickup Only
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className={`w-full h-12 text-[14px] ${
                      shop.inStock 
                        ? "bg-[#2874F0] active:bg-[#1E5DC8] text-white" 
                        : "bg-[#F1F3F6] text-[#878787] cursor-not-allowed"
                    }`}
                    disabled={!shop.inStock}
                  >
                    Buy from this shop
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-3 z-50 flex items-center justify-between pb-[22px]">
        <div>
          <p className="text-[10px] text-[#878787]">Lowest Price</p>
          <div className="flex items-center gap-2">
            <p className="text-[18px] font-bold text-[#212121] font-[family-name:var(--font-heading)]">
              ₹{lowestPrice.toLocaleString()}
            </p>
            <Badge className="bg-[#FFD700] text-[#212121] text-[8px] border-0 px-1.5">Best Deal</Badge>
          </div>
        </div>
        <Link href={`/checkout?shop=${bestDealShop?.id}&product=${resolvedParams.id}`}>
          <Button className="bg-[#2874F0] active:bg-[#1E5DC8] text-white px-6 h-12 text-[14px]">
            Buy Now
          </Button>
        </Link>
      </div>
    </MobileShell>
  )
}
