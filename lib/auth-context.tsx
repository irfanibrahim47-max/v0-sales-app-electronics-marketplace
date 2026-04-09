"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "./supabase"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  role: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  role: null,
})

const PUBLIC_PATHS = ["/", "/auth"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN' && session) {
        const role = session.user.user_metadata?.role
        if (role === 'vendor') {
          router.push('/vendor/dashboard')
        } else {
          router.push('/home')
        }
      }

      if (event === 'SIGNED_OUT') {
        router.push('/auth')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    if (loading) return
    const isPublic = PUBLIC_PATHS.includes(pathname)
    if (!user && !isPublic) {
      router.push('/auth')
    }
  }, [user, loading, pathname, router])

  const role = user?.user_metadata?.role ?? null

  return (
    <AuthContext.Provider value={{ user, session, loading, role }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
