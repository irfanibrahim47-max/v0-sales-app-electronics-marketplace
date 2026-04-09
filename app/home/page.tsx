"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Mic, ShoppingCart, MapPin, Star, ChevronDown, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

interface Category {
  id: string
  name: string
  emoji: string
  slug: string
  display_order: number
}

interface Shop {
  id: string
  name: string
  rating: number | null
  is_open: boolean
  city: string | null
  is_verified: boolean
}

interface Product {
  id: string
  name: string
  images: string[]
  categories: { name: string; emoji: string } | null
  shop_products: { price: number; in_stock: boolean }[]
}

interface FlashDeal {
  id: string
  deal_price: number
  original_price: number
  discount_percent: number
  ends_at: string
  shop_products: {
    products: { name: string; images: string[] } | null
  } | null
}

export default function HomePage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingShops, setLoadingShops] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingDeals, setLoadingDeals] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("display_order")
        if (error) throw error
        setCategories(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingCategories(false)
      }
    }

    async function fetchShops() {
      try {
        const { data, error } = await supabase
          .from("shops")
          .select("id, name, rating, is_open, city, is_verified")
          .eq("verification_status", "approved")
          .order("rating", { ascending: false })
          .limit(8)
        if (error) throw error
        setShops(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingShops(false)
      }
    }

    async function fetchFlashDeals() {
      try {
        const { data, error } = await supabase
          .from("flash_deals")
          .select(`
            id, deal_price, original_price, discount_percent, ends_at,
            shop_products(
              products(name, images)
            )
          `)
          .eq("is_active", true)
          .gt("ends_at", new Date().toISOString())
          .order("discount_percent", { ascending: false })
          .limit(6)
        if (error) throw error
        setFlashDeals((data as any[]) || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingDeals(false)
      }
    }

    fetchCategories()
    fetchShops()
    fetchFlashDeals()
  }, [])

  const fetchProducts = useCallback(async (categorySlug?: string | null, search?: string) => {
    setLoadingProducts(true)
    try {
      let query = supabase
        .from("products")
        .select(`
          id, name, images,
          categories(name, emoji),
          shop_products(price, in_stock)
        `)
        .limit(20)

      if (search) {
        query = query.ilike("name", `%${search}%`)
      }

      const { data, error } = await query
      if (error) throw error

      let filtered = (data as any[]) || []
      if (categorySlug) {
        const cat = categories.find((c) => c.name === categorySlug)
        if (cat) {
          const { data: catProducts } = await supabase
            .from("products")
            .select(`id, name, images, categories(name, emoji), shop_products(price, in_stock)`)
            .eq("category_id", cat.id)
            .limit(20)
          filtered = catProducts || []
        }
      }

      setProducts(filtered)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingProducts(false)
    }
  }, [categories])

  useEffect(() => {
    fetchProducts(null, "")
  }, [])

  useEffect(() => {
    if (categories.length === 0) return
    fetchProducts(selectedCategory, searchQuery)
  }, [selectedCategory, categories])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(selectedCategory, searchQuery)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery])

  useEffect(() => {
    if (!user) return
    async function fetchCartCount() {
      try {
        const { count } = await supabase
          .from("cart")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user!.id)
        setCartCount(count ?? 0)
      } catch (err) {
        console.error(err)
      }
    }
    fetchCartCount()
  }, [user])

  const getLowestPrice = (product: Product) => {
    const prices = product.shop_products?.map((sp) => sp.price).filter(Boolean) ?? []
    return prices.length > 0 ? Math.min(...prices) : null
  }

  const getShopsCount = (product: Product) => product.shop_products?.length ?? 0

  const getTimeLeft = (endsAt: string) => {
    const diff = new Date(endsAt).getTime() - Date.now()
    if (diff <= 0) return "Expired"
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return `${h}h ${m}m`
  }

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        <header className="sticky top-0 z-40 bg-gradient-to-r from-[#2874F0] to-[#42A5F5] shadow-[0_2px_12px_rgba(0,0,0,0.08)] pt-[34px]">
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-[20px] font-bold text-white">
              Sales<span className="text-[#FFD700]">App</span>
            </h1>
            <button className="flex items-center gap-1 text-[13px] text-white">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Mumbai</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>
            <Link href="/cart" className="relative p-1">
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#FF6161] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#878787]" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[52px] pl-12 pr-12 border-0 rounded-2xl bg-white focus:ring-2 focus:ring-[#2874F0]/30 focus:outline-none text-[15px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <Mic className="w-5 h-5 text-[#2874F0]" />
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-4 bg-white overflow-x-auto scrollbar-hide shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex gap-3">
            {loadingCategories
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 px-4 py-3 min-w-[70px]">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="w-12 h-3 rounded" />
                  </div>
                ))
              : categories.length > 0
              ? categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === category.name ? null : category.name)
                    }
                    className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-colors whitespace-nowrap min-w-[70px] active:scale-95 ${
                      selectedCategory === category.name
                        ? "bg-[#2874F0]/10 border-2 border-[#2874F0]"
                        : "bg-[#F1F3F6] border-2 border-transparent"
                    }`}
                  >
                    <span className="text-[20px]">{category.emoji}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        selectedCategory === category.name ? "text-[#2874F0]" : "text-[#212121]"
                      }`}
                    >
                      {category.name}
                    </span>
                  </button>
                ))
              : (
                <p className="text-[13px] text-[#878787] py-3 px-2">No categories yet</p>
              )}
          </div>
        </div>

        {(loadingDeals || flashDeals.length > 0) && (
          <section className="px-4 mt-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FF6161] fill-[#FF6161]" />
                <h2 className="text-[20px] font-bold text-[#212121]">Flash Deals</h2>
              </div>
              <div className="flex items-center gap-1 text-[12px] text-[#878787]">
                <Clock className="w-3.5 h-3.5" />
                {flashDeals[0] && <span>{getTimeLeft(flashDeals[0].ends_at)} left</span>}
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4">
                {loadingDeals
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="min-w-[160px] border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
                        <CardContent className="p-0">
                          <Skeleton className="w-full h-[120px] rounded-t-2xl" />
                          <div className="p-3 space-y-2">
                            <Skeleton className="h-3 w-full rounded" />
                            <Skeleton className="h-4 w-20 rounded" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  : flashDeals.map((deal) => {
                      const product = deal.shop_products?.products
                      const image = product?.images?.[0]
                      return (
                        <Card
                          key={deal.id}
                          className="min-w-[160px] border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform bg-white rounded-2xl overflow-hidden"
                        >
                          <CardContent className="p-0">
                            <div className="relative">
                              <div className="w-full h-[120px] bg-[#F1F3F6] flex items-center justify-center p-2">
                                {image ? (
                                  <img src={image} alt={product?.name} className="h-full object-contain" />
                                ) : (
                                  <div className="text-[11px] text-[#878787]">No image</div>
                                )}
                              </div>
                              <Badge className="absolute top-2 left-2 bg-[#FF6161] text-white border-0 text-[10px] font-bold px-2 rounded-full">
                                -{deal.discount_percent}%
                              </Badge>
                            </div>
                            <div className="p-3">
                              <p className="text-[12px] font-medium text-[#212121] line-clamp-2 mb-1">
                                {product?.name || "Product"}
                              </p>
                              <p className="text-[16px] font-bold text-[#2874F0]">
                                ₹{deal.deal_price.toLocaleString()}
                              </p>
                              <p className="text-[11px] text-[#878787] line-through">
                                ₹{deal.original_price.toLocaleString()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
              </div>
            </div>
          </section>
        )}

        <section className="px-4 mt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-[#212121]">Nearby Shops</h2>
            <Link href="/search" className="text-[#2874F0] text-[13px] font-semibold">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4">
              {loadingShops
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="min-w-[180px] border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
                      <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-4 w-28 rounded" />
                        <Skeleton className="h-3 w-20 rounded" />
                        <div className="flex gap-1.5">
                          <Skeleton className="h-5 w-12 rounded-full" />
                          <Skeleton className="h-5 w-12 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : shops.length > 0
                ? shops.map((shop) => (
                    <Link key={shop.id} href={`/shop/${shop.id}`}>
                      <Card className="min-w-[180px] border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform bg-white rounded-2xl">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-[15px] text-[#212121] line-clamp-1 flex-1 mr-2">
                              {shop.name}
                            </h3>
                            <Badge
                              className={`${
                                shop.is_open
                                  ? "bg-[#388E3C] text-white"
                                  : "bg-[#878787] text-white"
                              } text-[10px] border-0 px-2 rounded-full shrink-0`}
                            >
                              {shop.is_open ? "Open" : "Closed"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[#878787]">
                            {shop.rating != null && (
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                                <span className="font-medium text-[#212121]">{shop.rating}</span>
                              </div>
                            )}
                            {shop.city && (
                              <>
                                <span>•</span>
                                <span>{shop.city}</span>
                              </>
                            )}
                          </div>
                          {shop.is_verified && (
                            <Badge className="mt-2 bg-[#E3F2FD] text-[#2874F0] border-0 text-[10px] px-2 rounded-full">
                              Verified
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                : (
                  <p className="text-[13px] text-[#878787] py-3">No shops available yet</p>
                )}
            </div>
          </div>
        </section>

        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-bold text-[#212121]">
              {selectedCategory ? selectedCategory : "Popular Products"}
            </h2>
            <Link href="/search" className="text-[#2874F0] text-[13px] font-semibold">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {loadingProducts
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden bg-white rounded-2xl">
                    <CardContent className="p-0">
                      <Skeleton className="w-full aspect-square" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-3 w-3/4 rounded" />
                        <Skeleton className="h-5 w-24 rounded" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : products.length > 0
              ? products.map((product) => {
                  const lowestPrice = getLowestPrice(product)
                  const shopsCount = getShopsCount(product)
                  const image = product.images?.[0]
                  return (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-transform overflow-hidden bg-white rounded-2xl">
                        <CardContent className="p-0">
                          <div className="aspect-square bg-white flex items-center justify-center p-4">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#F1F3F6] rounded-xl flex items-center justify-center text-[#878787] text-[11px]">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-[13px] font-semibold text-[#212121] line-clamp-2 mb-2">
                              {product.name}
                            </h3>
                            {lowestPrice != null ? (
                              <p className="text-[17px] text-[#2874F0] font-bold">
                                ₹{lowestPrice.toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-[13px] text-[#878787]">Price unavailable</p>
                            )}
                            <p className="text-[11px] text-[#878787] mt-1">
                              {shopsCount} {shopsCount === 1 ? "shop" : "shops"} selling
                            </p>
                            <Button
                              size="sm"
                              className="w-full mt-3 bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white text-[13px] h-[44px] rounded-xl font-semibold"
                            >
                              Compare
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })
              : (
                <div className="col-span-2 text-center py-10 text-[#878787] text-[13px]">
                  {searchQuery ? `No results for "${searchQuery}"` : "No products available yet"}
                </div>
              )}
          </div>
        </section>
      </div>

      <BottomNav />
    </MobileShell>
  )
}
