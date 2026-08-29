import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getShopSettings, getOpeningHours } from '@/lib/data'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'Local Shop - Your Neighborhood Store for Everyday Essentials',
    template: '%s | Local Shop',
  },
  description: 'Discover quality household products at fair prices. From kitchen essentials to cleaning supplies, bathroom products, and storage solutions.',
  keywords: ['household goods', 'kitchen', 'cleaning', 'bathroom', 'storage', 'local shop', 'everyday essentials'],
  authors: [{ name: 'Local Shop' }],
  creator: 'Local Shop',
  publisher: 'Local Shop',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://localshop.example',
    siteName: 'Local Shop',
    title: 'Local Shop - Your Neighborhood Store for Everyday Essentials',
    description: 'Discover quality household products at fair prices.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Local Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Local Shop',
    description: 'Your neighborhood store for everyday essentials.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [shop, hours] = await Promise.all([
    getShopSettings(),
    getOpeningHours(),
  ])

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="robots" href="/robots.txt" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer shop={shop} hours={hours} />
        <Toaster />
      </body>
    </html>
  )
}