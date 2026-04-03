"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  ChevronDown,
  ChevronUp,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

const savedAddresses = [
  {
    id: 1,
    type: "Home",
    name: "Rahul Sharma",
    address: "Flat 402, Building A, Green Valley Apartments, Andheri West",
    city: "Mumbai - 400058",
    phone: "+91 98765 43210",
    isDefault: true
  },
  {
    id: 2,
    type: "Office",
    name: "Rahul Sharma",
    address: "Floor 5, Tech Park, Goregaon East",
    city: "Mumbai - 400063",
    phone: "+91 98765 43210",
    isDefault: false
  },
]

const paymentMethods = [
  { id: "upi", name: "UPI", icon: Smartphone, description: "Pay using any UPI app" },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "netbanking", name: "Net Banking", icon: Building2, description: "All major banks supported" },
  { id: "cod", name: "Cash on Delivery", icon: Banknote, description: "Pay when you receive" },
]

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0].id)
  const [selectedPayment, setSelectedPayment] = useState("upi")
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  const subtotal = 154989
  const deliveryFee = 49
  const total = subtotal + deliveryFee

  const handlePlaceOrder = () => {
    window.location.href = "/payment"
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/cart" className="p-1">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Checkout</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Delivery Address Section */}
        <section>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Delivery Address
          </h2>
          
          <RadioGroup value={String(selectedAddress)} onValueChange={(v) => setSelectedAddress(Number(v))}>
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <Card 
                  key={address.id}
                  className={`border-2 cursor-pointer transition-colors ${
                    selectedAddress === address.id 
                      ? "border-primary" 
                      : "border-border hover:border-primary/40"
                  }`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem 
                        value={String(address.id)} 
                        id={`address-${address.id}`}
                        className="mt-1 border-primary text-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{address.name}</span>
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.address}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.city}</p>
                        <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>

          <button className="flex items-center gap-2 mt-3 text-primary font-medium text-sm">
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </section>

        {/* Order Summary - Collapsible */}
        <section>
          <button 
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            className="w-full"
          >
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Order Summary</h3>
                    <p className="text-sm text-muted-foreground">2 items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">₹{total.toLocaleString()}</span>
                    {showOrderSummary ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {showOrderSummary && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-secondary/30 rounded flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          Samsung Galaxy S24 Ultra 256GB
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: 1</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">₹124,999</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-secondary/30 rounded flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          Sony WH-1000XM5 Headphones
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: 1</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">₹29,990</p>
                    </div>
                    <div className="pt-3 border-t border-border space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </button>
        </section>

        {/* Payment Method Section */}
        <section>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Method
          </h2>
          
          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card 
                  key={method.id}
                  className={`border-2 cursor-pointer transition-colors ${
                    selectedPayment === method.id 
                      ? "border-primary border-l-4" 
                      : "border-border hover:border-primary/40"
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedPayment === method.id ? "bg-primary/10" : "bg-secondary"
                      }`}>
                        <method.icon className={`w-5 h-5 ${
                          selectedPayment === method.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{method.name}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                      <RadioGroupItem 
                        value={method.id} 
                        id={`payment-${method.id}`}
                        className="border-primary text-primary"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </section>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-xl font-bold text-primary">₹{total.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Check className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
        <Button 
          onClick={handlePlaceOrder}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12"
        >
          Place Order
        </Button>
      </div>
    </div>
  )
}
