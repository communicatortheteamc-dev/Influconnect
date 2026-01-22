import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import SocialSidebar from '@/components/home/SocialLinks';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InfluConnect - Connect with Top Influencers in India',
  description: 'India\'s leading influencer marketing platform. Connect brands with verified influencers for impactful campaigns across Instagram, YouTube, and more.',
  keywords: 'influencer marketing, social media marketing, brand collaboration, content creators, India',
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Google Analytics */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-HDGQD78RMN"
      />

      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HDGQD78RMN');
        `}
      </Script>

      <body className={inter.className}>
        <Header />
        <div className='flex justify-end items-end'>
          <SocialSidebar />
        </div>

        <main className="min-h-screen">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
