"use client"

import { useState } from "react"
import { 
  Search, 
  Mic, 
  ShoppingCart, 
  MapPin, 
  Star,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const categories = [
  { name: "Mobile", emoji: "📱" },
  { name: "TV", emoji: "📺" },
  { name: "Laptop", emoji: "💻" },
  { name: "AC", emoji: "❄️" },
  { name: "Fridge", emoji: "🧊" },
  { name: "Washer", emoji: "🧺" },
  { name: "Audio", emoji: "🔊" },
]

const nearbyShops = [
  { id: 1, name: "Tech World", rating: 4.5, distance: "0.5 km", isOpen: true, brands: ["Samsung", "LG", "Sony"] },
  { id: 2, name: "Digital Hub", rating: 4.2, distance: "1.2 km", isOpen: true, brands: ["Apple", "OnePlus"] },
  { id: 3, name: "Electronics Bazaar", rating: 4.7, distance: "2.0 km", isOpen: false, brands: ["Dell", "HP"] },
  { id: 4, name: "Smart Gadgets", rating: 4.3, distance: "2.5 km", isOpen: true, brands: ["Boat", "JBL"] },
]

const products = [
  { id: 1, name: "Samsung Galaxy S24 Ultra", image: "/placeholder.svg?height=200&width=200", lowestPrice: 124999, shopsCount: 5 },
  { id: 2, name: "Sony Bravia 55\" 4K TV", image: "/placeholder.svg?height=200&width=200", lowestPrice: 74999, shopsCount: 3 },
  { id: 3, name: "MacBook Air M3", image: "/placeholder.svg?height=200&width=200", lowestPrice: 114999, shopsCount: 4 },
  { id: 4, name: "LG 1.5 Ton Split AC", image: "/placeholder.svg?height=200&width=200", lowestPrice: 42999, shopsCount: 6 },
  { id: 5, name: "Samsung 580L Fridge", image: "/placeholder.svg?height=200&width=200", lowestPrice: 68999, shopsCount: 4 },
  { id: 6, name: "iPhone 15 Pro Max", image: "/placeholder.svg?height=200&width=200", lowestPrice: 159999, shopsCount: 7 },
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        {/* Sticky Header with Gradient */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-[#2874F0] to-[#42A5F5] shadow-[0_2px_12px_rgba(0,0,0,0.08)] pt-[34px]">
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-[20px] font-bold text-white">
              Sales<span className="text-[#FFD700]">App</span>
            </h1>

            <button className="flex items-center gap-1 text-[13px] text-white">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Mumbai</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            <Link href="/cart" className="relative p-1">
              <ShoppingCart className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFD700] text-[#212121] text-[11px] rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#878787]" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[52px] pl-12 pr-12 border-0 rounded-2xl bg-white focus:ring-2 focus:ring-[#2874F0]/30 focus:outline-none text-[15px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <Mic className="w-5 h-5 text-[#2874F0]" />
              </button>
            </div>
          </div>
        </header>

        {/* Category Chips - Horizontal Scroll */}
        <div className="px-4 py-4 bg-white overflow-x-auto scrollbar-hide shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-colors whitespace-nowrap min-w-[70px] active:scale-95 ${
                  selectedCategory === category.name
                    ? "bg-[#2874F0]/10 border-2 border-[#2874F0]"
                    : "bg-[#F1F3F6] border-2 border-transparent"
                }`}
              >
                <span className="text-[20px]">{category.emoji}</span>
                <span className={`text-[11px] font-semibold ${
                  selectedCategory === category.name ? "text-[#2874F0]" : "text-[#212121]"
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Shops Section */}
        <section className="px-4 mt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-[#212121]">🏪 Nearby Shops</h2>
            <Link href="/shops" className="text-[#2874F0] text-[13px] font-semibold">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4">
              {nearbyShops.map((shop) => (
                <Link key={shop.id} href={`/shop/${shop.id}`}>
                  <Card className="min-w-[180px] border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform bg-white rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-[15px] text-[#212121] line-clamp-1">
                          {shop.name}
                        </h3>
                        <Badge 
                          className={`${shop.isOpen 
                            ? "bg-[#388E3C] text-white" 
                            : "bg-[#878787] text-white"} text-[10px] border-0 px-2 rounded-full`}
                        >
                          {shop.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#878787] mb-2">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                          <span className="font-medium text-[#212121]">{shop.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{shop.distance}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {shop.brands.slice(0, 2).map((brand) => (
                          <span 
                            key={brand}
                            className="text-[10px] bg-[#F1F3F6] px-2 py-1 rounded-full text-[#878787] font-medium"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-[#212121]">🔥 Popular Products</h2>
            <Link href="/products" className="text-[#2874F0] text-[13px] font-semibold">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform overflow-hidden bg-white rounded-2xl">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-white flex items-center justify-center p-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-[13px] font-semibold text-[#212121] line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-[17px] text-[#2874F0] font-bold">
                        ₹{product.lowestPrice.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[#878787] mt-1">
                        {product.shopsCount} shops selling
                      </p>
                      <Button 
                        size="sm"
                        className="w-full mt-3 bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white text-[13px] h-[44px] rounded-xl font-semibold"
                      >
                        Compare
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </MobileShell>
  )
}
