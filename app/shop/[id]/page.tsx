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
import Link from "next/link"

const shopData = {
  id: 1,
  name: "Tech World Electronics",
  coverImage: "/placeholder.svg?height=200&width=800",
  logo: "/placeholder.svg?height=80&width=80",
  address: "Shop No. 45, MG Road, Andheri West, Mumbai - 400058",
  rating: 4.5,
  reviewCount: 234,
  yearsInBusiness: 12,
  isOpen: true,
  openTime: "10:00 AM",
  closeTime: "9:00 PM",
  phone: "+91 98765 43210",
  brands: ["Samsung", "LG", "Sony", "OnePlus", "Apple", "Xiaomi", "Dell", "HP"],
  services: ["Installation", "Repair", "Exchange", "EMI Options"],
}

const shopProducts = [
  {
    id: 1,
    name: "Samsung Galaxy S24 Ultra",
    price: 124999,
    image: "/placeholder.svg?height=150&width=150"
  },
  {
    id: 2,
    name: "LG 55\" OLED TV",
    price: 89999,
    image: "/placeholder.svg?height=150&width=150"
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 29990,
    image: "/placeholder.svg?height=150&width=150"
  },
  {
    id: 4,
    name: "MacBook Air M3",
    price: 114999,
    image: "/placeholder.svg?height=150&width=150"
  },
  {
    id: 5,
    name: "iPhone 15 Pro",
    price: 134999,
    image: "/placeholder.svg?height=150&width=150"
  },
  {
    id: 6,
    name: "Samsung 580L Fridge",
    price: 68999,
    image: "/placeholder.svg?height=150&width=150"
  },
]

const shopReviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    date: "2 days ago",
    comment: "Excellent service! Got my TV installed the same day. Very professional staff.",
    serviceBadge: "Great Service"
  },
  {
    id: 2,
    name: "Priya Patel",
    rating: 4,
    date: "1 week ago",
    comment: "Good prices and genuine products. Delivery was slightly delayed but overall happy.",
    serviceBadge: "Good Prices"
  },
  {
    id: 3,
    name: "Amit Kumar",
    rating: 5,
    date: "2 weeks ago",
    comment: "Best electronics shop in the area. Have been buying from them for years.",
    serviceBadge: "Trusted Seller"
  },
]

export default function ShopProfilePage() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/home" className="p-1">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <button>
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      {/* Cover & Logo */}
      <div className="relative">
        <div className="h-36 bg-gradient-to-r from-primary/20 to-primary/5">
          <img 
            src={shopData.coverImage} 
            alt="Shop Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-10 left-4">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            <img 
              src={shopData.logo} 
              alt={shopData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Shop Info */}
      <div className="px-4 pt-14 pb-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">{shopData.name}</h1>
              <BadgeCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{shopData.address}</span>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-0">
            {shopData.yearsInBusiness} Years
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{shopData.rating}</span>
            <span className="text-sm text-muted-foreground">({shopData.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            {shopData.isOpen ? (
              <span className="text-green-600 font-medium">Open</span>
            ) : (
              <span className="text-red-500 font-medium">Closed</span>
            )}
            <span className="text-muted-foreground">
              • {shopData.openTime} - {shopData.closeTime}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Link href={`/chat/${shopData.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary/5">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </Link>
          <Button variant="outline" className="border-2 border-border">
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-white border-b border-border rounded-none h-12">
          <TabsTrigger 
            value="products" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
          >
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="reviews"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger 
            value="about"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
          >
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="px-4 py-4 mt-0">
          <div className="grid grid-cols-2 gap-3">
            {shopProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-secondary/30 flex items-center justify-center p-3">
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
                        ₹{product.price.toLocaleString()}
                      </p>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 border-primary text-primary hover:bg-primary/5 text-xs h-8"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="px-4 py-4 mt-0">
          <div className="space-y-4">
            {shopReviews.map((review) => (
              <Card key={review.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{review.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {review.serviceBadge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about" className="px-4 py-4 mt-0">
          {/* Brands */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Brands We Carry</h3>
            <div className="flex flex-wrap gap-2">
              {shopData.brands.map((brand) => (
                <Badge 
                  key={brand} 
                  variant="outline" 
                  className="border-primary/30 text-foreground"
                >
                  {brand}
                </Badge>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Services Offered</h3>
            <div className="grid grid-cols-2 gap-3">
              {shopData.services.map((service) => (
                <div 
                  key={service}
                  className="flex items-center gap-2 p-3 border-2 border-primary/20 rounded-lg"
                >
                  {service === "Repair" ? (
                    <Wrench className="w-4 h-4 text-primary" />
                  ) : (
                    <Package className="w-4 h-4 text-primary" />
                  )}
                  <span className="text-sm text-foreground">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Working Hours</h3>
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Monday - Saturday</span>
                  <span className="font-medium text-foreground">
                    {shopData.openTime} - {shopData.closeTime}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium text-foreground">11:00 AM - 7:00 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Location</h3>
            <div className="h-40 bg-secondary/50 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Map View</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating Chat Button */}
      <Link 
        href={`/chat/${shopData.id}`}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  )
}
