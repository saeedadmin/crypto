import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🤖 CryptoBot - Cryptocurrency Price Tracker',
  description: 'Track real-time cryptocurrency prices with the best rates and live analysis. Bitcoin, Ethereum, BNB and other popular cryptocurrencies',
  keywords: 'cryptocurrency, bitcoin, ethereum, crypto prices, blockchain, market cap, trading',
  authors: [{ name: 'Saeed Mohammadi' }],
  openGraph: {
    title: '🤖 CryptoBot - Cryptocurrency Price Tracker',
    description: 'Track real-time cryptocurrency prices with live analysis',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  )
}
