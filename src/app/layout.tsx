import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🤖 CryptoBot - ربات ارز دیجیتال',
  description: 'دنبال کردن قیمت‌های آنلاین ارزهای دیجیتال با بهترین نرخ‌ها و تحلیل‌های زنده. Bitcoin, Ethereum, BNB و ارزهای محبوب دیگر',
  keywords: 'ارز دیجیتال, بیت کوین, اتریوم, قیمت ارز, کریپتو, بلاک چین',
  authors: [{ name: 'MiniMax Agent' }],
  openGraph: {
    title: '🤖 CryptoBot - ربات ارز دیجیتال',
    description: 'دنبال کردن قیمت‌های آنلاین ارزهای دیجیتال',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
