"use client"

import { useState } from "react"
import { MapPin, Plus, CreditCard, Smartphone, Building2, Banknote, ChevronDown, ChevronUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import Link from "next/link"

const savedAddresses = [
  { id: 1, type: "Home", name: "Rahul Sharma", address: "Flat 402, Building A, Green Valley Apartments, Andheri West", city: "Mumbai - 400058", phone: "+91 98765 43210", isDefault: true },
  { id: 2, type: "Office", name: "Rahul Sharma", address: "Floor 5, Tech Park, Goregaon East", city: "Mumbai - 400063", phone: "+91 98765 43210", isDefault: false },
]

const paymentMethods = [
  { id: "upi", name: "UPI", emoji: "📱", icon: Smartphone, description: "Pay using any UPI app" },
  { id: "card", name: "Card", emoji: "💳", icon: CreditCard, description: "Credit/Debit Card" },
  { id: "netbanking", name: "Net Banking", emoji: "🏦", icon: Building2, description: "All major banks" },
  { id: "cod", name: "Cash on Delivery", emoji: "💵", icon: Banknote, description: "Pay when you receive" },
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
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[160px]">
        <MobileHeader title="📋 Checkout" backHref="/cart" />

        <div className="px-4 py-5 space-y-6">
          {/* Delivery Address */}
          <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-5">
            <h2 className="font-bold text-[15px] text-[#212121] mb-4 flex items-center gap-2">
              📍 Delivery Address
            </h2>
            
            <RadioGroup value={String(selectedAddress)} onValueChange={(v) => setSelectedAddress(Number(v))}>
              <div className="space-y-4">
                {savedAddresses.map((address) => (
                  <Card 
                    key={address.id}
                    className={`border-2 cursor-pointer transition-colors rounded-2xl ${
                      selectedAddress === address.id ? "border-[#2874F0] bg-[#2874F0]/5" : "border-[#E0E0E0]"
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={String(address.id)} id={`address-${address.id}`} className="mt-1 border-[#2874F0] text-[#2874F0]" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-[13px] text-[#212121]">{address.name}</span>
                            <span className="text-[11px] bg-[#F1F3F6] px-2 py-1 rounded-full text-[#878787] font-medium">{address.type === "Home" ? "🏠" : "🏢"} {address.type}</span>
                            {address.isDefault && <span className="text-[11px] bg-[#2874F0]/10 text-[#2874F0] px-2 py-1 rounded-full font-semibold">Default</span>}
                          </div>
                          <p className="text-[13px] text-[#878787]">{address.address}</p>
                          <p className="text-[13px] text-[#878787]">{address.city}</p>
                          <p className="text-[13px] text-[#878787] mt-1">{address.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>

            <button className="flex items-center gap-2 mt-4 text-[#2874F0] font-semibold text-[13px]">
              <Plus className="w-5 h-5" />➕ Add New Address
            </button>
          </section>

          {/* Order Summary - Collapsible */}
          <section>
            <button onClick={() => setShowOrderSummary(!showOrderSummary)} className="w-full">
              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[15px] text-[#212121]">📦 Order Summary</h3>
                      <p className="text-[13px] text-[#878787]">2 items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[17px] text-[#2874F0]">₹{total.toLocaleString()}</span>
                      {showOrderSummary ? <ChevronUp className="w-5 h-5 text-[#878787]" /> : <ChevronDown className="w-5 h-5 text-[#878787]" />}
                    </div>
                  </div>
                  
                  {showOrderSummary && (
                    <div className="mt-5 pt-5 border-t border-[#E0E0E0] space-y-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#F1F3F6] rounded-xl flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[13px] font-semibold text-[#212121] line-clamp-1">Samsung Galaxy S24 Ultra 256GB</p>
                          <p className="text-[11px] text-[#878787]">Qty: 1</p>
                        </div>
                        <p className="text-[13px] font-semibold text-[#212121]">₹124,999</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#F1F3F6] rounded-xl flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[13px] font-semibold text-[#212121] line-clamp-1">Sony WH-1000XM5 Headphones</p>
                          <p className="text-[11px] text-[#878787]">Qty: 1</p>
                        </div>
                        <p className="text-[13px] font-semibold text-[#212121]">₹29,990</p>
                      </div>
                      <div className="pt-4 border-t border-[#E0E0E0] space-y-2 text-[13px]">
                        <div className="flex justify-between text-[#878787]"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-[#878787]"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </button>
          </section>

          {/* Payment Method */}
          <section className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-5">
            <h2 className="font-bold text-[15px] text-[#212121] mb-4 flex items-center gap-2">
              💳 Payment Method
            </h2>
            
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card 
                    key={method.id}
                    className={`border-2 cursor-pointer transition-colors rounded-2xl ${
                      selectedPayment === method.id ? "border-[#2874F0] bg-[#2874F0]/5" : "border-[#E0E0E0]"
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPayment === method.id ? "bg-[#2874F0]/10" : "bg-[#F1F3F6]"}`}>
                          <span className="text-xl">{method.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[13px] text-[#212121]">{method.name}</p>
                          <p className="text-[11px] text-[#878787]">{method.description}</p>
                        </div>
                        <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="border-[#2874F0] text-[#2874F0]" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </section>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-5 z-50 pb-[26px] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] text-[#878787]">Total Amount</p>
            <p className="text-[20px] font-bold text-[#2874F0]">₹{total.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#388E3C] font-semibold">
            <Check className="w-4 h-4" /><span>🔒 Secure Checkout</span>
          </div>
        </div>
        <Button onClick={handlePlaceOrder} className="w-full bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold h-[52px] text-[15px] rounded-2xl">
          Place Order
        </Button>
      </div>
    </MobileShell>
  )
}
