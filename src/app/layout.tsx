import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',        // Recommended for performance
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Book2Latt - Gestione Pasticceria',
  description: 'Applicazione per la gestione di ordini, prodotti e inventario della pasticceria'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
