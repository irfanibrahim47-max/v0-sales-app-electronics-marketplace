"use client"

import { useState, useEffect } from "react"
import { Package, Check, XCircle, Bell, Plus, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

const tabs = [
  { id: "dashboard", label: "Dashboard", emoji: "📊" },
  { id: "products", label: "Products", emoji: "📦" },
  { id: "orders", label: "Orders", emoji: "🛒" },
  { id: "chat", label: "Chat", emoji: "💬" },
]

export default function VendorDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [shop, setShop] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const role = user.user_metadata?.role
    if (role !== "vendor") { router.push("/home"); return }
    loadDashboard()
  }, [user])

  async function loadDashboard() {
    try {
      const { data: shopData } = await supabase
        .from("shops").select("*").eq("owner_id", user!.id).single()
      setShop(shopData)

      if (shopData) {
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*, profiles(name)")
          .eq("shop_id", shopData.id)
          .order("created_at", { ascending: false })
          .limit(20)
        setOrders(ordersData || [])

        const { data: productsData } = await supabase
          .from("shop_products")
          .select("*, products(name, images)")
          .eq("shop_id", shopData.id)
        setProducts(productsData || [])

        const { data: msgs } = await supabase
          .from("messages")
          .select("customer_id, text, created_at, profiles(name)")
          .eq("shop_id", shopData.id)
          .order("created_at", { ascending: false })
        const uniqueCustomers = new Map()
        msgs?.forEach((m: any) => {
          if (!uniqueCustomers.has(m.customer_id)) uniqueCustomers.set(m.customer_id, m)
        })
        setConversations(Array.from(uniqueCustomers.values()))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderAction = async (orderId: string, action: "confirmed" | "cancelled") => {
    await supabase.from("orders").update({ status: action }).eq("id", orderId)
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  const toggleStock = async (shopProductId: string, currentStock: boolean) => {
    await supabase.from("shop_products").update({ in_stock: !currentStock }).eq("id", shopProductId)
    setProducts(prev => prev.map(p => p.id === shopProductId ? { ...p, in_stock: !currentStock } : p))
  }

  const pendingOrders = orders.filter(o => o.status === "pending")
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const initials = shop?.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "SW"

  const statusColors: Record<string, string> = {
    pending: "bg-[#FFD700] text-[#212121]",
    confirmed: "bg-[#2874F0] text-white",
    out_for_delivery: "bg-[#2874F0] text-white",
    delivered: "bg-[#388E3C] text-white",
    cancelled: "bg-[#FF6161] text-white"
  }

  return (
    <MobileShell>
      <div className="h-full flex flex-col bg-[#F1F3F6]">
        <header className="sticky top-0 z-40 bg-gradient-to-r from-[#2874F0] to-[#42A5F5] pt-[34px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-4 py-3 h-[56px]">
            <h1 className="text-[20px] font-bold text-white">Sales<span className="text-[#FFD700]">App</span></h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2">
                <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-[11px]">{initials}</span>
                </div>
                <span className="text-white text-[13px] font-semibold">{shop?.name?.split(" ")[0] || "Shop"}</span>
              </div>
              <button className="relative p-2">
                <Bell className="w-6 h-6 text-white" />
                {pendingOrders.length > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-[#FFD700] rounded-full border-2 border-[#2874F0]" />
                )}
              </button>
            </div>
          </div>
          <div className="flex px-3 pb-3 overflow-x-auto scrollbar-hide gap-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl whitespace-nowrap text-[13px] font-semibold ${
                  activeTab === tab.id ? "bg-white text-[#2874F0]" : "text-white/80 active:bg-white/10"}`}>
                <span>{tab.emoji}</span>{tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5">

          {/* No shop yet */}
          {!loading && !shop && (
            <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
              <CardContent className="p-8 text-center">
                <span className="text-4xl block mb-4">🏪</span>
                <h3 className="font-bold text-[17px] text-[#212121] mb-2">Set up your shop</h3>
                <p className="text-[13px] text-[#878787] mb-5">Complete your shop registration to start selling</p>
                <Link href="/vendor/register">
                  <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white h-[52px] px-8 rounded-2xl font-semibold">
                    Register Shop
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && shop && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[20px] font-bold text-[#212121]">☀️ Good Morning!</h2>
                <p className="text-[13px] text-[#878787]">Here's what's happening today.</p>
              </div>

              <div className="space-y-4">
                {loading ? [1,2,3].map(i => <Skeleton key={i} className="h-[100px] w-full rounded-2xl" />) : (
                  <>
                    {[
                      { label: "Orders Today", value: todayOrders.length.toString(), emoji: "📦", trend: `${orders.length} total orders` },
                      { label: "Revenue Today", value: `₹${todayRevenue.toLocaleString()}`, emoji: "💰", trend: "From today's orders" },
                      { label: "Pending Orders", value: pendingOrders.length.toString(), emoji: "⏳", trend: pendingOrders.length > 0 ? "Requires attention" : "All caught up!" },
                    ].map(stat => (
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
                  </>
                )}
              </div>

              <div>
                <h3 className="text-[20px] font-bold text-[#212121] mb-4">🔔 Incoming Orders</h3>
                {pendingOrders.length === 0 ? (
                  <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                    <CardContent className="p-8 text-center">
                      <span className="text-4xl block mb-3">📭</span>
                      <h4 className="font-bold text-[15px] text-[#212121] mb-2">No pending orders</h4>
                      <p className="text-[13px] text-[#878787]">New orders will appear here.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingOrders.map(order => {
                      const firstItem = Array.isArray(order.items) ? order.items[0] : null
                      return (
                        <Card key={order.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="font-semibold text-[15px] text-[#212121]">👤 {order.profiles?.name || "Customer"}</span>
                              <Badge className="bg-[#F1F3F6] text-[#878787] text-[10px] border-0 rounded-full font-medium">
                                {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </Badge>
                            </div>
                            <p className="text-[13px] text-[#212121]">📦 {firstItem?.name || "Order"}</p>
                            <p className="text-[17px] text-[#2874F0] font-bold mt-3">₹{order.total?.toLocaleString()}</p>
                            <div className="flex gap-3 mt-4">
                              <Button onClick={() => handleOrderAction(order.id, "cancelled")}
                                variant="outline" size="sm"
                                className="flex-1 border-2 border-[#E0E0E0] text-[#878787] h-[48px] text-[13px] font-semibold rounded-xl">
                                <XCircle className="w-5 h-5 mr-1" />❌ Decline
                              </Button>
                              <Button onClick={() => handleOrderAction(order.id, "confirmed")}
                                size="sm"
                                className="flex-1 bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white h-[48px] text-[13px] font-semibold rounded-xl">
                                <Check className="w-5 h-5 mr-1" />✅ Accept
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="space-y-4">
              {loading ? [1,2,3].map(i => <Skeleton key={i} className="h-[80px] w-full rounded-2xl" />) :
              products.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-4xl block mb-4">📦</span>
                  <h3 className="text-[20px] font-bold text-[#212121] mb-2">No products yet</h3>
                  <p className="text-[13px] text-[#878787] mb-5">Add your first product to start selling</p>
                  <Link href="/vendor/add-product">
                    <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white h-[52px] px-8 rounded-2xl font-semibold">
                      ➕ Add Product
                    </Button>
                  </Link>
                </div>
              ) : products.map(sp => {
                const image = sp.products?.images?.[0]
                return (
                  <Card key={sp.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#F1F3F6] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {image
                            ? <img src={image} alt={sp.products?.name} className="w-full h-full object-cover" />
                            : <Package className="w-6 h-6 text-[#878787]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[13px] text-[#212121] line-clamp-1">{sp.products?.name}</h4>
                          <p className="text-[15px] font-bold text-[#2874F0]">₹{sp.price?.toLocaleString()}</p>
                        </div>
                        <button onClick={() => toggleStock(sp.id, sp.in_stock)} className="flex-shrink-0">
                          {sp.in_stock
                            ? <div className="flex items-center gap-1 text-[#388E3C] text-[12px] font-semibold">
                                <ToggleRight className="w-6 h-6" />In Stock
                              </div>
                            : <div className="flex items-center gap-1 text-[#878787] text-[12px] font-semibold">
                                <ToggleLeft className="w-6 h-6" />Out
                              </div>}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {/* FAB Add Product Button */}
              <div className="fixed bottom-6 right-6 z-40">
                <Link href="/vendor/add-product">
                  <Button className="w-14 h-14 bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white rounded-2xl shadow-[0_4px_16px_rgba(40,116,240,0.4)]">
                    <Plus className="w-7 h-7" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {loading ? [1,2,3].map(i => <Skeleton key={i} className="h-[100px] w-full rounded-2xl" />) :
              orders.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-4xl block mb-4">🛒</span>
                  <h3 className="text-[20px] font-bold text-[#212121] mb-2">No orders yet</h3>
                  <p className="text-[13px] text-[#878787]">Orders from customers will appear here</p>
                </div>
              ) : orders.map(order => {
                const firstItem = Array.isArray(order.items) ? order.items[0] : null
                return (
                  <Card key={order.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-[15px] text-[#212121]">{order.profiles?.name || "Customer"}</p>
                          <p className="text-[11px] text-[#878787]">#{order.order_number || order.id.slice(0, 8)}</p>
                          <p className="text-[13px] text-[#212121] mt-1">{firstItem?.name || "Order"}</p>
                          <p className="text-[17px] font-bold text-[#2874F0] mt-1">₹{order.total?.toLocaleString()}</p>
                        </div>
                        <Badge className={`${statusColors[order.status] || "bg-[#878787] text-white"} text-[11px] border-0 rounded-full px-3`}>
                          {order.status?.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div className="space-y-4">
              {loading ? [1,2].map(i => <Skeleton key={i} className="h-[80px] w-full rounded-2xl" />) :
              conversations.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-4xl block mb-4">💬</span>
                  <h3 className="text-[20px] font-bold text-[#212121] mb-2">No messages yet</h3>
                  <p className="text-[13px] text-[#878787]">Customer messages will appear here</p>
                </div>
              ) : conversations.map((conv: any) => {
                const initials = conv.profiles?.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "CU"
                return (
                  <Link key={conv.customer_id} href={`/chat/${conv.customer_id}`}>
                    <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#2874F0] to-[#42A5F5] rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-[15px]">{initials}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[15px] text-[#212121]">{conv.profiles?.name || "Customer"}</p>
                            <p className="text-[13px] text-[#878787] line-clamp-1">{conv.text}</p>
                          </div>
                          <p className="text-[11px] text-[#878787] flex-shrink-0">
                            {new Date(conv.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  )
}