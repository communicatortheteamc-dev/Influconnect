'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, TrendingUp, Users, Zap, Star, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import MobileReels from './MobileReels';
import MobileFrame from './MobileFrame';
import ReelsPlayer from './ReelsPlayes';

export function HeroSection() {
  const [playVideo, setPlayVideo] = useState(false);

  const stats = [
    { icon: Users, label: 'Active Influencers', value: '3,000+', color: 'text-blue-400' },
    { icon: TrendingUp, label: 'Campaigns Completed', value: '850+', color: 'text-green-400' },
    { icon: Zap, label: 'Brands Connected', value: '200+', color: 'text-purple-400' },
  ];

  const features = [
    'Verified Influencer Network',
    'Building Strategies',
    'Real-time Analytics',
    '24/7 Support'
  ];
const videos = [
  "/videos/mobilereel4.mp4",
  "/videos/mobilereel5.mp4",
  "/videos/mobilereel6.mp4",
];
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000631] via-[#000631]/95 to-[#EC6546]/30">
        {/* Animated Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#EC6546]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-lg rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-[#EC6546]/10 rounded-full blur-2xl animate-bounce-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/20 rounded-full animate-ping"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-[#EC6546] rounded-full animate-float"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/4">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-float-delayed"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white border border-white/20 animate-fadeInUp">
              <Star className="w-4 h-4 text-[#EC6546] animate-pulse" />
              <span className="text-sm font-medium">India's #1 Influencer Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fadeInUp delay-200">
                Your Brand
                <span className="block bg-gradient-to-r from-[#EC6546] to-[#EC6546]/80 bg-clip-text text-transparent">
                  Their Voice
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl">Bigger Reach</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed animate-fadeInUp delay-400">
                Bridge the gap between visionary brands and authentic influencers. 
                Transform your marketing with data-driven partnerships that deliver real results.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3 animate-fadeInUp delay-500">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-white/90">
                  <CheckCircle className="w-4 h-4 text-[#EC6546]" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-600">
              <Button 
                asChild 
                size="lg" 
                className="bg-[#EC6546] hover:bg-[#EC6546]/90 text-white px-8 py-4 text-lg font-semibold rounded-full group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#EC6546]/25"
              >
                <Link href="/influencers" className="flex items-center space-x-2">
                  <span>Discover Influencers</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link> 
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="border-2 border-white text-white hover:bg-white hover:text-[#000631] px-8 py-4 text-lg font-semibold rounded-full group transition-all duration-300 hover:scale-105"
              >
                <Link href="/register" className="flex items-center space-x-2">
                  <span className='text-black'>Join as Creator</span>
                  <Users className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-6 pt-8 animate-fadeInUp delay-800">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div> */}
          </div>

          {/* Right Content - Interactive Demo */}
        {/* <MobileReels /> */}
          <MobileFrame>
          <ReelsPlayer videos={videos} />
        </MobileFrame>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
}