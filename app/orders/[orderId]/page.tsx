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
    <div className="min-h-screen bg-[#F1F3F6] pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/home" className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#212121]" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Track Order</h1>
            <p className="text-xs text-[#878787]">#{orderData.id}</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Order Info */}
        <div className="flex items-center justify-between bg-white p-4 rounded-sm shadow-sm">
          <div>
            <p className="text-sm text-[#878787]">Order Date</p>
            <p className="font-medium text-[#212121]">{orderData.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#878787]">Estimated Delivery</p>
            <p className="font-medium text-[#388E3C]">{orderData.estimatedTime}</p>
          </div>
        </div>

        {/* Product Card */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-white rounded-sm flex-shrink-0 flex items-center justify-center">
                <img 
                  src={orderData.product.image} 
                  alt={orderData.product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[#212121] line-clamp-2">
                  {orderData.product.name}
                </h3>
                <p className="text-sm text-[#878787] mt-1">
                  Qty: {orderData.product.quantity}
                </p>
                <p className="text-[#212121] font-bold mt-1 font-[family-name:var(--font-heading)]">
                  ₹{orderData.product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#212121] mb-4 font-[family-name:var(--font-heading)]">Order Status</h3>
            
            <div className="relative">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
                  {/* Timeline Line */}
                  {index < trackingSteps.length - 1 && (
                    <div 
                      className={`absolute left-3 top-6 w-0.5 h-[calc(100%-24px)] ${
                        trackingSteps[index + 1].completed 
                          ? "bg-[#2874F0]" 
                          : "bg-[#E0E0E0]"
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
                      ? "bg-[#2874F0]" 
                      : "bg-[#E0E0E0]"
                  }`}>
                    {step.completed ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-[#878787]/50 rounded-full" />
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${
                          step.completed ? "text-[#212121]" : "text-[#878787]"
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-[#878787]">
                          {step.description}
                        </p>
                      </div>
                      {step.time && (
                        <span className="text-xs text-[#878787]">
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
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#F1F3F6] rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-[#878787]" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[#212121]">{orderData.shop.name}</h4>
                <p className="text-sm text-[#878787]">{orderData.shop.phone}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-2 border-[#2874F0] text-[#2874F0] hover:bg-[#2874F0]/5"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Shop
              </Button>
              <Link href={`/chat/${orderData.shop.id}`} className="flex-1">
                <Button 
                  variant="outline"
                  className="w-full border-2 border-[#E0E0E0] hover:bg-[#F1F3F6]"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#2874F0] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[#212121] mb-1">Delivery Address</h4>
                <p className="text-sm text-[#878787]">
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
            className="w-full border-2 border-[#2874F0] text-[#2874F0] hover:bg-[#2874F0]/5"
          >
            Need Help?
          </Button>
        </div>
      </div>
    </div>
  )
}
