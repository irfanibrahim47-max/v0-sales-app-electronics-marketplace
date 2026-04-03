"use client"

import { useState } from "react"
import { 
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  MessageCircle,
  Settings,
  Menu,
  X,
  TrendingUp,
  Clock,
  Check,
  XCircle,
  ChevronRight,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const dashboardStats = [
  {
    label: "Orders Today",
    value: "12",
    icon: ShoppingBag,
    trend: "+3 from yesterday"
  },
  {
    label: "Revenue Today",
    value: "₹2,45,000",
    icon: TrendingUp,
    trend: "+15% from yesterday"
  },
  {
    label: "Pending Orders",
    value: "5",
    icon: Clock,
    trend: "Requires attention"
  },
]

const incomingOrders = [
  {
    id: "ORD001",
    customer: "Rahul Sharma",
    product: "Samsung Galaxy S24 Ultra",
    address: "Andheri West, Mumbai",
    amount: 124999,
    time: "2 mins ago",
    status: "pending"
  },
  {
    id: "ORD002",
    customer: "Priya Patel",
    product: "Sony WH-1000XM5",
    address: "Bandra East, Mumbai",
    amount: 29990,
    time: "10 mins ago",
    status: "pending"
  },
  {
    id: "ORD003",
    customer: "Amit Kumar",
    product: "MacBook Air M3",
    address: "Powai, Mumbai",
    amount: 114999,
    time: "25 mins ago",
    status: "pending"
  },
]

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/vendor/dashboard", active: true },
  { icon: Package, label: "My Products", href: "/vendor/products", active: false },
  { icon: ShoppingBag, label: "Orders", href: "/vendor/orders", active: false },
  { icon: Star, label: "Reviews", href: "/vendor/reviews", active: false },
  { icon: MessageCircle, label: "Chat", href: "/vendor/chat", active: false },
  { icon: Settings, label: "Settings", href: "/vendor/settings", active: false },
]

export default function VendorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState(incomingOrders)

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  const handleDeclineOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-[#212121]" />
          </button>
          <h1 className="text-lg font-bold text-[#212121] font-[family-name:var(--font-heading)]">
            Sales<span className="text-[#2874F0]">App</span>
          </h1>
          <button className="relative">
            <Bell className="w-6 h-6 text-[#212121]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2874F0] text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#2874F0] z-50 transform transition-transform duration-300
        lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">
            Sales<span className="text-[#FFD700]">App</span>
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">TW</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Tech World</h3>
              <p className="text-xs text-white/70">Shop Owner</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors ${
                  item.active 
                    ? "bg-white/20 text-white" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-6">
          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#212121] font-[family-name:var(--font-heading)]">
              Good Morning, Tech World!
            </h2>
            <p className="text-[#878787]">
              Here&apos;s what&apos;s happening with your shop today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {dashboardStats.map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#878787]">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#212121] mt-1 font-[family-name:var(--font-heading)]">{stat.value}</p>
                      <p className="text-xs text-[#878787] mt-1">{stat.trend}</p>
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Incoming Orders</h3>
              <Link href="/vendor/orders" className="text-[#2874F0] text-sm font-medium flex items-center">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#F1F3F6] rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-[#878787]" />
                  </div>
                  <h4 className="font-medium text-[#212121] mb-1">No pending orders</h4>
                  <p className="text-sm text-[#878787]">
                    All caught up! New orders will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="border-0 shadow-sm bg-white">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-[#212121]">{order.customer}</span>
                            <Badge className="bg-[#F1F3F6] text-[#878787] text-[10px] border-0">
                              {order.time}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#212121]">{order.product}</p>
                          <p className="text-xs text-[#878787] mt-1">{order.address}</p>
                          <p className="text-[#212121] font-bold mt-2 font-[family-name:var(--font-heading)]">
                            ₹{order.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleDeclineOrder(order.id)}
                            variant="outline"
                            size="sm"
                            className="border-2 border-[#E0E0E0] text-[#878787] hover:border-[#FF6161] hover:text-[#FF6161]"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                          <Button
                            onClick={() => handleAcceptOrder(order.id)}
                            size="sm"
                            className="bg-[#2874F0] hover:bg-[#2874F0]/90 text-white"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-[#212121] mb-4 font-[family-name:var(--font-heading)]">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/vendor/products/new">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-[#2874F0]/10 rounded-sm flex items-center justify-center mx-auto mb-2">
                      <Package className="w-5 h-5 text-[#2874F0]" />
                    </div>
                    <p className="text-sm font-medium text-[#212121]">Add Product</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/vendor/orders">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-[#2874F0]/10 rounded-sm flex items-center justify-center mx-auto mb-2">
                      <ShoppingBag className="w-5 h-5 text-[#2874F0]" />
                    </div>
                    <p className="text-sm font-medium text-[#212121]">View Orders</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/vendor/chat">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-[#2874F0]/10 rounded-sm flex items-center justify-center mx-auto mb-2">
                      <MessageCircle className="w-5 h-5 text-[#2874F0]" />
                    </div>
                    <p className="text-sm font-medium text-[#212121]">Messages</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/vendor/settings">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 bg-[#2874F0]/10 rounded-sm flex items-center justify-center mx-auto mb-2">
                      <Settings className="w-5 h-5 text-[#2874F0]" />
                    </div>
                    <p className="text-sm font-medium text-[#212121]">Settings</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
