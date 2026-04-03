import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: 'SalesApp - Your City\'s Best Electronics',
  description: 'Compare prices across nearby shops and order with local service assurance',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#E53935',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
