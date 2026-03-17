import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL('https://www.influconnect.in'),

  title: 'InfluConnect - Connect with Top Influencers in India',
  description:
    "India's leading influencer marketing platform. Connect brands with verified influencers for impactful campaigns across Instagram, YouTube, and more.",

  keywords: [
    'influencer marketing',
    'brand collaboration',
    'content creators',
    'instagram influencers',
    'youtube influencers',
    'india',
  ],

  alternates: {
    canonical: 'https://www.influconnect.in',
  },
  icons: {
    icon: "/icon.svg",
  },
 
  openGraph: {
    title: 'InfluConnect',
    description: 'Connect Brands with Trusted Creators Across India',
    url: 'https://www.influconnect.in',
    siteName: 'InfluConnect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InfluConnect Influencer Marketing Platform',
      },
    ],
    type: 'website',
  },
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