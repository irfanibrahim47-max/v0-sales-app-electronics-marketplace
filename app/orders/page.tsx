"use client"

import { useState, useEffect } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

type TabType = "active" | "completed" | "cancelled"

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-[#FFD700] text-[#212121]" },
  confirmed: { label: "Confirmed", color: "bg-[#2874F0] text-white" },
  preparing: { label: "Preparing", color: "bg-[#FF9800] text-white" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-[#2874F0] text-white" },
  delivered: { label: "Delivered", color: "bg-[#388E3C] text-white" },
  cancelled: { label: "Cancelled", color: "bg-[#FF6161] text-white" },
}

const ACTIVE = ["pending", "confirmed", "preparing", "out_for_delivery"]
const COMPLETED = ["delivered"]
const CANCELLED = ["cancelled"]

export default function OrdersListPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("active")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchOrders()
  }, [user])

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, shops(name)`)
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(o => {
    if (activeTab === "active") return ACTIVE.includes(o.status)
    if (activeTab === "completed") return COMPLETED.includes(o.status)
    return CANCELLED.includes(o.status)
  })

  const tabs: { key: TabType; label: string }[] = [
    { key: "active", label: `Active (${orders.filter(o => ACTIVE.includes(o.status)).length})` },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ]

  const getActionButton = (tab: TabType, order: any) => {
    if (tab === "active") return (
      <Link href={`/orders/${order.id}`}>
        <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[13px] h-[40px] rounded-xl font-semibold px-4">Track Order</Button>
      </Link>
    )
    if (tab === "completed") return (
      <div className="flex gap-2">
        <Link href={`/review/${order.id}`}>
          <Button variant="outline" className="text-[13px] h-[40px] rounded-xl font-semibold px-4 border-[#2874F0] text-[#2874F0]">Review</Button>
        </Link>
        <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[13px] h-[40px] rounded-xl font-semibold px-4">Reorder</Button>
      </div>
    )
    return <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[13px] h-[40px] rounded-xl font-semibold px-4">Reorder</Button>
  }

  return (
    <MobileShell>
      <MobileHeader title="My Orders" backHref="/profile" />
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        <div className="sticky top-[94px] z-30 bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 rounded-xl text-[12px] font-semibold transition-colors ${
                  activeTab === tab.key ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white" : "bg-[#F1F3F6] text-[#878787]"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-[140px] w-full rounded-2xl" />)
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-[#F1F3F6] rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-[#878787]" />
              </div>
              <p className="text-[15px] font-semibold text-[#212121] mb-1">No orders yet</p>
              <p className="text-[13px] text-[#878787] mb-4">Start shopping to see your orders here</p>
              <Link href="/home">
                <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white h-[48px] rounded-xl font-semibold px-6">Browse Products</Button>
              </Link>
            </div>
          ) : filteredOrders.map(order => {
            const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: "bg-[#878787] text-white" }
            const firstItem = Array.isArray(order.items) ? order.items[0] : null
            return (
              <Card key={order.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl bg-white">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-[80px] h-[80px] bg-[#F1F3F6] rounded-xl flex items-center justify-center p-2">
                      {firstItem?.image
                        ? <img src={firstItem.image} alt={firstItem.name} className="w-full h-full object-contain" />
                        : <Package className="w-8 h-8 text-[#878787]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-[15px] font-semibold text-[#212121] line-clamp-1 pr-2">
                          {firstItem?.name || "Order"}
                        </h3>
                        <Badge className={`${statusInfo.color} text-[10px] px-2 rounded-full font-medium whitespace-nowrap border-0`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#878787] mb-1">#{order.order_number || order.id.slice(0, 8)}</p>
                      <p className="text-[11px] text-[#878787]">{order.shops?.name}</p>
                      <div className="mt-2">
                        <p className="text-[13px] text-[#878787]">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        <p className="text-[15px] font-bold text-[#2874F0]">₹{order.total?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F1F3F6] flex justify-end">
                    {getActionButton(activeTab, order)}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </MobileShell>
  )
}