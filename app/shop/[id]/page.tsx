"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Phone,
  MessageCircle,
  Share2,
  BadgeCheck,
  Wrench,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"

const shopData = {
  id: 1, name: "Tech World Electronics", coverImage: "/placeholder.svg?height=200&width=800",
  logo: "/placeholder.svg?height=80&width=80", address: "Shop No. 45, MG Road, Andheri West, Mumbai",
  rating: 4.5, reviewCount: 234, yearsInBusiness: 12, isOpen: true, openTime: "10:00 AM", closeTime: "9:00 PM",
  phone: "+91 98765 43210", brands: ["Samsung", "LG", "Sony", "OnePlus", "Apple", "Xiaomi"],
  services: ["Installation", "Repair", "Exchange", "EMI"],
}

const shopProducts = [
  { id: 1, name: "Samsung Galaxy S24 Ultra", price: 124999, image: "/placeholder.svg?height=150&width=150" },
  { id: 2, name: "LG 55\" OLED TV", price: 89999, image: "/placeholder.svg?height=150&width=150" },
  { id: 3, name: "Sony WH-1000XM5", price: 29990, image: "/placeholder.svg?height=150&width=150" },
  { id: 4, name: "MacBook Air M3", price: 114999, image: "/placeholder.svg?height=150&width=150" },
]

const shopReviews = [
  { id: 1, name: "Rahul Sharma", rating: 5, date: "2 days ago", comment: "Excellent service! Very professional.", serviceBadge: "Great Service" },
  { id: 2, name: "Priya Patel", rating: 4, date: "1 week ago", comment: "Good prices and genuine products.", serviceBadge: "Good Prices" },
]

export default function ShopProfilePage() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.08)] pt-[34px]">
          <div className="flex items-center justify-between px-4 py-3 h-[56px]">
            <Link href="/home" className="p-2 -ml-2 active:bg-black/5 rounded-2xl">
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </Link>
            <button className="p-2 active:bg-black/5 rounded-2xl">
              <Share2 className="w-5 h-5 text-[#212121]" />
            </button>
          </div>
        </header>

        {/* Cover & Logo */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-[#2874F0] to-[#42A5F5]">
            <img src={shopData.coverImage} alt="Cover" className="w-full h-full object-cover opacity-50" />
          </div>
          <div className="absolute -bottom-10 left-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden">
              <img src={shopData.logo} alt={shopData.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Shop Info */}
        <div className="px-4 pt-14 pb-5 bg-white mt-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-bold text-[#212121]">🏪 {shopData.name}</h1>
                <BadgeCheck className="w-5 h-5 text-[#2874F0]" />
              </div>
              <div className="flex items-center gap-1 text-[13px] text-[#878787] mt-1">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{shopData.address}</span>
              </div>
            </div>
            <Badge className="bg-[#2874F0]/10 text-[#2874F0] border-0 text-[11px] font-semibold rounded-full px-3">{shopData.yearsInBusiness} Years</Badge>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
              <span className="font-bold text-[15px] text-[#212121]">{shopData.rating}</span>
              <span className="text-[13px] text-[#878787]">({shopData.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-[13px]">
              <Clock className="w-4 h-4 text-[#878787]" />
              <span className={shopData.isOpen ? "text-[#388E3C] font-semibold" : "text-[#FF6161] font-semibold"}>
                {shopData.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <Link href={`/chat/${shopData.id}`} className="flex-1">
              <Button variant="outline" className="w-full h-[52px] border-2 border-[#2874F0] text-[#2874F0] text-[15px] font-semibold rounded-2xl">
                <MessageCircle className="w-5 h-5 mr-2" />💬 Chat
              </Button>
            </Link>
            <Button variant="outline" className="h-[52px] border-2 border-[#E0E0E0] px-5 rounded-2xl">
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="w-full grid grid-cols-3 bg-white border-b border-[#E0E0E0] rounded-none h-14 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <TabsTrigger value="products" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2874F0] data-[state=active]:text-[#2874F0] data-[state=active]:bg-transparent text-[13px] font-semibold">📦 Products</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2874F0] data-[state=active]:text-[#2874F0] data-[state=active]:bg-transparent text-[13px] font-semibold">⭐ Reviews</TabsTrigger>
            <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2874F0] data-[state=active]:text-[#2874F0] data-[state=active]:bg-transparent text-[13px] font-semibold">ℹ️ About</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="px-4 py-5 mt-0">
            <div className="grid grid-cols-2 gap-4">
              {shopProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform overflow-hidden bg-white rounded-2xl">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-white flex items-center justify-center p-4">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[13px] font-semibold text-[#212121] line-clamp-2 mb-2">{product.name}</h3>
                        <p className="text-[17px] text-[#2874F0] font-bold">₹{product.price.toLocaleString()}</p>
                        <Button size="sm" variant="outline" className="w-full mt-3 border-2 border-[#2874F0] text-[#2874F0] text-[13px] h-[44px] font-semibold rounded-xl">Add to Cart</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="px-4 py-5 mt-0">
            <div className="space-y-4">
              {shopReviews.map((review) => (
                <Card key={review.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-[15px] text-[#212121]">{review.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-[#FFD700] text-[#FFD700]" : "text-[#E0E0E0]"}`} />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#878787]">{review.date}</span>
                        </div>
                      </div>
                      <Badge className="bg-[#F1F3F6] text-[#212121] text-[11px] border-0 font-medium rounded-full">{review.serviceBadge}</Badge>
                    </div>
                    <p className="text-[13px] text-[#878787]">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="px-4 py-5 mt-0">
            <div className="mb-6">
              <h3 className="font-bold text-[15px] text-[#212121] mb-4">🏷️ Brands</h3>
              <div className="flex flex-wrap gap-2">
                {shopData.brands.map((brand) => (
                  <Badge key={brand} variant="outline" className="border-2 border-[#2874F0]/30 text-[#212121] text-[11px] font-medium rounded-full px-3 py-1.5">{brand}</Badge>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-bold text-[15px] text-[#212121] mb-4">🛠️ Services</h3>
              <div className="grid grid-cols-2 gap-3">
                {shopData.services.map((service) => (
                  <div key={service} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                    {service === "Repair" ? <Wrench className="w-5 h-5 text-[#2874F0]" /> : <Package className="w-5 h-5 text-[#2874F0]" />}
                    <span className="text-[13px] text-[#212121] font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Chat Button */}
      <Link 
        href={`/chat/${shopData.id}`}
        className="fixed bottom-[94px] right-4 w-16 h-16 bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white rounded-2xl shadow-[0_4px_16px_rgba(40,116,240,0.4)] flex items-center justify-center active:from-[#1E5DC8] active:to-[#0D47A1] transition-colors z-40"
      >
        <MessageCircle className="w-7 h-7" />
      </Link>
    </MobileShell>
  )
}
