import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import SocialSidebar from '@/components/home/SocialLinks';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InflueConnect - Connect with Top Influencers in India',
  description: 'India\'s leading influencer marketing platform. Connect brands with verified influencers for impactful campaigns across Instagram, YouTube, and more.',
  keywords: 'influencer marketing, social media marketing, brand collaboration, content creators, India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className='flex justify-end items-end'>
          <SocialSidebar/>
        </div>
        
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}