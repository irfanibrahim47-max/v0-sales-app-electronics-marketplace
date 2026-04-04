"use client"

import { useState } from "react"
import { 
  LayoutDashboard, Package, ShoppingBag, MessageCircle,
  Check, XCircle, ChevronRight, Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileShell } from "@/components/mobile-shell"

const dashboardStats = [
  { label: "Orders Today", value: "12", emoji: "📦", trend: "+3 from yesterday" },
  { label: "Revenue Today", value: "₹2,45,000", emoji: "💰", trend: "+15% from yesterday" },
  { label: "Pending Orders", value: "5", emoji: "⏳", trend: "Requires attention" },
]

const incomingOrders = [
  { id: "ORD001", customer: "Rahul Sharma", product: "Samsung Galaxy S24 Ultra", address: "Andheri West, Mumbai", amount: 124999, time: "2 mins ago" },
  { id: "ORD002", customer: "Priya Patel", product: "Sony WH-1000XM5", address: "Bandra East, Mumbai", amount: 29990, time: "10 mins ago" },
  { id: "ORD003", customer: "Amit Kumar", product: "MacBook Air M3", address: "Powai, Mumbai", amount: 114999, time: "25 mins ago" },
]

const tabs = [
  { id: "dashboard", label: "Dashboard", emoji: "📊" },
  { id: "products", label: "Products", emoji: "📦" },
  { id: "orders", label: "Orders", emoji: "🛒" },
  { id: "chat", label: "Chat", emoji: "💬" },
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
        <header className="sticky top-0 z-40 bg-gradient-to-r from-[#2874F0] to-[#42A5F5] pt-[34px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-4 py-3 h-[56px]">
            <h1 className="text-[20px] font-bold text-white">
              Sales<span className="text-[#FFD700]">App</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2">
                <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-[11px]">TW</span>
                </div>
                <span className="text-white text-[13px] font-semibold">Tech World</span>
              </div>
              <button className="relative p-2">
                <Bell className="w-6 h-6 text-white" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-[#FFD700] rounded-full border-2 border-[#2874F0]" />
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex px-3 pb-3 overflow-x-auto scrollbar-hide gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl whitespace-nowrap transition-colors text-[13px] font-semibold ${
                  activeTab === tab.id
                    ? "bg-white text-[#2874F0]"
                    : "text-white/80 active:bg-white/10"
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Greeting */}
              <div className="mb-5">
                <h2 className="text-[20px] font-bold text-[#212121]">☀️ Good Morning!</h2>
                <p className="text-[13px] text-[#878787]">Here&apos;s what&apos;s happening today.</p>
              </div>

              {/* Stats Cards - Stacked */}
              <div className="space-y-4">
                {dashboardStats.map((stat) => (
                  <Card key={stat.label} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[13px] text-[#878787]">{stat.label}</p>
                          <p className="text-[20px] font-bold text-[#212121] mt-1">{stat.value}</p>
                          <p className="text-[11px] text-[#878787] mt-1">{stat.trend}</p>
                        </div>
                        <div className="w-14 h-14 bg-[#2874F0]/10 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">{stat.emoji}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Incoming Orders */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[20px] font-bold text-[#212121]">🔔 Incoming Orders</h3>
                  <button className="text-[#2874F0] text-[13px] font-semibold flex items-center">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-[#F1F3F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📭</span>
                      </div>
                      <h4 className="font-bold text-[15px] text-[#212121] mb-2">No pending orders</h4>
                      <p className="text-[13px] text-[#878787]">All caught up! New orders will appear here.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-semibold text-[15px] text-[#212121]">👤 {order.customer}</span>
                            <Badge className="bg-[#F1F3F6] text-[#878787] text-[10px] border-0 rounded-full font-medium">{order.time}</Badge>
                          </div>
                          <p className="text-[13px] text-[#212121]">📱 {order.product}</p>
                          <p className="text-[11px] text-[#878787] mt-1">📍 {order.address}</p>
                          <p className="text-[17px] text-[#2874F0] font-bold mt-3">
                            ₹{order.amount.toLocaleString()}
                          </p>
                          
                          <div className="flex gap-3 mt-4">
                            <Button
                              onClick={() => handleDeclineOrder(order.id)}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-2 border-[#E0E0E0] text-[#878787] h-[48px] text-[13px] font-semibold rounded-xl"
                            >
                              <XCircle className="w-5 h-5 mr-1" />❌ Decline
                            </Button>
                            <Button
                              onClick={() => handleAcceptOrder(order.id)}
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white h-[48px] text-[13px] font-semibold rounded-xl"
                            >
                              <Check className="w-5 h-5 mr-1" />✅ Accept
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
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#2874F0]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#212121] mb-2">Manage Products</h3>
              <p className="text-[13px] text-[#878787] mb-5">Add and edit your product listings</p>
              <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white h-[52px] px-8 text-[15px] font-semibold rounded-2xl">
                ➕ Add Product
              </Button>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#2874F0]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#212121] mb-2">All Orders</h3>
              <p className="text-[13px] text-[#878787]">View and manage all your orders here</p>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#2874F0]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#212121] mb-2">Messages</h3>
              <p className="text-[13px] text-[#878787]">Chat with customers here</p>
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  )
}
