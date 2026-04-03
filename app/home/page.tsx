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
    <div className="min-h-screen bg-white pb-20">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/home">
            <h1 className="text-xl font-bold text-foreground">
              Sales<span className="text-primary">App</span>
            </h1>
          </Link>

          <button className="flex items-center gap-1 text-sm text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">Mumbai</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <Link href="/profile">
              <User className="w-6 h-6 text-foreground" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border-2 border-primary/30 rounded-lg focus:border-primary focus:outline-none text-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Mic className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* Category Chips */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(
                selectedCategory === category.name ? null : category.name
              )}
              className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-lg border-2 transition-colors whitespace-nowrap min-w-[80px] ${
                selectedCategory === category.name
                  ? "border-primary bg-primary/5"
                  : "border-primary/20 bg-white hover:border-primary/40"
              }`}
            >
              <category.icon className={`w-5 h-5 ${
                selectedCategory === category.name ? "text-primary" : "text-muted-foreground"
              }`} />
              <span className={`text-xs font-medium ${
                selectedCategory === category.name ? "text-primary" : "text-foreground"
              }`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Shops Section */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Nearby Shops</h2>
          <Link href="/shops" className="text-primary text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-3">
            {nearbyShops.map((shop) => (
              <Link key={shop.id} href={`/shop/${shop.id}`}>
                <Card className="min-w-[200px] border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm text-foreground line-clamp-1">
                        {shop.name}
                      </h3>
                      <Badge 
                        variant={shop.isOpen ? "default" : "secondary"}
                        className={shop.isOpen ? "bg-green-500 text-white text-[10px]" : "text-[10px]"}
                      >
                        {shop.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{shop.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{shop.distance}</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {shop.brands.slice(0, 2).map((brand) => (
                        <span 
                          key={brand}
                          className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground"
                        >
                          {brand}
                        </span>
                      ))}
                      {shop.brands.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">
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
          <h2 className="text-lg font-semibold text-foreground">Popular Products</h2>
          <Link href="/products" className="text-primary text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square bg-secondary/30 flex items-center justify-center p-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold">
                      ₹{product.lowestPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.shopsCount} shops selling this
                    </p>
                    <Button 
                      size="sm"
                      className="w-full mt-2 bg-primary hover:bg-primary/90 text-white text-xs h-8"
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
