"use client"

import { 
  ArrowLeft, 
  Check, 
  Package, 
  Truck, 
  MapPin,
  Phone,
  MessageCircle,
  Store
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const orderData = {
  id: "ORD12345678",
  date: "April 4, 2026",
  status: "out_for_delivery",
  estimatedTime: "Today by 8 PM",
  product: {
    name: "Samsung Galaxy S24 Ultra 256GB",
    image: "/placeholder.svg?height=80&width=80",
    price: 124999,
    quantity: 1
  },
  shop: {
    id: 1,
    name: "Tech World Electronics",
    phone: "+91 98765 43210"
  },
  deliveryAddress: "Flat 402, Building A, Green Valley Apartments, Andheri West, Mumbai - 400058"
}

const trackingSteps = [
  {
    id: 1,
    title: "Order Placed",
    description: "Your order has been confirmed",
    time: "10:30 AM",
    completed: true
  },
  {
    id: 2,
    title: "Shop Confirmed",
    description: "Shop has accepted your order",
    time: "10:45 AM",
    completed: true
  },
  {
    id: 3,
    title: "Out for Delivery",
    description: "Your order is on the way",
    time: "2:30 PM",
    completed: true
  },
  {
    id: 4,
    title: "Delivered",
    description: "Package delivered successfully",
    time: null,
    completed: false
  },
]

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/home" className="p-1">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Track Order</h1>
            <p className="text-xs text-muted-foreground">#{orderData.id}</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Order Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium text-foreground">{orderData.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Estimated Delivery</p>
            <p className="font-medium text-green-600">{orderData.estimatedTime}</p>
          </div>
        </div>

        {/* Product Card */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-secondary/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                <img 
                  src={orderData.product.image} 
                  alt={orderData.product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground line-clamp-2">
                  {orderData.product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Qty: {orderData.product.quantity}
                </p>
                <p className="text-primary font-bold mt-1">
                  ₹{orderData.product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Order Status</h3>
            
            <div className="relative">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
                  {/* Timeline Line */}
                  {index < trackingSteps.length - 1 && (
                    <div 
                      className={`absolute left-3 top-6 w-0.5 h-[calc(100%-24px)] ${
                        trackingSteps[index + 1].completed 
                          ? "bg-primary" 
                          : "bg-border"
                      }`}
                      style={{ 
                        top: `${index * 72 + 24}px`,
                        height: "48px"
                      }}
                    />
                  )}
                  
                  {/* Step Circle */}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed 
                      ? "bg-primary" 
                      : "bg-border"
                  }`}>
                    {step.completed ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${
                          step.completed ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      {step.time && (
                        <span className="text-xs text-muted-foreground">
                          {step.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shop Contact Card */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{orderData.shop.name}</h4>
                <p className="text-sm text-muted-foreground">{orderData.shop.phone}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-2 border-primary text-primary hover:bg-primary/5"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Shop
              </Button>
              <Link href={`/chat/${orderData.shop.id}`} className="flex-1">
                <Button 
                  variant="outline"
                  className="w-full border-2 border-border hover:bg-secondary"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Delivery Address</h4>
                <p className="text-sm text-muted-foreground">
                  {orderData.deliveryAddress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            variant="outline"
            className="w-full border-2 border-primary text-primary hover:bg-primary/5"
          >
            Need Help?
          </Button>
        </div>
      </div>
    </div>
  )
}
