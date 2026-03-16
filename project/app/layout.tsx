import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Influconnect - Influencer Marketing Platform",
  description: "Connect brands with influencers for powerful marketing campaigns.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Influconnect",
    description: "Influencer marketing platform",
    siteName: "Influconnect",
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