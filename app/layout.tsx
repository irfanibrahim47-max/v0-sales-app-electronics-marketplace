import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Nunito_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"]
});

const nunitoSans = Nunito_Sans({ 
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: 'SalesApp - Your City\'s Best Electronics',
  description: 'Compare prices across nearby shops and order with local service assurance',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#2874F0',
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
      <body className={`${plusJakarta.variable} ${nunitoSans.variable} font-sans antialiased bg-[#F1F3F6]`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
