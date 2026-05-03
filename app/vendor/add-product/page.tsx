"use client"

import { useState, useEffect } from "react"
import { Camera, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MobileShell } from "@/components/mobile-shell"
import { MobileHeader } from "@/components/mobile-header"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [productName, setProductName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [brandId, setBrandId] = useState("")
  const [mrp, setMrp] = useState("")
  const [yourPrice, setYourPrice] = useState("")
  const [stock, setStock] = useState("")
  const [description, setDescription] = useState("")
  const [deliveryAvailable, setDeliveryAvailable] = useState(true)
  const [emiAvailable, setEmiAvailable] = useState(false)
  const [warranty, setWarranty] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [shopId, setShopId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      const [{ data: cats }, { data: brnds }] = await Promise.all([
        supabase.from("categories").select("id, name").order("display_order"),
        supabase.from("brands").select("id, name").order("name")
      ])
      setCategories(cats || [])
      setBrands(brnds || [])
      if (user) {
        const { data: shop } = await supabase
          .from("shops").select("id").eq("owner_id", user.id).single()
        if (shop) setShopId(shop.id)
      }
    }
    loadData()
  }, [user])

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.slice(0, 4 - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handlePublish = async () => {
    if (!productName || !categoryId || !yourPrice || !shopId) {
      setError("Please fill in all required fields")
      return
    }
    setLoading(true)
    setError("")
    try {
      // Upload images to Supabase storage
      const imageUrls: string[] = []
      for (const img of images) {
        const fileName = `${Date.now()}-${img.file.name}`
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(fileName, img.file)
        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from("product-images").getPublicUrl(data.path)
          imageUrls.push(urlData.publicUrl)
        }
      }

      // Insert product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
          name: productName,
          category_id: categoryId || null,
          brand_id: brandId || null,
          description,
          images: imageUrls
        })
        .select()
        .single()
      if (productError) throw productError

      // Insert shop_product
      const { error: spError } = await supabase
        .from("shop_products")
        .insert({
          shop_id: shopId,
          product_id: product.id,
          price: parseInt(yourPrice),
          mrp: mrp ? parseInt(mrp) : null,
          in_stock: true,
          stock_quantity: stock ? parseInt(stock) : 0,
          delivery_available: deliveryAvailable,
          emi_available: emiAvailable,
          warranty_months: warranty ? parseInt(warranty) : null
        })
      if (spError) throw spError

      router.push("/vendor/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to publish product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MobileShell>
      <MobileHeader title="Add Product" backHref="/vendor/dashboard" />
      <div className="h-full overflow-y-auto bg-[#F1F3F6] pb-[100px]">
        <div className="px-4 py-4 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-600">{error}</div>
          )}

          {/* Photo Upload */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
            <CardContent className="p-4">
              <Label className="text-[15px] font-semibold text-[#212121] mb-3 block">Product Photos</Label>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="aspect-square relative rounded-xl overflow-hidden bg-[#F1F3F6]">
                    <img src={img.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <X className="w-3 h-3 text-[#FF6161]" />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square border-2 border-dashed border-[#878787] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer active:bg-[#F1F3F6]">
                    <Camera className="w-6 h-6 text-[#878787]" />
                    <span className="text-[10px] text-[#878787]">Add</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagePick} />
                  </label>
                )}
                {Array.from({ length: Math.max(0, 3 - images.length) }).map((_, i) => (
                  <div key={`ph-${i}`} className="aspect-square border-2 border-dashed border-[#E0E0E0] rounded-xl" />
                ))}
              </div>
              <p className="text-[11px] text-[#878787] mt-2">Add up to 4 photos. First photo will be the cover.</p>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-2xl">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-[13px] font-medium text-[#212121] mb-2 block">Product Name *</Label>
                <Input value={productName} onChange={e => setProductName(e.target.value)}
                  placeholder="e.g., Samsung Galaxy S24 Ultra 256GB"
                  className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]" />
              </div>
              <div>
                <Label className="text-[13px] font-medium text-[#212121] mb-2 block">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[13px] font-medium text-[#212121] mb-2 block">Brand</Label>
                <Select value={brandId} onValueChange={setBrandId}>
                  <SelectTrigger className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[13px] font-medium text-[#212121] mb-2 block">MRP (₹)</Label>
                  <Input type="number" value={mrp} onChange={e => setMrp(e.target.value)}
                    placeholder="129999" className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]" />
                </div>
                <div>
                  <Label className="text-[13px] font-medium text-[#212121] mb-2 block">Your Price (₹) *</Label>
                  <Input type="number" value={yourPrice} onChange={e => setYourPrice(e.target.value)}
                    placeholder="124999" className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]" />
                </div>
              </div>
              <div>
                <Label className="text-[13px] font-medium text-[#212121] mb-2 block">Stock Quantity</Label>
                <Input type="number" value={stock} onChange={e => setStock(e.target.value)}
                  placeholder="10" className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]" />
              </div>
              <div>
                <Label className="text-[13px] font-medium text-[#212121] mb-2 block">Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  className="min-h-[100px] rounded-xl border-[#E0E0E0] text-[15px] resize-none" />
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
                <Switch checked={deliveryAvailable} onCheckedChange={setDeliveryAvailable} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-medium text-[#212121]">EMI Available</p>
                  <p className="text-[11px] text-[#878787]">Offer EMI payment option</p>
                </div>
                <Switch checked={emiAvailable} onCheckedChange={setEmiAvailable} />
              </div>
              <div>
                <Label className="text-[13px] font-medium text-[#212121] mb-2 block">Warranty (months)</Label>
                <Input type="number" value={warranty} onChange={e => setWarranty(e.target.value)}
                  placeholder="12" className="h-[52px] rounded-xl border-[#E0E0E0] text-[15px]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] px-4 py-4 z-50 pb-[26px] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <Button onClick={handlePublish} disabled={loading}
          className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[15px] font-semibold rounded-2xl gap-2 disabled:opacity-60">
          <Plus className="w-5 h-5" />
          {loading ? "Publishing..." : "Publish Product"}
        </Button>
      </div>
    </MobileShell>
  )
}