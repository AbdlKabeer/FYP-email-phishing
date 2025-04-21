import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PhishGuard App',
  description: 'PhishGuard uses advanced decision tree algorithms to detect and protect you from phishing emails. Connect your Gmail account and stay safe online.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
