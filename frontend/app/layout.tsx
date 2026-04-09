import type { Metadata } from 'next'
import { Manrope, Segoe UI } from 'next/font/google'
import './globals.css'

// 1. Configure Manrope (Primary font)
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

// 2. Configure Segoe UI (Secondary/Accent font)
const segoeui = Segoe U({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
})

export const metadata: Metadata = {
  title: 'Maihelt - Digital Health Records',
  description: 'Unified and Secure Health Records',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          poppins.variable,
          merriweather.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}