"use client"

import { useState } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const orders = {
  active: [
    { 
      id: "ORD123456", 
      product: "Samsung Galaxy S24 Ultra",
      image: "/placeholder.svg?height=100&width=100",
      status: "Out for Delivery",
      statusColor: "bg-[#2874F0]",
      date: "Apr 3, 2026",
      amount: 124999,
      shop: "Tech World Electronics"
    },
    { 
      id: "ORD123457", 
      product: "Sony WH-1000XM5",
      image: "/placeholder.svg?height=100&width=100",
      status: "Packed",
      statusColor: "bg-[#FFD700]",
      date: "Apr 2, 2026",
      amount: 29990,
      shop: "Digital Hub"
    },
  ],
  completed: [
    { 
      id: "ORD123450", 
      product: "MacBook Air M3",
      image: "/placeholder.svg?height=100&width=100",
      status: "Delivered",
      statusColor: "bg-[#388E3C]",
      date: "Mar 28, 2026",
      amount: 114999,
      shop: "Electronics Bazaar"
    },
    { 
      id: "ORD123445", 
      product: "LG 55\" 4K Smart TV",
      image: "/placeholder.svg?height=100&width=100",
      status: "Delivered",
      statusColor: "bg-[#388E3C]",
      date: "Mar 15, 2026",
      amount: 74999,
      shop: "Smart Gadgets"
    },
  ],
  cancelled: [
    { 
      id: "ORD123440", 
      product: "iPhone 15 Pro Max",
      image: "/placeholder.svg?height=100&width=100",
      status: "Cancelled",
      statusColor: "bg-[#FF6161]",
      date: "Mar 10, 2026",
      amount: 159999,
      shop: "Mobile World"
    },
  ],
}

type TabType = "active" | "completed" | "cancelled"

export default function OrdersListPage() {
  const [activeTab, setActiveTab] = useState<TabType>("active")

  const tabs: { key: TabType; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ]

  const currentOrders = orders[activeTab]

  const getActionButton = (tab: TabType, orderId: string) => {
    switch (tab) {
      case "active":
        return (
          <Link href={`/orders/${orderId}`}>
            <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[13px] h-[40px] rounded-xl font-semibold px-4">
              Track Order
            </Button>
          </Link>
        )
      case "completed":
        return (
          <div className="flex gap-2">
            <Link href={`/review/${orderId}`}>
              <Button variant="outline" className="text-[13px] h-[40px] rounded-xl font-semibold px-4 border-[#2874F0] text-[#2874F0]">
                Review
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[13px] h-[40px] rounded-xl font-semibold px-4">
              Reorder
            </Button>
          </div>
        )
      case "cancelled":
        return (
          <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[13px] h-[40px] rounded-xl font-semibold px-4">
            Reorder
          </Button>
        )
    }
  }

  return (
    <MobileShell>
      <MobileHeader title="My Orders" backHref="/profile" />
      
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        {/* Tabs */}
        <div className="sticky top-[94px] z-30 bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 rounded-xl text-[13px] font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white"
                    : "bg-[#F1F3F6] text-[#878787]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="px-4 py-4 space-y-4">
          {currentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-[#F1F3F6] rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-[#878787]" />
              </div>
              <p className="text-[15px] font-semibold text-[#212121] mb-1">No orders yet</p>
              <p className="text-[13px] text-[#878787] mb-4">Start shopping to see your orders here</p>
              <Link href="/home">
                <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white h-[48px] rounded-xl font-semibold px-6">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            currentOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-[80px] h-[80px] bg-[#F1F3F6] rounded-xl flex items-center justify-center p-2">
                      <img 
                        src={order.image} 
                        alt={order.product}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-[15px] font-semibold text-[#212121] line-clamp-1 pr-2">
                          {order.product}
                        </h3>
                        <Badge className={`${order.statusColor} text-white text-[10px] px-2 rounded-full font-medium whitespace-nowrap`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#878787] mb-1">Order #{order.id}</p>
                      <p className="text-[11px] text-[#878787]">{order.shop}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-[13px] text-[#878787]">{order.date}</p>
                          <p className="text-[15px] font-bold text-[#2874F0]">Rs.{order.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F1F3F6] flex justify-end">
                    {getActionButton(activeTab, order.id)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </MobileShell>
  )
}
