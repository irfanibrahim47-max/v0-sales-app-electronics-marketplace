"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Paperclip, Store, MoreVertical, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileShell } from "@/components/mobile-shell"
import Link from "next/link"

interface Message {
  id: number
  text: string
  sender: "user" | "shop"
  timestamp: string
}

const initialMessages: Message[] = [
  { id: 1, text: "Hello! Welcome to Tech World Electronics. How can I help you today? 👋", sender: "shop", timestamp: "10:30 AM" },
  { id: 2, text: "Hi! I'm interested in the Samsung Galaxy S24 Ultra. Is it available?", sender: "user", timestamp: "10:32 AM" },
  { id: 3, text: "Yes, we have the S24 Ultra in stock! 📱 Available in Titanium Black, Gray, Violet, and Yellow. Which color?", sender: "shop", timestamp: "10:33 AM" },
]

const quickReplies = ["❓ What's the warranty?", "🚚 Do you deliver?", "💰 Best price?", "💳 EMI available?"]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const shopResponse: Message = {
        id: messages.length + 2,
        text: "Thank you for your message! 😊 Let me check that for you and get back shortly.",
        sender: "shop",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, shopResponse])
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(newMessage)
  }

  return (
    <MobileShell>
      <div className="h-full flex flex-col bg-[#F1F3F6]">
        {/* Header */}
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
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#388E3C] rounded-full border-2 border-[#2874F0]" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-[15px]">🏪 Tech World Electronics</h1>
                  <p className="text-[11px] text-white/80">Online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/shop/1">
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

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white rounded-br-md"
                    : "bg-white text-[#212121] shadow-[0_2px_12px_rgba(0,0,0,0.08)] rounded-bl-md"
                }`}>
                  <p className="text-[15px]">{message.text}</p>
                  <p className={`text-[11px] mt-1.5 ${message.sender === "user" ? "text-white/70" : "text-[#878787]"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-[#878787]/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2.5 h-2.5 bg-[#878787]/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2.5 h-2.5 bg-[#878787]/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-3 bg-white border-t border-[#E0E0E0] overflow-x-auto scrollbar-hide shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendMessage(reply)}
                className="px-4 py-2.5 text-[13px] border-2 border-[#2874F0]/30 rounded-full text-[#2874F0] active:bg-[#2874F0]/5 whitespace-nowrap transition-colors h-[44px] font-semibold"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="px-4 py-4 bg-white border-t border-[#E0E0E0] pb-[26px]">
          <div className="flex items-center gap-2">
            <button type="button" className="p-2.5 text-[#878787] active:text-[#212121] rounded-2xl active:bg-[#F1F3F6]">
              <Paperclip className="w-6 h-6" />
            </button>
            <button type="button" className="p-2.5 text-[#878787] active:text-[#212121] rounded-2xl active:bg-[#F1F3F6]">
              <ImageIcon className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-5 py-3.5 bg-[#F1F3F6] rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2874F0]/30 h-[52px]"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="w-[52px] h-[52px] bg-gradient-to-r from-[#2874F0] to-[#1565C0] text-white rounded-2xl flex items-center justify-center active:from-[#1E5DC8] active:to-[#0D47A1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_4px_12px_rgba(40,116,240,0.3)]"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </MobileShell>
  )
}
