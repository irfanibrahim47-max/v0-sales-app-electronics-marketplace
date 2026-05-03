"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

export default function CartPage() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState<any>(null)
  const [couponError, setCouponError] = useState("")

  useEffect(() => {
    if (!user) return
    fetchCart()
  }, [user])

  async function fetchCart() {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select(`*, shop_products(id, price, products(name, images), shops(id, name))`)
        .eq("user_id", user!.id)
      if (error) throw error
      setCartItems(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartId: string, delta: number, currentQty: number) => {
    const newQty = Math.max(1, currentQty + delta)
    await supabase.from("cart").update({ quantity: newQty }).eq("id", cartId)
    setCartItems(prev => prev.map(item => item.id === cartId ? { ...item, quantity: newQty } : item))
  }

  const removeItem = async (cartId: string) => {
    await supabase.from("cart").delete().eq("id", cartId)
    setCartItems(prev => prev.filter(item => item.id !== cartId))
  }

  const applyCoupon = async () => {
    setCouponError("")
    const { data } = await supabase.from("coupons").select("*")
      .eq("code", couponCode.toUpperCase()).eq("is_active", true).maybeSingle()
    if (!data) { setCouponError("Invalid coupon code"); return }
    if (data.min_order_amount > subtotal) { setCouponError(`Minimum order ₹${data.min_order_amount}`); return }
    setCouponApplied(data)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.shop_products?.price || 0) * item.quantity, 0)
  const deliveryFee = 49
  const discount = couponApplied
    ? couponApplied.discount_type === "percentage"
      ? Math.min(Math.floor(subtotal * couponApplied.discount_value / 100), couponApplied.max_discount || 999999)
      : couponApplied.discount_value
    : 0
  const total = subtotal + deliveryFee - discount

  const groupedItems = cartItems.reduce((groups: any, item) => {
    const shopId = item.shop_products?.shops?.id || "unknown"
    if (!groups[shopId]) groups[shopId] = { shopName: item.shop_products?.shops?.name || "Shop", items: [] }
    groups[shopId].items.push(item)
    return groups
  }, {})

  if (loading) {
    return (
      <MobileShell>
        <div className="h-full bg-[#F1F3F6]">
          <MobileHeader title="🛒 My Cart" backHref="/home" />
          <div className="px-4 py-5 space-y-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-[120px] w-full rounded-2xl" />)}
          </div>
        </div>
      </MobileShell>
    )
  }

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
              <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white h-[52px] px-8 text-[15px] font-semibold rounded-2xl">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[220px]">
        <MobileHeader title="🛒 My Cart" backHref="/home" />
        <div className="px-4 py-5 space-y-6">
          {Object.entries(groupedItems).map(([shopId, group]: any) => (
            <div key={shopId}>
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-[#2874F0]" />
                <span className="font-semibold text-[#212121] text-[13px]">🏪 {group.shopName}</span>
              </div>
              <div className="space-y-4">
                {group.items.map((item: any) => {
                  const product = item.shop_products?.products
                  const image = product?.images?.[0] || "/placeholder.svg?height=100&width=100"
                  return (
                    <Card key={item.id} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                            <img src={image} alt={product?.name} className="w-full h-full object-contain p-2" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#212121] text-[13px] line-clamp-2 mb-2">{product?.name}</h3>
                            <p className="text-[17px] text-[#2874F0] font-bold">₹{item.shop_products?.price?.toLocaleString()}</p>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3">
                                <button onClick={() => updateQuantity(item.id, -1, item.quantity)}
                                  className="w-10 h-10 border-2 border-[#E0E0E0] rounded-xl flex items-center justify-center active:border-[#2874F0]">
                                  <Minus className="w-5 h-5 text-[#212121]" />
                                </button>
                                <span className="w-8 text-center font-bold text-[#212121] text-[15px]">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1, item.quantity)}
                                  className="w-10 h-10 border-2 border-[#E0E0E0] rounded-xl flex items-center justify-center active:border-[#2874F0]">
                                  <Plus className="w-5 h-5 text-[#212121]" />
                                </button>
                              </div>
                              <button onClick={() => removeItem(item.id)} className="p-2.5 text-[#878787] active:text-[#FF6161] rounded-xl">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-4">
              <h3 className="font-semibold text-[15px] text-[#212121] mb-3">🏷️ Apply Coupon</h3>
              {couponApplied ? (
                <div className="flex items-center justify-between p-3 bg-[#388E3C]/5 border border-[#388E3C]/20 rounded-xl">
                  <div>
                    <p className="text-[13px] font-semibold text-[#388E3C]">✅ {couponApplied.code} applied!</p>
                    <p className="text-[11px] text-[#878787]">You save ₹{discount.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setCouponApplied(null)} className="text-[#FF6161] text-[13px] font-semibold">Remove</button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 h-[52px] px-4 border-2 border-[#E0E0E0] rounded-2xl text-[15px] focus:outline-none focus:border-[#2874F0]" />
                    <Button onClick={applyCoupon} className="h-[52px] px-5 bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white rounded-2xl font-semibold">Apply</Button>
                  </div>
                  {couponError && <p className="text-[12px] text-[#FF6161] mt-2">{couponError}</p>}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-5 z-50 pb-[26px] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] mb-4 bg-[#F1F3F6] rounded-2xl">
          <CardContent className="p-4">
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between text-[#878787]"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-[#878787]"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
              {discount > 0 && <div className="flex justify-between text-[#388E3C]"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
              <div className="h-px bg-[#E0E0E0] my-2" />
              <div className="flex justify-between font-bold text-[#212121] text-[15px]">
                <span>Total</span><span className="text-[#2874F0]">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Link href="/checkout" className="block">
          <Button className="w-full bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white font-semibold h-[52px] text-[15px] rounded-2xl">Proceed to Checkout</Button>
        </Link>
      </div>
    </MobileShell>
  )
}