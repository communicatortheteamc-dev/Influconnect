'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Logo from "@/images/influconnectlogo.png"
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Influencers', href: '/influencers', icon: Users },
    { name: 'Register', href: '/register' },
    { name: 'Enquiry', href: '/enquiry', icon: MessageSquare },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#000631] to-[#EC6546] bg-clip-text text-transparent">
              {/* InflueConnect */}
              <Image src={Logo} alt={'Influ Connect'} height={63} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-[#EC6546] transition-colors duration-200 font-medium"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild className="border-[#000631] text-[#000631] hover:bg-[#000631] hover:text-white">
              <Link href="/register">Join as Influencer</Link>
            </Button>
            <Button asChild className="bg-[#EC6546] hover:bg-[#EC6546]/90">
              <Link href="/enquiry">Find Influencers</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#EC6546] transition-colors p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white/95 backdrop-blur-lg border-t">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-[#EC6546] hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-2 pb-1 space-y-2">
              <Button variant="outline" asChild className="w-full border-[#000631] text-[#000631]">
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  Join as Influencer
                </Link>
              </Button>
              <Button asChild className="w-full bg-[#EC6546] hover:bg-[#EC6546]/90">
                <Link href="/enquiry" onClick={() => setIsMenuOpen(false)}>
                  Find Influencers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}