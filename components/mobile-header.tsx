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
    <header className="sticky top-0 z-40 bg-white shadow-sm pt-[34px]">
      <div className="flex items-center justify-between px-4 py-3 h-[56px]">
        {/* Left */}
        <div className="w-10 flex items-center justify-start">
          {showBack && (
            <Link href={backHref} className="p-1 -ml-1 active:bg-black/5 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="flex-1 text-center text-[18px] font-semibold text-[#212121] font-[family-name:var(--font-heading)] truncate px-2">
          {title}
        </h1>

        {/* Right */}
        <div className="w-10 flex items-center justify-end gap-2">
          {showSearch && (
            <button className="p-1 active:bg-black/5 rounded-full transition-colors">
              <Search className="w-5 h-5 text-[#212121]" />
            </button>
          )}
          {showCart && (
            <Link href="/cart" className="p-1 relative active:bg-black/5 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5 text-[#212121]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2874F0] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {showMore && (
            <button className="p-1 active:bg-black/5 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-[#212121]" />
            </button>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  )
}
