"use client"

import { useState, useRef, useEffect } from "react"
import { 
  ArrowLeft, 
  Send, 
  Paperclip,
  Store,
  MoreVertical,
  Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Message {
  id: number
  text: string
  sender: "user" | "shop"
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! Welcome to Tech World Electronics. How can I help you today?",
    sender: "shop",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    text: "Hi! I'm interested in the Samsung Galaxy S24 Ultra. Is it available?",
    sender: "user",
    timestamp: "10:32 AM"
  },
  {
    id: 3,
    text: "Yes, we have the S24 Ultra in stock! Available in Titanium Black, Titanium Gray, Titanium Violet, and Titanium Yellow. Which color would you prefer?",
    sender: "shop",
    timestamp: "10:33 AM"
  },
]

const quickReplies = [
  "What's the warranty?",
  "Do you deliver?",
  "Best price?",
  "EMI available?"
]

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

    // Simulate shop response
    setTimeout(() => {
      setIsTyping(false)
      const shopResponse: Message = {
        id: messages.length + 2,
        text: "Thank you for your message! Let me check that for you and get back to you shortly.",
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/home" className="p-1">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Store className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground text-sm">Tech World Electronics</h1>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/shop/1">
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/5 text-xs">
                View Shop
              </Button>
            </Link>
            <button className="p-2">
              <MoreVertical className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-secondary/20">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  message.sender === "user"
                    ? "bg-primary/10 text-foreground rounded-br-md"
                    : "bg-white text-foreground shadow-sm rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-[10px] mt-1 ${
                  message.sender === "user" ? "text-primary/70" : "text-muted-foreground"
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 bg-white border-t border-border overflow-x-auto">
        <div className="flex gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSendMessage(reply)}
              className="px-3 py-1.5 text-xs border-2 border-primary/30 rounded-full text-primary hover:bg-primary/5 whitespace-nowrap transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="px-4 py-3 bg-white border-t border-border">
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 text-muted-foreground hover:text-foreground">
            <Paperclip className="w-5 h-5" />
          </button>
          <button type="button" className="p-2 text-muted-foreground hover:text-foreground">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-secondary/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
