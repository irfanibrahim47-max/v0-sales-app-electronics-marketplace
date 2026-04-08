"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"

interface Notification {
  id: number
  type: "order" | "price" | "message" | "offer"
  title: string
  description: string
  time: string
  read: boolean
}

const initialNotifications: { today: Notification[]; yesterday: Notification[]; earlier: Notification[] } = {
  today: [
    { id: 1, type: "order", title: "Order Out for Delivery", description: "Your Samsung Galaxy S24 Ultra is out for delivery. Track it now!", time: "2 hours ago", read: false },
    { id: 2, type: "price", title: "Price Drop Alert!", description: "iPhone 15 Pro Max dropped to Rs.1,54,999 at Tech World", time: "5 hours ago", read: false },
  ],
  yesterday: [
    { id: 3, type: "message", title: "New Message from Tech World", description: "Your query about Samsung S24 has been answered", time: "Yesterday, 4:30 PM", read: true },
    { id: 4, type: "offer", title: "Special Offer!", description: "Get 10% off on all laptops this weekend. Use code LAPTOP10", time: "Yesterday, 10:00 AM", read: true },
  ],
  earlier: [
    { id: 5, type: "order", title: "Order Delivered", description: "Your MacBook Air M3 has been delivered", time: "Mar 28, 2026", read: true },
    { id: 6, type: "price", title: "Price Alert Triggered", description: "Sony WH-1000XM5 is now below Rs.30,000 at 3 shops", time: "Mar 25, 2026", read: true },
    { id: 7, type: "offer", title: "Flash Sale!", description: "Electronics sale starting tonight at 8 PM", time: "Mar 20, 2026", read: true },
  ],
}

const typeConfig = {
  order: { emoji: "📦", bg: "bg-[#2874F0]/10" },
  price: { emoji: "💰", bg: "bg-[#FF6161]/10" },
  message: { emoji: "💬", bg: "bg-[#388E3C]/10" },
  offer: { emoji: "🎁", bg: "bg-[#FFD700]/20" },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAllRead = () => {
    setNotifications({
      today: notifications.today.map(n => ({ ...n, read: true })),
      yesterday: notifications.yesterday.map(n => ({ ...n, read: true })),
      earlier: notifications.earlier.map(n => ({ ...n, read: true })),
    })
  }

  const unreadCount = 
    notifications.today.filter(n => !n.read).length + 
    notifications.yesterday.filter(n => !n.read).length + 
    notifications.earlier.filter(n => !n.read).length

  const hasNotifications = 
    notifications.today.length > 0 || 
    notifications.yesterday.length > 0 || 
    notifications.earlier.length > 0

  const renderNotification = (notification: Notification) => {
    const config = typeConfig[notification.type]
    return (
      <Card 
        key={notification.id} 
        className={`border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden bg-white ${!notification.read ? "ring-2 ring-[#2874F0]/20" : ""}`}
      >
        <CardContent className="p-4 flex gap-3">
          <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <span className="text-[20px]">{config.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`text-[15px] font-semibold text-[#212121] line-clamp-1 ${!notification.read ? "font-bold" : ""}`}>
                {notification.title}
              </h3>
              {!notification.read && (
                <div className="w-2.5 h-2.5 bg-[#2874F0] rounded-full flex-shrink-0 mt-1.5" />
              )}
            </div>
            <p className="text-[13px] text-[#878787] line-clamp-2 mt-0.5">{notification.description}</p>
            <p className="text-[11px] text-[#878787] mt-2">{notification.time}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <MobileShell>
      <MobileHeader 
        title="Notifications" 
        backHref="/profile"
        rightAction={
          unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-[13px] text-[#2874F0] font-medium whitespace-nowrap"
            >
              Mark all read
            </button>
          )
        }
      />
      
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        {!hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-[#F1F3F6] rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-[#878787]" />
            </div>
            <p className="text-[15px] font-semibold text-[#212121] mb-1">No notifications yet</p>
            <p className="text-[13px] text-[#878787] text-center">{"We'll notify you when something arrives"}</p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-6">
            {/* Today */}
            {notifications.today.length > 0 && (
              <section>
                <h2 className="text-[13px] font-semibold text-[#878787] mb-3">Today</h2>
                <div className="space-y-3">
                  {notifications.today.map(renderNotification)}
                </div>
              </section>
            )}

            {/* Yesterday */}
            {notifications.yesterday.length > 0 && (
              <section>
                <h2 className="text-[13px] font-semibold text-[#878787] mb-3">Yesterday</h2>
                <div className="space-y-3">
                  {notifications.yesterday.map(renderNotification)}
                </div>
              </section>
            )}

            {/* Earlier */}
            {notifications.earlier.length > 0 && (
              <section>
                <h2 className="text-[13px] font-semibold text-[#878787] mb-3">Earlier</h2>
                <div className="space-y-3">
                  {notifications.earlier.map(renderNotification)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </MobileShell>
  )
}
