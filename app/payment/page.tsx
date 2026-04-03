"use client"

import { useState, useEffect } from "react"
import { Check, X, RefreshCw, Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

type PaymentStatus = "processing" | "success" | "failed"

export default function PaymentPage() {
  const [status, setStatus] = useState<PaymentStatus>("processing")

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      // Randomly succeed or fail for demo
      setStatus(Math.random() > 0.2 ? "success" : "failed")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    setStatus("processing")
    setTimeout(() => {
      setStatus("success")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {status === "processing" && (
          <div className="text-center">
            {/* Processing Animation */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Processing Payment
            </h1>
            <p className="text-muted-foreground">
              Please wait while we process your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center animate-in fade-in duration-500">
            {/* Success Animation */}
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully
            </p>

            <Card className="border-2 border-primary/20 text-left mb-6">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-medium text-foreground">#ORD12345678</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Shop</span>
                  <span className="font-medium text-foreground">Tech World Electronics</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-primary">₹1,55,038</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Delivery</span>
                  <span className="font-medium text-green-600">Today by 8 PM</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/orders/12345678" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12">
                  <Package className="w-5 h-5 mr-2" />
                  Track Order
                </Button>
              </Link>
              <Link href="/home" className="block">
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-medium h-12"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center animate-in fade-in duration-500">
            {/* Failed Animation */}
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-12 h-12 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Payment Failed
            </h1>
            <p className="text-muted-foreground mb-6">
              Something went wrong with your payment. Please try again.
            </p>

            <div className="space-y-3">
              <Button 
                onClick={handleRetry}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retry Payment
              </Button>
              <Link href="/checkout" className="block">
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-border text-foreground hover:bg-secondary font-medium h-12"
                >
                  Change Payment Method
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
