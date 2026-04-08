"use client"

import { Home, Search, ShoppingBag, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: Home, label: "Home", emoji: "🏠", href: "/home" },
  { icon: Search, label: "Search", emoji: "🔍", href: "/search" },
  { icon: ShoppingBag, label: "Orders", emoji: "📦", href: "/orders" },
  { icon: MessageCircle, label: "Chat", emoji: "💬", href: "/chat/1" },
  { icon: User, label: "Profile", emoji: "👤", href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] z-40 pb-[22px] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-[60px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href)
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full active:bg-black/5 transition-colors"
            >
              <span className="text-[18px]">{item.emoji}</span>
              <span className={`text-[11px] font-medium ${isActive ? "text-[#2874F0]" : "text-[#878787]"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
