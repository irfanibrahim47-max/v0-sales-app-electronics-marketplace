"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star, Truck, Store, ChevronLeft, ChevronRight, Share2, Heart, Check, Clock, Bell, CircleCheck as CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

type SortOption = "price" | "rating"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [currentImage, setCurrentImage] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>("price")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [priceAlertValue, setPriceAlertValue] = useState("")
  const [notifyNewShops, setNotifyNewShops] = useState(false)
  const [alertSet, setAlertSet] = useState(false)
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [shopPrices, setShopPrices] = useState<any[]>([])

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`*, brands(name), categories(name, emoji),
            shop_products(id, price, mrp, in_stock, delivery_available,
              delivery_time, emi_available, warranty_months,
              shops(id, name, rating, city))`)
          .eq("id", params.id)
          .single()
        if (error) throw error
        setProduct(data)
        setShopPrices(data?.shop_products || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    async function checkWishlist() {
      if (!user) return
      const { data } = await supabase.from("wishlist").select("id")
        .eq("user_id", user.id).eq("product_id", params.id).maybeSingle()
      if (data) setIsWishlisted(true)
    }
    fetchProduct()
    checkWishlist()
  }, [params.id, user])

  const toggleWishlist = async () => {
    if (!user) return
    if (isWishlisted) {
      await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", params.id)
      setIsWishlisted(false)
    } else {
      await supabase.from("wishlist").insert({ user_id: user.id, product_id: params.id })
      setIsWishlisted(true)
    }
  }

  const handleSetAlert = async () => {
    if (!user || !priceAlertValue) return
    await supabase.from("price_alerts").insert({
      user_id: user.id, product_id: params.id, target_price: parseInt(priceAlertValue)
    })
    setAlertSet(true)
  }

  const sortedShops = [...shopPrices].sort((a, b) =>
    sortBy === "price" ? a.price - b.price : (b.shops?.rating || 0) - (a.shops?.rating || 0))

  const lowestPrice = shopPrices.length > 0 ? Math.min(...shopPrices.map(s => s.price)) : 0
  const bestDealShop = shopPrices.find(s => s.price === lowestPrice)
  const images = product?.images?.length > 0 ? product.images : ["/placeholder.svg?height=400&width=400"]

  if (loading) {
    return (
      <MobileShell>
        <div className="h-full overflow-y-auto bg-[#F1F3F6] pt-[34px]">
          <Skeleton className="w-full aspect-square" />
          <div className="px-4 py-4 space-y-3">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </div>
      </MobileShell>
    )
  }

  if (!product) {
    return (
      <MobileShell>
        <div className="h-full flex items-center justify-center">
          <p className="text-[#878787]">Product not found</p>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[110px]">
        <header className="sticky top-0 z-40 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] pt-[34px]">
          <div className="flex items-center justify-between px-4 py-3 h-[56px]">
            <Link href="/home" className="p-2 -ml-2 active:bg-black/5 rounded-2xl">
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2 active:bg-black/5 rounded-2xl"><Share2 className="w-5 h-5 text-[#212121]" /></button>
              <button onClick={toggleWishlist} className="p-2 active:bg-black/5 rounded-2xl">
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#FF6161] text-[#FF6161]" : "text-[#212121]"}`} />
              </button>
            </div>
          </div>
        </header>

        <div className="relative bg-white">
          <div className="aspect-square flex items-center justify-center p-6">
            <img src={images[currentImage]} alt={product.name} className="w-full h-full object-contain" />
          </div>
          {images.length > 1 && (
            <>
              <button onClick={() => setCurrentImage(p => p > 0 ? p - 1 : images.length - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-[#212121]" />
              </button>
              <button onClick={() => setCurrentImage(p => p < images.length - 1 ? p + 1 : 0)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-[#212121]" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_: any, idx: number) => (
                  <button key={idx} onClick={() => setCurrentImage(idx)}
                    className={`w-2.5 h-2.5 rounded-full ${idx === currentImage ? "bg-[#2874F0]" : "bg-[#212121]/30"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-4 py-5 bg-white mt-2 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          {product.brands?.name && (
            <Badge className="bg-[#2874F0]/10 text-[#2874F0] border-0 mb-3 text-[11px] font-semibold rounded-full px-3">{product.brands.name}</Badge>
          )}
          <h1 className="text-[20px] font-bold text-[#212121] mb-3">{product.name}</h1>
          {product.specs && (
            <div className="flex gap-2 flex-wrap">
              {Object.values(product.specs).map((spec: any, i: number) => (
                <span key={i} className="text-[11px] bg-[#F1F3F6] px-3 py-1.5 rounded-full text-[#878787] font-medium">{spec}</span>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-5 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-[#212121]">💰 Compare Prices</h2>
            <span className="text-[13px] text-[#878787]">{shopPrices.length} shops</span>
          </div>
          <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide">
            {[{ key: "price" as SortOption, label: "💵 Lowest Price" }, { key: "rating" as SortOption, label: "⭐ Best Rated" }].map(option => (
              <button key={option.key} onClick={() => setSortBy(option.key)}
                className={`px-4 py-3 text-[13px] rounded-2xl whitespace-nowrap h-[48px] min-w-[100px] font-semibold ${
                  sortBy === option.key ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white" : "bg-white text-[#878787] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"}`}>
                {option.label}
              </button>
            ))}
          </div>

          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl mb-4">
            <CardContent className="p-4">
              {!alertSet ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-[#2874F0]" />
                    <h3 className="text-[15px] font-semibold text-[#212121]">Set a Price Alert</h3>
                  </div>
                  <div className="mb-4">
                    <label className="text-[13px] text-[#878787] mb-2 block">Alert me when price drops below</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#878787]">₹</span>
                      <Input type="number" value={priceAlertValue} onChange={e => setPriceAlertValue(e.target.value)}
                        placeholder="120000" className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px] pl-8" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] text-[#212121]">Notify when new shops add this product</span>
                    <Switch checked={notifyNewShops} onCheckedChange={setNotifyNewShops} />
                  </div>
                  <Button onClick={handleSetAlert} className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[15px] font-semibold rounded-2xl">Set Alert</Button>
                </>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-[#388E3C]/10 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-8 h-8 text-[#388E3C]" />
                  </div>
                  <p className="text-[15px] font-semibold text-[#212121] mb-1">Price Alert Set!</p>
                  <p className="text-[13px] text-[#878787] text-center">We'll notify you when price drops below ₹{priceAlertValue}</p>
                  <button onClick={() => setAlertSet(false)} className="text-[13px] text-[#2874F0] font-medium mt-3">Edit Alert</button>
                </div>
              )}
            </CardContent>
          </Card>

          {shopPrices.length === 0 ? (
            <div className="text-center py-8 text-[#878787] text-[13px]">No shops selling this product yet</div>
          ) : (
            <div className="space-y-4">
              {sortedShops.map(shop => (
                <Card key={shop.id} className={`border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl ${shop.price === lowestPrice ? "ring-2 ring-[#FFD700]" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[15px] text-[#212121]">{shop.shops?.name}</h3>
                          {shop.price === lowestPrice && <Badge className="bg-[#FFD700] text-[#212121] text-[10px] border-0 px-2 font-bold rounded-full">🔥 Best Deal</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#878787] mt-1">
                          {shop.shops?.rating && <><Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" /><span className="font-medium text-[#212121]">{shop.shops.rating}</span></>}
                          {shop.shops?.city && <><span>•</span><span>{shop.shops.city}</span></>}
                        </div>
                      </div>
                      <p className="text-[17px] font-bold text-[#2874F0]">₹{shop.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      {shop.in_stock
                        ? <span className="flex items-center gap-1 text-[11px] text-[#388E3C] font-medium"><Check className="w-3.5 h-3.5" /> In Stock</span>
                        : <span className="flex items-center gap-1 text-[11px] text-[#FF6161] font-medium"><Clock className="w-3.5 h-3.5" /> Out of Stock</span>}
                      {shop.delivery_available && <Badge className="bg-[#F1F3F6] text-[#212121] text-[10px] gap-1 border-0 rounded-full font-medium"><Truck className="w-3 h-3" /> {shop.delivery_time || "Delivery"}</Badge>}
                      {!shop.delivery_available && shop.in_stock && <Badge className="bg-[#F1F3F6] text-[#212121] text-[10px] gap-1 border-0 rounded-full font-medium"><Store className="w-3 h-3" /> Pickup Only</Badge>}
                    </div>
                    <Link href={`/checkout?shopProductId=${shop.id}&productId=${params.id}`}>
                      <Button className={`w-full h-[52px] text-[15px] font-semibold rounded-2xl ${shop.in_stock ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white" : "bg-[#F1F3F6] text-[#878787] cursor-not-allowed"}`} disabled={!shop.in_stock}>
                        Buy from this shop
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {lowestPrice > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-4 z-50 flex items-center justify-between pb-[26px] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
          <div>
            <p className="text-[11px] text-[#878787]">Lowest Price</p>
            <div className="flex items-center gap-2">
              <p className="text-[20px] font-bold text-[#2874F0]">₹{lowestPrice.toLocaleString()}</p>
              <Badge className="bg-[#FFD700] text-[#212121] text-[10px] border-0 px-2 font-bold rounded-full">🔥 Best</Badge>
            </div>
          </div>
          <Link href={`/checkout?shopProductId=${bestDealShop?.id}&productId=${params.id}`}>
            <Button className="bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white px-8 h-[52px] text-[15px] font-semibold rounded-2xl">Buy Now</Button>
          </Link>
        </div>
      )}
    </MobileShell>
  )
}