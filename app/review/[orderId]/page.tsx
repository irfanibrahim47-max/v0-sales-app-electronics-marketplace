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
                ? "fill-yellow-400 text-yellow-400" 
                : "text-border hover:text-yellow-400/50"
            }`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/home" className="p-1">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Write a Review</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Product Info */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-secondary/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                <img 
                  src={orderData.product.image} 
                  alt={orderData.product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground line-clamp-2">
                  {orderData.product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  from {orderData.shop}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Review */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Product Review</h3>
            
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                How would you rate this product?
              </p>
              <div className="flex justify-center">
                <StarRating rating={productRating} setRating={setProductRating} />
              </div>
              {productRating > 0 && (
                <p className="text-sm text-primary mt-2 font-medium">
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
              className="min-h-[100px] border-2 focus:border-primary resize-none"
            />
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Add Photos (Optional)</h3>
            
            <div className="flex gap-3 flex-wrap">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img 
                    src={image} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button 
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {uploadedImages.length < 4 && (
                <button 
                  onClick={handleImageUpload}
                  className="w-20 h-20 border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center text-primary hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">Upload</span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Review */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Service Review</h3>
            
            <div className="space-y-4">
              {/* Delivery Speed */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Delivery Speed</span>
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
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Packaging Quality</span>
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
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">Staff Behaviour</span>
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
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  )
}
