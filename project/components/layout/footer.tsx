import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import Image from "next/image"
import Logo from "@/images/influconnectlogo.png"

const MailIcon = ({ className = "w-6 h-6 text-[#EC6546]" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.2" ry="2.2" />
    <path d="M3.8 7.5l7.2 5.1c.6.45 1.4.45 2 0l7.2-5.1" />
  </svg>
);

export default MailIcon;

export function Footer() {
  return (
    <footer className="bg-[#000631] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-[#EC6546] bg-clip-text text-transparent">
              {/* InflueConnect */}
              <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
                <div className="text-2xl font-bold bg-gradient-to-r from-[#000631] to-[#EC6546] bg-clip-text text-transparent">
                  {/* InflueConnect */}
                  <Image src={Logo} alt={'Influ Connect'} height={63} />
                </div>
              </Link>

            </div>
            <p className="text-gray-300 leading-relaxed">
              Connecting brands with the perfect influencers for impactful marketing campaigns.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/influ_connectbytheteamc?igsh=cTdxZXk1eXNzbG5m" target="_blank" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578100237959&mibextid=rS40aB7S9Ucbxw6v" target='_blank' className="text-gray-300 hover:text-[#EC6546] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://wa.me/919642426444" target="_blank" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                {/* <What className="w-5 h-5" /> */}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="white"
                >
                  <path d="M12.04 2.5C6.54 2.5 2.04 7 2.04 12.5c0 2.14.67 4.13 1.82 5.77L2 23l5-1.8a9.96 9.96 0 005.04 1.3c5.5 0 10-4.5 10-10s-4.5-10-10-10zm0 18.18c-1.73 0-3.35-.5-4.7-1.37l-.34-.21-3 .98 1-2.88-.22-.35a8.15 8.15 0 01-1.3-4.35c0-4.5 3.67-8.18 8.18-8.18 4.5 0 8.18 3.68 8.18 8.18s-3.68 8.18-8.18 8.18z" />
                  <path d="M17.6 14.8c-.3-.15-1.8-.89-2.08-.98-.28-.1-.48-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.23-.65.08-.3-.15-1.26-.47-2.4-1.5-.89-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.6-.91-2.2-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.25 5.14 4.55 3.02 1.3 3.02.87 3.57.82.55-.05 1.8-.73 2.05-1.43.25-.7.25-1.3.18-1.43-.07-.13-.27-.2-.57-.35z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/influencers" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                  Browse Influencers
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                  Join as Influencer
                </Link>
              </li>
              <li>
                <Link href="/enquiry" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                  Submit Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Social Media Campaigns</li>
              <li>Product Launches</li>
              <li>Brand Ambassadorships</li>
              <li>Content Creation</li>
              <li>Event Coverage</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MailIcon className="w-4 h-4   text-[#EC6546]" />
                <span className="text-gray-300 text-xs">influconnectbytheteamc@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#EC6546]" />
                <span className="text-gray-300">+91 9642426444</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#EC6546] mt-0.5" />
                <span className="text-gray-300">
                  5th floor, Monya Exotica, Rd.Number 10,<br />
                  Kakatiya Hills, Madhapur, Hyderabad,<br />
                  Telangana - 500033
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <div className='flex justify-center gap-4 mb-4'>
            <a href='/privacypolicy' target="_blank" rel="noopener noreferrer">
              <p className="text-gray-300 text-xs">Privacy & Policy</p>
            </a>
            <a href='/returnsrefunds' target="_blank" rel="noopener noreferrer">
              <p className="text-gray-300 text-xs">Returns & Refunds</p>
            </a>

          </div>

          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} InfluConnect By TheTeamC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}