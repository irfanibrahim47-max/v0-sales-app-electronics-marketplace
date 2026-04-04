"use client"

import { useState } from "react"
import { MapPin, User, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"

export default function OnboardingPage() {
  const [locationGranted, setLocationGranted] = useState(false)

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationGranted(true),
        () => setLocationGranted(true)
      )
    } else {
      setLocationGranted(true)
    }
  }

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] flex flex-col items-center justify-center px-4 pt-[34px]">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#212121] tracking-tight">
            Sales<span className="text-[#2874F0]">App</span>
          </h1>
          <p className="text-[#2874F0] font-semibold mt-3 text-[15px]">
            Your city&apos;s best electronics, one tap away.
          </p>
        </div>

        {/* Location Permission Card */}
        {!locationGranted && (
          <Card className="w-full border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] mb-6 bg-white rounded-2xl">
            <CardContent className="pt-6 pb-6 px-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2874F0] to-[#42A5F5] flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-[20px] font-bold text-[#212121] mb-2">
                  📍 Enable Location
                </h2>
                <p className="text-[#878787] text-[13px] mb-6 px-2">
                  Allow location access to find the best electronics deals near you
                </p>
                <Button 
                  onClick={handleLocationPermission}
                  className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] hover:from-[#2874F0] hover:to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold text-[15px] rounded-2xl"
                >
                  Allow Location
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Role Selection */}
        {locationGranted && (
          <div className="w-full space-y-4 animate-in fade-in duration-300">
            <p className="text-center text-[#878787] text-[13px] mb-4">
              How would you like to continue?
            </p>
            
            <Link href="/auth?role=customer" className="block">
              <Card className="border-0 bg-white active:scale-[0.98] transition-transform cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
                <CardContent className="py-5 px-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2874F0] to-[#42A5F5] flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-[#212121]">🛒 Continue as Customer</h3>
                    <p className="text-[13px] text-[#878787]">Browse and compare prices</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth?role=vendor" className="block">
              <Card className="border-0 bg-white active:scale-[0.98] transition-transform cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
                <CardContent className="py-5 px-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2874F0] to-[#42A5F5] flex items-center justify-center">
                    <Store className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-[#212121]">🏪 Continue as Shop Owner</h3>
                    <p className="text-[13px] text-[#878787]">Manage your shop and products</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Skip location button */}
        {!locationGranted && (
          <button 
            onClick={() => setLocationGranted(true)}
            className="text-[#878787] text-[13px] active:text-[#2874F0] transition-colors mt-4"
          >
            Skip for now
          </button>
        )}
      </div>
    </MobileShell>
  )
}
