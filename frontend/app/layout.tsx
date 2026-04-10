import type { Metadata } from 'next'
import { Manrope, Poppins } from 'next/font/google'
import './globals.css'

// 1. Configure Manrope (Primary font)
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
})

// 2. Configure Poppins (Secondary/Accent font)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'EcoSmart AI',
  description: '',
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
          'min-h-screen bg-background antialiased',
          poppins.variable,
          manrope.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}