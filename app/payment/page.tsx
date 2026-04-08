"use client"

import { useState, useEffect } from "react"
import { Check, X, RefreshCw, Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"

type PaymentStatus = "processing" | "success" | "failed"

export default function PaymentPage() {
  const [status, setStatus] = useState<PaymentStatus>("processing")

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("success")
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    setStatus("processing")
    setTimeout(() => setStatus("success"), 2000)
  }

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] flex items-center justify-center px-4 pt-[34px]">
        <div className="w-full">
          {status === "processing" && (
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#2874F0]/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#2874F0] border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-[20px] font-bold text-[#212121] mb-2">💳 Processing Payment</h1>
              <p className="text-[#878787] text-[13px]">Please wait while we process your payment...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#388E3C]/10 rounded-2xl flex items-center justify-center">
                <span className="text-5xl">✅</span>
              </div>
              
              <h1 className="text-[20px] font-bold text-[#212121] mb-2">🎉 Payment Successful!</h1>
              <p className="text-[#878787] text-[13px] mb-6">Your order has been placed successfully</p>

              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-left mb-6 bg-white rounded-2xl">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#878787]">Order ID</span>
                    <span className="font-semibold text-[#212121]">#ORD12345678</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#878787]">Shop</span>
                    <span className="font-semibold text-[#212121]">🏪 Tech World Electronics</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#878787]">Amount Paid</span>
                    <span className="font-bold text-[17px] text-[#2874F0]">₹1,55,038</span>
                  </div>
                  <div className="h-px bg-[#E0E0E0]" />
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-[#878787]">Estimated Delivery</span>
                    <span className="font-semibold text-[#388E3C]">🚚 Today by 8 PM</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Link href="/orders/12345678" className="block">
                  <Button className="w-full bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold h-[52px] text-[15px] rounded-2xl">
                    📦 Track Order
                  </Button>
                </Link>
                <Link href="/home" className="block">
                  <Button variant="outline" className="w-full border-2 border-[#2874F0] text-[#2874F0] font-semibold h-[52px] text-[15px] rounded-2xl">
                    🛒 Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#FF6161]/10 rounded-2xl flex items-center justify-center">
                <span className="text-5xl">❌</span>
              </div>
              
              <h1 className="text-[20px] font-bold text-[#212121] mb-2">Payment Failed</h1>
              <p className="text-[#878787] text-[13px] mb-6">Something went wrong. Please try again.</p>

              <div className="space-y-4">
                <Button onClick={handleRetry} className="w-full bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold h-[52px] text-[15px] rounded-2xl">
                  🔄 Retry Payment
                </Button>
                <Link href="/checkout" className="block">
                  <Button variant="outline" className="w-full border-2 border-[#E0E0E0] text-[#212121] font-semibold h-[52px] text-[15px] rounded-2xl">
                    💳 Change Payment Method
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  )
}
