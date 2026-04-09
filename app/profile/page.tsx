"use client"

import { useEffect, useState } from "react"
import { ChevronRight, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { MobileShell } from "@/components/mobile-shell"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

const menuItems = [
  { emoji: "📦", label: "My Orders", href: "/orders" },
  { emoji: "❤️", label: "Wishlist", href: "/wishlist" },
  { emoji: "📍", label: "Saved Addresses", href: "/addresses" },
  { emoji: "💳", label: "Payment Methods", href: "/payment-methods" },
  { emoji: "🔔", label: "Notifications", href: "/notifications" },
  { emoji: "❓", label: "Help & Support", href: "/support" },
  { emoji: "⭐", label: "Rate the App", href: "/rate" },
]

interface ProfileStats {
  orders: number
  wishlist: number
  reviews: number
}

interface Profile {
  name: string
  email: string
  phone: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<ProfileStats>({ orders: 0, wishlist: 0, reviews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchProfileData() {
      try {
        const [profileRes, ordersRes, reviewsRes] = await Promise.all([
          supabase.from("profiles").select("name, email, phone").eq("id", user!.id).maybeSingle(),
          supabase.from("orders").select("id", { count: "exact", head: true }).eq("customer_id", user!.id),
          supabase.from("reviews").select("id", { count: "exact", head: true }).eq("customer_id", user!.id),
        ])

        if (profileRes.data) {
          setProfile({
            name: profileRes.data.name || user!.email?.split("@")[0] || "User",
            email: profileRes.data.email || user!.email || "",
            phone: profileRes.data.phone || "",
          })
        } else {
          setProfile({
            name: user!.user_metadata?.name || user!.email?.split("@")[0] || "User",
            email: user!.email || "",
            phone: user!.user_metadata?.phone || "",
          })
        }

        setStats({
          orders: ordersRes.count ?? 0,
          wishlist: 0,
          reviews: reviewsRes.count ?? 0,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  const initials = profile?.name
    ? profile.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[82px]">
        <header className="bg-gradient-to-r from-[#2874F0] to-[#42A5F5] pt-[34px] pb-8 px-4">
          <div className="flex items-center gap-4 mt-4">
            <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-blue-100 animate-pulse" />
              ) : (
                <span className="text-[24px] font-bold text-[#2874F0]">{initials}</span>
              )}
            </div>
            <div>
              {loading ? (
                <>
                  <div className="h-5 w-32 bg-white/30 rounded animate-pulse mb-2" />
                  <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <h1 className="text-[20px] font-bold text-white">{profile?.name || "User"}</h1>
                  <p className="text-[15px] text-white/80">{profile?.phone || profile?.email || ""}</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-around mt-6 bg-white/10 rounded-2xl py-4">
            <div className="text-center">
              {loading ? (
                <div className="h-6 w-8 bg-white/30 rounded animate-pulse mx-auto mb-1" />
              ) : (
                <p className="text-[20px] font-bold text-white">{stats.orders}</p>
              )}
              <p className="text-[13px] text-white/80">Orders</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              {loading ? (
                <div className="h-6 w-8 bg-white/30 rounded animate-pulse mx-auto mb-1" />
              ) : (
                <p className="text-[20px] font-bold text-white">{stats.wishlist}</p>
              )}
              <p className="text-[13px] text-white/80">Wishlist</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              {loading ? (
                <div className="h-6 w-8 bg-white/30 rounded animate-pulse mx-auto mb-1" />
              ) : (
                <p className="text-[20px] font-bold text-white">{stats.reviews}</p>
              )}
              <p className="text-[13px] text-white/80">Reviews</p>
            </div>
          </div>
        </header>

        <div className="px-4 -mt-4">
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {menuItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-4 active:bg-[#F1F3F6] transition-colors ${
                    index !== menuItems.length - 1 ? "border-b border-[#F1F3F6]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{item.emoji}</span>
                    <span className="text-[15px] font-medium text-[#212121]">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#878787]" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:bg-[#FFF5F5] transition-colors"
          >
            <LogOut className="w-5 h-5 text-[#FF6161]" />
            <span className="text-[15px] font-semibold text-[#FF6161]">Logout</span>
          </button>

          <p className="text-center text-[13px] text-[#878787] mt-6 mb-4">Version 1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </MobileShell>
  )
}
