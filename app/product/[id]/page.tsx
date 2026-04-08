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
  Clock,
  Bell,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
  const [priceAlertValue, setPriceAlertValue] = useState("")
  const [notifyNewShops, setNotifyNewShops] = useState(false)
  const [alertSet, setAlertSet] = useState(false)

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
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[110px]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] pt-[34px]">
          <div className="flex items-center justify-between px-4 py-3 h-[56px]">
            <Link href="/home" className="p-2 -ml-2 active:bg-black/5 rounded-2xl">
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2 active:bg-black/5 rounded-2xl">
                <Share2 className="w-5 h-5 text-[#212121]" />
              </button>
              <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-2 active:bg-black/5 rounded-2xl">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-center active:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-[#212121]" />
          </button>
          <button 
            onClick={() => setCurrentImage(prev => prev < productImages.length - 1 ? prev + 1 : 0)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-center active:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-[#212121]" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {productImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentImage ? "bg-[#2874F0]" : "bg-[#212121]/30"}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 py-5 bg-white mt-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <Badge className="bg-[#2874F0]/10 text-[#2874F0] border-0 mb-3 text-[11px] font-semibold rounded-full px-3">Samsung</Badge>
          <h1 className="text-[20px] font-bold text-[#212121] mb-3">
            📱 Samsung Galaxy S24 Ultra 256GB
          </h1>
          <div className="flex gap-2 flex-wrap">
            {productSpecs.map((spec) => (
              <span key={spec} className="text-[11px] bg-[#F1F3F6] px-3 py-1.5 rounded-full text-[#878787] font-medium">{spec}</span>
            ))}
          </div>
        </div>

        {/* Compare Prices Section */}
        <div className="px-4 py-5 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-[#212121]">💰 Compare Prices</h2>
            <span className="text-[13px] text-[#878787]">{shopPrices.length} shops</span>
          </div>

          {/* Sort Options */}
          <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide">
            {[
              { key: "price" as SortOption, label: "💵 Lowest Price" },
              { key: "distance" as SortOption, label: "📍 Nearest" },
              { key: "rating" as SortOption, label: "⭐ Best Rated" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key)}
                className={`px-4 py-3 text-[13px] rounded-2xl whitespace-nowrap transition-colors h-[48px] min-w-[100px] font-semibold ${
                  sortBy === option.key
                    ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white"
                    : "bg-white text-[#878787] active:bg-[#F1F3F6] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Price Alert Card */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl mb-4">
            <CardContent className="p-4">
              {!alertSet ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-[#2874F0]" />
                    <h3 className="text-[15px] font-semibold text-[#212121]">Set a Price Alert</h3>
                  </div>
                  <div className="mb-4">
                    <label className="text-[13px] text-[#878787] mb-2 block">Alert me when price drops below</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#878787]">Rs.</span>
                      <Input
                        type="number"
                        value={priceAlertValue}
                        onChange={(e) => setPriceAlertValue(e.target.value)}
                        placeholder="120000"
                        className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px] pl-12"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] text-[#212121]">Notify when new shops add this product</span>
                    <Switch
                      checked={notifyNewShops}
                      onCheckedChange={setNotifyNewShops}
                    />
                  </div>
                  <Button 
                    onClick={() => setAlertSet(true)}
                    className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white text-[15px] font-semibold rounded-2xl"
                  >
                    Set Alert
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-[#388E3C]/10 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-8 h-8 text-[#388E3C]" />
                  </div>
                  <p className="text-[15px] font-semibold text-[#212121] mb-1">Price Alert Set!</p>
                  <p className="text-[13px] text-[#878787] text-center">{"We'll notify you when the price drops below Rs."}{priceAlertValue || "120000"}</p>
                  <button 
                    onClick={() => setAlertSet(false)}
                    className="text-[13px] text-[#2874F0] font-medium mt-3"
                  >
                    Edit Alert
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shop Cards - Full Width Stacked */}
          <div className="space-y-4">
            {sortedShops.map((shop) => (
              <Card 
                key={shop.id} 
                className={`border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl ${shop.price === lowestPrice ? "ring-2 ring-[#FFD700]" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[15px] text-[#212121]">{shop.name}</h3>
                        {shop.price === lowestPrice && (
                          <Badge className="bg-[#FFD700] text-[#212121] text-[10px] border-0 px-2 font-bold rounded-full">🔥 Best Deal</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#878787] mt-1">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                          <span className="font-medium text-[#212121]">{shop.rating}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{shop.distance}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[17px] font-bold text-[#2874F0]">
                      ₹{shop.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    {shop.inStock ? (
                      <span className="flex items-center gap-1 text-[11px] text-[#388E3C] font-medium">
                        <Check className="w-3.5 h-3.5" /> In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-[#FF6161] font-medium">
                        <Clock className="w-3.5 h-3.5" /> Out of Stock
                      </span>
                    )}
                    {shop.delivery && (
                      <Badge className="bg-[#F1F3F6] text-[#212121] text-[10px] gap-1 border-0 rounded-full font-medium">
                        <Truck className="w-3 h-3" /> {shop.deliveryTime}
                      </Badge>
                    )}
                    {!shop.delivery && shop.inStock && (
                      <Badge className="bg-[#F1F3F6] text-[#212121] text-[10px] gap-1 border-0 rounded-full font-medium">
                        <Store className="w-3 h-3" /> Pickup Only
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className={`w-full h-[52px] text-[15px] font-semibold rounded-2xl ${
                      shop.inStock 
                        ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white" 
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-4 z-50 flex items-center justify-between pb-[26px] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div>
          <p className="text-[11px] text-[#878787]">Lowest Price</p>
          <div className="flex items-center gap-2">
            <p className="text-[20px] font-bold text-[#2874F0]">
              ₹{lowestPrice.toLocaleString()}
            </p>
            <Badge className="bg-[#FFD700] text-[#212121] text-[10px] border-0 px-2 font-bold rounded-full">🔥 Best</Badge>
          </div>
        </div>
        <Link href={`/checkout?shop=${bestDealShop?.id}&product=${resolvedParams.id}`}>
          <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white px-8 h-[52px] text-[15px] font-semibold rounded-2xl">
            Buy Now
          </Button>
        </Link>
      </div>
    </MobileShell>
  )
}
