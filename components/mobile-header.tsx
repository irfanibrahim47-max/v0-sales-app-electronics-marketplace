"use client"

import { ArrowLeft, ShoppingCart, Search, MoreVertical } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

interface MobileHeaderProps {
  title: string
  backHref?: string
  showBack?: boolean
  showCart?: boolean
  showSearch?: boolean
  showMore?: boolean
  rightAction?: ReactNode
  cartCount?: number
}

export function MobileHeader({
  title,
  backHref = "/home",
  showBack = true,
  showCart = false,
  showSearch = false,
  showMore = false,
  rightAction,
  cartCount = 0
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] pt-[34px]">
      <div className="flex items-center justify-between px-4 py-3 h-[60px]">
        {/* Left */}
        <div className="w-12 flex items-center justify-start">
          {showBack && (
            <Link href={backHref} className="p-2 -ml-2 active:bg-black/5 rounded-2xl transition-colors">
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="flex-1 text-center text-[20px] font-bold text-[#212121] truncate px-2">
          {title}
        </h1>

        {/* Right */}
        <div className="w-12 flex items-center justify-end gap-2">
          {showSearch && (
            <button className="p-2 active:bg-black/5 rounded-2xl transition-colors">
              <Search className="w-5 h-5 text-[#212121]" />
            </button>
          )}
          {showCart && (
            <Link href="/cart" className="p-2 relative active:bg-black/5 rounded-2xl transition-colors">
              <ShoppingCart className="w-5 h-5 text-[#212121]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#2874F0] text-white text-[11px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {showMore && (
            <button className="p-2 active:bg-black/5 rounded-2xl transition-colors">
              <MoreVertical className="w-5 h-5 text-[#212121]" />
            </button>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  )
}
