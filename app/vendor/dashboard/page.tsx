"use client"

import { useState } from "react"
import { 
  LayoutDashboard, Package, ShoppingBag, MessageCircle,
  TrendingUp, Clock, Check, XCircle, ChevronRight, Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"

const dashboardStats = [
  { label: "Orders Today", value: "12", icon: ShoppingBag, trend: "+3 from yesterday" },
  { label: "Revenue Today", value: "₹2,45,000", icon: TrendingUp, trend: "+15% from yesterday" },
  { label: "Pending Orders", value: "5", icon: Clock, trend: "Requires attention" },
]

const incomingOrders = [
  { id: "ORD001", customer: "Rahul Sharma", product: "Samsung Galaxy S24 Ultra", address: "Andheri West, Mumbai", amount: 124999, time: "2 mins ago" },
  { id: "ORD002", customer: "Priya Patel", product: "Sony WH-1000XM5", address: "Bandra East, Mumbai", amount: 29990, time: "10 mins ago" },
  { id: "ORD003", customer: "Amit Kumar", product: "MacBook Air M3", address: "Powai, Mumbai", amount: 114999, time: "25 mins ago" },
]

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "chat", label: "Chat", icon: MessageCircle },
]

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orders, setOrders] = useState(incomingOrders)

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  const handleDeclineOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  return (
    <MobileShell>
      <div className="h-full flex flex-col bg-[#F1F3F6]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#2874F0] pt-[34px]">
          <div className="flex items-center justify-between px-4 py-3 h-[56px]">
            <h1 className="text-[18px] font-bold text-white font-[family-name:var(--font-heading)]">
              Sales<span className="text-[#FFD700]">App</span>
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">TW</span>
                </div>
                <span className="text-white text-[12px] font-medium">Tech World</span>
              </div>
              <button className="relative p-2">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFD700] rounded-full" />
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#2874F0] px-2 pb-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-colors text-[12px] ${
                  activeTab === tab.id
                    ? "bg-white text-[#2874F0] font-medium"
                    : "text-white/80 active:bg-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              {/* Greeting */}
              <div className="mb-4">
                <h2 className="text-[18px] font-bold text-[#212121] font-[family-name:var(--font-heading)]">Good Morning!</h2>
                <p className="text-[12px] text-[#878787]">Here&apos;s what&apos;s happening today.</p>
              </div>

              {/* Stats Cards - Stacked */}
              <div className="space-y-3">
                {dashboardStats.map((stat) => (
                  <Card key={stat.label} className="border-0 shadow-sm bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[12px] text-[#878787]">{stat.label}</p>
                          <p className="text-[18px] font-bold text-[#212121] mt-1 font-[family-name:var(--font-heading)]">{stat.value}</p>
                          <p className="text-[10px] text-[#878787] mt-1">{stat.trend}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#2874F0]/10 rounded-sm flex items-center justify-center">
                          <stat.icon className="w-5 h-5 text-[#2874F0]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Incoming Orders */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Incoming Orders</h3>
                  <button className="text-[#2874F0] text-[12px] font-medium flex items-center">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <Card className="border-0 shadow-sm bg-white">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-[#F1F3F6] rounded-full flex items-center justify-center mx-auto mb-3">
                        <ShoppingBag className="w-7 h-7 text-[#878787]" />
                      </div>
                      <h4 className="font-medium text-[14px] text-[#212121] mb-1">No pending orders</h4>
                      <p className="text-[12px] text-[#878787]">All caught up! New orders will appear here.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-0 shadow-sm bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-[14px] text-[#212121]">{order.customer}</span>
                            <Badge className="bg-[#F1F3F6] text-[#878787] text-[8px] border-0">{order.time}</Badge>
                          </div>
                          <p className="text-[12px] text-[#212121]">{order.product}</p>
                          <p className="text-[10px] text-[#878787] mt-1">{order.address}</p>
                          <p className="text-[16px] text-[#212121] font-bold mt-2 font-[family-name:var(--font-heading)]">
                            ₹{order.amount.toLocaleString()}
                          </p>
                          
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => handleDeclineOrder(order.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-2 border-[#E0E0E0] text-[#878787] h-10 text-[12px]"
                            >
                              <XCircle className="w-4 h-4 mr-1" />Decline
                            </Button>
                            <Button
                              onClick={() => handleAcceptOrder(order.id)}
                              size="sm"
                              className="flex-1 bg-[#2874F0] active:bg-[#1E5DC8] text-white h-10 text-[12px]"
                            >
                              <Check className="w-4 h-4 mr-1" />Accept
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#2874F0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#2874F0]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#212121] mb-2 font-[family-name:var(--font-heading)]">Manage Products</h3>
              <p className="text-[12px] text-[#878787] mb-4">Add and edit your product listings</p>
              <Button className="bg-[#2874F0] active:bg-[#1E5DC8] text-white h-12 px-6 text-[14px]">
                <Package className="w-4 h-4 mr-2" />Add Product
              </Button>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#2874F0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-[#2874F0]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#212121] mb-2 font-[family-name:var(--font-heading)]">All Orders</h3>
              <p className="text-[12px] text-[#878787]">View and manage all your orders here</p>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#2874F0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#2874F0]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#212121] mb-2 font-[family-name:var(--font-heading)]">Messages</h3>
              <p className="text-[12px] text-[#878787]">Chat with customers here</p>
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  )
}
