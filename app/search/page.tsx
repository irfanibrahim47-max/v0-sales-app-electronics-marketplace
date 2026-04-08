"use client"

import { useState } from "react"
import { 
  Search, 
  Mic, 
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  X,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

const categories = [
  { name: "All", emoji: "🔥" },
  { name: "Mobile", emoji: "📱" },
  { name: "TV", emoji: "📺" },
  { name: "Laptop", emoji: "💻" },
  { name: "AC", emoji: "❄️" },
]

const recentSearches = ["Samsung S24", "iPhone 15 Pro", "LG TV 55 inch", "MacBook Air"]
const trendingSearches = ["Samsung S24", "iPhone 15", "LG TV", "MacBook"]

const brands = ["Samsung", "Apple", "LG", "Sony", "Dell", "HP", "OnePlus", "Xiaomi"]

const searchResults = [
  { id: 1, name: "Samsung Galaxy S24 Ultra 256GB", image: "/placeholder.svg?height=200&width=200", lowestPrice: 124999, shopsCount: 5, rating: 4.5 },
  { id: 2, name: "Samsung Galaxy S24+ 256GB", image: "/placeholder.svg?height=200&width=200", lowestPrice: 94999, shopsCount: 4, rating: 4.4 },
  { id: 3, name: "Samsung Galaxy S24 128GB", image: "/placeholder.svg?height=200&width=200", lowestPrice: 74999, shopsCount: 6, rating: 4.3 },
  { id: 4, name: "Samsung Galaxy A55 5G", image: "/placeholder.svg?height=200&width=200", lowestPrice: 39999, shopsCount: 8, rating: 4.2 },
  { id: 5, name: "Samsung Galaxy Z Fold 5", image: "/placeholder.svg?height=200&width=200", lowestPrice: 154999, shopsCount: 3, rating: 4.6 },
]

type SortOption = "relevance" | "price-low" | "price-high" | "rating" | "distance"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [showSortSheet, setShowSortSheet] = useState(false)
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [distanceRange, setDistanceRange] = useState([5])
  const [inStockOnly, setInStockOnly] = useState(false)

  const hasSearched = searchQuery.length > 0

  const sortOptions = [
    { key: "relevance" as SortOption, label: "Relevance" },
    { key: "price-low" as SortOption, label: "Price: Low to High" },
    { key: "price-high" as SortOption, label: "Price: High to Low" },
    { key: "rating" as SortOption, label: "Rating" },
    { key: "distance" as SortOption, label: "Distance" },
  ]

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        {/* Sticky Search Header */}
        <header className="sticky top-0 z-40 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] pt-[34px]">
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#878787]" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full h-[52px] pl-12 pr-12 border-2 border-[#2874F0] rounded-2xl bg-white focus:ring-2 focus:ring-[#2874F0]/30 focus:outline-none text-[15px]"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-[#878787]" />
                </button>
              ) : (
                <button className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Mic className="w-5 h-5 text-[#2874F0]" />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-colors whitespace-nowrap text-[13px] font-semibold active:scale-95 ${
                    selectedCategory === category.name
                      ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white"
                      : "bg-[#F1F3F6] text-[#212121]"
                  }`}
                >
                  <span>{category.emoji}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Filter Row */}
          {hasSearched && (
            <div className="flex items-center justify-between px-4 pb-3 border-t border-[#F1F3F6] pt-3">
              <Sheet open={showSortSheet} onOpenChange={setShowSortSheet}>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 text-[13px] text-[#212121] font-medium">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl">
                  <SheetHeader>
                    <SheetTitle className="text-[20px] font-bold">Sort By</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSortBy(option.key)
                          setShowSortSheet(false)
                        }}
                        className={`w-full text-left px-4 py-4 rounded-2xl text-[15px] font-medium transition-colors ${
                          sortBy === option.key
                            ? "bg-[#2874F0]/10 text-[#2874F0]"
                            : "text-[#212121] active:bg-[#F1F3F6]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 text-[13px] text-[#212121] font-medium">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                    {(selectedBrands.length > 0 || inStockOnly) && (
                      <Badge className="bg-[#2874F0] text-white text-[10px] px-1.5 rounded-full">
                        {selectedBrands.length + (inStockOnly ? 1 : 0)}
                      </Badge>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl h-[80vh]">
                  <SheetHeader>
                    <SheetTitle className="text-[20px] font-bold">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-6 overflow-y-auto">
                    {/* Brands */}
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#212121] mb-3">Brands</h3>
                      <div className="space-y-3">
                        {brands.map((brand) => (
                          <label key={brand} className="flex items-center gap-3 cursor-pointer">
                            <Checkbox
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedBrands([...selectedBrands, brand])
                                } else {
                                  setSelectedBrands(selectedBrands.filter(b => b !== brand))
                                }
                              }}
                            />
                            <span className="text-[15px] text-[#212121]">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#212121] mb-3">Price Range</h3>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200000}
                        step={5000}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-[13px] text-[#878787]">
                        <span>Rs.{priceRange[0].toLocaleString()}</span>
                        <span>Rs.{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Distance */}
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#212121] mb-3">Distance</h3>
                      <Slider
                        value={distanceRange}
                        onValueChange={setDistanceRange}
                        max={20}
                        step={1}
                        className="mb-2"
                      />
                      <p className="text-[13px] text-[#878787]">Within {distanceRange[0]} km</p>
                    </div>

                    {/* In Stock */}
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-semibold text-[#212121]">In Stock Only</span>
                      <Switch
                        checked={inStockOnly}
                        onCheckedChange={setInStockOnly}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[#E0E0E0]">
                    <Button
                      variant="outline"
                      className="flex-1 h-[52px] rounded-2xl text-[15px] font-semibold"
                      onClick={() => {
                        setSelectedBrands([])
                        setPriceRange([0, 200000])
                        setDistanceRange([5])
                        setInStockOnly(false)
                      }}
                    >
                      Clear All
                    </Button>
                    <Button
                      className="flex-1 h-[52px] rounded-2xl text-[15px] font-semibold bg-gradient-to-r from-[#2874F0] to-[#1565C0]"
                      onClick={() => setShowFilterSheet(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </header>

        {/* Content */}
        {!hasSearched ? (
          <div className="px-4 py-6 space-y-6">
            {/* Recent Searches */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[15px] font-semibold text-[#212121]">Recent Searches</h2>
                <button className="text-[13px] text-[#2874F0] font-medium">Clear</button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setSearchQuery(search)}
                    className="flex items-center gap-3 w-full p-3 bg-white rounded-2xl active:bg-[#F1F3F6] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                  >
                    <Clock className="w-4 h-4 text-[#878787]" />
                    <span className="text-[15px] text-[#212121]">{search}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Trending */}
            <section>
              <h2 className="text-[15px] font-semibold text-[#212121] mb-3">Trending Now</h2>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setSearchQuery(search)}
                    className="px-4 py-2.5 bg-[#FFD700]/20 text-[#212121] rounded-full text-[13px] font-medium active:scale-95"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-4">
            <p className="text-[13px] text-[#878787]">{searchResults.length} results for &quot;{searchQuery}&quot;</p>
            
            {searchResults.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.99] transition-transform bg-white rounded-2xl overflow-hidden">
                  <CardContent className="p-0 flex">
                    <div className="w-[120px] h-[120px] bg-[#F1F3F6] flex items-center justify-center p-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="text-[15px] font-semibold text-[#212121] line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                          <span className="text-[13px] font-medium text-[#212121]">{product.rating}</span>
                        </div>
                        <span className="text-[11px] text-[#878787]">{product.shopsCount} shops</span>
                      </div>
                      <p className="text-[17px] text-[#2874F0] font-bold mb-2">
                        Rs.{product.lowestPrice.toLocaleString()}
                      </p>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[13px] h-[36px] rounded-xl font-semibold px-4"
                      >
                        Compare Prices
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </MobileShell>
  )
}
