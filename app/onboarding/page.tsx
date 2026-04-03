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
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {/* Logo Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-foreground tracking-tight">
          Sales<span className="text-primary">App</span>
        </h1>
        <p className="text-primary font-medium mt-4 text-lg">
          Your city&apos;s best electronics, one tap away.
        </p>
      </div>

      {/* Location Permission Card */}
      {!locationGranted && (
        <Card className="w-full max-w-sm border-2 border-primary/20 shadow-sm mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Enable Location
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Allow location access to find the best electronics deals near you
              </p>
              <Button 
                onClick={handleLocationPermission}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
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
          <p className="text-center text-muted-foreground mb-6">
            How would you like to continue?
          </p>
          
          <Link href="/auth?role=customer" className="block">
            <Card className="border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer shadow-sm">
              <CardContent className="py-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Continue as Customer</h3>
                  <p className="text-sm text-muted-foreground">Browse and compare prices</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/auth?role=vendor" className="block">
            <Card className="border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer shadow-sm">
              <CardContent className="py-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Continue as Shop Owner</h3>
                  <p className="text-sm text-muted-foreground">Manage your shop and products</p>
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
          className="text-muted-foreground text-sm hover:text-primary transition-colors mt-4"
        >
          Skip for now
        </button>
      )}
    </main>
  )
}
