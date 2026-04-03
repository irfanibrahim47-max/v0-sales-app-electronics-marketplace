"use client"

import { useState } from "react"
import { MapPin, User, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function OnboardingPage() {
  const [locationGranted, setLocationGranted] = useState(false)

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationGranted(true),
        () => setLocationGranted(true) // Continue anyway for demo
      )
    } else {
      setLocationGranted(true)
    }
  }

  return (
    <main className="min-h-screen bg-[#F1F3F6] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-[#212121] tracking-tight font-[family-name:var(--font-heading)]">
          Sales<span className="text-[#2874F0]">App</span>
        </h1>
        <p className="text-[#2874F0] font-medium mt-4 text-lg">
          Your city&apos;s best electronics, one tap away.
        </p>
      </div>

      {/* Location Permission Card */}
      {!locationGranted && (
        <Card className="w-full max-w-sm border-0 shadow-md mb-8 bg-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#2874F0]/10 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-[#2874F0]" />
              </div>
              <h2 className="text-lg font-semibold text-[#212121] mb-2 font-[family-name:var(--font-heading)]">
                Enable Location
              </h2>
              <p className="text-[#878787] text-sm mb-6">
                Allow location access to find the best electronics deals near you
              </p>
              <Button 
                onClick={handleLocationPermission}
                className="w-full bg-[#2874F0] hover:bg-[#2874F0]/90 text-white font-medium"
              >
                Allow Location
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Selection */}
      {locationGranted && (
        <div className="w-full max-w-sm space-y-4 animate-in fade-in duration-300">
          <p className="text-center text-[#878787] mb-6">
            How would you like to continue?
          </p>
          
          <Link href="/auth?role=customer" className="block">
            <Card className="border-0 bg-white hover:shadow-lg transition-shadow cursor-pointer shadow-md">
              <CardContent className="py-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2874F0]/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#2874F0]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Continue as Customer</h3>
                  <p className="text-sm text-[#878787]">Browse and compare prices</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/auth?role=vendor" className="block">
            <Card className="border-0 bg-white hover:shadow-lg transition-shadow cursor-pointer shadow-md">
              <CardContent className="py-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2874F0]/10 flex items-center justify-center">
                  <Store className="w-6 h-6 text-[#2874F0]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Continue as Shop Owner</h3>
                  <p className="text-sm text-[#878787]">Manage your shop and products</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Skip location button when not granted */}
      {!locationGranted && (
        <button 
          onClick={() => setLocationGranted(true)}
          className="text-[#878787] text-sm hover:text-[#2874F0] transition-colors mt-4"
        >
          Skip for now
        </button>
      )}
    </main>
  )
}
