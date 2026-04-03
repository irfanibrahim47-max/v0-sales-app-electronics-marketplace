"use client"

import { useState } from "react"
import { 
  Search, 
  Mic, 
  ShoppingCart, 
  User, 
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
import Link from "next/link"

const categories = [
  { name: "Mobile", icon: Smartphone },
  { name: "TV", icon: Tv },
  { name: "Laptop", icon: Laptop },
  { name: "AC", icon: AirVent },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Speakers", icon: Speaker },
]

const nearbyShops = [
  {
    id: 1,
    name: "Tech World Electronics",
    rating: 4.5,
    distance: "0.5 km",
    isOpen: true,
    brands: ["Samsung", "LG", "Sony"]
  },
  {
    id: 2,
    name: "Digital Hub",
    rating: 4.2,
    distance: "1.2 km",
    isOpen: true,
    brands: ["Apple", "OnePlus", "Xiaomi"]
  },
  {
    id: 3,
    name: "Electronics Bazaar",
    rating: 4.7,
    distance: "2.0 km",
    isOpen: false,
    brands: ["Dell", "HP", "Lenovo"]
  },
  {
    id: 4,
    name: "Smart Gadgets",
    rating: 4.3,
    distance: "2.5 km",
    isOpen: true,
    brands: ["Boat", "JBL", "Bose"]
  },
]

const products = [
  {
    id: 1,
    name: "Samsung Galaxy S24 Ultra",
    image: "/placeholder.svg?height=200&width=200",
    lowestPrice: 124999,
    shopsCount: 5
  },
  {
    id: 2,
    name: "Sony Bravia 55\" 4K TV",
    image: "/placeholder.svg?height=200&width=200",
    lowestPrice: 74999,
    shopsCount: 3
  },
  {
    id: 3,
    name: "MacBook Air M3",
    image: "/placeholder.svg?height=200&width=200",
    lowestPrice: 114999,
    shopsCount: 4
  },
  {
    id: 4,
    name: "LG 1.5 Ton Split AC",
    image: "/placeholder.svg?height=200&width=200",
    lowestPrice: 42999,
    shopsCount: 6
  },
  {
    id: 5,
    name: "Samsung 580L Refrigerator",
    image: "/placeholder.svg?height=200&width=200",
    lowestPrice: 68999,
    shopsCount: 4
  },
  {
    id: 6,
    name: "iPhone 15 Pro Max",
    image: "/placeholder.svg?height=200&width=200",
    lowestPrice: 159999,
    shopsCount: 7
  },
]

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-[#F1F3F6] pb-20">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/home">
            <h1 className="text-xl font-bold text-[#212121] font-[family-name:var(--font-heading)]">
              Sales<span className="text-[#2874F0]">App</span>
            </h1>
          </Link>

          <button className="flex items-center gap-1 text-sm text-[#212121]">
            <MapPin className="w-4 h-4 text-[#2874F0]" />
            <span className="font-medium">Mumbai</span>
            <ChevronDown className="w-3 h-3 text-[#878787]" />
          </button>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-[#212121]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2874F0] text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <Link href="/profile">
              <User className="w-6 h-6 text-[#212121]" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#878787]" />
            <input
              type="text"
              placeholder="Search for products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-[#E0E0E0] rounded-sm bg-[#F1F3F6] focus:border-[#2874F0] focus:outline-none text-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Mic className="w-5 h-5 text-[#2874F0]" />
            </button>
          </div>
        </div>
      </header>

      {/* Category Chips */}
      <div className="px-4 py-4 bg-white overflow-x-auto">
        <div className="flex gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(
                selectedCategory === category.name ? null : category.name
              )}
              className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-sm transition-colors whitespace-nowrap min-w-[80px] ${
                selectedCategory === category.name
                  ? "bg-[#2874F0]/10 border border-[#2874F0]"
                  : "bg-[#F1F3F6] hover:bg-[#E0E0E0]"
              }`}
            >
              <category.icon className={`w-5 h-5 ${
                selectedCategory === category.name ? "text-[#2874F0]" : "text-[#878787]"
              }`} />
              <span className={`text-xs font-medium ${
                selectedCategory === category.name ? "text-[#2874F0]" : "text-[#212121]"
              }`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Shops Section */}
      <section className="px-4 mt-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Nearby Shops</h2>
          <Link href="/shops" className="text-[#2874F0] text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-3">
            {nearbyShops.map((shop) => (
              <Link key={shop.id} href={`/shop/${shop.id}`}>
                <Card className="min-w-[200px] border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm text-[#212121] line-clamp-1">
                        {shop.name}
                      </h3>
                      <Badge 
                        className={shop.isOpen 
                          ? "bg-[#388E3C] text-white text-[10px] border-0" 
                          : "bg-[#878787] text-white text-[10px] border-0"}
                      >
                        {shop.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#878787] mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                        <span>{shop.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{shop.distance}</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {shop.brands.slice(0, 2).map((brand) => (
                        <span 
                          key={brand}
                          className="text-[10px] bg-[#F1F3F6] px-1.5 py-0.5 rounded-sm text-[#878787]"
                        >
                          {brand}
                        </span>
                      ))}
                      {shop.brands.length > 2 && (
                        <span className="text-[10px] text-[#878787]">
                          +{shop.brands.length - 2}
                        </span>
                      )}
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Popular Products</h2>
          <Link href="/products" className="text-[#2874F0] text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="aspect-square bg-white flex items-center justify-center p-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <h3 className="text-sm font-medium text-[#212121] line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-[#212121] font-bold font-[family-name:var(--font-heading)]">
                      ₹{product.lowestPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#878787] mt-0.5">
                      {product.shopsCount} shops selling this
                    </p>
                    <Button 
                      size="sm"
                      className="w-full mt-2 bg-[#2874F0] hover:bg-[#2874F0]/90 text-white text-xs h-8"
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
  )
}
