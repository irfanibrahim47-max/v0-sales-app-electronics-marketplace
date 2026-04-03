"use client"

import { Home, Search, ShoppingBag, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: ShoppingBag, label: "Orders", href: "/orders/12345678" },
  { icon: MessageCircle, label: "Chat", href: "/chat/1" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] z-40 pb-[22px]">
      <div className="flex items-center justify-around h-[56px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href.split("/")[1] ? `/${item.href.split("/")[1]}` : item.href)
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full active:bg-black/5 transition-colors"
            >
              <item.icon 
                className={`w-6 h-6 ${isActive ? "text-[#2874F0]" : "text-[#878787]"}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? "text-[#2874F0]" : "text-[#878787]"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
