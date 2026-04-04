"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { MobileShell } from "@/components/mobile-shell"
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
    if (role === "vendor") {
      window.location.href = "/vendor/dashboard"
    } else {
      window.location.href = "/home"
    }
  }

  if (showOtp) {
    return (
      <MobileShell>
        <div className="h-full overflow-y-auto bg-[#F1F3F6] flex flex-col items-center justify-center px-4 pt-[34px]">
          <div className="w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#212121]">
                Sales<span className="text-[#2874F0]">App</span>
              </h1>
            </div>

            <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
              <CardContent className="pt-6 pb-6 px-4">
                <div className="text-center mb-6">
                  <h2 className="text-[20px] font-bold text-[#212121] mb-2">
                    🔐 Verify OTP
                  </h2>
                  <p className="text-[#878787] text-[13px]">
                    Enter the 4-digit code sent to your phone
                  </p>
                </div>

                <div className="flex justify-center mb-5">
                  <InputOTP 
                    maxLength={4} 
                    value={otp} 
                    onChange={setOtp}
                    onComplete={handleOtpComplete}
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot index={0} className="w-14 h-14 text-lg border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl font-bold" />
                      <InputOTPSlot index={1} className="w-14 h-14 text-lg border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl font-bold" />
                      <InputOTPSlot index={2} className="w-14 h-14 text-lg border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl font-bold" />
                      <InputOTPSlot index={3} className="w-14 h-14 text-lg border-2 border-[#E0E0E0] focus:border-[#2874F0] rounded-2xl font-bold" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center mb-5">
                  {countdown > 0 ? (
                    <p className="text-[#878787] text-[13px]">
                      Resend code in <span className="text-[#2874F0] font-bold">{countdown}s</span>
                    </p>
                  ) : (
                    <button className="text-[#2874F0] font-semibold text-[13px] active:underline">
                      Resend Code
                    </button>
                  )}
                </div>

                <Button 
                  onClick={handleOtpComplete}
                  className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] hover:from-[#2874F0] hover:to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold text-[15px] rounded-2xl"
                >
                  Verify & Continue
                </Button>
              </CardContent>
            </Card>

            <button 
              onClick={() => setShowOtp(false)}
              className="w-full text-center text-[#878787] text-[13px] mt-4 active:text-[#2874F0] transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className="h-full overflow-y-auto bg-[#F1F3F6] flex flex-col items-center justify-center px-4 pt-[34px]">
        <div className="w-full">
          <div className="text-center mb-6">
            <Link href="/">
              <h1 className="text-2xl font-bold text-[#212121]">
                Sales<span className="text-[#2874F0]">App</span>
              </h1>
            </Link>
            <p className="text-[#878787] text-[13px] mt-1 capitalize">
              {role === "customer" ? "🛒 Customer" : "🏪 Shop Owner"} Account
            </p>
          </div>

          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="pt-5 pb-5 px-4">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-5 bg-[#F1F3F6] h-12 rounded-2xl p-1">
                  <TabsTrigger value="login" className="text-[13px] font-semibold data-[state=active]:bg-white data-[state=active]:text-[#2874F0] data-[state=active]:shadow-sm rounded-xl">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-[13px] font-semibold data-[state=active]:bg-white data-[state=active]:text-[#2874F0] data-[state=active]:shadow-sm rounded-xl">
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                      type="text" 
                      placeholder="Phone or Email"
                      className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] text-[15px] rounded-2xl px-4"
                    />
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] pr-12 text-[15px] rounded-2xl px-4"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#878787] active:text-[#212121]"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="text-right">
                      <button type="button" className="text-[#2874F0] text-[13px] font-semibold active:underline">
                        Forgot Password?
                      </button>
                    </div>
                    <Button 
                      type="submit"
                      className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] hover:from-[#2874F0] hover:to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold text-[15px] rounded-2xl"
                    >
                      Continue
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                      type="text" 
                      placeholder="Full Name"
                      className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] text-[15px] rounded-2xl px-4"
                    />
                    <Input 
                      type="tel" 
                      placeholder="Phone Number"
                      className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] text-[15px] rounded-2xl px-4"
                    />
                    <Input 
                      type="email" 
                      placeholder="Email Address"
                      className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] text-[15px] rounded-2xl px-4"
                    />
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] pr-12 text-[15px] rounded-2xl px-4"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#878787] active:text-[#212121]"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] pr-12 text-[15px] rounded-2xl px-4"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#878787] active:text-[#212121]"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <Button 
                      type="submit"
                      className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] hover:from-[#2874F0] hover:to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold text-[15px] rounded-2xl"
                    >
                      Continue
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E0E0E0]"></div>
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase">
                    <span className="bg-white px-3 text-[#878787] font-medium">Or</span>
                  </div>
                </div>

                <Button 
                  variant="outline"
                  className="w-full h-[52px] mt-4 border-2 border-[#2874F0] text-[#2874F0] active:bg-[#2874F0]/5 text-[15px] font-semibold rounded-2xl"
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
            href="/"
            className="block text-center text-[#878787] text-[13px] mt-4 active:text-[#2874F0] transition-colors"
          >
            Back to start
          </Link>
        </div>
      </div>
    </MobileShell>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <MobileShell>
        <div className="h-full bg-[#F1F3F6] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#212121]">
              Sales<span className="text-[#2874F0]">App</span>
            </h1>
            <p className="text-[#878787] mt-2 text-[13px]">Loading...</p>
          </div>
        </div>
      </MobileShell>
    }>
      <AuthContent />
    </Suspense>
  )
}
