import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#000631] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-[#EC6546] bg-clip-text text-transparent">
              InflueConnect
            </div>
            <p className="text-gray-300 leading-relaxed">
              Connecting brands with the perfect influencers for impactful marketing campaigns.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#EC6546] transition-colors">
                <Linkedin className="w-5 h-5" />
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
                <Mail className="w-5 h-5 text-[#EC6546]" />
                <span className="text-gray-300">influconnectbytheteamc@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#EC6546]" />
                <span className="text-gray-300">+91 9642426444</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#EC6546] mt-0.5" />
                <span className="text-gray-300">
                  Hyderabad, Telangana<br />
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} InflueConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}