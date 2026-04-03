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
  { id: "upi", name: "UPI", icon: Smartphone, description: "Pay using any UPI app" },
  { id: "card", name: "Card", icon: CreditCard, description: "Credit/Debit Card" },
  { id: "netbanking", name: "Net Banking", icon: Building2, description: "All major banks" },
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
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[140px]">
        <MobileHeader title="Checkout" backHref="/cart" />

        <div className="px-4 py-4 space-y-4">
          {/* Delivery Address */}
          <section className="bg-white rounded-sm shadow-sm p-4">
            <h2 className="font-semibold text-[14px] text-[#212121] mb-3 flex items-center gap-2 font-[family-name:var(--font-heading)]">
              <MapPin className="w-5 h-5 text-[#2874F0]" />Delivery Address
            </h2>
            
            <RadioGroup value={String(selectedAddress)} onValueChange={(v) => setSelectedAddress(Number(v))}>
              <div className="space-y-3">
                {savedAddresses.map((address) => (
                  <Card 
                    key={address.id}
                    className={`border cursor-pointer transition-colors ${
                      selectedAddress === address.id ? "border-[#2874F0] bg-[#2874F0]/5" : "border-[#E0E0E0]"
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={String(address.id)} id={`address-${address.id}`} className="mt-1 border-[#2874F0] text-[#2874F0]" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-[12px] text-[#212121]">{address.name}</span>
                            <span className="text-[10px] bg-[#F1F3F6] px-1.5 py-0.5 rounded-sm text-[#878787]">{address.type}</span>
                            {address.isDefault && <span className="text-[10px] bg-[#2874F0]/10 text-[#2874F0] px-1.5 py-0.5 rounded-sm">Default</span>}
                          </div>
                          <p className="text-[12px] text-[#878787]">{address.address}</p>
                          <p className="text-[12px] text-[#878787]">{address.city}</p>
                          <p className="text-[12px] text-[#878787] mt-1">{address.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>

            <button className="flex items-center gap-2 mt-3 text-[#2874F0] font-medium text-[12px]">
              <Plus className="w-4 h-4" />Add New Address
            </button>
          </section>

          {/* Order Summary - Collapsible */}
          <section>
            <button onClick={() => setShowOrderSummary(!showOrderSummary)} className="w-full">
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[14px] text-[#212121] font-[family-name:var(--font-heading)]">Order Summary</h3>
                      <p className="text-[12px] text-[#878787]">2 items</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-[#212121] font-[family-name:var(--font-heading)]">₹{total.toLocaleString()}</span>
                      {showOrderSummary ? <ChevronUp className="w-5 h-5 text-[#878787]" /> : <ChevronDown className="w-5 h-5 text-[#878787]" />}
                    </div>
                  </div>
                  
                  {showOrderSummary && (
                    <div className="mt-4 pt-4 border-t border-[#E0E0E0] space-y-3">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-[#F1F3F6] rounded-sm flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[12px] font-medium text-[#212121] line-clamp-1">Samsung Galaxy S24 Ultra 256GB</p>
                          <p className="text-[10px] text-[#878787]">Qty: 1</p>
                        </div>
                        <p className="text-[12px] font-medium text-[#212121]">₹124,999</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-[#F1F3F6] rounded-sm flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[12px] font-medium text-[#212121] line-clamp-1">Sony WH-1000XM5 Headphones</p>
                          <p className="text-[10px] text-[#878787]">Qty: 1</p>
                        </div>
                        <p className="text-[12px] font-medium text-[#212121]">₹29,990</p>
                      </div>
                      <div className="pt-3 border-t border-[#E0E0E0] space-y-2 text-[12px]">
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
          <section className="bg-white rounded-sm shadow-sm p-4">
            <h2 className="font-semibold text-[14px] text-[#212121] mb-3 flex items-center gap-2 font-[family-name:var(--font-heading)]">
              <CreditCard className="w-5 h-5 text-[#2874F0]" />Payment Method
            </h2>
            
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card 
                    key={method.id}
                    className={`border cursor-pointer transition-colors ${
                      selectedPayment === method.id ? "border-[#2874F0] bg-[#2874F0]/5" : "border-[#E0E0E0]"
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${selectedPayment === method.id ? "bg-[#2874F0]/10" : "bg-[#F1F3F6]"}`}>
                          <method.icon className={`w-5 h-5 ${selectedPayment === method.id ? "text-[#2874F0]" : "text-[#878787]"}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[12px] text-[#212121]">{method.name}</p>
                          <p className="text-[10px] text-[#878787]">{method.description}</p>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-4 z-50 pb-[22px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-[#878787]">Total Amount</p>
            <p className="text-[18px] font-bold text-[#212121] font-[family-name:var(--font-heading)]">₹{total.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#388E3C]">
            <Check className="w-4 h-4" /><span>Secure Checkout</span>
          </div>
        </div>
        <Button onClick={handlePlaceOrder} className="w-full bg-[#2874F0] active:bg-[#1E5DC8] text-white font-medium h-12 text-[14px]">
          Place Order
        </Button>
      </div>
    </MobileShell>
  )
}
