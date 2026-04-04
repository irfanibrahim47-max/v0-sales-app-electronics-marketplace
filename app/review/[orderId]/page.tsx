"use client"

import { useState } from "react"
import { Star, Upload, X, Truck, Package, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"

const orderData = {
  product: { name: "Samsung Galaxy S24 Ultra 256GB", image: "/placeholder.svg?height=80&width=80" },
  shop: "Tech World Electronics"
}

export default function ReviewPage() {
  const [productRating, setProductRating] = useState(0)
  const [productReview, setProductReview] = useState("")
  const [deliveryRating, setDeliveryRating] = useState(0)
  const [packagingRating, setPackagingRating] = useState(0)
  const [staffRating, setStaffRating] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = () => {
    const newImage = `/placeholder.svg?height=100&width=100&text=Photo${uploadedImages.length + 1}`
    setUploadedImages(prev => [...prev, newImage])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => { window.location.href = "/home" }, 1500)
  }

  const StarRating = ({ rating, setRating, size = "default" }: { rating: number; setRating: (r: number) => void; size?: "default" | "small" }) => (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform active:scale-110">
          <Star className={`${size === "small" ? "w-6 h-6" : "w-8 h-8"} ${star <= rating ? "fill-[#FFD700] text-[#FFD700]" : "text-[#E0E0E0]"}`} />
        </button>
      ))}
    </div>
  )

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-8">
        <MobileHeader title="⭐ Write a Review" backHref="/home" />

        <div className="px-4 py-5 space-y-6">
          {/* Product Info */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <img src={orderData.product.image} alt={orderData.product.name} className="w-full h-full object-contain p-2" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-[#212121] line-clamp-2">{orderData.product.name}</h3>
                  <p className="text-[13px] text-[#878787] mt-1">from 🏪 {orderData.shop}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Review */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-5">
              <h3 className="font-bold text-[15px] text-[#212121] mb-5">📱 Product Review</h3>
              
              <div className="text-center mb-5">
                <p className="text-[13px] text-[#878787] mb-3">How would you rate this product?</p>
                <div className="flex justify-center">
                  <StarRating rating={productRating} setRating={setProductRating} />
                </div>
                {productRating > 0 && (
                  <p className="text-[13px] text-[#2874F0] mt-3 font-semibold">
                    {productRating === 5 ? "🎉 Excellent!" : productRating === 4 ? "👍 Very Good!" : productRating === 3 ? "👌 Good" : productRating === 2 ? "😐 Fair" : "👎 Poor"}
                  </p>
                )}
              </div>

              <Textarea 
                placeholder="Share your experience with this product..."
                value={productReview}
                onChange={(e) => setProductReview(e.target.value)}
                className="min-h-[100px] border-2 border-[#E0E0E0] focus:border-[#2874F0] resize-none text-[15px] rounded-2xl p-4"
              />
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-5">
              <h3 className="font-bold text-[15px] text-[#212121] mb-5">📸 Add Photos (Optional)</h3>
              
              <div className="flex gap-3 flex-wrap">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-2xl" />
                    <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6161] text-white rounded-full flex items-center justify-center shadow-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {uploadedImages.length < 4 && (
                  <button onClick={handleImageUpload} className="w-20 h-20 border-2 border-dashed border-[#2874F0]/30 rounded-2xl flex flex-col items-center justify-center text-[#2874F0] active:border-[#2874F0] active:bg-[#2874F0]/5">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-[11px] font-semibold">Upload</span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Review */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="p-5">
              <h3 className="font-bold text-[15px] text-[#212121] mb-5">🛠️ Service Review</h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2874F0]/10 rounded-xl flex items-center justify-center">
                      <span className="text-lg">🚚</span>
                    </div>
                    <span className="text-[13px] text-[#212121] font-medium">Delivery Speed</span>
                  </div>
                  <StarRating rating={deliveryRating} setRating={setDeliveryRating} size="small" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2874F0]/10 rounded-xl flex items-center justify-center">
                      <span className="text-lg">📦</span>
                    </div>
                    <span className="text-[13px] text-[#212121] font-medium">Packaging Quality</span>
                  </div>
                  <StarRating rating={packagingRating} setRating={setPackagingRating} size="small" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2874F0]/10 rounded-xl flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <span className="text-[13px] text-[#212121] font-medium">Staff Behaviour</span>
                  </div>
                  <StarRating rating={staffRating} setRating={setStaffRating} size="small" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={productRating === 0 || isSubmitting}
            className="w-full bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold h-[52px] text-[15px] disabled:opacity-50 rounded-2xl"
          >
            {isSubmitting ? "Submitting..." : "✅ Submit Review"}
          </Button>
        </div>
      </div>
    </MobileShell>
  )
}
