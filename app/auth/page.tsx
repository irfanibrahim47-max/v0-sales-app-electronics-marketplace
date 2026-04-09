"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"
import { signInWithEmail, signUpWithEmail } from "@/lib/auth"

function AuthContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = (searchParams.get("role") || "customer") as "customer" | "vendor"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await signInWithEmail(loginEmail, loginPassword)
      const userRole = data.user?.user_metadata?.role
      if (userRole === "vendor") {
        router.push("/vendor/dashboard")
      } else {
        router.push("/home")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (registerPassword !== registerConfirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (registerPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    try {
      await signUpWithEmail(registerEmail, registerPassword, registerName, role)
      if (role === "vendor") {
        router.push("/vendor/register")
      } else {
        router.push("/home")
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
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
            <p className="text-[#878787] text-[13px] mt-1">
              {role === "customer" ? "Customer" : "Shop Owner"} Account
            </p>
          </div>

          <Card className="border-0 shadow-[0_2px_12px_rgba(0,0,0,0.08)] bg-white rounded-2xl">
            <CardContent className="pt-5 pb-5 px-4">
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-600">
                  {error}
                </div>
              )}

              <Tabs defaultValue="login" className="w-full" onValueChange={() => setError(null)}>
                <TabsList className="w-full grid grid-cols-2 mb-5 bg-[#F1F3F6] h-12 rounded-2xl p-1">
                  <TabsTrigger value="login" className="text-[13px] font-semibold data-[state=active]:bg-white data-[state=active]:text-[#2874F0] data-[state=active]:shadow-sm rounded-xl">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-[13px] font-semibold data-[state=active]:bg-white data-[state=active]:text-[#2874F0] data-[state=active]:shadow-sm rounded-xl">
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] text-[15px] rounded-2xl px-4"
                    />
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
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
                      disabled={loading}
                      className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] hover:from-[#2874F0] hover:to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold text-[15px] rounded-2xl disabled:opacity-60"
                    >
                      {loading ? "Signing in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] text-[15px] rounded-2xl px-4"
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="h-[52px] border-2 border-[#E0E0E0] focus:border-[#2874F0] text-[15px] rounded-2xl px-4"
                    />
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
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
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
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
                      disabled={loading}
                      className="w-full h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] hover:from-[#2874F0] hover:to-[#1565C0] active:from-[#1E5DC8] active:to-[#0D47A1] text-white font-semibold text-[15px] rounded-2xl disabled:opacity-60"
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
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
