"use client"

import { Check, Phone, MessageCircle, Store, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const orderData = {
  id: "ORD12345678", date: "April 4, 2026", status: "out_for_delivery", estimatedTime: "Today by 8 PM",
  product: { name: "Samsung Galaxy S24 Ultra 256GB", image: "/placeholder.svg?height=80&width=80", price: 124999, quantity: 1 },
  shop: { id: 1, name: "Tech World Electronics", phone: "+91 98765 43210" },
  deliveryAddress: "Flat 402, Building A, Green Valley Apartments, Andheri West, Mumbai - 400058"
}

const trackingSteps = [
  { id: 1, title: "Order Placed", emoji: "📋", description: "Your order has been confirmed", time: "10:30 AM", completed: true },
  { id: 2, title: "Shop Confirmed", emoji: "✅", description: "Shop has accepted your order", time: "10:45 AM", completed: true },
  { id: 3, title: "Out for Delivery", emoji: "🚚", description: "Your order is on the way", time: "2:30 PM", completed: true },
  { id: 4, title: "Delivered", emoji: "📦", description: "Package delivered successfully", time: null, completed: false },
]

export default function OrderTrackingPage() {
  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        <MobileHeader title="📦 Track Order" backHref="/home" />

        <div className="px-4 py-5 space-y-6">
          {/* Order Info */}
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <div>
              <p className="text-[11px] text-[#878787]">Order Date</p>
              <p className="font-semibold text-[15px] text-[#212121]">{orderData.date}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#878787]">Estimated Delivery</p>
              <p className="font-semibold text-[15px] text-[#388E3C]">🚚 {orderData.estimatedTime}</p>
            </div>
          </div>

          {/* Product Card */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <img src={orderData.product.image} alt={orderData.product.name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[15px] text-[#212121] line-clamp-2">{orderData.product.name}</h3>
                  <p className="text-[13px] text-[#878787] mt-1">Qty: {orderData.product.quantity}</p>
                  <p className="text-[17px] text-[#2874F0] font-bold mt-2">₹{orderData.product.price.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline - Full Width Vertical */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-5">
              <h3 className="font-bold text-[15px] text-[#212121] mb-5">📍 Order Status</h3>
              
              <div className="relative">
                {trackingSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
                    {index < trackingSteps.length - 1 && (
                      <div 
                        className={`absolute left-4 w-0.5 ${trackingSteps[index + 1].completed ? "bg-[#2874F0]" : "bg-[#E0E0E0]"}`}
                        style={{ top: `${index * 76 + 32}px`, height: "44px" }}
                      />
                    )}
                    
                    <div className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${step.completed ? "bg-[#2874F0]" : "bg-[#E0E0E0]"}`}>
                      {step.completed ? <Check className="w-5 h-5 text-white" /> : <div className="w-2.5 h-2.5 bg-[#878787]/50 rounded-full" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-semibold text-[15px] ${step.completed ? "text-[#212121]" : "text-[#878787]"}`}>{step.emoji} {step.title}</h4>
                          <p className="text-[13px] text-[#878787]">{step.description}</p>
                        </div>
                        {step.time && <span className="text-[11px] text-[#878787]">{step.time}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shop Contact Card */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-[#F1F3F6] rounded-2xl flex items-center justify-center">
                  <Store className="w-7 h-7 text-[#878787]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[15px] text-[#212121]">🏪 {orderData.shop.name}</h4>
                  <p className="text-[13px] text-[#878787]">{orderData.shop.phone}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 border-2 border-[#2874F0] text-[#2874F0] h-[52px] text-[13px] font-semibold rounded-2xl">
                  <Phone className="w-5 h-5 mr-2" />📞 Call Shop
                </Button>
                <Link href={`/chat/${orderData.shop.id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-2 border-[#E0E0E0] h-[52px] text-[13px] font-semibold rounded-2xl">
                    <MessageCircle className="w-5 h-5 mr-2" />💬 Chat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#2874F0] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[15px] text-[#212121] mb-2">🏠 Delivery Address</h4>
                  <p className="text-[13px] text-[#878787]">{orderData.deliveryAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button variant="outline" className="w-full border-2 border-[#2874F0] text-[#2874F0] h-[52px] text-[15px] font-semibold rounded-2xl">
            ❓ Need Help?
          </Button>
        </div>
      </div>

      <BottomNav />
    </MobileShell>
  )
}
