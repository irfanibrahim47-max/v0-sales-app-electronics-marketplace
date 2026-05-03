"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Paperclip, Store, MoreVertical, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

const quickReplies = ["❓ What's the warranty?", "🚚 Do you deliver?", "💰 Best price?", "💳 EMI available?"]

export default function ChatPage({ params }: { params: { shopId: string } }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [shop, setShop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    fetchShop()
    fetchMessages()

    const channel = supabase
      .channel("messages")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `shop_id=eq.${params.shopId}`
      }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, params.shopId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchShop() {
    const { data } = await supabase
      .from("shops")
      .select("id, name, is_open")
      .eq("id", params.shopId)
      .single()
    setShop(data)
  }

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("shop_id", params.shopId)
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: true })
      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !user) return
    setNewMessage("")
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        shop_id: params.shopId,
        customer_id: user.id,
        text
      })
      .select()
      .single()
    if (!error && data) setMessages(prev => [...prev, data])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(newMessage)
  }

  return (
    <MobileShell>
      <div className="h-full flex flex-col bg-[#F1F3F6]">
        <header className="sticky top-0 z-40 bg-gradient-to-r from-[#2874F0] to-[#42A5F5] shadow-[0_2px_12px_rgba(0,0,0,0.08)] pt-[34px]">
          <div className="flex items-center justify-between px-4 py-3 h-[60px]">
            <div className="flex items-center gap-3">
              <Link href="/home" className="p-2 -ml-2 active:bg-white/10 rounded-2xl">
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  {shop?.is_open && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#388E3C] rounded-full border-2 border-[#2874F0]" />
                  )}
                </div>
                <div>
                  <h1 className="font-bold text-white text-[15px]">🏪 {shop?.name || "Shop"}</h1>
                  <p className="text-[11px] text-white/80">{shop?.is_open ? "Online" : "Offline"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/shop/${params.shopId}`}>
                <Button variant="outline" size="sm" className="border-2 border-white/30 text-white bg-white/10 text-[11px] h-9 px-3 rounded-xl font-semibold">
                  View Shop
                </Button>
              </Link>
              <button className="p-2 active:bg-white/10 rounded-2xl">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-3/4 rounded-2xl" />)}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                <span className="text-3xl">💬</span>
              </div>
              <p className="text-[15px] font-semibold text-[#212121] mb-1">No messages yet</p>
              <p className="text-[13px] text-[#878787]">Start a conversation with the shop</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender_id === user?.id
                      ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white rounded-br-md"
                      : "bg-white text-[#212121] shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-bl-md"
                  }`}>
                    <p className="text-[15px]">{message.text}</p>
                    <p className={`text-[11px] mt-1.5 ${message.sender_id === user?.id ? "text-white/70" : "text-[#878787]"}`}>
                      {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-white border-t border-[#E0E0E0] overflow-x-auto scrollbar-hide shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex gap-2">
            {quickReplies.map(reply => (
              <button key={reply} onClick={() => handleSendMessage(reply)}
                className="px-4 py-2.5 text-[13px] border-2 border-[#2874F0]/30 rounded-full text-[#2874F0] whitespace-nowrap h-[44px] font-semibold">
                {reply}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 bg-white border-t border-[#E0E0E0] pb-[26px]">
          <div className="flex items-center gap-2">
            <button type="button" className="p-2.5 text-[#878787] rounded-2xl">
              <Paperclip className="w-6 h-6" />
            </button>
            <button type="button" className="p-2.5 text-[#878787] rounded-2xl">
              <ImageIcon className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-5 py-3.5 bg-[#F1F3F6] rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 h-[52px]"
            />
            <button type="submit" disabled={!newMessage.trim()}
              className="w-[52px] h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white rounded-2xl flex items-center justify-center disabled:opacity-50 shadow-[0_4px_12px_rgba(40,116,240,0.3)]">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </MobileShell>
  )
}