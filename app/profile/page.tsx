"use client"

import { 
  ChevronRight,
  LogOut
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const menuItems = [
  { emoji: "📦", label: "My Orders", href: "/orders", count: 3 },
  { emoji: "❤️", label: "Wishlist", href: "/wishlist", count: 5 },
  { emoji: "📍", label: "Saved Addresses", href: "/addresses" },
  { emoji: "💳", label: "Payment Methods", href: "/payment-methods" },
  { emoji: "🔔", label: "Notifications", href: "/notifications", badge: "2 new" },
  { emoji: "❓", label: "Help & Support", href: "/support" },
  { emoji: "⭐", label: "Rate the App", href: "/rate" },
]

export default function ProfilePage() {
  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        {/* Header with Gradient */}
        <header className="bg-gradient-to-r from-[#2874F0] to-[#42A5F5] pt-[34px] pb-8 px-4">
          <div className="flex items-center gap-4 mt-4">
            {/* Avatar */}
            <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
              <span className="text-[24px] font-bold text-[#2874F0]">RK</span>
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-white">Rahul Kumar</h1>
              <p className="text-[15px] text-white/80">+91 98765 43210</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-around mt-6 bg-white/10 rounded-2xl py-4">
            <div className="text-center">
              <p className="text-[20px] font-bold text-white">3</p>
              <p className="text-[13px] text-white/80">Orders</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-[20px] font-bold text-white">5</p>
              <p className="text-[13px] text-white/80">Wishlist</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-[20px] font-bold text-white">2</p>
              <p className="text-[13px] text-white/80">Reviews</p>
            </div>
          </div>
        </header>

        {/* Menu List */}
        <div className="px-4 -mt-4">
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {menuItems.map((item, index) => (
                <Link 
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-4 active:bg-[#F1F3F6] transition-colors ${
                    index !== menuItems.length - 1 ? "border-b border-[#F1F3F6]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{item.emoji}</span>
                    <span className="text-[15px] font-medium text-[#212121]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count && (
                      <span className="text-[13px] text-[#878787]">{item.count}</span>
                    )}
                    {item.badge && (
                      <span className="text-[11px] bg-[#FF6161] text-white px-2 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-[#878787]" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Logout Button */}
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:bg-[#FFF5F5] transition-colors">
            <LogOut className="w-5 h-5 text-[#FF6161]" />
            <span className="text-[15px] font-semibold text-[#FF6161]">Logout</span>
          </button>

          {/* App Version */}
          <p className="text-center text-[13px] text-[#878787] mt-6 mb-4">
            Version 1.0.0
          </p>
        </div>
      </div>

      <BottomNav />
    </MobileShell>
  )
}
