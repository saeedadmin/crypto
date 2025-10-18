import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto Bot',
  description: 'Simple crypto bot app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
