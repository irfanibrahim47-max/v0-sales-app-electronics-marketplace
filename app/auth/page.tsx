"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Link from "next/link"

function AuthContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "customer"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")
  const [countdown, setCountdown] = useState(30)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowOtp(true)
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleOtpComplete = () => {
    // Navigate to appropriate page based on role
    if (role === "vendor") {
      window.location.href = "/vendor/dashboard"
    } else {
      window.location.href = "/home"
    }
  }

  if (showOtp) {
    return (
      <main className="min-h-screen bg-[#F1F3F6] flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#212121] font-[family-name:var(--font-heading)]">
              Sales<span className="text-[#2874F0]">App</span>
            </h1>
          </div>

          <Card className="border-0 shadow-md bg-white">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-[#212121] mb-2 font-[family-name:var(--font-heading)]">
                  Verify OTP
                </h2>
                <p className="text-[#878787] text-sm">
                  Enter the 4-digit code sent to your phone
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <InputOTP 
                  maxLength={4} 
                  value={otp} 
                  onChange={setOtp}
                  onComplete={handleOtpComplete}
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot 
                      index={0} 
                      className="w-14 h-14 text-xl border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-lg" 
                    />
                    <InputOTPSlot 
                      index={1} 
                      className="w-14 h-14 text-xl border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-lg" 
                    />
                    <InputOTPSlot 
                      index={2} 
                      className="w-14 h-14 text-xl border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-lg" 
                    />
                    <InputOTPSlot 
                      index={3} 
                      className="w-14 h-14 text-xl border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-lg" 
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="text-center mb-6">
                {countdown > 0 ? (
                  <p className="text-[#878787] text-sm">
                    Resend code in <span className="text-[#2874F0] font-medium">{countdown}s</span>
                  </p>
                ) : (
                  <button className="text-[#2874F0] font-medium text-sm hover:underline">
                    Resend Code
                  </button>
                )}
              </div>

              <Button 
                onClick={handleOtpComplete}
                className="w-full bg-[#2874F0] hover:bg-[#2874F0]/90 text-white font-medium"
              >
                Verify & Continue
              </Button>
            </CardContent>
          </Card>

          <button 
            onClick={() => setShowOtp(false)}
            className="w-full text-center text-[#878787] text-sm mt-4 hover:text-[#2874F0] transition-colors"
          >
            Go back
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F1F3F6] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/onboarding">
            <h1 className="text-3xl font-bold text-[#212121] font-[family-name:var(--font-heading)]">
              Sales<span className="text-[#2874F0]">App</span>
            </h1>
          </Link>
          <p className="text-[#878787] text-sm mt-2 capitalize">
            {role} Account
          </p>
        </div>

        <Card className="border-0 shadow-md bg-white">
          <CardContent className="pt-6 pb-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-6 bg-[#F1F3F6]">
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-[#2874F0] data-[state=active]:shadow-sm">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-[#2874F0] data-[state=active]:shadow-sm">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input 
                      type="text" 
                      placeholder="Phone or Email"
                      className="border-2 border-[#E0E0E0] focus:border-[#2874F0]"
                    />
                  </div>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border-2 border-[#E0E0E0] focus:border-[#2874F0] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#878787] hover:text-[#212121]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-right">
                    <button type="button" className="text-[#2874F0] text-sm hover:underline">
                      Forgot Password?
                    </button>
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[#2874F0] hover:bg-[#2874F0]/90 text-white font-medium"
                  >
                    Continue
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input 
                      type="text" 
                      placeholder="Full Name"
                      className="border-2 border-[#E0E0E0] focus:border-[#2874F0]"
                    />
                  </div>
                  <div>
                    <Input 
                      type="tel" 
                      placeholder="Phone Number"
                      className="border-2 border-[#E0E0E0] focus:border-[#2874F0]"
                    />
                  </div>
                  <div>
                    <Input 
                      type="email" 
                      placeholder="Email Address"
                      className="border-2 border-[#E0E0E0] focus:border-[#2874F0]"
                    />
                  </div>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border-2 border-[#E0E0E0] focus:border-[#2874F0] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#878787] hover:text-[#212121]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="border-2 border-[#E0E0E0] focus:border-[#2874F0] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#878787] hover:text-[#212121]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-[#2874F0] hover:bg-[#2874F0]/90 text-white font-medium"
                  >
                    Continue
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0E0E0]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#878787]">Or</span>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full mt-4 border-2 border-[#2874F0] text-[#2874F0] hover:bg-[#2874F0]/5"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </Card>

        <Link 
          href="/onboarding"
          className="block text-center text-[#878787] text-sm mt-4 hover:text-[#2874F0] transition-colors"
        >
          Back to start
        </Link>
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#212121] font-[family-name:var(--font-heading)]">
            Sales<span className="text-[#2874F0]">App</span>
          </h1>
          <p className="text-[#878787] mt-2">Loading...</p>
        </div>
      </main>
    }>
      <AuthContent />
    </Suspense>
  )
}
