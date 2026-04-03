"use client"

import { useState } from "react"
import { 
  Search, 
  Mic, 
  ShoppingCart, 
  MapPin, 
  Star,
  Smartphone,
  Tv,
  Laptop,
  AirVent,
  Refrigerator,
  WashingMachine,
  Speaker,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const categories = [
  { name: "Mobile", icon: Smartphone },
  { name: "TV", icon: Tv },
  { name: "Laptop", icon: Laptop },
  { name: "AC", icon: AirVent },
  { name: "Fridge", icon: Refrigerator },
  { name: "Washer", icon: WashingMachine },
  { name: "Audio", icon: Speaker },
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
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[78px]">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm pt-[34px]">
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-[18px] font-bold text-[#212121] font-[family-name:var(--font-heading)]">
              Sales<span className="text-[#2874F0]">App</span>
            </h1>

            <button className="flex items-center gap-1 text-[12px] text-[#212121]">
              <MapPin className="w-4 h-4 text-[#2874F0]" />
              <span className="font-medium">Mumbai</span>
              <ChevronDown className="w-3 h-3 text-[#878787]" />
            </button>

            <Link href="/cart" className="relative p-1">
              <ShoppingCart className="w-6 h-6 text-[#212121]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2874F0] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#878787]" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-10 border border-[#E0E0E0] rounded-sm bg-[#F1F3F6] focus:border-[#2874F0] focus:outline-none text-[14px]"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <Mic className="w-5 h-5 text-[#2874F0]" />
              </button>
            </div>
          </div>
        </header>

        {/* Category Chips - Horizontal Scroll */}
        <div className="px-4 py-3 bg-white overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-sm transition-colors whitespace-nowrap min-w-[60px] active:scale-95 ${
                  selectedCategory === category.name
                    ? "bg-[#2874F0]/10 border border-[#2874F0]"
                    : "bg-[#F1F3F6]"
                }`}
              >
                <category.icon className={`w-5 h-5 ${
                  selectedCategory === category.name ? "text-[#2874F0]" : "text-[#878787]"
                }`} />
                <span className={`text-[10px] font-medium ${
                  selectedCategory === category.name ? "text-[#2874F0]" : "text-[#212121]"
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Shops Section */}
        <section className="px-4 mt-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[16px] font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Nearby Shops</h2>
            <Link href="/shops" className="text-[#2874F0] text-[12px] font-medium">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3">
              {nearbyShops.map((shop) => (
                <Link key={shop.id} href={`/shop/${shop.id}`}>
                  <Card className="min-w-[160px] border-0 shadow-sm active:scale-[0.98] transition-transform bg-white">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-medium text-[12px] text-[#212121] line-clamp-1">
                          {shop.name}
                        </h3>
                        <Badge 
                          className={shop.isOpen 
                            ? "bg-[#388E3C] text-white text-[8px] border-0 px-1.5" 
                            : "bg-[#878787] text-white text-[8px] border-0 px-1.5"}
                        >
                          {shop.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#878787] mb-1">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                          <span>{shop.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{shop.distance}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {shop.brands.slice(0, 2).map((brand) => (
                          <span 
                            key={brand}
                            className="text-[8px] bg-[#F1F3F6] px-1.5 py-0.5 rounded-sm text-[#878787]"
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[16px] font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Popular Products</h2>
            <Link href="/products" className="text-[#2874F0] text-[12px] font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="border-0 shadow-sm active:scale-[0.98] transition-transform overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-white flex items-center justify-center p-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-[12px] font-medium text-[#212121] line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-[14px] text-[#212121] font-bold font-[family-name:var(--font-heading)]">
                        ₹{product.lowestPrice.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#878787] mt-0.5">
                        {product.shopsCount} shops selling
                      </p>
                      <Button 
                        size="sm"
                        className="w-full mt-2 bg-[#2874F0] active:bg-[#1E5DC8] text-white text-[12px] h-10"
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
