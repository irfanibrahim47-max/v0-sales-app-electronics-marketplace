"use client"

import { useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const initialWishlistItems = [
  { id: 1, name: "Samsung Galaxy S24 Ultra", image: "/placeholder.svg?height=200&width=200", lowestPrice: 124999, shopsCount: 5 },
  { id: 2, name: "Sony WH-1000XM5", image: "/placeholder.svg?height=200&width=200", lowestPrice: 29990, shopsCount: 4 },
  { id: 3, name: "MacBook Air M3", image: "/placeholder.svg?height=200&width=200", lowestPrice: 114999, shopsCount: 3 },
  { id: 4, name: "iPhone 15 Pro Max", image: "/placeholder.svg?height=200&width=200", lowestPrice: 159999, shopsCount: 7 },
  { id: 5, name: "LG 55\" OLED TV", image: "/placeholder.svg?height=200&width=200", lowestPrice: 134999, shopsCount: 4 },
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id))
  }

  return (
    <MobileShell>
      <MobileHeader title="Wishlist" backHref="/profile" />
      
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-[#FFF5F5] rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-[#FF6161]" />
            </div>
            <p className="text-[15px] font-semibold text-[#212121] mb-1">Your wishlist is empty</p>
            <p className="text-[13px] text-[#878787] text-center mb-4">Save items you love to buy them later</p>
            <Link href="/home">
              <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white h-[48px] rounded-xl font-semibold px-6">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="px-4 py-4">
            <p className="text-[13px] text-[#878787] mb-4">{wishlistItems.length} items saved</p>
            <div className="grid grid-cols-2 gap-4">
              {wishlistItems.map((product) => (
                <Card key={product.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform overflow-hidden bg-white rounded-2xl relative">
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-[#FF6161] text-[#FF6161]" />
                  </button>
                  <Link href={`/product/${product.id}`}>
                    <CardContent className="p-0">
                      <div className="aspect-square bg-white flex items-center justify-center p-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[13px] font-semibold text-[#212121] line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-[17px] text-[#2874F0] font-bold">
                          Rs.{product.lowestPrice.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-[#878787] mt-1">
                          {product.shopsCount} shops selling
                        </p>
                      </div>
                    </CardContent>
                  </Link>
                  <div className="px-4 pb-4">
                    <Button 
                      size="sm"
                      className="w-full bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white text-[13px] h-[44px] rounded-xl font-semibold gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileShell>
  )
}
