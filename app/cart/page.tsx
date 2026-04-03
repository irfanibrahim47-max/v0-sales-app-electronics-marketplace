"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2,
  Store
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  {
    id: 1,
    name: "Samsung Galaxy S24 Ultra 256GB",
    image: "/placeholder.svg?height=100&width=100",
    price: 124999,
    quantity: 1,
    shopId: 1,
    shopName: "Tech World Electronics"
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Headphones",
    image: "/placeholder.svg?height=100&width=100",
    price: 29990,
    quantity: 1,
    shopId: 1,
    shopName: "Tech World Electronics"
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 49
  const total = subtotal + deliveryFee

  // Group items by shop
  const groupedItems = cartItems.reduce((groups, item) => {
    const key = item.shopId
    if (!groups[key]) {
      groups[key] = {
        shopId: item.shopId,
        shopName: item.shopName,
        items: []
      }
    }
    groups[key].items.push(item)
    return groups
  }, {} as Record<number, { shopId: number; shopName: string; items: CartItem[] }>)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <Link href="/home" className="p-1">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground">My Cart</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
            <Store className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-6">
            Browse products and add them to your cart
          </p>
          <Link href="/home">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/home" className="p-1">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground">My Cart</h1>
          </div>
          <span className="text-sm text-muted-foreground">{cartItems.length} items</span>
        </div>
      </header>

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-4">
        {Object.values(groupedItems).map((group) => (
          <div key={group.shopId}>
            {/* Shop Header */}
            <div className="flex items-center gap-2 mb-3">
              <Store className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground text-sm">{group.shopName}</span>
            </div>

            {/* Items from this shop */}
            <div className="space-y-3">
              {group.items.map((item) => (
                <Card key={item.id} className="border shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-secondary/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-primary font-bold">
                          ₹{item.price.toLocaleString()}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 border-2 border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                            >
                              <Minus className="w-4 h-4 text-foreground" />
                            </button>
                            <span className="w-8 text-center font-medium text-foreground">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 border-2 border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                            >
                              <Plus className="w-4 h-4 text-foreground" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          >
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

      {/* Order Summary - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-4 z-50">
        <Card className="border-2 border-primary/20 mb-3">
          <CardContent className="p-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Link href="/checkout" className="block">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  )
}
