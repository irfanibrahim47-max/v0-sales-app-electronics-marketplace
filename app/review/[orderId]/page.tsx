"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  Star,
  Upload,
  X,
  Package,
  Truck,
  UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

const orderData = {
  product: {
    name: "Samsung Galaxy S24 Ultra 256GB",
    image: "/placeholder.svg?height=80&width=80",
  },
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
    // Simulate image upload
    const newImage = `/placeholder.svg?height=100&width=100&text=Photo${uploadedImages.length + 1}`
    setUploadedImages(prev => [...prev, newImage])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      window.location.href = "/home"
    }, 1500)
  }

  const StarRating = ({ 
    rating, 
    setRating, 
    size = "default" 
  }: { 
    rating: number
    setRating: (r: number) => void
    size?: "default" | "small"
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star 
            className={`${size === "small" ? "w-6 h-6" : "w-8 h-8"} ${
              star <= rating 
                ? "fill-[#FFD700] text-[#FFD700]" 
                : "text-[#E0E0E0] hover:text-[#FFD700]/50"
            }`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F1F3F6] pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/home" className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#212121]" />
          </Link>
          <h1 className="text-lg font-semibold text-[#212121] font-[family-name:var(--font-heading)]">Write a Review</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Product Info */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-white rounded-sm flex-shrink-0 flex items-center justify-center">
                <img 
                  src={orderData.product.image} 
                  alt={orderData.product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div>
                <h3 className="font-medium text-[#212121] line-clamp-2">
                  {orderData.product.name}
                </h3>
                <p className="text-sm text-[#878787] mt-1">
                  from {orderData.shop}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Review */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#212121] mb-4 font-[family-name:var(--font-heading)]">Product Review</h3>
            
            <div className="text-center mb-4">
              <p className="text-sm text-[#878787] mb-2">
                How would you rate this product?
              </p>
              <div className="flex justify-center">
                <StarRating rating={productRating} setRating={setProductRating} />
              </div>
              {productRating > 0 && (
                <p className="text-sm text-[#2874F0] mt-2 font-medium">
                  {productRating === 5 ? "Excellent!" : 
                   productRating === 4 ? "Very Good!" : 
                   productRating === 3 ? "Good" : 
                   productRating === 2 ? "Fair" : "Poor"}
                </p>
              )}
            </div>

            <Textarea 
              placeholder="Share your experience with this product..."
              value={productReview}
              onChange={(e) => setProductReview(e.target.value)}
              className="min-h-[100px] border-2 border-[#E0E0E0] focus:border-[#2874F0] resize-none"
            />
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#212121] mb-4 font-[family-name:var(--font-heading)]">Add Photos (Optional)</h3>
            
            <div className="flex gap-3 flex-wrap">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img 
                    src={image} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-sm"
                  />
                  <button 
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF6161] text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {uploadedImages.length < 4 && (
                <button 
                  onClick={handleImageUpload}
                  className="w-20 h-20 border-2 border-dashed border-[#2874F0]/30 rounded-sm flex flex-col items-center justify-center text-[#2874F0] hover:border-[#2874F0] hover:bg-[#2874F0]/5 transition-colors"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">Upload</span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Review */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <h3 className="font-semibold text-[#212121] mb-4 font-[family-name:var(--font-heading)]">Service Review</h3>
            
            <div className="space-y-4">
              {/* Delivery Speed */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2874F0]/10 rounded-sm flex items-center justify-center">
                    <Truck className="w-4 h-4 text-[#2874F0]" />
                  </div>
                  <span className="text-sm text-[#212121]">Delivery Speed</span>
                </div>
                <StarRating 
                  rating={deliveryRating} 
                  setRating={setDeliveryRating} 
                  size="small"
                />
              </div>

              {/* Packaging */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2874F0]/10 rounded-sm flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#2874F0]" />
                  </div>
                  <span className="text-sm text-[#212121]">Packaging Quality</span>
                </div>
                <StarRating 
                  rating={packagingRating} 
                  setRating={setPackagingRating} 
                  size="small"
                />
              </div>

              {/* Staff Behaviour */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2874F0]/10 rounded-sm flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-[#2874F0]" />
                  </div>
                  <span className="text-sm text-[#212121]">Staff Behaviour</span>
                </div>
                <StarRating 
                  rating={staffRating} 
                  setRating={setStaffRating} 
                  size="small"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={productRating === 0 || isSubmitting}
          className="w-full bg-[#2874F0] hover:bg-[#2874F0]/90 text-white font-medium h-12 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  )
}
