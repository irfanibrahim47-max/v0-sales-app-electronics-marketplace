"use client"

import { useState } from "react"
import { 
  LayoutDashboard, Package, ShoppingBag, MessageCircle,
  Check, XCircle, ChevronRight, Bell, Plus, Pencil
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
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

const vendorProducts = [
  { id: 1, name: "Samsung Galaxy S24 Ultra", price: 124999, inStock: true, image: "/placeholder.svg?height=60&width=60" },
  { id: 2, name: "Sony WH-1000XM5", price: 29990, inStock: true, image: "/placeholder.svg?height=60&width=60" },
  { id: 3, name: "MacBook Air M3", price: 114999, inStock: false, image: "/placeholder.svg?height=60&width=60" },
  { id: 4, name: "LG 55\" OLED TV", price: 89999, inStock: true, image: "/placeholder.svg?height=60&width=60" },
]

const allOrders = [
  { id: "ORD001", customer: "Rahul Sharma", product: "Samsung Galaxy S24 Ultra", amount: 124999, status: "pending", time: "2 mins ago" },
  { id: "ORD002", customer: "Priya Patel", product: "Sony WH-1000XM5", amount: 29990, status: "confirmed", time: "1 hour ago" },
  { id: "ORD003", customer: "Amit Kumar", product: "MacBook Air M3", amount: 114999, status: "delivered", time: "Yesterday" },
  { id: "ORD004", customer: "Sneha Reddy", product: "LG OLED TV", amount: 89999, status: "cancelled", time: "2 days ago" },
]

const chatConversations = [
  { id: 1, customer: "Rahul Sharma", initials: "RS", lastMessage: "Is the S24 Ultra available in green?", time: "2 mins ago", unread: 2 },
  { id: 2, customer: "Priya Patel", initials: "PP", lastMessage: "Thanks for the quick delivery!", time: "1 hour ago", unread: 0 },
  { id: 3, customer: "Amit Kumar", initials: "AK", lastMessage: "Can I get a discount on bulk order?", time: "3 hours ago", unread: 1 },
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
  const [products, setProducts] = useState(vendorProducts)
  const [orderFilter, setOrderFilter] = useState("all")

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  const handleDeclineOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  const toggleStock = (productId: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ))
  }

  const filteredOrders = orderFilter === "all" 
    ? allOrders 
    : allOrders.filter(o => o.status === orderFilter)

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
            <div className="space-y-4 pb-20">
              <h2 className="text-[18px] font-bold text-[#212121]">Your Products</h2>
              {products.map((product) => (
                <Card key={product.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[60px] h-[60px] bg-[#F1F3F6] rounded-xl flex items-center justify-center flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#212121] text-[15px] line-clamp-1">{product.name}</h3>
                        <p className="text-[#2874F0] font-bold text-[15px]">{product.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <Switch
                            checked={product.inStock}
                            onCheckedChange={() => toggleStock(product.id)}
                          />
                          <span className={`text-[10px] font-medium ${product.inStock ? "text-[#388E3C]" : "text-[#FF6161]"}`}>
                            {product.inStock ? "In Stock" : "Out"}
                          </span>
                        </div>
                        <button className="p-2 active:bg-[#F1F3F6] rounded-xl">
                          <Pencil className="w-5 h-5 text-[#878787]" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* FAB */}
              <Link href="/vendor/add-product">
                <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#2874F0] to-[#1565C0] rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-transform">
                  <Plus className="w-7 h-7 text-white" />
                </button>
              </Link>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
                {[
                  { key: "all", label: "All" },
                  { key: "pending", label: "Pending", count: allOrders.filter(o => o.status === "pending").length },
                  { key: "confirmed", label: "Confirmed" },
                  { key: "delivered", label: "Delivered" },
                  { key: "cancelled", label: "Cancelled" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setOrderFilter(filter.key)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap flex items-center gap-1 ${
                      orderFilter === filter.key
                        ? "bg-[#2874F0] text-white"
                        : "bg-white text-[#878787] border border-[#E0E0E0]"
                    }`}
                  >
                    {filter.label}
                    {filter.count && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        orderFilter === filter.key ? "bg-white/20" : "bg-[#2874F0] text-white"
                      }`}>
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Order Cards */}
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#212121] text-[15px]">{order.customer}</span>
                      <Badge className={`text-[10px] border-0 rounded-full px-2 ${
                        order.status === "pending" ? "bg-[#FFD700]/20 text-[#B8860B]" :
                        order.status === "confirmed" ? "bg-[#2874F0]/10 text-[#2874F0]" :
                        order.status === "delivered" ? "bg-[#388E3C]/10 text-[#388E3C]" :
                        "bg-[#FF6161]/10 text-[#FF6161]"
                      }`}>
                        {order.status === "pending" && "Pending"}
                        {order.status === "confirmed" && "Confirmed"}
                        {order.status === "delivered" && "Delivered"}
                        {order.status === "cancelled" && "Cancelled"}
                      </Badge>
                    </div>
                    <p className="text-[13px] text-[#212121]">{order.product}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[#2874F0] font-bold text-[15px]">{order.amount.toLocaleString()}</p>
                      <span className="text-[11px] text-[#878787]">{order.time}</span>
                    </div>
                    {order.status === "pending" && (
                      <Button className="w-full mt-3 bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white h-[44px] text-[13px] font-semibold rounded-xl">
                        Update Status
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-4">
              <h2 className="text-[18px] font-bold text-[#212121]">Messages</h2>
              {chatConversations.map((chat) => (
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                  <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl active:scale-[0.98] transition-transform">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2874F0] to-[#42A5F5] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-[15px]">{chat.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-[#212121] text-[15px]">{chat.customer}</h3>
                            <span className="text-[11px] text-[#878787]">{chat.time}</span>
                          </div>
                          <p className="text-[13px] text-[#878787] line-clamp-1">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <div className="w-6 h-6 bg-[#2874F0] rounded-full flex items-center justify-center">
                            <span className="text-white text-[11px] font-bold">{chat.unread}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  )
}
