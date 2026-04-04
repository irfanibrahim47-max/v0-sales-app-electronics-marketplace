"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import Link from "next/link"

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  quantity: number
  shopId: number
  shopName: string
}

const initialCartItems: CartItem[] = [
  { id: 1, name: "Samsung Galaxy S24 Ultra 256GB", image: "/placeholder.svg?height=100&width=100", price: 124999, quantity: 1, shopId: 1, shopName: "Tech World Electronics" },
  { id: 2, name: "Sony WH-1000XM5 Headphones", image: "/placeholder.svg?height=100&width=100", price: 29990, quantity: 1, shopId: 1, shopName: "Tech World Electronics" },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 49
  const total = subtotal + deliveryFee

  const groupedItems = cartItems.reduce((groups, item) => {
    const key = item.shopId
    if (!groups[key]) {
      groups[key] = { shopId: item.shopId, shopName: item.shopName, items: [] }
    }
    groups[key].items.push(item)
    return groups
  }, {} as Record<number, { shopId: number; shopName: string; items: CartItem[] }>)

  if (cartItems.length === 0) {
    return (
      <MobileShell>
        <div className="h-full bg-[#F1F3F6]">
          <MobileHeader title="🛒 My Cart" backHref="/home" />
          <div className="flex flex-col items-center justify-center h-[60vh] px-4">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-[20px] font-bold text-[#212121] mb-2">Your cart is empty</h2>
            <p className="text-[#878787] text-center mb-6 text-[13px]">Browse products and add them to your cart</p>
            <Link href="/home">
              <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white h-[52px] px-8 text-[15px] font-semibold rounded-2xl">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[200px]">
        <MobileHeader title="🛒 My Cart" backHref="/home" />

        {/* Cart Items */}
        <div className="px-4 py-5 space-y-6">
          {Object.values(groupedItems).map((group) => (
            <div key={group.shopId}>
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-[#2874F0]" />
                <span className="font-semibold text-[#212121] text-[13px]">🏪 {group.shopName}</span>
              </div>

              <div className="space-y-4">
                {group.items.map((item) => (
                  <Card key={item.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#212121] text-[13px] line-clamp-2 mb-2">{item.name}</h3>
                          <p className="text-[17px] text-[#2874F0] font-bold">₹{item.price.toLocaleString()}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-10 h-10 border-2 border-[#E0E0E0] rounded-xl flex items-center justify-center active:border-[#2874F0] active:bg-[#2874F0]/5"
                              >
                                <Minus className="w-5 h-5 text-[#212121]" />
                              </button>
                              <span className="w-8 text-center font-bold text-[#212121] text-[15px]">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-10 h-10 border-2 border-[#E0E0E0] rounded-xl flex items-center justify-center active:border-[#2874F0] active:bg-[#2874F0]/5"
                              >
                                <Plus className="w-5 h-5 text-[#212121]" />
                              </button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="p-2.5 text-[#878787] active:text-[#FF6161] rounded-xl active:bg-[#FF6161]/5">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-5 z-50 pb-[26px] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] mb-4 bg-[#F1F3F6] rounded-2xl">
          <CardContent className="p-4">
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between text-[#878787]">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#878787]">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="h-px bg-[#E0E0E0] my-2" />
              <div className="flex justify-between font-bold text-[#212121] text-[15px]">
                <span>Total</span>
                <span className="text-[#2874F0]">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Link href="/checkout" className="block">
          <Button className="w-full bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold h-[52px] text-[15px] rounded-2xl">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </MobileShell>
  )
}
