'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Users, MessageSquare, LogOut, User, Home, RectangleEllipsisIcon, ContactIcon, User2Icon, MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from "@/images/influlogo1.png"
export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        setUser(JSON.parse(adminUser));
      } catch (error) {
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('redirectAfterLogin');
    setUser(null);
    router.push('/');
  };

  const navigation = [
    { name: 'Home', href: '/', icon : <Home className='w-4 h-4'/> },
    { name: 'Influencers', href: '/influencers', icon: <User2Icon className='w-4 h-4'/> },
    { name: 'Register', href: '/register', icon: <RectangleEllipsisIcon className='w-4 h-4'/> },
    { name: 'Enquiry', href: '/enquiry', icon: <MessageCircleIcon className='w-4 h-4'/> },
    { name: 'Contact', href: '/contact' , icon: <ContactIcon className='w-4 h-4'/>},
  ];
  const pathname = usePathname();

  // Hide Navbar on /registerform
  if (pathname === "/registerform") return null;
  return (
     <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#000631] backdrop-blur-lg shadow-lg
        `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#000631] to-[#EC6546] bg-clip-text text-transparent">
              {/* InflueConnect */}
              <Image src={Logo} alt={'Influ Connect'} height={60} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-white hover:text-[#EC6546] transition-colors duration-200 font-medium"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-[#EC6546] text-[#EC6546] hover:bg-[#EC6546] hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" asChild className="border-[#000631] text-[#000631] hover:bg-[#000631] hover:text-white">
                  <Link href="/register">Join as Influencer</Link>
                </Button>
                <Button asChild className="bg-[#EC6546] hover:bg-[#EC6546]/90">
                  <Link href="/enquiry">Find Influencers</Link>
                </Button>
              </>
            )}
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
                <div className='flex items-center'>
                  <span >{item.icon }</span> 
                <span>{item.name}</span>
                </div>
               
              </Link>
            ))}
            <div className="pt-2 pb-1 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-[#EC6546] text-[#EC6546]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}