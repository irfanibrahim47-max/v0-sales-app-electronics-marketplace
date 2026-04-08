"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Check, Camera, Upload, Eye, EyeOff, 
  Building2, FileText, CreditCard, ChevronDown, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { MobileShell } from "@/components/mobile-shell"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh"
]

const SHOP_CATEGORIES = [
  "Electronics", "Mobile & Accessories", "Computers & Laptops",
  "Home Appliances", "Audio & TV", "Multi-brand Store"
]

const BUSINESS_YEARS = ["< 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"]
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const TIMES = Array.from({ length: 35 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6
  const minute = i % 2 === 0 ? "00" : "30"
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minute} ${ampm}`
})

const DOCUMENT_TYPES = [
  { id: "udyam", label: "Udyam Registration (MSME)", emoji: "🏢", recommended: true },
  { id: "shop", label: "Shop & Establishment Certificate", emoji: "📄" },
  { id: "trade", label: "Trade License", emoji: "🏛️" },
  { id: "partnership", label: "Partnership Deed", emoji: "📋" },
]

const GST_EXEMPT_REASONS = [
  "Composition Scheme",
  "Below Threshold",
  "Agriculture/Exempt",
  "Other"
]

interface FormData {
  // Step 1 - Shop Info
  shopName: string
  shopCategory: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  yearsInBusiness: string
  opensAt: string
  closesAt: string
  daysOpen: string[]
  shopPhone: string
  shopDescription: string
  shopPhotos: string[]
  
  // Step 2 - Documents
  hasGst: boolean
  gstNumber: string
  gstVerified: boolean
  gstCertificate: string | null
  gstExemptReason: string
  documentType: string
  documentNumber: string
  documentFile: string | null
  aadhaarNumber: string
  panNumber: string
  panVerified: boolean
  panCard: string | null
  ownerSelfie: string | null
  
  // Step 3 - Bank
  accountHolderName: string
  accountNumber: string
  confirmAccountNumber: string
  ifscCode: string
  ifscVerified: boolean
  bankName: string
  branchName: string
  accountType: string
  chequeOrPassbook: string | null
  upiId: string
  upiVerified: boolean
  
  // Agreements
  agreementDocs: boolean
  agreementTerms: boolean
  agreementVerification: boolean
}

export default function VendorRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeUploadField, setActiveUploadField] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    shopName: "",
    shopCategory: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    yearsInBusiness: "",
    opensAt: "9:00 AM",
    closesAt: "9:00 PM",
    daysOpen: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    shopPhone: "",
    shopDescription: "",
    shopPhotos: [],
    hasGst: true,
    gstNumber: "",
    gstVerified: false,
    gstCertificate: null,
    gstExemptReason: "",
    documentType: "udyam",
    documentNumber: "",
    documentFile: null,
    aadhaarNumber: "",
    panNumber: "",
    panVerified: false,
    panCard: null,
    ownerSelfie: null,
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    ifscVerified: false,
    bankName: "",
    branchName: "",
    accountType: "current",
    chequeOrPassbook: null,
    upiId: "",
    upiVerified: false,
    agreementDocs: false,
    agreementTerms: false,
    agreementVerification: false,
  })

  const updateForm = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePincodeBlur = () => {
    if (formData.pincode.length === 6) {
      updateForm("city", "Thrissur")
      updateForm("state", "Kerala")
    }
  }

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12)
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  const formatPan = (value: string) => {
    return value.toUpperCase().slice(0, 10)
  }

  const verifyGst = () => {
    if (formData.gstNumber.length === 15) {
      updateForm("gstVerified", true)
    }
  }

  const verifyPan = () => {
    if (formData.panNumber.length === 10) {
      updateForm("panVerified", true)
    }
  }

  const verifyIfsc = () => {
    if (formData.ifscCode.length === 11) {
      updateForm("ifscVerified", true)
      updateForm("bankName", "State Bank of India")
      updateForm("branchName", "Thrissur Main Branch")
    }
  }

  const verifyUpi = () => {
    if (formData.upiId.includes("@")) {
      updateForm("upiVerified", true)
    }
  }

  const handleFileUpload = (field: string) => {
    setActiveUploadField(field)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && activeUploadField) {
      const reader = new FileReader()
      reader.onload = () => {
        if (activeUploadField === "shopPhotos") {
          updateForm("shopPhotos", [...formData.shopPhotos, reader.result as string])
        } else {
          updateForm(activeUploadField as keyof FormData, reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ""
    setActiveUploadField(null)
  }

  const removeShopPhoto = (index: number) => {
    updateForm("shopPhotos", formData.shopPhotos.filter((_, i) => i !== index))
  }

  const toggleDay = (day: string) => {
    if (formData.daysOpen.includes(day)) {
      updateForm("daysOpen", formData.daysOpen.filter(d => d !== day))
    } else {
      updateForm("daysOpen", [...formData.daysOpen, day])
    }
  }

  const steps = [
    { id: 1, label: "Shop Info", icon: Building2 },
    { id: 2, label: "Documents", icon: FileText },
    { id: 3, label: "Bank Details", icon: CreditCard },
  ]

  const canContinueStep1 = formData.shopName && formData.shopCategory && 
    formData.addressLine1 && formData.city && formData.state && 
    formData.pincode && formData.yearsInBusiness && formData.shopPhone

  const canContinueStep2 = (formData.hasGst ? formData.gstNumber : formData.gstExemptReason) &&
    formData.documentNumber && formData.aadhaarNumber && formData.panNumber

  const canSubmit = formData.accountHolderName && formData.accountNumber &&
    formData.confirmAccountNumber && formData.accountNumber === formData.confirmAccountNumber &&
    formData.ifscCode && formData.accountType &&
    formData.agreementDocs && formData.agreementTerms && formData.agreementVerification

  const handleSubmit = () => {
    setCurrentStep(4)
  }

  // Bottom sheet dropdown component
  const BottomSheet = ({ 
    isOpen, 
    onClose, 
    title, 
    options, 
    value, 
    onChange 
  }: { 
    isOpen: boolean
    onClose: () => void
    title: string
    options: string[]
    value: string
    onChange: (v: string) => void
  }) => {
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 z-50" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50" />
        <div 
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-[#E0E0E0] p-4">
            <div className="w-12 h-1.5 bg-[#E0E0E0] rounded-full mx-auto mb-3" />
            <h3 className="text-[17px] font-bold text-[#212121] text-center">{title}</h3>
          </div>
          <div className="overflow-y-auto max-h-[60vh] pb-8">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => { onChange(option); onClose() }}
                className={`w-full px-5 py-4 text-left text-[15px] border-b border-[#F1F3F6] active:bg-[#F1F3F6] flex items-center justify-between ${
                  value === option ? "text-[#2874F0] font-semibold bg-[#2874F0]/5" : "text-[#212121]"
                }`}
              >
                {option}
                {value === option && <Check className="w-5 h-5 text-[#2874F0]" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Success screen (Step 4)
  if (currentStep === 4) {
    return (
      <MobileShell>
        <div className="h-full overflow-y-auto bg-[#F1F3F6] pt-[34px]">
          <div className="flex flex-col items-center justify-center min-h-[calc(100%-34px)] px-5 py-8">
            {/* Animated Checkmark */}
            <div className="w-24 h-24 bg-[#388E3C] rounded-full flex items-center justify-center mb-6 animate-[scale-in_0.3s_ease-out]">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>

            <h1 className="text-[24px] font-bold text-[#212121] mb-2">
              Application Submitted!
            </h1>
            <p className="text-[15px] text-[#878787] mb-8">
              Your shop verification is in progress
            </p>

            {/* What happens next */}
            <Card className="w-full border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl mb-6">
              <CardContent className="p-5">
                <h3 className="text-[15px] font-bold text-[#212121] mb-4">What happens next:</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, emoji: "✅", text: "Application received", status: "Done" },
                    { step: 2, emoji: "🔍", text: "Document verification", status: "24-48 hours" },
                    { step: 3, emoji: "📞", text: "Our team may call you", status: "If needed" },
                    { step: 4, emoji: "🏪", text: "Shop goes live", status: "After approval" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <span className="text-xl">{item.emoji}</span>
                      <div className="flex-1">
                        <p className="text-[13px] text-[#212121]">{item.text}</p>
                      </div>
                      <span className={`text-[11px] font-medium ${item.step === 1 ? "text-[#388E3C]" : "text-[#878787]"}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline badge */}
            <div className="bg-[#2874F0]/10 text-[#2874F0] px-4 py-2 rounded-full text-[13px] font-semibold mb-8">
              Usually within 48 hours
            </div>

            {/* Buttons */}
            <div className="w-full space-y-3">
              <Button
                onClick={() => router.push("/vendor/dashboard")}
                className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white text-[15px] font-semibold rounded-2xl"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/shop/preview")}
                className="w-full h-[52px] border-2 border-[#2874F0] text-[#2874F0] text-[15px] font-semibold rounded-2xl"
              >
                Preview My Shop Profile
              </Button>
            </div>

            <p className="text-[12px] text-[#878787] mt-6">
              Questions? WhatsApp us at +91 98765 43210
            </p>
          </div>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className="h-full flex flex-col bg-[#F1F3F6]">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Header with Progress */}
        <header className="sticky top-0 z-40 bg-white pt-[34px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center px-4 py-3 h-[56px]">
            <button 
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
              className="p-2 -ml-2 active:bg-[#F1F3F6] rounded-xl"
            >
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <h1 className="flex-1 text-center text-[17px] font-bold text-[#212121]">
              Vendor Registration
            </h1>
            <div className="w-10" />
          </div>

          {/* Progress Steps */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      currentStep > step.id 
                        ? "bg-[#2874F0]" 
                        : currentStep === step.id 
                          ? "bg-[#2874F0]" 
                          : "bg-[#E0E0E0]"
                    }`}>
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <step.icon className={`w-5 h-5 ${currentStep === step.id ? "text-white" : "text-[#878787]"}`} />
                      )}
                    </div>
                    <span className={`text-[10px] mt-1.5 font-medium ${
                      currentStep >= step.id ? "text-[#2874F0]" : "text-[#878787]"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-1 rounded-full ${
                      currentStep > step.id ? "bg-[#2874F0]" : "bg-[#E0E0E0]"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-[12px] text-[#878787] mt-3">
              Step {currentStep} of 3
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-32">
          {/* STEP 1 - Shop Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="mb-2">
                <h2 className="text-[20px] font-bold text-[#212121]">Tell us about your shop</h2>
                <p className="text-[13px] text-[#878787]">This will be shown to customers on your profile</p>
              </div>

              {/* Shop Name */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Shop Name *</label>
                <Input
                  value={formData.shopName}
                  onChange={(e) => updateForm("shopName", e.target.value)}
                  placeholder="e.g. Tech World Electronics"
                  className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                />
              </div>

              {/* Shop Category */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Shop Category *</label>
                <button
                  onClick={() => setShowDropdown("category")}
                  className="w-full h-[52px] border-2 border-[#E0E0E0] rounded-2xl px-4 text-left flex items-center justify-between"
                >
                  <span className={formData.shopCategory ? "text-[#212121] text-[15px]" : "text-[#878787] text-[15px]"}>
                    {formData.shopCategory || "Select category"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-[#878787]" />
                </button>
              </div>

              {/* Address */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Shop Address Line 1 *</label>
                <Input
                  value={formData.addressLine1}
                  onChange={(e) => updateForm("addressLine1", e.target.value)}
                  placeholder="Shop no, Building name"
                  className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Shop Address Line 2</label>
                <Input
                  value={formData.addressLine2}
                  onChange={(e) => updateForm("addressLine2", e.target.value)}
                  placeholder="Street, Area, Locality"
                  className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                />
              </div>

              {/* Pincode, City, State */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Pincode *</label>
                <Input
                  value={formData.pincode}
                  onChange={(e) => updateForm("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onBlur={handlePincodeBlur}
                  placeholder="6 digit pincode"
                  className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-medium text-[#212121] mb-2 block">City *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    placeholder="e.g. Thrissur"
                    className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-[#212121] mb-2 block">State *</label>
                  <button
                    onClick={() => setShowDropdown("state")}
                    className="w-full h-[52px] border-2 border-[#E0E0E0] rounded-2xl px-4 text-left flex items-center justify-between"
                  >
                    <span className={formData.state ? "text-[#212121] text-[14px]" : "text-[#878787] text-[14px]"}>
                      {formData.state || "Select"}
                    </span>
                    <ChevronDown className="w-5 h-5 text-[#878787]" />
                  </button>
                </div>
              </div>

              {/* Years in Business */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Years in Business *</label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_YEARS.map((year) => (
                    <button
                      key={year}
                      onClick={() => updateForm("yearsInBusiness", year)}
                      className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium transition-colors ${
                        formData.yearsInBusiness === year
                          ? "bg-[#2874F0] text-white"
                          : "bg-white border-2 border-[#E0E0E0] text-[#212121] active:bg-[#F1F3F6]"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shop Timings */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Shop Timings</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDropdown("opensAt")}
                    className="flex-1 h-[52px] border-2 border-[#E0E0E0] rounded-2xl px-4 text-left flex items-center justify-between"
                  >
                    <span className="text-[14px] text-[#212121]">{formData.opensAt}</span>
                    <ChevronDown className="w-4 h-4 text-[#878787]" />
                  </button>
                  <span className="text-[#878787]">to</span>
                  <button
                    onClick={() => setShowDropdown("closesAt")}
                    className="flex-1 h-[52px] border-2 border-[#E0E0E0] rounded-2xl px-4 text-left flex items-center justify-between"
                  >
                    <span className="text-[14px] text-[#212121]">{formData.closesAt}</span>
                    <ChevronDown className="w-4 h-4 text-[#878787]" />
                  </button>
                </div>
              </div>

              {/* Days Open */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Days Open</label>
                <div className="flex gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-colors ${
                        formData.daysOpen.includes(day)
                          ? "bg-[#2874F0] text-white"
                          : "bg-white border-2 border-[#E0E0E0] text-[#878787]"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shop Phone */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Shop Phone Number *</label>
                <Input
                  value={formData.shopPhone}
                  onChange={(e) => updateForm("shopPhone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="+91 XXXXX XXXXX"
                  className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                />
                <p className="text-[11px] text-[#878787] mt-1">Customers will use this to contact you</p>
              </div>

              {/* Shop Description */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Shop Description</label>
                <Textarea
                  value={formData.shopDescription}
                  onChange={(e) => updateForm("shopDescription", e.target.value.slice(0, 200))}
                  placeholder="Tell customers what makes your shop special..."
                  rows={3}
                  className="border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 py-3 text-[15px] resize-none"
                />
                <p className="text-[11px] text-[#878787] mt-1 text-right">{formData.shopDescription.length}/200</p>
              </div>

              {/* Shop Photos */}
              <div>
                <label className="text-[13px] font-medium text-[#212121] mb-2 block">Upload Shop Photos (optional)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="relative">
                      {formData.shopPhotos[index] ? (
                        <div className="aspect-square rounded-2xl overflow-hidden relative">
                          <img src={formData.shopPhotos[index]} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeShopPhoto(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleFileUpload("shopPhotos")}
                          className="aspect-square border-2 border-dashed border-[#E0E0E0] rounded-2xl flex flex-col items-center justify-center active:bg-[#F1F3F6]"
                        >
                          <Camera className="w-6 h-6 text-[#878787] mb-1" />
                          <span className="text-[10px] text-[#878787]">Add Photo</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 - Business Documents */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="mb-2">
                <h2 className="text-[20px] font-bold text-[#212121]">Business Verification</h2>
                <p className="text-[13px] text-[#878787]">Required for legal compliance in India. Your data is encrypted and secure.</p>
              </div>

              {/* Info Banner */}
              <div className="bg-[#2874F0]/10 border-l-4 border-[#2874F0] p-4 rounded-r-2xl">
                <p className="text-[13px] text-[#212121]">
                  <strong>Why do we need this?</strong> To ensure all shops on SalesApp are legitimate businesses and to enable payments to your account.
                </p>
              </div>

              {/* Section A - GST */}
              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                <CardContent className="p-4">
                  <h3 className="text-[15px] font-bold text-[#212121] mb-4">GST Details</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] text-[#212121]">I have a GST number</span>
                    <Switch
                      checked={formData.hasGst}
                      onCheckedChange={(checked) => updateForm("hasGst", checked)}
                    />
                  </div>

                  {formData.hasGst ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[12px] text-[#878787] mb-1.5 block">GSTIN Number *</label>
                        <div className="flex gap-2">
                          <Input
                            value={formData.gstNumber}
                            onChange={(e) => updateForm("gstNumber", e.target.value.toUpperCase().slice(0, 15))}
                            placeholder="22AAAAA0000A1Z5"
                            className={`flex-1 h-[52px] border-2 rounded-2xl px-4 text-[15px] ${
                              formData.gstVerified ? "border-[#388E3C] bg-[#388E3C]/5" : "border-[#E0E0E0] focus:border-[#2874F0]"
                            }`}
                          />
                          {formData.gstVerified ? (
                            <div className="w-[52px] h-[52px] bg-[#388E3C] rounded-2xl flex items-center justify-center">
                              <Check className="w-6 h-6 text-white" />
                            </div>
                          ) : (
                            <Button
                              onClick={verifyGst}
                              className="h-[52px] px-4 bg-[#2874F0] text-white rounded-2xl text-[13px] font-semibold"
                            >
                              Verify
                            </Button>
                          )}
                        </div>
                        <p className="text-[10px] text-[#878787] mt-1">15 character alphanumeric</p>
                      </div>

                      <div>
                        <label className="text-[12px] text-[#878787] mb-1.5 block">GST Registration Certificate</label>
                        {formData.gstCertificate ? (
                          <div className="flex items-center gap-3 p-3 bg-[#F1F3F6] rounded-2xl">
                            <FileText className="w-8 h-8 text-[#2874F0]" />
                            <span className="flex-1 text-[13px] text-[#212121]">Certificate uploaded</span>
                            <button onClick={() => updateForm("gstCertificate", null)}>
                              <X className="w-5 h-5 text-[#878787]" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleFileUpload("gstCertificate")}
                            className="w-full h-24 border-2 border-dashed border-[#E0E0E0] rounded-2xl flex flex-col items-center justify-center active:bg-[#F1F3F6]"
                          >
                            <Upload className="w-6 h-6 text-[#878787] mb-1" />
                            <span className="text-[13px] text-[#878787]">Upload PDF or Image</span>
                            <span className="text-[10px] text-[#878787] mt-0.5">Max 5MB - PDF, JPG, PNG</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[12px] text-[#878787]">
                        You can still register without GST if your annual turnover is below 40 lakhs
                      </p>
                      <button
                        onClick={() => setShowDropdown("gstExempt")}
                        className="w-full h-[52px] border-2 border-[#E0E0E0] rounded-2xl px-4 text-left flex items-center justify-between"
                      >
                        <span className={formData.gstExemptReason ? "text-[#212121] text-[15px]" : "text-[#878787] text-[15px]"}>
                          {formData.gstExemptReason || "Select reason"}
                        </span>
                        <ChevronDown className="w-5 h-5 text-[#878787]" />
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Section B - Shop Identity */}
              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                <CardContent className="p-4">
                  <h3 className="text-[15px] font-bold text-[#212121] mb-4">Shop Identity Proof</h3>
                  
                  <div className="space-y-3 mb-4">
                    {DOCUMENT_TYPES.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => updateForm("documentType", doc.id)}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-colors ${
                          formData.documentType === doc.id
                            ? "border-[#2874F0] bg-[#2874F0]/5"
                            : "border-[#E0E0E0] active:bg-[#F1F3F6]"
                        }`}
                      >
                        <span className="text-xl">{doc.emoji}</span>
                        <div className="flex-1">
                          <span className={`text-[13px] ${formData.documentType === doc.id ? "text-[#2874F0] font-semibold" : "text-[#212121]"}`}>
                            {doc.label}
                          </span>
                          {doc.recommended && (
                            <span className="ml-2 text-[10px] text-[#388E3C] font-medium">Recommended</span>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.documentType === doc.id ? "border-[#2874F0] bg-[#2874F0]" : "border-[#E0E0E0]"
                        }`}>
                          {formData.documentType === doc.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[12px] text-[#878787] mb-1.5 block">Document Number *</label>
                      <Input
                        value={formData.documentNumber}
                        onChange={(e) => updateForm("documentNumber", e.target.value)}
                        placeholder="Enter document number"
                        className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                      />
                    </div>

                    <div>
                      <label className="text-[12px] text-[#878787] mb-1.5 block">Upload Document *</label>
                      {formData.documentFile ? (
                        <div className="flex items-center gap-3 p-3 bg-[#F1F3F6] rounded-2xl">
                          <FileText className="w-8 h-8 text-[#2874F0]" />
                          <span className="flex-1 text-[13px] text-[#212121]">Document uploaded</span>
                          <button onClick={() => updateForm("documentFile", null)}>
                            <X className="w-5 h-5 text-[#878787]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleFileUpload("documentFile")}
                          className="w-full h-20 border-2 border-dashed border-[#E0E0E0] rounded-2xl flex flex-col items-center justify-center active:bg-[#F1F3F6]"
                        >
                          <Upload className="w-6 h-6 text-[#878787] mb-1" />
                          <span className="text-[12px] text-[#878787]">Upload PDF or Image</span>
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section C - Owner Identity */}
              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                <CardContent className="p-4">
                  <h3 className="text-[15px] font-bold text-[#212121] mb-4">Owner Identity</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[12px] text-[#878787] mb-1.5 block">Aadhaar Number *</label>
                      <Input
                        value={formData.aadhaarNumber}
                        onChange={(e) => updateForm("aadhaarNumber", formatAadhaar(e.target.value))}
                        placeholder="XXXX XXXX XXXX"
                        className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                      />
                      <p className="text-[10px] text-[#878787] mt-1">Used for KYC verification only</p>
                    </div>

                    <div>
                      <label className="text-[12px] text-[#878787] mb-1.5 block">PAN Number *</label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.panNumber}
                          onChange={(e) => updateForm("panNumber", formatPan(e.target.value))}
                          placeholder="ABCDE1234F"
                          className={`flex-1 h-[52px] border-2 rounded-2xl px-4 text-[15px] uppercase ${
                            formData.panVerified ? "border-[#388E3C] bg-[#388E3C]/5" : "border-[#E0E0E0] focus:border-[#2874F0]"
                          }`}
                        />
                        {formData.panVerified ? (
                          <div className="w-[52px] h-[52px] bg-[#388E3C] rounded-2xl flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        ) : (
                          <Button
                            onClick={verifyPan}
                            className="h-[52px] px-4 bg-[#2874F0] text-white rounded-2xl text-[13px] font-semibold"
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[12px] text-[#878787] mb-1.5 block">Upload PAN Card *</label>
                      {formData.panCard ? (
                        <div className="flex items-center gap-3 p-3 bg-[#F1F3F6] rounded-2xl">
                          <FileText className="w-8 h-8 text-[#2874F0]" />
                          <span className="flex-1 text-[13px] text-[#212121]">PAN card uploaded</span>
                          <button onClick={() => updateForm("panCard", null)}>
                            <X className="w-5 h-5 text-[#878787]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleFileUpload("panCard")}
                          className="w-full h-20 border-2 border-dashed border-[#E0E0E0] rounded-2xl flex flex-col items-center justify-center active:bg-[#F1F3F6]"
                        >
                          <Upload className="w-6 h-6 text-[#878787] mb-1" />
                          <span className="text-[12px] text-[#878787]">Upload PDF or Image</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-[12px] text-[#878787] mb-1.5 block">Owner Selfie with Shop (optional)</label>
                      {formData.ownerSelfie ? (
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
                          <img src={formData.ownerSelfie} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => updateForm("ownerSelfie", null)}
                            className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleFileUpload("ownerSelfie")}
                          className="w-full h-20 border-2 border-dashed border-[#E0E0E0] rounded-2xl flex flex-col items-center justify-center active:bg-[#F1F3F6]"
                        >
                          <Camera className="w-6 h-6 text-[#878787] mb-1" />
                          <span className="text-[12px] text-[#878787]">Take a selfie with your shop</span>
                        </button>
                      )}
                      <p className="text-[10px] text-[#878787] mt-1">Helps build customer trust - shows your verified badge faster</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 3 - Bank Details */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="mb-2">
                <h2 className="text-[20px] font-bold text-[#212121]">Payment Settlement</h2>
                <p className="text-[13px] text-[#878787]">Payments from orders will be settled to this account within 2 business days</p>
              </div>

              {/* Info Banner */}
              <div className="bg-[#388E3C]/10 border-l-4 border-[#388E3C] p-4 rounded-r-2xl">
                <p className="text-[13px] text-[#212121]">
                  Your bank details are encrypted with 256-bit SSL. SalesApp never stores your full account number.
                </p>
              </div>

              {/* Bank Details Card */}
              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-[12px] text-[#878787] mb-1.5 block">Account Holder Name *</label>
                    <Input
                      value={formData.accountHolderName}
                      onChange={(e) => updateForm("accountHolderName", e.target.value)}
                      placeholder="As per bank records"
                      className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 text-[15px]"
                    />
                    <p className="text-[10px] text-[#878787] mt-1">Must match your PAN card name</p>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#878787] mb-1.5 block">Bank Account Number *</label>
                    <div className="relative">
                      <Input
                        type={showAccountNumber ? "text" : "password"}
                        value={formData.accountNumber}
                        onChange={(e) => updateForm("accountNumber", e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter account number"
                        className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl px-4 pr-12 text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#878787]"
                      >
                        {showAccountNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#878787] mb-1.5 block">Confirm Account Number *</label>
                    <Input
                      type="text"
                      value={formData.confirmAccountNumber}
                      onChange={(e) => updateForm("confirmAccountNumber", e.target.value.replace(/\D/g, ""))}
                      placeholder="Re-enter account number"
                      className={`h-[52px] border-2 rounded-2xl px-4 text-[15px] ${
                        formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber
                          ? "border-[#FF6161] bg-[#FF6161]/5"
                          : formData.confirmAccountNumber && formData.accountNumber === formData.confirmAccountNumber
                            ? "border-[#388E3C] bg-[#388E3C]/5"
                            : "border-[#E0E0E0] focus:border-[#2874F0]"
                      }`}
                    />
                    {formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber && (
                      <p className="text-[10px] text-[#FF6161] mt-1">Account numbers do not match</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[12px] text-[#878787] mb-1.5 block">IFSC Code *</label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.ifscCode}
                        onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase().slice(0, 11))}
                        placeholder="e.g. SBIN0001234"
                        className={`flex-1 h-[52px] border-2 rounded-2xl px-4 text-[15px] ${
                          formData.ifscVerified ? "border-[#388E3C] bg-[#388E3C]/5" : "border-[#E0E0E0] focus:border-[#2874F0]"
                        }`}
                      />
                      {formData.ifscVerified ? (
                        <div className="w-[52px] h-[52px] bg-[#388E3C] rounded-2xl flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <Button
                          onClick={verifyIfsc}
                          className="h-[52px] px-4 bg-[#2874F0] text-white rounded-2xl text-[13px] font-semibold"
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                    {formData.ifscVerified && (
                      <p className="text-[11px] text-[#388E3C] mt-1">
                        {formData.bankName}, {formData.branchName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[12px] text-[#878787] mb-1.5 block">Account Type *</label>
                    <div className="flex gap-3">
                      {["savings", "current"].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateForm("accountType", type)}
                          className={`flex-1 h-[52px] rounded-2xl border-2 text-[14px] font-medium capitalize flex items-center justify-center gap-2 ${
                            formData.accountType === type
                              ? "border-[#2874F0] bg-[#2874F0]/5 text-[#2874F0]"
                              : "border-[#E0E0E0] text-[#212121] active:bg-[#F1F3F6]"
                          }`}
                        >
                          {type}
                          {type === "current" && <span className="text-[10px] text-[#878787]">(recommended)</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-[#878787] mb-1.5 block">Upload Cancelled Cheque or Passbook *</label>
                    {formData.chequeOrPassbook ? (
                      <div className="flex items-center gap-3 p-3 bg-[#F1F3F6] rounded-2xl">
                        <FileText className="w-8 h-8 text-[#2874F0]" />
                        <span className="flex-1 text-[13px] text-[#212121]">Document uploaded</span>
                        <button onClick={() => updateForm("chequeOrPassbook", null)}>
                          <X className="w-5 h-5 text-[#878787]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleFileUpload("chequeOrPassbook")}
                        className="w-full h-20 border-2 border-dashed border-[#E0E0E0] rounded-2xl flex flex-col items-center justify-center active:bg-[#F1F3F6]"
                      >
                        <Upload className="w-6 h-6 text-[#878787] mb-1" />
                        <span className="text-[12px] text-[#878787]">Upload cheque or passbook first page</span>
                      </button>
                    )}
                    <p className="text-[10px] text-[#878787] mt-1">Shows account number and IFSC code</p>
                  </div>
                </CardContent>
              </Card>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#E0E0E0]" />
                <span className="text-[13px] text-[#878787] font-medium">OR</span>
                <div className="flex-1 h-px bg-[#E0E0E0]" />
              </div>

              {/* UPI Card */}
              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                <CardContent className="p-4">
                  <div>
                    <label className="text-[12px] text-[#878787] mb-1.5 block">UPI ID (Alternative)</label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.upiId}
                        onChange={(e) => updateForm("upiId", e.target.value.toLowerCase())}
                        placeholder="yourshop@upi"
                        className={`flex-1 h-[52px] border-2 rounded-2xl px-4 text-[15px] ${
                          formData.upiVerified ? "border-[#388E3C] bg-[#388E3C]/5" : "border-[#E0E0E0] focus:border-[#2874F0]"
                        }`}
                      />
                      {formData.upiVerified ? (
                        <div className="w-[52px] h-[52px] bg-[#388E3C] rounded-2xl flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <Button
                          onClick={verifyUpi}
                          className="h-[52px] px-4 bg-[#2874F0] text-white rounded-2xl text-[13px] font-semibold"
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                    {formData.upiVerified && (
                      <p className="text-[11px] text-[#388E3C] mt-1">Valid UPI ID</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Agreements */}
              <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
                <CardContent className="p-4 space-y-4">
                  {[
                    { field: "agreementDocs" as const, text: "I confirm all documents uploaded are genuine and valid. I understand that fake documents will result in permanent account suspension." },
                    { field: "agreementTerms" as const, text: "I agree to SalesApp's Vendor Terms & Conditions and Commission Policy (5% per order).", hasLink: true },
                    { field: "agreementVerification" as const, text: "I understand that SalesApp will verify my documents within 24-48 hours before my shop goes live." },
                  ].map((item) => (
                    <label key={item.field} className="flex items-start gap-3 cursor-pointer">
                      <button
                        onClick={() => updateForm(item.field, !formData[item.field])}
                        className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                          formData[item.field] ? "bg-[#2874F0] border-[#2874F0]" : "border-[#E0E0E0]"
                        }`}
                      >
                        {formData[item.field] && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <span className="text-[12px] text-[#212121] leading-relaxed">
                        {item.hasLink ? (
                          <>
                            {"I agree to SalesApp's "}
                            <button className="text-[#2874F0] underline">Vendor Terms & Conditions</button>
                            {" and "}
                            <button className="text-[#2874F0] underline">Commission Policy</button>
                            {" (5% per order)."}
                          </>
                        ) : (
                          item.text
                        )}
                      </span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {currentStep < 4 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E0E0E0] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
            <div className="max-w-[390px] mx-auto">
              {currentStep === 1 && (
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canContinueStep1}
                  className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] disabled:from-[#E0E0E0] disabled:to-[#E0E0E0] text-white disabled:text-[#878787] text-[15px] font-semibold rounded-2xl"
                >
                  Continue
                </Button>
              )}
              {currentStep === 2 && (
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!canContinueStep2}
                  className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] disabled:from-[#E0E0E0] disabled:to-[#E0E0E0] text-white disabled:text-[#878787] text-[15px] font-semibold rounded-2xl"
                >
                  Continue
                </Button>
              )}
              {currentStep === 3 && (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] disabled:from-[#E0E0E0] disabled:to-[#E0E0E0] text-white disabled:text-[#878787] text-[15px] font-semibold rounded-2xl"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Sheets */}
        <BottomSheet
          isOpen={showDropdown === "category"}
          onClose={() => setShowDropdown(null)}
          title="Shop Category"
          options={SHOP_CATEGORIES}
          value={formData.shopCategory}
          onChange={(v) => updateForm("shopCategory", v)}
        />
        <BottomSheet
          isOpen={showDropdown === "state"}
          onClose={() => setShowDropdown(null)}
          title="Select State"
          options={INDIAN_STATES}
          value={formData.state}
          onChange={(v) => updateForm("state", v)}
        />
        <BottomSheet
          isOpen={showDropdown === "opensAt"}
          onClose={() => setShowDropdown(null)}
          title="Opens At"
          options={TIMES}
          value={formData.opensAt}
          onChange={(v) => updateForm("opensAt", v)}
        />
        <BottomSheet
          isOpen={showDropdown === "closesAt"}
          onClose={() => setShowDropdown(null)}
          title="Closes At"
          options={TIMES}
          value={formData.closesAt}
          onChange={(v) => updateForm("closesAt", v)}
        />
        <BottomSheet
          isOpen={showDropdown === "gstExempt"}
          onClose={() => setShowDropdown(null)}
          title="GST Exemption Reason"
          options={GST_EXEMPT_REASONS}
          value={formData.gstExemptReason}
          onChange={(v) => updateForm("gstExemptReason", v)}
        />
      </div>
    </MobileShell>
  )
}
