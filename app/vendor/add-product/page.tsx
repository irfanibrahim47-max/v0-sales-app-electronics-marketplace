"use client"

import { useState } from "react"
import { Camera, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import Link from "next/link"

const categories = [
  "Mobile Phones",
  "Televisions",
  "Laptops",
  "Air Conditioners",
  "Refrigerators",
  "Washing Machines",
  "Audio",
  "Cameras",
  "Accessories",
]

export default function AddProductPage() {
  const [images, setImages] = useState<string[]>([])
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [mrp, setMrp] = useState("")
  const [yourPrice, setYourPrice] = useState("")
  const [stock, setStock] = useState("")
  const [description, setDescription] = useState("")
  const [deliveryAvailable, setDeliveryAvailable] = useState(true)
  const [emiAvailable, setEmiAvailable] = useState(false)
  const [warranty, setWarranty] = useState("")

  const handleImageUpload = () => {
    // Simulate image upload
    if (images.length < 4) {
      setImages([...images, `/placeholder.svg?height=200&width=200&text=Image${images.length + 1}`])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <MobileShell>
      <MobileHeader title="Add Product" backHref="/vendor/dashboard" />
      
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[100px]">
        <div className="px-4 py-4 space-y-4">
          {/* Photo Upload */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
            <CardContent className="p-4">
              <Label className="text-[15px] font-semibold text-[#212121] mb-3 block">Product Photos</Label>
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-xl overflow-hidden bg-[#F1F3F6]">
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <X className="w-3 h-3 text-[#FF6161]" />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <button
                    onClick={handleImageUpload}
                    className="aspect-square border-2 border-dashed border-[#878787] rounded-xl flex flex-col items-center justify-center gap-1 active:bg-[#F1F3F6] transition-colors"
                  >
                    <Camera className="w-6 h-6 text-[#878787]" />
                    <span className="text-[10px] text-[#878787]">Add</span>
                  </button>
                )}
                {Array.from({ length: Math.max(0, 3 - images.length) }).map((_, index) => (
                  <div key={`placeholder-${index}`} className="aspect-square border-2 border-dashed border-[#E0E0E0] rounded-xl" />
                ))}
              </div>
              <p className="text-[11px] text-[#878787] mt-2">Add up to 4 photos. First photo will be the cover.</p>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="name" className="text-[13px] font-medium text-[#212121] mb-2 block">Product Name</Label>
                <Input
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Samsung Galaxy S24 Ultra 256GB"
                  className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-[13px] font-medium text-[#212121] mb-2 block">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brand" className="text-[13px] font-medium text-[#212121] mb-2 block">Brand</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g., Samsung"
                  className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="mrp" className="text-[13px] font-medium text-[#212121] mb-2 block">MRP (Rs.)</Label>
                  <Input
                    id="mrp"
                    type="number"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="129999"
                    className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]"
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-[13px] font-medium text-[#212121] mb-2 block">Your Price (Rs.)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={yourPrice}
                    onChange={(e) => setYourPrice(e.target.value)}
                    placeholder="124999"
                    className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stock" className="text-[13px] font-medium text-[#212121] mb-2 block">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-[13px] font-medium text-[#212121] mb-2 block">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product features, specifications, etc."
                  className="min-h-[100px] rounded-xl border-[#E0E0E0] text-[15px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-medium text-[#212121]">Delivery Available</p>
                  <p className="text-[11px] text-[#878787]">Can you deliver this product?</p>
                </div>
                <Switch
                  checked={deliveryAvailable}
                  onCheckedChange={setDeliveryAvailable}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-medium text-[#212121]">EMI Available</p>
                  <p className="text-[11px] text-[#878787]">Offer EMI payment option</p>
                </div>
                <Switch
                  checked={emiAvailable}
                  onCheckedChange={setEmiAvailable}
                />
              </div>

              <div>
                <Label htmlFor="warranty" className="text-[13px] font-medium text-[#212121] mb-2 block">Warranty</Label>
                <Input
                  id="warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="e.g., 1 Year Manufacturer Warranty"
                  className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-4 z-50 pb-[26px] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <Button className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white text-[15px] font-semibold rounded-2xl gap-2">
          <Plus className="w-5 h-5" />
          Publish Product
        </Button>
      </div>
    </MobileShell>
  )
}
